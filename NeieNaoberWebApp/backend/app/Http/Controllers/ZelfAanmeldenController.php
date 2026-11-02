<?php

namespace App\Http\Controllers;

use App\Http\Requests\BenIkAangemeldRequest;
use App\Http\Requests\ZelfAanmeldenRequest;
use App\Models\Aanmelding;
use App\Models\Periode;
use App\Services\AanmeldRegels;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

// Openbaar, zonder inloggen. Daarom een limiet van 10 per minuut in routes/api.php.
class ZelfAanmeldenController extends Controller
{
    public function __construct(private AanmeldRegels $aanmeldRegels)
    {
    }

    // Should (UC-8): vrijwilliger buiten Tynaarlo meldt zichzelf aan; VIP! controleert daarna
    public function store(ZelfAanmeldenRequest $request): JsonResponse
    {
        $periode = Periode::HuidigeOpen();

        if (! $periode)
        {
            throw ValidationException::withMessages([
                'periode' => 'Er is nu geen aanmeldperiode. Aanmelden kan alleen tijdens de aanmeldperiode.',
            ]);
        }

        $gegevens = $request->safe()->except(['organisatie_naam', 'akkoord_privacy']);

        $this->aanmeldRegels->Aanmelden($gegevens, $periode, null, $request->input('organisatie_naam'), Aanmelding::STATUS_NIEUW);

        // Geen gegevens terugsturen: een openbaar formulier hoeft niets te laten zien
        return response()->json(['message' => 'Bedankt! Uw aanmelding is ontvangen. VIP! Tynaarlo controleert hem.'], 201);
    }

    // Should (UC-6): alleen ja of nee, nooit een adres of andere gegevens (AVG)
    public function benIkAangemeld(BenIkAangemeldRequest $request): JsonResponse
    {
        $periode = Periode::HuidigeOpen() ?? Periode::query()
            ->whereDate('startdatum', '<=', now()->toDateString())
            ->whereNull('gegevens_verwijderd_op')
            ->orderByDesc('einddatum')
            ->first();

        $aangemeld = $periode !== null && $this->aanmeldRegels
            ->ZelfdePersoon($request->validated(), $periode->id)
            // Concept is nog niet verstuurd door de organisatie, dus telt nog niet
            ->whereIn('aanmeldingen.status', [Aanmelding::STATUS_NIEUW, Aanmelding::STATUS_GOEDGEKEURD])
            ->exists();

        return response()->json([
            'aangemeld' => $aangemeld,
            'message' => $aangemeld
                ? 'U bent aangemeld.'
                : 'Wij kunnen u niet vinden. Vraag het na bij uw organisatie.',
        ]);
    }
}
