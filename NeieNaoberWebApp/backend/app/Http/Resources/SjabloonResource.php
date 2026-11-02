<?php

namespace App\Http\Resources;

use App\Services\ExcelService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Throwable;

class SjabloonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'naam' => $this->naam,
            'kolommen' => $this->kolommen,
            // De kolomnamen van de gemeente, zodat VIP! bij het koppelen "Achternaam" ziet in plaats van alleen "A"
            'kolomnamen' => $this->Kolomnamen(),
            'actief' => $this->actief,
            'geupload_door' => $this->whenLoaded('uploader', fn () => $this->uploader?->naam),
            'aangemaakt_op' => $this->created_at,
        ];
    }

    private function Kolomnamen(): array
    {
        try
        {
            return app(ExcelService::class)->LeesKolomnamen(Storage::disk('local')->path($this->bestandsnaam));
        }
        catch (Throwable)
        {
            // Bestand weg of kapot: het koppelen werkt dan nog steeds met alleen de letters
            return [];
        }
    }
}
