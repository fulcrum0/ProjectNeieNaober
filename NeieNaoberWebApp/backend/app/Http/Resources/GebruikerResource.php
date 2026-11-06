<?php

namespace App\Http\Resources;

use App\Models\Gebruiker;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Zelfde vorm als een user in de frontend: { id, email, name, initials, role, orgId }
class GebruikerResource extends JsonResource
{
    // De frontend kent de rollen "admin" en "organisation" (src/data/constants.js)
    private const ROLLEN = [
        Gebruiker::ROL_BEHEERDER => 'admin',
        Gebruiker::ROL_ORGANISATIE => 'organisation',
    ];

    public function toArray(Request $request): array
    {
        $initialen = collect(preg_split('/\s+/', trim($this->naam)))
            ->filter()
            ->take(2)
            ->map(fn (string $woord) => mb_strtoupper(mb_substr($woord, 0, 1)))
            ->join('');

        return [
            'id' => (string) $this->id,
            'email' => $this->email,
            'name' => $this->naam,
            'initials' => $initialen,
            'role' => self::ROLLEN[$this->rol],
            'orgId' => $this->organisatie_id ? (string) $this->organisatie_id : null,
        ];
    }
}
