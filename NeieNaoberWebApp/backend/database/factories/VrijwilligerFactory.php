<?php

namespace Database\Factories;

use App\Models\Organisatie;
use Illuminate\Database\Eloquent\Factories\Factory;

class VrijwilligerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organisatie_id' => Organisatie::factory(),
            'voornaam' => fake()->firstName(),
            'achternaam' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'telefoon' => fake()->optional()->phoneNumber(),
            'geboortedatum' => fake()->optional()->date(max: '-16 years'),
            'straat' => fake()->streetName(),
            'huisnummer' => (string) fake()->numberBetween(1, 250),
            'toevoeging' => null,
            'postcode' => fake()->numberBetween(9400, 9499) . fake()->randomElement(['AB', 'CD', 'EF', 'GH', 'JK']),
        ];
    }
}
