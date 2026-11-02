<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VrijwilligerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'aanhef' => fake()->randomElement(['dhr.', 'mevr.', null]),
            'voornaam' => fake()->firstName(),
            'tussenvoegsel' => fake()->optional(0.3)->randomElement(['van', 'de', 'van der', 'ter']),
            'achternaam' => fake()->lastName(),
            'straat' => fake()->streetName(),
            'huisnummer' => (string) fake()->numberBetween(1, 250),
            'postcode' => fake()->numberBetween(9400, 9499) . fake()->randomElement(['AB', 'CD', 'EF', 'GH', 'JK']),
            'woonplaats' => fake()->randomElement(['Vries', 'Zuidlaren', 'Eelde', 'Paterswolde', 'Tynaarlo']),
        ];
    }
}
