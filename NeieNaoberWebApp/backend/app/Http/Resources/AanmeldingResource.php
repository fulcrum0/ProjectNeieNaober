<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AanmeldingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'mogelijk_dubbel' => $this->mogelijk_dubbel,
            'periode_id' => $this->periode_id,
            'organisatie' => [
                'id' => $this->organisatie_id,
                'naam' => $this->OrganisatieNaam(),
                // Zelf aangemeld: de organisatie is alleen een getypte naam
                'zelf_aangemeld' => $this->organisatie_id === null,
            ],
            'vrijwilliger' => new VrijwilligerResource($this->whenLoaded('vrijwilliger')),
            'verstuurd_op' => $this->whenLoaded('verklaring', fn () => $this->verklaring?->created_at),
            'beoordeeld_door' => $this->whenLoaded('beoordelaar', fn () => $this->beoordelaar?->naam),
            'beoordeeld_op' => $this->beoordeeld_op,
            'aangemaakt_op' => $this->created_at,
            'mogelijke_dubbels' => AanmeldingResource::collection($this->whenLoaded('mogelijkeDubbels')),
        ];
    }
}
