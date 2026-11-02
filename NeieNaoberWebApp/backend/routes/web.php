<?php

use Illuminate\Support\Facades\Route;

// Eén domein: Laravel geeft ook de React-build aan de browser (TO 3.2).
// `npm run build` zet de bestanden in public/app. Elke pagina die geen /api is, krijgt index.html,
// zodat React Router de juiste pagina laat zien.
Route::get('/{pad?}', function ()
{
    $index = public_path('app/index.html');

    abort_unless(file_exists($index), 404, 'De React-app is nog niet gebouwd (npm run build).');

    return response()->file($index);
})->where('pad', '^(?!api|sanctum|up).*$');
