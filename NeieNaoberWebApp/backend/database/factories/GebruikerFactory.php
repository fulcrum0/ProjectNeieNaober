<?php

namespace Database\Factories;

use App\Models\Gebruiker;
use App\Models\Organisatie;
use Illuminate\Database\Eloquent\Factories\Factory;

class GebruikerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'naam' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'wachtwoord' => 'password123',
            'rol' => Gebruiker::ROL_BEHEERDER,
        ];
    }

    public function organisatie(?Organisatie $organisatie = null): static
    {
        return $this->state(fn () => [
            'rol' => Gebruiker::ROL_ORGANISATIE,
            'organisatie_id' => $organisatie?->id ?? Organisatie::factory(),
        ]);
    }
}
