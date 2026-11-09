<?php

namespace Database\Seeders;

use App\Models\Organisatie;
use App\Models\Vrijwilliger;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VeelVrijwilligersSeeder extends Seeder
{
    public const AANTAL = 60;

    public function run(): void
    {
        $organisatie = Organisatie::query()->where('naam', 'Organisatie A')->firstOrFail();
        $faker = fake('nl_NL');

        Vrijwilliger::factory()
            ->count(self::AANTAL)
            ->for($organisatie)
            ->state(new Sequence(function (Sequence $reeks) use ($faker)
            {
                $voornaam = $faker->firstName();
                $achternaam = $faker->lastName();
                $dagen = $reeks->index % 90;

                return [
                    'voornaam' => $voornaam,
                    'achternaam' => $achternaam,
                    'email' => Str::slug("{$voornaam} {$achternaam}", '.') . ".{$reeks->index}@example.com",
                    'telefoon' => $faker->numerify('06 #### ####'),
                    'straat' => $faker->streetName(),
                    'created_at' => now()->subDays($dagen + 1),
                    'verstuurd_op' => $reeks->index % 2 === 0 ? now()->subDays($dagen) : null,
                ];
            }))
            ->create();
    }
}
