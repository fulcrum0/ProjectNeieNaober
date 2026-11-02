<?php

namespace Database\Factories;

use App\Models\Aanmelding;
use App\Models\Organisatie;
use App\Models\Periode;
use App\Models\Vrijwilliger;
use Illuminate\Database\Eloquent\Factories\Factory;

class AanmeldingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vrijwilliger_id' => Vrijwilliger::factory(),
            'periode_id' => Periode::factory(),
            'organisatie_id' => Organisatie::factory(),
            'status' => Aanmelding::STATUS_CONCEPT,
            'mogelijk_dubbel' => false,
        ];
    }

    public function status(string $status): static
    {
        return $this->state(fn () => ['status' => $status]);
    }
}
