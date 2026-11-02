<?php

namespace App\Services;

use App\Mail\UitnodigingMail;
use App\Models\Gebruiker;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

class UitnodigingService
{
    // Laravel's wachtwoord-reset-token is hier de uitnodiging: eenmalig, verloopt en staat gehasht in de database
    public function Stuur(Gebruiker $gebruiker): void
    {
        $token = Password::broker()->createToken($gebruiker);

        Mail::to($gebruiker->email)->send(new UitnodigingMail($gebruiker, self::Link($token, $gebruiker->email)));
    }

    public static function Link(string $token, string $email): string
    {
        return rtrim(config('neienaober.frontend_url'), '/')
            . '/wachtwoord-maken?token=' . urlencode($token) . '&email=' . urlencode($email);
    }
}
