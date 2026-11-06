<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VrijwilligerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'orgId' => (string) $this->organisatie_id,
            'firstName' => $this->voornaam,
            'infix' => $this->tussenvoegsel ?? '',
            'lastName' => $this->achternaam ?? '',
            'email' => $this->email ?? '',
            'phone' => $this->telefoon ?? '',
            'birthDate' => $this->geboortedatum?->toDateString() ?? '',
            'street' => $this->straat ?? '',
            'houseNumber' => $this->huisnummer ?? '',
            'addition' => $this->toevoeging ?? '',
            'postcode' => $this->postcode ?? '',
            'createdAt' => $this->created_at->toDateString(),
            'sentAt' => $this->verstuurd_op?->toDateString() ?? '',
        ];
    }
}
