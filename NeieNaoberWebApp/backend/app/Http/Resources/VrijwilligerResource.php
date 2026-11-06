<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Zelfde vorm als een vrijwilliger in de frontend. Lege velden worden "" en geen null,
// want de frontend plakt ze direct in tekst (bijv. formatAddress).
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
            // Leeg = concept (nog niet verstuurd naar VIP! Tynaarlo)
            'sentAt' => $this->verstuurd_op?->toDateString() ?? '',
        ];
    }
}
