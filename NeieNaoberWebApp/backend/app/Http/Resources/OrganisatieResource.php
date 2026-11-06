<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganisatieResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->naam,
            'phone' => $this->telefoon ?? '',
            'email' => $this->email ?? '',
            'location' => $this->locatie ?? '',
            'type' => $this->soort ?? '',
        ];
    }
}
