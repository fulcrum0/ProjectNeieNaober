<?php

namespace App\Providers;

use App\Services\UitnodigingService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }

    public function boot(): void
    {
        $this->Limieten();

        // Minimaal 12 tekens en niet uitgelekt (TO 6). De lek-check vraagt een externe dienst;
        // in tests slaan we die over, zodat tests ook zonder internet werken.
        Password::defaults(function ()
        {
            $regel = Password::min(12);

            return $this->app->runningUnitTests() ? $regel : $regel->uncompromised();
        });

        // "Wachtwoord vergeten" (Could): de link moet naar de React-app, niet naar een Laravel-pagina
        ResetPassword::createUrlUsing(fn ($gebruiker, string $token) => UitnodigingService::Link($token, $gebruiker->email));

        ResetPassword::toMailUsing(function ($gebruiker, string $token)
        {
            return (new MailMessage())
                ->subject('Nieuw wachtwoord maken')
                ->greeting('Beste ' . $gebruiker->naam . ',')
                ->line('U heeft gevraagd om een nieuw wachtwoord.')
                ->action('Nieuw wachtwoord maken', UitnodigingService::Link($token, $gebruiker->email))
                ->line('Heeft u dit niet gevraagd? Dan hoeft u niets te doen.')
                ->salutation('Met vriendelijke groet, VIP! Tynaarlo');
        });
    }

    // Eigen limieten per soort verzoek. De standaard "throttle:5,1" telt per IP voor álle routes samen;
    // dan kan een kantoor met één IP-adres maar 5 keer per minuut inloggen (TO 6: max. 5 pogingen).
    private function Limieten(): void
    {
        // Per e-mailadres én IP: raden van één wachtwoord stopt na 5 keer, andere collega's kunnen gewoon inloggen
        RateLimiter::for('login', fn (Request $request) => Limit::perMinute(5)
            ->by(strtolower((string) $request->input('email')) . '|' . $request->ip()));

        RateLimiter::for('wachtwoord', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));

        // Openbare formulieren: max. 10 per minuut (UC-6 en UC-8)
        RateLimiter::for('openbaar', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));
    }
}
