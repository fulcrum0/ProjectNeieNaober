<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VrijwilligerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'aanhef' => $this->aanhef,
            'voornaam' => $this->voornaam,
            'tussenvoegsel' => $this->tussenvoegsel,
            'achternaam' => $this->achternaam,
            'straat' => $this->straat,
            'huisnummer' => $this->huisnummer,
            'postcode' => $this->postcode,
            'woonplaats' => $this->woonplaats,
        ];
    }
}
