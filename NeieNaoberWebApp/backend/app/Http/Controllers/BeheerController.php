<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganisatieRequest;
use App\Http\Requests\PeriodeRequest;
use App\Http\Requests\VerwijderGegevensRequest;
use App\Http\Resources\OrganisatieResource;
use App\Http\Resources\PeriodeResource;
use App\Models\Gebruiker;
use App\Models\Organisatie;
use App\Models\Periode;
use App\Services\GegevensOpruimer;
use App\Services\UitnodigingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

// Alleen de beheerder van VIP!: organisaties, periodes en definitief verwijderen (TO 6.1)
class BeheerController extends Controller
{
    public function __construct(private UitnodigingService $uitnodigingService, private GegevensOpruimer $opruimer)
    {
    }

    // UC-9: organisatie + één account; het wachtwoord maakt de organisatie zelf via de mail
    public function organisatieStore(OrganisatieRequest $request): JsonResponse
    {
        $organisatie = DB::transaction(function () use ($request)
        {
            $organisatie = Organisatie::create($request->only(['naam', 'plaats']));

            Gebruiker::create([
                'organisatie_id' => $organisatie->id,
                'naam' => $organisatie->naam,
                'email' => $request->input('email'),
                // Kolom is NOT NULL; met een willekeurig wachtwoord kan niemand inloggen tot de link gebruikt is
                'wachtwoord' => Str::random(64),
                'rol' => Gebruiker::ROL_ORGANISATIE,
            ]);

            return $organisatie;
        });

        $this->uitnodigingService->Stuur($organisatie->gebruiker);

        return (new OrganisatieResource($organisatie->load('gebruiker')))
            ->additional(['message' => 'De organisatie is gemaakt. Er is een uitnodiging gemaild.'])
            ->response()
            ->setStatusCode(201);
    }

    // UC-9, 5a: de link is verlopen, dus de beheerder stuurt een nieuwe uitnodiging
    public function uitnodiging(Organisatie $organisatie): JsonResponse
    {
        $gebruiker = $organisatie->gebruiker;

        abort_if(! $gebruiker, 404);

        $this->uitnodigingService->Stuur($gebruiker);

        return response()->json(['message' => 'Er is een nieuwe uitnodiging gemaild.']);
    }

    // UC-5
    public function periodeStore(PeriodeRequest $request): JsonResponse
    {
        $periode = Periode::create($request->validated());

        return (new PeriodeResource($periode))->response()->setStatusCode(201);
    }

    // UC-7, 3a: eerder verwijderen kan alleen de beheerder, na het typen van VERWIJDER
    public function gegevensVerwijderen(VerwijderGegevensRequest $request, Periode $periode): Response
    {
        $this->opruimer->VerwijderPeriode($periode);

        return response()->noContent();
    }
}
