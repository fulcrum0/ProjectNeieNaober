<?php

namespace Tests\Feature;

use App\Mail\GeenExportMail;
use App\Models\Aanmelding;
use App\Models\Periode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AvgOpruimenTest extends TestCase
{
    use RefreshDatabase;

    public function test_zonder_export_niets_verwijderen_en_vip_mailen(): void
    {
        Mail::fake();
        $periode = Periode::factory()->afgelopen(2)->create();
        Aanmelding::factory(2)->status('goedgekeurd')->create(['periode_id' => $periode->id]);

        $this->artisan('app:verwijder-gegevens')->assertSuccessful();

        $this->assertDatabaseCount('aanmeldingen', 2);
        $this->assertNull($periode->refresh()->gegevens_verwijderd_op);
        Mail::assertSent(GeenExportMail::class, fn ($mail) => $mail->hasTo(config('neienaober.vip_email')));
    }

    public function test_na_export_en_een_maand_verwijderen(): void
    {
        Mail::fake();
        $oud = Periode::factory()->afgelopen(2)->create(['geexporteerd_op' => now()->subMonths(2)]);
        $net = Periode::factory()->create([
            'naam' => 'Net afgelopen', 'startdatum' => now()->subMonths(5)->toDateString(),
            'einddatum' => now()->subWeek()->toDateString(), 'geexporteerd_op' => now(),
        ]);
        Aanmelding::factory(3)->status('goedgekeurd')->create(['periode_id' => $oud->id]);
        Aanmelding::factory()->status('goedgekeurd')->create(['periode_id' => $net->id]);

        $this->artisan('app:verwijder-gegevens')->assertSuccessful();

        $this->assertSame(0, Aanmelding::where('periode_id', $oud->id)->count());
        $this->assertSame(1, Aanmelding::where('periode_id', $net->id)->count());
        $this->assertDatabaseCount('vrijwilligers', 1);
        $this->assertNotNull($oud->refresh()->gegevens_verwijderd_op);
        Mail::assertNothingSent();
    }

    public function test_geplande_taak_om_twee_uur(): void
    {
        $this->artisan('schedule:list')->expectsOutputToContain('0 2 * * *')->assertSuccessful();
    }
}
