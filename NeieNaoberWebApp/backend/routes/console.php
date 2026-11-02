<?php

use Illuminate\Support\Facades\Schedule;

// Elke nacht om 02:00 oude gegevens verwijderen (AVG, UC-7).
// Op alwaysdata: cron "* * * * * php artisan schedule:run" of direct "0 2 * * * php artisan app:verwijder-gegevens".
Schedule::command('app:verwijder-gegevens')->dailyAt('02:00');
