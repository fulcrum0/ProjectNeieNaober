<?php

namespace App\Http\Controllers;

use App\Http\Requests\SjabloonUpdateRequest;
use App\Http\Requests\SjabloonUploadRequest;
use App\Http\Resources\SjabloonResource;
use App\Models\ExportSjabloon;
use App\Services\ExcelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

// UC-4, 1a / User Story-11: nieuw sjabloon van de gemeente uploaden en kolommen koppelen
class SjabloonController extends Controller
{
    public function __construct(private ExcelService $excelService)
    {
    }

    public function index(): AnonymousResourceCollection
    {
        $sjablonen = ExportSjabloon::query()->with('uploader')->orderByDesc('id')->get();

        return SjabloonResource::collection($sjablonen)->additional([
            'velden' => ExportSjabloon::VELDEN,
        ]);
    }

    public function store(SjabloonUploadRequest $request): JsonResponse
    {
        $bestand = $request->file('bestand');

        try
        {
            $kolomnamen = $this->excelService->LeesKolomnamen($bestand->getRealPath());
        }
        catch (Throwable)
        {
            throw ValidationException::withMessages(['bestand' => 'Dit Excel-bestand kunnen we niet lezen.']);
        }

        if (count($kolomnamen) === 0)
        {
            throw ValidationException::withMessages(['bestand' => 'In rij 1 van het bestand staan geen kolomnamen.']);
        }

        // Disk "local" = storage/app/private: niet openbaar te downloaden
        $pad = $bestand->store('sjablonen', 'local');

        $sjabloon = ExportSjabloon::create([
            'naam' => $request->input('naam') ?: pathinfo($bestand->getClientOriginalName(), PATHINFO_FILENAME),
            'bestandsnaam' => $pad,
            'kolommen' => $this->excelService->RaadKolommen($kolomnamen),
            // Het eerste sjabloon meteen actief, zodat er altijd één actief is
            'actief' => ! ExportSjabloon::query()->where('actief', true)->exists(),
            'geupload_door' => $request->user()->id,
        ]);

        return (new SjabloonResource($sjabloon))
            ->additional(['gevonden_kolommen' => $kolomnamen, 'velden' => ExportSjabloon::VELDEN])
            ->response()
            ->setStatusCode(201);
    }

    public function update(SjabloonUpdateRequest $request, ExportSjabloon $sjabloon): SjabloonResource
    {
        $gegevens = $request->validated();

        if (array_key_exists('actief', $gegevens) && ! $gegevens['actief'] && $sjabloon->actief)
        {
            throw ValidationException::withMessages([
                'actief' => 'Er moet altijd één sjabloon actief zijn. Zet een ander sjabloon actief.',
            ]);
        }

        DB::transaction(function () use ($sjabloon, $gegevens)
        {
            if (! empty($gegevens['actief']))
            {
                // Er is altijd maar één sjabloon actief
                ExportSjabloon::query()->where('id', '!=', $sjabloon->id)->update(['actief' => false]);
            }

            $sjabloon->update($gegevens);
        });

        return new SjabloonResource($sjabloon->refresh());
    }

    public function destroy(ExportSjabloon $sjabloon): JsonResponse
    {
        if ($sjabloon->actief)
        {
            throw ValidationException::withMessages(['actief' => 'Het actieve sjabloon kunt u niet verwijderen.']);
        }

        Storage::disk('local')->delete($sjabloon->bestandsnaam);
        $sjabloon->delete();

        return response()->json(null, 204);
    }
}
