<?php

namespace App\Services;

use App\Models\Aanmelding;
use App\Models\Periode;
use App\Models\Vrijwilliger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

// De regels die de database niet zelf kan bewaken (TO 4.3):
// max. 3 aanmeldingen per periode (FE-4) en niet twee keer bij dezelfde organisatie.
class AanmeldRegels
{
    public function __construct(private DubbelCheck $dubbelCheck)
    {
    }

    // Eén plek voor alle nieuwe aanmeldingen: organisatie, zelf aanmelden en Excel-upload
    public function Aanmelden(array $gegevens, Periode $periode, ?int $organisatieId, ?string $organisatieNaam, string $status): Aanmelding
    {
        return DB::transaction(function () use ($gegevens, $periode, $organisatieId, $organisatieNaam, $status)
        {
            $this->Controleer($gegevens, $periode, $organisatieId, $organisatieNaam);

            $vrijwilliger = Vrijwilliger::create($gegevens);

            $aanmelding = Aanmelding::create([
                'vrijwilliger_id' => $vrijwilliger->id,
                'periode_id' => $periode->id,
                'organisatie_id' => $organisatieId,
                'organisatie_naam' => $organisatieId ? null : $organisatieNaam,
                'status' => $status,
            ]);

            $this->dubbelCheck->Herbereken($periode->id, $gegevens);

            return $aanmelding->refresh();
        });
    }

    // Gegevens van een bestaande aanmelding aanpassen (organisatie bij concept, of VIP!)
    public function Aanpassen(Aanmelding $aanmelding, array $gegevens): Aanmelding
    {
        return DB::transaction(function () use ($aanmelding, $gegevens)
        {
            $vrijwilliger = $aanmelding->vrijwilliger;
            $oud = $vrijwilliger->only(Vrijwilliger::VELDEN);
            $nieuw = array_merge($oud, $gegevens);

            $this->Controleer($nieuw, $aanmelding->periode, $aanmelding->organisatie_id, $aanmelding->organisatie_naam, $aanmelding->id);

            $vrijwilliger->update($gegevens);

            // Oude én nieuwe adresgroep opnieuw bekijken: de dubbel kan verdwenen of ontstaan zijn
            $this->dubbelCheck->Herbereken($aanmelding->periode_id, $oud);
            $this->dubbelCheck->Herbereken($aanmelding->periode_id, $nieuw);

            return $aanmelding->refresh();
        });
    }

    public function Verwijderen(Aanmelding $aanmelding): void
    {
        DB::transaction(function () use ($aanmelding)
        {
            $vrijwilliger = $aanmelding->vrijwilliger;
            $gegevens = $vrijwilliger->only(Vrijwilliger::VELDEN);

            // Elke aanmelding heeft een eigen vrijwilliger-record; CASCADE ruimt de aanmelding op
            $vrijwilliger->delete();

            $this->dubbelCheck->Herbereken($aanmelding->periode_id, $gegevens);
        });
    }

    private function Controleer(array $gegevens, Periode $periode, ?int $organisatieId, ?string $organisatieNaam, ?int $negeerId = null): void
    {
        // lockForUpdate: twee organisaties die tegelijk dezelfde persoon invoeren kunnen samen niet over de 3 heen
        $zelfdePersoon = $this->ZelfdePersoon($gegevens, $periode->id)
            ->when($negeerId, fn (Builder $query) => $query->where('aanmeldingen.id', '!=', $negeerId))
            ->lockForUpdate()
            ->get(['aanmeldingen.id', 'aanmeldingen.organisatie_id', 'aanmeldingen.organisatie_naam']);

        $alBijDezeOrganisatie = $zelfdePersoon->contains(function (Aanmelding $andere) use ($organisatieId, $organisatieNaam)
        {
            if ($organisatieId)
            {
                return $andere->organisatie_id === $organisatieId;
            }

            return $andere->organisatie_id === null
                && mb_strtolower((string) $andere->organisatie_naam) === mb_strtolower((string) $organisatieNaam);
        });

        if ($alBijDezeOrganisatie)
        {
            throw ValidationException::withMessages([
                'vrijwilliger' => 'Deze vrijwilliger is al aangemeld bij deze organisatie.',
            ]);
        }

        if ($zelfdePersoon->count() >= config('neienaober.max_aanmeldingen'))
        {
            throw ValidationException::withMessages([
                'vrijwilliger' => 'Deze vrijwilliger is in deze periode al 3 keer aangemeld. Meer mag niet.',
            ]);
        }
    }

    // Dezelfde persoon = zelfde voornaam, achternaam, postcode en huisnummer.
    // Afgekeurde aanmeldingen tellen niet mee.
    public function ZelfdePersoon(array $gegevens, int $periodeId): Builder
    {
        return Aanmelding::query()
            ->join('vrijwilligers', 'vrijwilligers.id', '=', 'aanmeldingen.vrijwilliger_id')
            ->where('aanmeldingen.periode_id', $periodeId)
            ->where('aanmeldingen.status', '!=', Aanmelding::STATUS_AFGEKEURD)
            ->whereRaw('LOWER(vrijwilligers.voornaam) = ?', [mb_strtolower((string) ($gegevens['voornaam'] ?? ''))])
            ->whereRaw('LOWER(vrijwilligers.achternaam) = ?', [mb_strtolower((string) ($gegevens['achternaam'] ?? ''))])
            ->where('vrijwilligers.postcode', $gegevens['postcode'] ?? '')
            ->whereRaw('LOWER(vrijwilligers.huisnummer) = ?', [mb_strtolower((string) ($gegevens['huisnummer'] ?? ''))]);
    }
}
