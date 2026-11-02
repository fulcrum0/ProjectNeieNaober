<?php

namespace App\Services;

use App\Models\Aanmelding;

// FE-6: het systeem markeert mogelijke dubbele aanmeldingen, maar voegt nooit zelf samen.
// Mogelijk dubbel = zelfde achternaam, postcode en huisnummer bij een ándere organisatie.
class DubbelCheck
{
    // We rekenen de hele groep opnieuw uit, zodat de vlag ook weer uitgaat
    // als VIP! één van de twee afkeurt of een organisatie hem verwijdert.
    public function Herbereken(int $periodeId, array $gegevens): void
    {
        $groep = $this->Groep($periodeId, $gegevens)->get(['aanmeldingen.*']);

        $actief = $groep->where('status', '!=', Aanmelding::STATUS_AFGEKEURD);
        $aantalOrganisaties = $actief->map(fn (Aanmelding $a) => $this->OrganisatieSleutel($a))->unique()->count();
        $isDubbel = $aantalOrganisaties > 1;

        foreach ($groep as $aanmelding)
        {
            $vlag = $isDubbel && $aanmelding->status !== Aanmelding::STATUS_AFGEKEURD;

            if ($aanmelding->mogelijk_dubbel !== $vlag)
            {
                $aanmelding->forceFill(['mogelijk_dubbel' => $vlag])->save();
            }
        }
    }

    // Voor het scherm "dubbele aanmeldingen vergelijken": de anderen uit dezelfde groep
    public function Anderen(Aanmelding $aanmelding)
    {
        $vrijwilliger = $aanmelding->vrijwilliger;

        return $this->Groep($aanmelding->periode_id, $vrijwilliger->only(['achternaam', 'postcode', 'huisnummer']))
            ->where('aanmeldingen.id', '!=', $aanmelding->id)
            ->with(['vrijwilliger', 'organisatie'])
            ->get(['aanmeldingen.*']);
    }

    private function Groep(int $periodeId, array $gegevens)
    {
        return Aanmelding::query()
            ->join('vrijwilligers', 'vrijwilligers.id', '=', 'aanmeldingen.vrijwilliger_id')
            ->where('aanmeldingen.periode_id', $periodeId)
            ->whereRaw('LOWER(vrijwilligers.achternaam) = ?', [mb_strtolower((string) ($gegevens['achternaam'] ?? ''))])
            ->where('vrijwilligers.postcode', $gegevens['postcode'] ?? '')
            ->whereRaw('LOWER(vrijwilligers.huisnummer) = ?', [mb_strtolower((string) ($gegevens['huisnummer'] ?? ''))]);
    }

    // Zelf aangemeld heeft geen organisatie_id; dan telt de getypte naam als organisatie
    private function OrganisatieSleutel(Aanmelding $aanmelding): string
    {
        return $aanmelding->organisatie_id
            ? 'id:' . $aanmelding->organisatie_id
            : 'naam:' . mb_strtolower((string) $aanmelding->organisatie_naam);
    }
}
