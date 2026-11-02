<?php

namespace Tests\Feature;

use App\Mail\UitnodigingMail;
use App\Models\Aanmelding;
use App\Models\Gebruiker;
use App\Models\Periode;
use App\Models\Verklaring;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class BeheerTest extends TestCase
{
    use RefreshDatabase;

    public function test_organisatie_maken_met_account_en_uitnodiging(): void
    {
        Mail::fake();

        $this->actingAs($this->Beheerder())
            ->postJson('/api/beheer/organisaties', ['naam' => ' VV  Vries ', 'plaats' => 'Vries', 'email' => 'info@vvvries.test'])
            ->assertCreated()
            ->assertJsonPath('data.naam', 'VV Vries')
            ->assertJsonPath('data.email', 'info@vvvries.test');

        $gebruiker = Gebruiker::where('email', 'info@vvvries.test')->sole();
        $this->assertSame('organisatie', $gebruiker->rol);
        $this->assertNotNull($gebruiker->organisatie_id);
        Mail::assertSent(UitnodigingMail::class, fn ($mail) => str_contains($mail->link, '/wachtwoord-maken?token='));
    }

    public function test_naam_of_email_bestaat_al(): void
    {
        Mail::fake();
        $beheerder = $this->Beheerder();
        $bestaand = $this->OrganisatieGebruiker();

        $this->actingAs($beheerder)
            ->postJson('/api/beheer/organisaties', ['naam' => $bestaand->organisatie->naam, 'plaats' => 'Vries', 'email' => $bestaand->email])
            ->assertStatus(422)
            ->assertJsonPath('errors.naam.0', 'Er is al een organisatie met deze naam.')
            ->assertJsonPath('errors.email.0', 'Dit e-mailadres heeft al een account.');
    }

    public function test_nieuwe_uitnodiging_sturen(): void
    {
        Mail::fake();
        $organisatie = $this->OrganisatieGebruiker()->organisatie;

        $this->actingAs($this->Beheerder())->postJson("/api/beheer/organisaties/{$organisatie->id}/uitnodiging")->assertOk();
        Mail::assertSent(UitnodigingMail::class);
    }

    public function test_periode_maken_en_regels(): void
    {
        $beheerder = $this->Beheerder();

        $this->actingAs($beheerder)
            ->postJson('/api/beheer/periodes', ['naam' => 'Horecabon 2027', 'startdatum' => '2027-03-01', 'einddatum' => '2027-05-31'])
            ->assertCreated()
            ->assertJsonPath('data.open', false);

        $this->actingAs($beheerder)
            ->postJson('/api/beheer/periodes', ['naam' => 'Fout', 'startdatum' => '2027-09-01', 'einddatum' => '2027-08-01'])
            ->assertStatus(422)
            ->assertJsonPath('errors.einddatum.0', 'De einddatum moet na de startdatum liggen.');

        $this->actingAs($beheerder)
            ->postJson('/api/beheer/periodes', ['naam' => 'Overlap', 'startdatum' => '2027-05-01', 'einddatum' => '2027-06-30'])
            ->assertStatus(422)
            ->assertJsonPath('errors.startdatum.0', 'Deze periode overlapt met een andere periode.');
    }

    public function test_medewerker_mag_niet_beheren(): void
    {
        $this->actingAs($this->Medewerker())
            ->postJson('/api/beheer/organisaties', ['naam' => 'X', 'plaats' => 'Y', 'email' => 'x@y.test'])
            ->assertForbidden();
    }

    public function test_gegevens_verwijderen_met_bevestiging(): void
    {
        $periode = Periode::factory()->afgelopen()->create();
        $andere = $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();
        $verklaring = Verklaring::create([
            'organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id,
            'naam_invuller' => 'Jan', 'versie_privacy' => '1.0',
        ]);
        Aanmelding::factory(3)->status('goedgekeurd')->create(['periode_id' => $periode->id, 'verklaring_id' => $verklaring->id]);
        $blijft = Aanmelding::factory()->create(['periode_id' => $andere->id]);

        $beheerder = $this->Beheerder();

        $this->actingAs($beheerder)->deleteJson("/api/beheer/periodes/{$periode->id}/gegevens", ['bevestiging' => 'verwijder'])
            ->assertStatus(422)->assertJsonPath('errors.bevestiging.0', 'Typ VERWIJDER in hoofdletters om te bevestigen.');

        $this->actingAs($beheerder)->deleteJson("/api/beheer/periodes/{$periode->id}/gegevens", ['bevestiging' => 'VERWIJDER'])
            ->assertNoContent();

        $this->assertSame(0, Aanmelding::where('periode_id', $periode->id)->count());
        $this->assertDatabaseCount('vrijwilligers', 1);
        $this->assertDatabaseHas('aanmeldingen', ['id' => $blijft->id]);
        $this->assertNotNull($periode->refresh()->gegevens_verwijderd_op);
        $this->assertSame('(verwijderd)', $verklaring->refresh()->naam_invuller);
    }
}
