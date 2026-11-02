<?php

namespace App\Console\Commands;

use App\Models\Gebruiker;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

// De allereerste beheerder kan niet via de website gemaakt worden; daarom een commando (TO 7.2)
class MaakBeheerder extends Command
{
    protected $signature = 'app:maak-beheerder {--rol=beheerder : beheerder of medewerker}';

    protected $description = 'Maakt een account voor een beheerder of medewerker van VIP!';

    public function handle(): int
    {
        $rol = $this->option('rol');

        if (! in_array($rol, [Gebruiker::ROL_BEHEERDER, Gebruiker::ROL_MEDEWERKER], true))
        {
            $this->error('Kies --rol=beheerder of --rol=medewerker.');

            return self::FAILURE;
        }

        $gegevens = [
            'naam' => $this->ask('Naam'),
            'email' => strtolower(trim((string) $this->ask('E-mailadres'))),
            'wachtwoord' => $this->secret('Wachtwoord (min. 12 tekens)'),
        ];

        $validator = Validator::make($gegevens, [
            'naam' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:gebruikers,email'],
            'wachtwoord' => ['required', Password::defaults()],
        ]);

        if ($validator->fails())
        {
            foreach ($validator->errors()->all() as $melding)
            {
                $this->error($melding);
            }

            return self::FAILURE;
        }

        Gebruiker::create($gegevens + ['rol' => $rol]);
        $this->info("Account voor {$gegevens['email']} ({$rol}) is gemaakt.");

        return self::SUCCESS;
    }
}
