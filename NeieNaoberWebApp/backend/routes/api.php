<?php

// Alle routes beginnen met /api (TO 5). Laravel-namen zoals index en store houden we zoals Laravel ze wil.

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BeheerController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\MijnVrijwilligersController;
use App\Http\Controllers\PeriodeController;
use App\Http\Controllers\SjabloonController;
use App\Http\Controllers\VipAanmeldingenController;
use App\Http\Controllers\ZelfAanmeldenController;
use Illuminate\Support\Facades\Route;

// Openbaar, met een limiet (zie AppServiceProvider): max. 5 of 10 pogingen per minuut
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/wachtwoord', [AuthController::class, 'wachtwoord'])->middleware('throttle:wachtwoord');
Route::post('/wachtwoord-vergeten', [AuthController::class, 'wachtwoordVergeten'])->middleware('throttle:wachtwoord');

Route::post('/zelf-aanmelden', [ZelfAanmeldenController::class, 'store'])->middleware('throttle:openbaar');
Route::post('/ben-ik-aangemeld', [ZelfAanmeldenController::class, 'benIkAangemeld'])->middleware('throttle:openbaar');
Route::get('/periode', [PeriodeController::class, 'huidig']);

// Alleen als je bent ingelogd (Sanctum-sessie)
Route::middleware('auth:sanctum')->group(function ()
{
    Route::get('/ik', [AuthController::class, 'ik']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // De rol komt uit de database, niet uit het tabblad op het loginscherm
    Route::middleware('rol:organisatie')->prefix('mijn')->group(function ()
    {
        Route::get('/export', [MijnVrijwilligersController::class, 'export']);
        Route::post('/versturen', [MijnVrijwilligersController::class, 'versturen']);
        Route::post('/vrijwilligers/upload', [MijnVrijwilligersController::class, 'upload']);
        Route::apiResource('vrijwilligers', MijnVrijwilligersController::class);
    });

    Route::middleware('rol:medewerker,beheerder')->prefix('vip')->group(function ()
    {
        Route::get('/aanmeldingen', [VipAanmeldingenController::class, 'index']);
        Route::get('/aanmeldingen/{aanmelding}', [VipAanmeldingenController::class, 'show']);
        Route::put('/aanmeldingen/{aanmelding}', [VipAanmeldingenController::class, 'update']);
        Route::patch('/aanmeldingen/{aanmelding}/status', [VipAanmeldingenController::class, 'status']);
        Route::get('/overzicht', [VipAanmeldingenController::class, 'overzicht']);
        Route::get('/organisaties', [VipAanmeldingenController::class, 'organisaties']);
        Route::get('/organisaties/{organisatie}', [VipAanmeldingenController::class, 'organisatie']);
        Route::get('/periodes', [PeriodeController::class, 'index']);

        Route::get('/export', [ExportController::class, 'gemeente']);

        Route::get('/sjablonen', [SjabloonController::class, 'index']);
        Route::post('/sjablonen', [SjabloonController::class, 'store']);
        Route::put('/sjablonen/{sjabloon}', [SjabloonController::class, 'update']);
        Route::delete('/sjablonen/{sjabloon}', [SjabloonController::class, 'destroy']);
    });

    Route::middleware('rol:beheerder')->prefix('beheer')->group(function ()
    {
        Route::post('/organisaties', [BeheerController::class, 'organisatieStore']);
        Route::post('/organisaties/{organisatie}/uitnodiging', [BeheerController::class, 'uitnodiging']);
        Route::post('/periodes', [BeheerController::class, 'periodeStore']);
        Route::delete('/periodes/{periode}/gegevens', [BeheerController::class, 'gegevensVerwijderen']);
    });
});
