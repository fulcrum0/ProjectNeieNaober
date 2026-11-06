<?php

namespace Tests;

use App\Models\Gebruiker;
use App\Models\Organisatie;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    // Sanctum start alleen een sessie voor verzoeken van de eigen frontend
    protected function ViaFrontend(): static
    {
        return $this->withHeader('Origin', 'http://localhost:5173');
    }

    protected function Beheerder(): Gebruiker
    {
        return Gebruiker::factory()->create();
    }

    protected function OrganisatieGebruiker(?Organisatie $organisatie = null): Gebruiker
    {
        return Gebruiker::factory()->organisatie($organisatie)->create();
    }
}
