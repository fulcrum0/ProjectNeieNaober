<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Zelfde vorm als een organisatie in de frontend: { id, name, phone, email, location, type }.
// Ids als tekst, want de frontend vergelijkt ze met ids uit de URL (useParams geeft tekst).
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
