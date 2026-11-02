<?php

namespace Tests;

use App\Models\Gebruiker;
use App\Models\Organisatie;
use App\Models\Periode;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    // Sanctum start alleen een sessie voor verzoeken van de eigen frontend
    protected function ViaFrontend(): static
    {
        return $this->withHeader('Origin', 'http://localhost:5173');
    }

    protected function OpenPeriode(): Periode
    {
        return Periode::factory()->create();
    }

    protected function OrganisatieGebruiker(?Organisatie $organisatie = null): Gebruiker
    {
        return Gebruiker::factory()->organisatie($organisatie)->create();
    }

    protected function Medewerker(): Gebruiker
    {
        return Gebruiker::factory()->create();
    }

    protected function Beheerder(): Gebruiker
    {
        return Gebruiker::factory()->beheerder()->create();
    }

    protected function VrijwilligerGegevens(array $anders = []): array
    {
        return array_merge([
            'aanhef' => 'mevr.',
            'voornaam' => 'Anna',
            'tussenvoegsel' => null,
            'achternaam' => 'Jansen',
            'straat' => 'Brink',
            'huisnummer' => '12a',
            'postcode' => '9481 AB',
            'woonplaats' => 'Vries',
        ], $anders);
    }
}
