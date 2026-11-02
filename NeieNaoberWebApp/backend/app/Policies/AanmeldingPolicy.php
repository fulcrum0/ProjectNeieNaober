<?php

namespace App\Policies;

use App\Models\Aanmelding;
use App\Models\Gebruiker;

// Een organisatie ziet alleen haar eigen aanmeldingen en wijzigt alleen bij status "concept".
// Een ander nummer in de URL typen helpt dus niet (TO 6).
class AanmeldingPolicy
{
    public function view(Gebruiker $gebruiker, Aanmelding $aanmelding): bool
    {
        return $gebruiker->IsVip() || $this->IsEigen($gebruiker, $aanmelding);
    }

    public function update(Gebruiker $gebruiker, Aanmelding $aanmelding): bool
    {
        if ($gebruiker->IsVip())
        {
            return true;
        }

        return $this->IsEigen($gebruiker, $aanmelding) && $aanmelding->status === Aanmelding::STATUS_CONCEPT;
    }

    public function delete(Gebruiker $gebruiker, Aanmelding $aanmelding): bool
    {
        return $this->IsEigen($gebruiker, $aanmelding) && $aanmelding->status === Aanmelding::STATUS_CONCEPT;
    }

    public function beoordelen(Gebruiker $gebruiker, Aanmelding $aanmelding): bool
    {
        return $gebruiker->IsVip();
    }

    private function IsEigen(Gebruiker $gebruiker, Aanmelding $aanmelding): bool
    {
        return $gebruiker->organisatie_id !== null && $aanmelding->organisatie_id === $gebruiker->organisatie_id;
    }
}
