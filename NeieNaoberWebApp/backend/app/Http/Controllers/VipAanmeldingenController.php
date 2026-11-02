<?php

namespace App\Http\Controllers;

use App\Http\Requests\StatusRequest;
use App\Http\Requests\VrijwilligerRequest;
use App\Http\Resources\AanmeldingResource;
use App\Http\Resources\OrganisatieResource;
use App\Http\Resources\PeriodeResource;
use App\Models\Aanmelding;
use App\Models\Organisatie;
use App\Models\Periode;
use App\Services\AanmeldRegels;
use App\Services\DubbelCheck;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

// UC-3: medewerker of beheerder van VIP! zoekt, controleert, past aan en keurt goed
class VipAanmeldingenController extends Controller
{
    public function __construct(private AanmeldRegels $aanmeldRegels, private DubbelCheck $dubbelCheck)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'periode' => ['nullable', 'integer'],
            'organisatie' => ['nullable', 'integer'],
            'status' => ['nullable', 'in:nieuw,goedgekeurd,afgekeurd'],
            'dubbel' => ['nullable', 'boolean'],
            'zoek' => ['nullable', 'string', 'max:100'],
        ]);

        $aanmeldingen = Aanmelding::query()
            // Concepten zijn nog niet verstuurd; die zijn nog van de organisatie
            ->where('status', '!=', Aanmelding::STATUS_CONCEPT)
            ->when($request->filled('periode'), fn (Builder $q) => $q->where('periode_id', $request->integer('periode')))
            ->when($request->filled('organisatie'), fn (Builder $q) => $q->where('organisatie_id', $request->integer('organisatie')))
            ->when($request->filled('status'), fn (Builder $q) => $q->where('status', $request->input('status')))
            ->when($request->filled('dubbel'), fn (Builder $q) => $q->where('mogelijk_dubbel', $request->boolean('dubbel')))
            ->when($request->filled('zoek'), fn (Builder $q) => $this->Zoek($q, $request->input('zoek')))
            ->with(['vrijwilliger', 'organisatie'])
            ->orderByDesc('id')
            ->paginate(config('neienaober.per_pagina'))
            ->withQueryString();

        return AanmeldingResource::collection($aanmeldingen);
    }

    public function show(Aanmelding $aanmelding): AanmeldingResource
    {
        $aanmelding->load(['vrijwilliger', 'organisatie', 'verklaring', 'beoordelaar']);

        // Mogelijk dubbel? Dan de andere aanmeldingen meesturen, om naast elkaar te vergelijken (UC-3, 3a)
        if ($aanmelding->mogelijk_dubbel)
        {
            $aanmelding->setRelation('mogelijkeDubbels', $this->dubbelCheck->Anderen($aanmelding));
        }

        return new AanmeldingResource($aanmelding);
    }

    public function update(VrijwilligerRequest $request, Aanmelding $aanmelding): AanmeldingResource
    {
        $this->authorize('update', $aanmelding);

        $aanmelding = $this->aanmeldRegels->Aanpassen($aanmelding, $request->validated());

        return new AanmeldingResource($aanmelding->load(['vrijwilliger', 'organisatie']));
    }

    public function status(StatusRequest $request, Aanmelding $aanmelding): AanmeldingResource
    {
        $this->authorize('beoordelen', $aanmelding);

        if ($aanmelding->status === Aanmelding::STATUS_CONCEPT)
        {
            throw ValidationException::withMessages([
                'status' => 'Deze aanmelding is nog niet verstuurd door de organisatie.',
            ]);
        }

        DB::transaction(function () use ($request, $aanmelding)
        {
            $aanmelding->update([
                'status' => $request->input('status'),
                'beoordeeld_door' => $request->user()->id,
                'beoordeeld_op' => now(),
            ]);

            // Afgekeurd telt niet meer mee als dubbel; de vlag bij de andere kan dan uit
            $this->dubbelCheck->Herbereken($aanmelding->periode_id, $aanmelding->vrijwilliger->toArray());
        });

        return new AanmeldingResource($aanmelding->refresh()->load(['vrijwilliger', 'organisatie', 'beoordelaar']));
    }

    // Dashboard van VIP!: de belangrijkste aantallen van de open (of laatste) periode in één keer
    public function overzicht(): JsonResponse
    {
        $periode = Periode::HuidigeOpen() ?? Periode::query()->orderByDesc('einddatum')->first();
        $aanmeldingen = Aanmelding::query()->where('periode_id', $periode?->id)->where('status', '!=', Aanmelding::STATUS_CONCEPT);

        return response()->json([
            'periode' => $periode ? new PeriodeResource($periode) : null,
            'aantal_organisaties' => Organisatie::count(),
            'aantal_aanmeldingen' => (clone $aanmeldingen)->count(),
            'aantal_nieuw' => (clone $aanmeldingen)->where('status', Aanmelding::STATUS_NIEUW)->count(),
            'aantal_goedgekeurd' => (clone $aanmeldingen)->where('status', Aanmelding::STATUS_GOEDGEKEURD)->count(),
            'aantal_afgekeurd' => (clone $aanmeldingen)->where('status', Aanmelding::STATUS_AFGEKEURD)->count(),
            'aantal_dubbel' => (clone $aanmeldingen)->where('mogelijk_dubbel', true)->count(),
        ]);
    }

    public function organisaties(Request $request): AnonymousResourceCollection
    {
        $request->validate(['zoek' => ['nullable', 'string', 'max:100']]);

        $organisaties = $this->MetAantallen(Organisatie::query(), $request->integer('periode') ?: null)
            ->when($request->filled('zoek'), fn (Builder $q) => $q->where(function (Builder $deel) use ($request)
            {
                $like = '%' . str_replace(['%', '_'], ['\%', '\_'], $request->input('zoek')) . '%';
                $deel->where('naam', 'like', $like)->orWhere('plaats', 'like', $like);
            }))
            ->orderBy('naam')
            ->paginate(config('neienaober.per_pagina'))
            ->withQueryString();

        return OrganisatieResource::collection($organisaties);
    }

    public function organisatie(Request $request, Organisatie $organisatie): OrganisatieResource
    {
        $organisatie = $this->MetAantallen(Organisatie::query()->whereKey($organisatie->id), $request->integer('periode') ?: null)->firstOrFail();

        return new OrganisatieResource($organisatie);
    }

    // Concepten tellen niet mee: die heeft de organisatie nog niet verstuurd
    private function MetAantallen(Builder $query, ?int $periodeId): Builder
    {
        $binnenPeriode = fn ($q) => $q->when($periodeId, fn ($q) => $q->where('periode_id', $periodeId));

        return $query
            ->with('gebruiker')
            ->withCount([
                'aanmeldingen' => fn ($q) => $binnenPeriode($q)->where('status', '!=', Aanmelding::STATUS_CONCEPT),
                'aanmeldingen as nieuw_count' => fn ($q) => $binnenPeriode($q)->where('status', Aanmelding::STATUS_NIEUW),
                'aanmeldingen as goedgekeurd_count' => fn ($q) => $binnenPeriode($q)->where('status', Aanmelding::STATUS_GOEDGEKEURD),
            ]);
    }

    // Zoeken op naam of postcode; ook "Jansen 9481" of "9481 AB" moet werken
    private function Zoek(Builder $query, string $zoek): Builder
    {
        return $query->whereHas('vrijwilliger', function (Builder $q) use ($zoek)
        {
            foreach (preg_split('/\s+/', trim($zoek)) as $woord)
            {
                $like = '%' . str_replace(['%', '_'], ['\%', '\_'], $woord) . '%';

                $q->where(function (Builder $deel) use ($like)
                {
                    $deel->where('voornaam', 'like', $like)
                        ->orWhere('achternaam', 'like', $like)
                        ->orWhere('postcode', 'like', $like)
                        ->orWhere('woonplaats', 'like', $like);
                });
            }
        });
    }
}
