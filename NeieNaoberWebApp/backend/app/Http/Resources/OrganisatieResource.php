<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganisatieResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'naam' => $this->naam,
            'plaats' => $this->plaats,
            'email' => $this->whenLoaded('gebruiker', fn () => $this->gebruiker?->email),
            'aantal_aanmeldingen' => $this->whenHas('aanmeldingen_count'),
            'aantal_nieuw' => $this->whenHas('nieuw_count'),
            'aantal_goedgekeurd' => $this->whenHas('goedgekeurd_count'),
            'aangemaakt_op' => $this->created_at,
        ];
    }
}
