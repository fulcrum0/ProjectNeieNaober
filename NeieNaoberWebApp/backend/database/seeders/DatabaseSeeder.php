<?php

namespace Database\Seeders;

use App\Models\Aanmelding;
use App\Models\ExportSjabloon;
use App\Models\Gebruiker;
use App\Models\Organisatie;
use App\Models\Periode;
use App\Models\Verklaring;
use App\Models\Vrijwilliger;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// Alleen nep-gegevens (TO 6: nooit echte persoonsgegevens). Start met: npm run reset
// Accounts en vrijwilligers komen uit frontend/src/data/mockData.js, zodat de frontend straks dezelfde mensen ziet.
// Velden die volgens het TO niet bewaard worden (telefoon, geboortedatum, e-mail van vrijwilligers) vallen weg.
class DatabaseSeeder extends Seeder
{
    // Minimaal 12 tekens (TO 6); hetzelfde wachtwoord als in mockData.js
    private const WACHTWOORD = 'Wachtwoord1234';

    public function run(): void
    {
        // Zo kan "npm run dev" de seeder elke keer starten zonder dubbele testgegevens
        if (Gebruiker::query()->exists())
        {
            $this->command?->info('Er staan al gegevens in de database; seeder overgeslagen.');

            return;
        }

        Gebruiker::create([
            'naam' => 'VIP TYNAARLO', 'email' => 'lorem@vip.tynaarlo.nl',
            'wachtwoord' => self::WACHTWOORD, 'rol' => Gebruiker::ROL_BEHEERDER,
        ]);

        // Niet in mockData, maar nodig om de rol "medewerker" te testen (TO 6.1)
        $medewerker = Gebruiker::create([
            'naam' => 'Medewerker VIP!', 'email' => 'medewerker@vip.tynaarlo.nl',
            'wachtwoord' => self::WACHTWOORD, 'rol' => Gebruiker::ROL_MEDEWERKER,
        ]);

        $periode = Periode::factory()->create();

        $organisatieA = $this->MaakOrganisatie('Organisatie A', 'Tynaarlo', 'a@organisatie.nl');
        $organisatieB = $this->MaakOrganisatie('Organisatie B', 'Vries', 'b@organisatie.nl');

        // De vier vrijwilligers uit mockData.js, bij Organisatie A, nog niet verstuurd (concept)
        $mockVrijwilligers = [
            ['voornaam' => 'Dinesh', 'tussenvoegsel' => 'van', 'achternaam' => 'Putten', 'straat' => 'Dinostraat', 'huisnummer' => '99', 'postcode' => '1234AB'],
            ['voornaam' => 'Rafael', 'tussenvoegsel' => null, 'achternaam' => 'Chalabyan', 'straat' => 'Rafstraat', 'huisnummer' => '11', 'postcode' => '5678CD'],
            ['voornaam' => 'Orhan', 'tussenvoegsel' => null, 'achternaam' => 'Kurt', 'straat' => 'Orstraat', 'huisnummer' => '4', 'postcode' => '9012EF'],
            ['voornaam' => 'Tarik', 'tussenvoegsel' => null, 'achternaam' => 'Kurt', 'straat' => 'Tarstraat', 'huisnummer' => '1', 'postcode' => '3456GH'],
        ];

        foreach ($mockVrijwilligers as $gegevens)
        {
            $this->MaakAanmelding($gegevens + ['woonplaats' => 'Tynaarlo'], $organisatieA, $periode, Aanmelding::STATUS_CONCEPT);
        }

        // Organisatie B heeft al verstuurd, zodat VIP! iets te controleren heeft
        $verklaring = Verklaring::create([
            'organisatie_id' => $organisatieB->id, 'periode_id' => $periode->id,
            'naam_invuller' => 'Jan Testpersoon', 'versie_privacy' => config('neienaober.privacy_versie'),
        ]);

        Aanmelding::factory(4)->create([
            'organisatie_id' => $organisatieB->id, 'periode_id' => $periode->id,
            'status' => Aanmelding::STATUS_NIEUW, 'verklaring_id' => $verklaring->id,
        ]);

        Aanmelding::factory(3)->create([
            'organisatie_id' => $organisatieB->id, 'periode_id' => $periode->id,
            'status' => Aanmelding::STATUS_GOEDGEKEURD, 'verklaring_id' => $verklaring->id,
            'beoordeeld_door' => $medewerker->id, 'beoordeeld_op' => now(),
        ]);

        // Een mogelijk dubbele: zelfde achternaam en adres bij A en B (FE-6)
        $anna = ['aanhef' => 'mevr.', 'voornaam' => 'Anna', 'achternaam' => 'Testman', 'straat' => 'Brink', 'huisnummer' => '12', 'postcode' => '9481AB', 'woonplaats' => 'Vries'];
        $this->MaakAanmelding($anna, $organisatieA, $periode, Aanmelding::STATUS_NIEUW, true);
        $this->MaakAanmelding($anna, $organisatieB, $periode, Aanmelding::STATUS_NIEUW, true);

        // Zelf aangemeld (geen organisatie_id, alleen een naam)
        Aanmelding::create([
            'vrijwilliger_id' => Vrijwilliger::factory()->create()->id,
            'periode_id' => $periode->id, 'organisatie_naam' => 'Voetbalclub Groningen (buiten Tynaarlo)',
            'status' => Aanmelding::STATUS_NIEUW,
        ]);

        $this->MaakStandaardSjabloon();
    }

    private function MaakOrganisatie(string $naam, string $plaats, string $email): Organisatie
    {
        $organisatie = Organisatie::create(['naam' => $naam, 'plaats' => $plaats]);

        Gebruiker::create([
            'organisatie_id' => $organisatie->id, 'naam' => $naam, 'email' => $email,
            'wachtwoord' => self::WACHTWOORD, 'rol' => Gebruiker::ROL_ORGANISATIE,
        ]);

        return $organisatie;
    }

    private function MaakAanmelding(array $gegevens, Organisatie $organisatie, Periode $periode, string $status, bool $dubbel = false): void
    {
        Aanmelding::create([
            'vrijwilliger_id' => Vrijwilliger::create($gegevens)->id,
            'periode_id' => $periode->id,
            'organisatie_id' => $organisatie->id,
            'status' => $status,
            'mogelijk_dubbel' => $dubbel,
        ]);
    }

    // Een eenvoudig sjabloon, zodat de export meteen werkt. VIP! uploadt later het echte sjabloon van de gemeente.
    private function MaakStandaardSjabloon(): void
    {
        $kolommen = ['A' => 'aanhef', 'B' => 'voornaam', 'C' => 'tussenvoegsel', 'D' => 'achternaam',
            'E' => 'straat', 'F' => 'huisnummer', 'G' => 'postcode', 'H' => 'woonplaats', 'I' => 'organisatie'];

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($kolommen as $letter => $veld)
        {
            $sheet->setCellValue($letter . '1', ucfirst($veld));
        }

        $pad = 'sjablonen/standaard-sjabloon.xlsx';
        Storage::disk('local')->makeDirectory('sjablonen');
        (new Xlsx($spreadsheet))->save(Storage::disk('local')->path($pad));

        ExportSjabloon::create([
            'naam' => 'Standaard sjabloon (voorbeeld)',
            'bestandsnaam' => $pad,
            'kolommen' => $kolommen,
            'actief' => true,
        ]);
    }
}
