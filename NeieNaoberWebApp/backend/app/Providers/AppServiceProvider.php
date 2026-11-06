<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }

    public function boot(): void
    {
        // De frontend verwacht kale objecten en lijsten, zonder { data: ... } eromheen
        JsonResource::withoutWrapping();

        // Per e-mailadres én IP: raden van één wachtwoord stopt na 5 keer, andere collega's kunnen gewoon inloggen
        RateLimiter::for('login', fn (Request $request) => Limit::perMinute(5)
            ->by(strtolower((string) $request->input('email')) . '|' . $request->ip()));
    }
}
