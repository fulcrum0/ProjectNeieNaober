<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OrganisatieFactory extends Factory
{
    public function definition(): array
    {
        return [
            'naam' => fake()->unique()->company(),
            'telefoon' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
            'locatie' => fake()->randomElement(['Vries', 'Zuidlaren', 'Eelde', 'Paterswolde', 'Tynaarlo']) . ' / Drenthe',
            'soort' => fake()->randomElement(['Horeca', 'Zorg', 'Sport', 'Cultuur']),
        ];
    }
}
