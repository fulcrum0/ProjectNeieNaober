<?php

namespace App\Http\Controllers;

use App\Http\Requests\VersturenRequest;
use App\Http\Requests\VrijwilligerRequest;
use App\Http\Requests\VrijwilligersUploadRequest;
use App\Http\Resources\AanmeldingResource;
use App\Models\Aanmelding;
use App\Models\Periode;
use App\Models\Verklaring;
use App\Services\AanmeldRegels;
use App\Services\ExcelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

// Alles voor de rol "organisatie": de eigen lijst van de open periode (UC-2)
class MijnVrijwilligersController extends Controller
{
    public function __construct(private AanmeldRegels $aanmeldRegels, private ExcelService $excelService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $periode = Periode::HuidigeOpen();

        $aanmeldingen = Aanmelding::query()
            ->where('organisatie_id', $request->user()->organisatie_id)
            ->where('periode_id', $periode?->id)
            ->with('vrijwilliger')
            ->orderByDesc('id')
            ->paginate(config('neienaober.per_pagina'));

        return AanmeldingResource::collection($aanmeldingen)->additional([
            'periode' => $periode ? ['id' => $periode->id, 'naam' => $periode->naam, 'einddatum' => $periode->einddatum->toDateString()] : null,
            'aantal_concept' => $periode ? $this->EigenConcepten($request, $periode)->count() : 0,
        ]);
    }

    public function store(VrijwilligerRequest $request): JsonResponse
    {
        $periode = $this->OpenPeriodeOfFout();

        $aanmelding = $this->aanmeldRegels->Aanmelden(
            $request->validated(),
            $periode,
            $request->user()->organisatie_id,
            null,
            Aanmelding::STATUS_CONCEPT
        );

        return (new AanmeldingResource($aanmelding->load('vrijwilliger')))->response()->setStatusCode(201);
    }

    public function show(Aanmelding $vrijwilliger): AanmeldingResource
    {
        $this->authorize('view', $vrijwilliger);

        return new AanmeldingResource($vrijwilliger->load(['vrijwilliger', 'verklaring']));
    }

    // Route-parameter heet {vrijwilliger} door apiResource, maar het is een aanmelding-id
    public function update(VrijwilligerRequest $request, Aanmelding $vrijwilliger): AanmeldingResource
    {
        $this->authorize('update', $vrijwilliger);

        $aanmelding = $this->aanmeldRegels->Aanpassen($vrijwilliger, $request->validated());

        return new AanmeldingResource($aanmelding->load('vrijwilliger'));
    }

    public function destroy(Aanmelding $vrijwilliger): Response
    {
        $this->authorize('delete', $vrijwilliger);

        $this->aanmeldRegels->Verwijderen($vrijwilliger);

        return response()->noContent();
    }

    // Privacyvinkje aan en versturen: concept wordt nieuw, met bewijs in verklaringen (FE-5)
    public function versturen(VersturenRequest $request): JsonResponse
    {
        $periode = $this->OpenPeriodeOfFout();
        $gebruiker = $request->user();

        $aantal = DB::transaction(function () use ($request, $periode, $gebruiker)
        {
            $concepten = $this->EigenConcepten($request, $periode)->lockForUpdate()->pluck('id');

            if ($concepten->isEmpty())
            {
                throw ValidationException::withMessages([
                    'versturen' => 'Er zijn geen nieuwe vrijwilligers om te versturen.',
                ]);
            }

            $verklaring = Verklaring::create([
                'organisatie_id' => $gebruiker->organisatie_id,
                'periode_id' => $periode->id,
                'gebruiker_id' => $gebruiker->id,
                'naam_invuller' => $request->input('naam_invuller'),
                'versie_privacy' => config('neienaober.privacy_versie'),
            ]);

            return Aanmelding::query()->whereIn('id', $concepten)->update([
                'status' => Aanmelding::STATUS_NIEUW,
                'verklaring_id' => $verklaring->id,
                'updated_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'De lijst is verstuurd naar VIP! Tynaarlo.',
            'aantal_verstuurd' => $aantal,
        ]);
    }

    // Should (FE-11): de organisatie downloadt alleen haar eigen lijst
    public function export(Request $request): StreamedResponse
    {
        $periode = Periode::HuidigeOpen() ?? Periode::query()->orderByDesc('einddatum')->first();

        $query = Aanmelding::query()
            ->where('organisatie_id', $request->user()->organisatie_id)
            ->where('periode_id', $periode?->id);

        $spreadsheet = $this->excelService->MaakEigenLijst($query);

        return $this->excelService->Download($spreadsheet, 'vrijwilligers-' . now()->format('Y-m-d') . '.xlsx');
    }

    // Could: veel vrijwilligers tegelijk. Elke rij met dezelfde regels als het formulier.
    // Eén fout? Dan slaan we niets op, zodat de organisatie het bestand verbetert en opnieuw uploadt.
    public function upload(VrijwilligersUploadRequest $request): JsonResponse
    {
        $periode = $this->OpenPeriodeOfFout();
        $bestand = $request->file('bestand');
        $extensie = strtolower($bestand->getClientOriginalExtension()) === 'xlsx' ? 'xlsx' : 'csv';
        $rijen = $this->excelService->LeesVrijwilligers($bestand->getRealPath(), $extensie);

        if (count($rijen) === 0)
        {
            throw ValidationException::withMessages(['bestand' => 'Het bestand heeft geen vrijwilligers.']);
        }

        $fouten = [];
        $goed = [];

        foreach ($rijen as $rijNummer => $gegevens)
        {
            $gegevens = VrijwilligerRequest::Opschonen($gegevens);
            $validator = Validator::make($gegevens, VrijwilligerRequest::Regels(), VrijwilligerRequest::Meldingen());

            if ($validator->fails())
            {
                $fouten[] = ['rij' => $rijNummer, 'meldingen' => $validator->errors()->all()];
                continue;
            }

            $goed[$rijNummer] = $validator->validated();
        }

        if (count($fouten) === 0)
        {
            // Alles of niets: zit er bij het opslaan nog een fout in (bijv. al 3 keer aangemeld), dan terugdraaien
            DB::beginTransaction();

            foreach ($goed as $rijNummer => $gegevens)
            {
                try
                {
                    $this->aanmeldRegels->Aanmelden($gegevens, $periode, $request->user()->organisatie_id, null, Aanmelding::STATUS_CONCEPT);
                }
                catch (ValidationException $e)
                {
                    $fouten[] = ['rij' => $rijNummer, 'meldingen' => array_merge(...array_values($e->errors()))];
                }
            }

            count($fouten) === 0 ? DB::commit() : DB::rollBack();
        }

        if (count($fouten) > 0)
        {
            return response()->json([
                'message' => 'Niet alle rijen zijn goed. Er is niets opgeslagen.',
                'fouten' => $fouten,
            ], 422);
        }

        return response()->json([
            'message' => count($goed) . ' vrijwilligers toegevoegd.',
            'aantal_toegevoegd' => count($goed),
        ], 201);
    }

    private function EigenConcepten(Request $request, Periode $periode)
    {
        return Aanmelding::query()
            ->where('organisatie_id', $request->user()->organisatie_id)
            ->where('periode_id', $periode->id)
            ->where('status', Aanmelding::STATUS_CONCEPT);
    }

    private function OpenPeriodeOfFout(): Periode
    {
        $periode = Periode::HuidigeOpen();

        if (! $periode)
        {
            throw ValidationException::withMessages([
                'periode' => 'Er is nu geen aanmeldperiode. Aanmelden kan alleen tijdens de aanmeldperiode.',
            ]);
        }

        return $periode;
    }
}
