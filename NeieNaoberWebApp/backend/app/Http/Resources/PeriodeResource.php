<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeriodeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $vandaag = now()->startOfDay();

        return [
            'id' => $this->id,
            'naam' => $this->naam,
            'startdatum' => $this->startdatum->toDateString(),
            'einddatum' => $this->einddatum->toDateString(),
            'open' => $this->startdatum->lte($vandaag) && $this->einddatum->gte($vandaag),
            'geexporteerd_op' => $this->geexporteerd_op,
            'gegevens_verwijderd_op' => $this->gegevens_verwijderd_op,
        ];
    }
}
