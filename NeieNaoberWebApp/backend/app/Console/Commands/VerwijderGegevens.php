<?php

namespace App\Console\Commands;

use App\Mail\GeenExportMail;
use App\Models\Periode;
use App\Services\GegevensOpruimer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

// UC-7: draait elke nacht om 02:00 (zie routes/console.php)
class VerwijderGegevens extends Command
{
    protected $signature = 'app:verwijder-gegevens';

    protected $description = 'Verwijdert vrijwilligersgegevens 1 maand na de einddatum, maar alleen na de export (AVG)';

    public function handle(GegevensOpruimer $opruimer): int
    {
        $grens = now()->subMonths(config('neienaober.bewaren_maanden'))->toDateString();

        $periodes = Periode::query()
            ->whereDate('einddatum', '<', $grens)
            ->whereNull('gegevens_verwijderd_op')
            ->get();

        foreach ($periodes as $periode)
        {
            if ($periode->geexporteerd_op === null)
            {
                // Zonder export zou de gemeente de lijst nooit krijgen; dus niets verwijderen en VIP! waarschuwen
                Mail::to(config('neienaober.vip_email'))->send(new GeenExportMail($periode));
                $this->warn("{$periode->naam}: nog geen export, niets verwijderd. VIP! is gemaild.");
                continue;
            }

            $aantal = $opruimer->VerwijderPeriode($periode);
            $this->info("{$periode->naam}: {$aantal} vrijwilligers verwijderd.");
        }

        return self::SUCCESS;
    }
}
