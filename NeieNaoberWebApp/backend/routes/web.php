<?php

use Illuminate\Support\Facades\Route;

// Dit is alleen de API; de React-app draait via Vite (http://localhost:5173)
Route::get('/', fn () => response()->json(['app' => config('app.name'), 'api' => url('/api')]));
