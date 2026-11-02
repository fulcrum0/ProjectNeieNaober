<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PeriodeFactory extends Factory
{
    // Standaard een periode die nu open is
    public function definition(): array
    {
        return [
            'naam' => 'Horecabon ' . now()->year,
            'startdatum' => now()->subMonth()->toDateString(),
            'einddatum' => now()->addMonth()->toDateString(),
        ];
    }

    public function afgelopen(int $maandenGeleden = 2): static
    {
        return $this->state(fn () => [
            'naam' => 'Horecabon ' . (now()->year - 1),
            'startdatum' => now()->subMonths($maandenGeleden + 2)->toDateString(),
            'einddatum' => now()->subMonths($maandenGeleden)->toDateString(),
        ]);
    }
}
