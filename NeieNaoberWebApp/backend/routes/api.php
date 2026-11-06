<?php

// Alle routes beginnen met /api. Ze leveren precies wat de frontend (v1.0) nodig heeft.

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrganisatieController;
use App\Http\Controllers\VrijwilligerController;
use Illuminate\Support\Facades\Route;

// Openbaar, met een limiet (zie AppServiceProvider)
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

// Alleen als je bent ingelogd (Sanctum-sessie)
Route::middleware('auth:sanctum')->group(function ()
{
    Route::get('/user', [AuthController::class, 'ik']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/organisations', [OrganisatieController::class, 'index']);
    Route::get('/volunteers', [VrijwilligerController::class, 'index']);
    Route::post('/volunteers', [VrijwilligerController::class, 'store']);
    Route::delete('/volunteers', [VrijwilligerController::class, 'destroy']);

    Route::middleware('rol:organisatie')->group(function ()
    {
        Route::post('/volunteers/send', [VrijwilligerController::class, 'send']);
    });

    // De rol komt uit de database, niet uit de frontend
    Route::middleware('rol:beheerder')->group(function ()
    {
        Route::post('/organisations/import', [OrganisatieController::class, 'import']);
        Route::delete('/organisations', [OrganisatieController::class, 'destroy']);
        Route::post('/volunteers/import', [VrijwilligerController::class, 'import']);
    });
});
