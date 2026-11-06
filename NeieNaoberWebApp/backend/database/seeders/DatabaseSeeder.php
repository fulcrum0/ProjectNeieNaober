<?php

namespace Database\Seeders;

use App\Models\Gebruiker;
use App\Models\Organisatie;
use App\Models\Vrijwilliger;
use Illuminate\Database\Seeder;

// Nep-testgegevens: dezelfde accounts, organisaties en vrijwilligers als de mockData uit frontend v1.0
class DatabaseSeeder extends Seeder
{
    public const WACHTWOORD = 'password123';

    public function run(): void
    {
        $a = Organisatie::create([
            'naam' => 'Organisatie A', 'telefoon' => '06 1234 5678', 'email' => 'contact@organisatiea.com',
            'locatie' => 'Tynaarlo / Drenthe', 'soort' => 'Horeca',
        ]);
        $b = Organisatie::create([
            'naam' => 'Organisatie B', 'telefoon' => '06 8765 4321', 'email' => 'contact@organisatieb.com',
            'locatie' => 'Vries / Drenthe', 'soort' => 'Zorg',
        ]);

        Gebruiker::create(['naam' => 'VIP TYNAARLO', 'email' => 'lorem@vip.tynaarlo.nl', 'wachtwoord' => self::WACHTWOORD, 'rol' => Gebruiker::ROL_BEHEERDER]);
        Gebruiker::create(['naam' => 'Organisatie A', 'email' => 'a@organisatie.nl', 'wachtwoord' => self::WACHTWOORD, 'rol' => Gebruiker::ROL_ORGANISATIE, 'organisatie_id' => $a->id]);
        Gebruiker::create(['naam' => 'Organisatie B', 'email' => 'b@organisatie.nl', 'wachtwoord' => self::WACHTWOORD, 'rol' => Gebruiker::ROL_ORGANISATIE, 'organisatie_id' => $b->id]);

        // De eerste twee zijn al verstuurd naar VIP!, de laatste twee zijn nog concept
        $vrijwilligers = [
            ['Dinesh', 'van Putten', 'd.vanputten@example.com', '06 1234 5678', '1999-09-19', 'Dinostraat', '99', '1234AB', '2026-09-24', '2026-09-25'],
            ['Rafael', 'Chalabyan', 'r.chalabyan@example.com', null, null, 'Rafstraat', '11', '5678CD', '2026-10-01', '2026-10-02'],
            ['Orhan', 'Kurt', 'o.kurt@example.com', null, null, 'Orstraat', '4', '9012EF', '2026-08-11', null],
            ['Tarik', 'Kurt', 't.kurt@example.com', null, null, 'Tarstraat', '1', '3456GH', '2026-09-16', null],
        ];

        foreach ($vrijwilligers as [$voornaam, $achternaam, $email, $telefoon, $geboortedatum, $straat, $huisnummer, $postcode, $ingediend, $verstuurd])
        {
            $vrijwilliger = new Vrijwilliger([
                'organisatie_id' => $a->id, 'voornaam' => $voornaam, 'achternaam' => $achternaam, 'email' => $email,
                'telefoon' => $telefoon, 'geboortedatum' => $geboortedatum, 'straat' => $straat,
                'huisnummer' => $huisnummer, 'postcode' => $postcode, 'verstuurd_op' => $verstuurd,
            ]);
            $vrijwilliger->created_at = $ingediend;
            $vrijwilliger->save();
        }
    }
}
