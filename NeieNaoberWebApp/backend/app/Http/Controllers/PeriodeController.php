<?php

namespace App\Http\Controllers;

use App\Http\Resources\PeriodeResource;
use App\Models\Periode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PeriodeController extends Controller
{
    // Openbaar: de startpagina laat zien of aanmelden nu kan
    public function huidig(): JsonResponse
    {
        $periode = Periode::HuidigeOpen();

        return response()->json(['data' => $periode ? new PeriodeResource($periode) : null]);
    }

    // VIP!: voor het filter in het overzicht en bij de export
    public function index(): AnonymousResourceCollection
    {
        return PeriodeResource::collection(Periode::query()->orderByDesc('startdatum')->get());
    }
}
