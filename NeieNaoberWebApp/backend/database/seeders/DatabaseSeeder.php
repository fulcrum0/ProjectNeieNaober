<?php

namespace Database\Seeders;

use App\Models\Gebruiker;
use App\Models\Organisatie;
use App\Models\Vrijwilliger;
use Illuminate\Database\Seeder;

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

        $vrijwilligers = [
            [$a, 'Dinesh', null, 'van Putten', 'd.vanputten@example.com', '06 1234 5678', '1999-09-19', 'Dinostraat', '99', null, '1234AB', '2026-09-24', '2026-09-25'],
            [$a, 'Rafael', null, 'Chalabyan', 'r.chalabyan@example.com', null, null, 'Rafstraat', '11', null, '5678CD', '2026-10-01', '2026-10-02'],
            [$a, 'Orhan', null, 'Kurt', 'o.kurt@example.com', null, null, 'Orstraat', '4', null, '9012EF', '2026-08-11', null],
            [$a, 'Tarik', null, 'Kurt', 't.kurt@example.com', null, null, 'Tarstraat', '1', null, '3456GH', '2026-09-16', null],

            // Volledig ingevuld, met tussenvoegsel en huisnummertoevoeging
            [$a, 'Maria', 'de', 'Vries', 'maria.devries@example.com', '06 2345 6789', '1984-05-23', 'Kerkstraat', '12', 'A', '9482AB', '2026-10-05', '2026-10-06'],
            [$a, 'Jan-Willem', 'van der', 'Meer', 'jw.vandermeer@example.com', '+31 6 3456 7890', '1972-11-30', 'Stationsweg', '148', 'bis', '9481CD', '2026-10-12', '2026-10-14'],
            // Lange namen en bijzondere tekens
            [$a, 'Anna Maria Wilhelmina', 'van den', 'Berg-Hoekstra', 'a.m.w.vandenberg-hoekstra@example.com', '06 4567 8901', '1990-02-08', 'Burgemeester Legroweg', '203', null, '9761TA', '2026-10-20', '2026-10-21'],
            [$a, 'Zoë', null, 'Çelik', 'zoe.celik@example.com', '06 5678 9012', '2001-07-17', 'Brink', '7', null, '9471AE', '2026-11-02', null],
            // Alleen telefoon, alleen e-mail, of geen adres
            [$a, 'Seán', null, "O'Connor", null, '06 6789 0123', '1995-03-14', 'Molenweg', '31', null, '9481EF', '2026-11-03', null],
            [$a, 'Fatima', 'el', 'Amrani', 'f.elamrani@example.com', null, null, null, null, null, null, '2026-11-04', null],
            // Jongste en oudste vrijwilliger, oudere zonder e-mail met vast nummer
            [$a, 'Lotte', null, 'Jansen', 'lotte.jansen@example.com', '06 7890 1234', '2010-04-02', 'Schoolstraat', '5', null, '9482GH', '2026-10-28', '2026-10-29'],
            [$a, 'Hendrik', null, 'Bakker', null, '0592 123 456', '1941-02-14', 'Dorpsstraat', '66', '2', '9481JK', '2026-09-30', '2026-10-01'],
            // Zelfde naam, andere persoon (geen dubbele)
            [$a, 'Peter', null, 'Smit', 'peter.smit@example.com', '06 8901 2345', '1968-08-21', 'Beukenlaan', '19', null, '9471KL', '2026-10-15', '2026-10-16'],
            [$a, 'Peter', null, 'Smit', 'p.smit86@example.com', null, '1986-12-03', 'Eikenlaan', '40', null, '9471MN', '2026-11-05', null],
            // Vandaag binnengekomen, nog niet verstuurd
            [$a, 'Sanne', 'ter', 'Horst', 's.terhorst@example.com', '06 9012 3456', '1998-06-11', 'Zuiderstraat', '3', 'C', '9482PR', '2026-11-09', null],

            // Zelfde persoon en e-mailadres bij een tweede organisatie (mag)
            [$b, 'Maria', 'de', 'Vries', 'maria.devries@example.com', '06 2345 6789', '1984-05-23', 'Kerkstraat', '12', 'A', '9482AB', '2026-10-18', '2026-10-19'],
            [$b, 'Willem', null, 'Mulder', 'w.mulder@example.com', '06 1357 9024', '1958-01-26', 'Asserstraat', '88', null, '9481ST', '2026-10-07', '2026-10-09'],
            [$b, 'Aisha', null, 'Yilmaz', 'aisha.yilmaz@example.com', null, '1993-09-09', 'Tolhuisweg', '2', 'D', '9481TV', '2026-10-26', '2026-10-27'],
            [$b, 'Bram', 'van', 'Dijk', null, '06 2468 0135', null, null, null, null, null, '2026-11-06', null],
            [$b, 'Noor', null, 'Hendriks', 'noor.hendriks@example.com', '06 3579 1246', '2004-10-31', 'Parklaan', '27', null, '9481VW', '2026-11-08', null],
        ];

        foreach ($vrijwilligers as [$organisatie, $voornaam, $tussenvoegsel, $achternaam, $email, $telefoon, $geboortedatum, $straat, $huisnummer, $toevoeging, $postcode, $ingediend, $verstuurd])
        {
            $vrijwilliger = new Vrijwilliger([
                'organisatie_id' => $organisatie->id, 'voornaam' => $voornaam, 'tussenvoegsel' => $tussenvoegsel,
                'achternaam' => $achternaam, 'email' => $email, 'telefoon' => $telefoon, 'geboortedatum' => $geboortedatum,
                'straat' => $straat, 'huisnummer' => $huisnummer, 'toevoeging' => $toevoeging, 'postcode' => $postcode,
                'verstuurd_op' => $verstuurd,
            ]);
            $vrijwilliger->created_at = $ingediend;
            $vrijwilliger->save();
        }

        $this->call(VeelVrijwilligersSeeder::class);
    }
}
