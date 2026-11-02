<?php

namespace App\Services;

use App\Models\Periode;
use App\Models\Vrijwilliger;
use Illuminate\Support\Facades\DB;

// AVG: persoonsgegevens van een periode definitief verwijderen (UC-7, FE-9, FE-10)
class GegevensOpruimer
{
    private const CHUNK_SIZE = 500;

    public function VerwijderPeriode(Periode $periode): int
    {
        return DB::transaction(function () use ($periode)
        {
            $aantal = 0;

            // De vrijwilligers weg; hun aanmeldingen gaan mee door ON DELETE CASCADE
            Vrijwilliger::query()
                ->whereIn('id', fn ($q) => $q->select('vrijwilliger_id')->from('aanmeldingen')->where('periode_id', $periode->id))
                ->select('id')
                ->chunkById(self::CHUNK_SIZE, function ($vrijwilligers) use (&$aantal)
                {
                    $aantal += Vrijwilliger::query()->whereIn('id', $vrijwilligers->pluck('id'))->delete();
                });

            // De naam van wie het vinkje zette is ook een persoonsgegeven; datum en versie blijven als bewijs
            DB::table('verklaringen')->where('periode_id', $periode->id)->update(['naam_invuller' => '(verwijderd)']);

            $periode->update(['gegevens_verwijderd_op' => now()]);

            return $aantal;
        });
    }
}
