<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GebruikerResource extends JsonResource
{
    // Nooit het wachtwoord of andere interne velden terugsturen
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'naam' => $this->naam,
            'email' => $this->email,
            'rol' => $this->rol,
            'organisatie' => $this->organisatie ? [
                'id' => $this->organisatie->id,
                'naam' => $this->organisatie->naam,
                'plaats' => $this->organisatie->plaats,
            ] : null,
        ];
    }
}
