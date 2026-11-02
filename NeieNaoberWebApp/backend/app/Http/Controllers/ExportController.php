<?php

namespace App\Http\Controllers;

use App\Models\Aanmelding;
use App\Models\ExportSjabloon;
use App\Models\Periode;
use App\Services\ExcelService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

// UC-4: Excel-bestand voor de gemeente, met de kolommen van het actieve sjabloon (FE-7)
class ExportController extends Controller
{
    public function __construct(private ExcelService $excelService)
    {
    }

    public function gemeente(Request $request): StreamedResponse
    {
        $request->validate([
            'periode_id' => ['required', 'integer', 'exists:periodes,id'],
            'doorgaan' => ['nullable', 'boolean'],
        ]);

        $periode = Periode::findOrFail($request->integer('periode_id'));
        $sjabloon = $this->ActiefSjabloonOfFout();
        $this->ControleerNietGecontroleerd($periode, $request->boolean('doorgaan'));

        $spreadsheet = $this->excelService->MaakGemeenteExport($periode, $sjabloon);

        // Pas na de export mag de nachtelijke AVG-opruiming deze periode verwijderen (FE-9)
        $periode->update(['geexporteerd_op' => now()]);

        return $this->excelService->Download($spreadsheet, 'horecabon-' . str($periode->naam)->slug() . '.xlsx');
    }

    // UC-4, 3a: nog niet alles gecontroleerd? Waarschuwen; met doorgaan=1 kan het toch
    private function ControleerNietGecontroleerd(Periode $periode, bool $doorgaan): void
    {
        $aantal = Aanmelding::query()
            ->where('periode_id', $periode->id)
            ->where('status', Aanmelding::STATUS_NIEUW)
            ->count();

        if ($aantal > 0 && ! $doorgaan)
        {
            throw ValidationException::withMessages([
                'periode_id' => "Er zijn nog {$aantal} aanmeldingen niet gecontroleerd. Wilt u toch doorgaan?",
            ]);
        }
    }

    private function ActiefSjabloonOfFout(): ExportSjabloon
    {
        $sjabloon = ExportSjabloon::Actief();

        if (! $sjabloon)
        {
            throw ValidationException::withMessages([
                'sjabloon' => 'Er is geen actief Excel-sjabloon. Upload eerst het sjabloon van de gemeente.',
            ]);
        }

        return $sjabloon;
    }
}
