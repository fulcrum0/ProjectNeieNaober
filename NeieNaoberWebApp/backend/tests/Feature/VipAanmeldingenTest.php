<?php

namespace Tests\Feature;

use App\Models\Aanmelding;
use App\Models\Vrijwilliger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VipAanmeldingenTest extends TestCase
{
    use RefreshDatabase;

    public function test_overzicht_zonder_concepten_en_met_filters(): void
    {
        $periode = $this->OpenPeriode();
        Aanmelding::factory(2)->create(['periode_id' => $periode->id]);
        Aanmelding::factory(3)->status('nieuw')->create(['periode_id' => $periode->id]);
        $goed = Aanmelding::factory()->status('goedgekeurd')->create([
            'periode_id' => $periode->id,
            'vrijwilliger_id' => Vrijwilliger::factory()->create(['achternaam' => 'Zoekmij', 'postcode' => '9481AB']),
        ]);

        $medewerker = $this->Medewerker();

        $this->actingAs($medewerker)->getJson('/api/vip/aanmeldingen')->assertOk()->assertJsonCount(4, 'data')
            ->assertJsonStructure(['data', 'links', 'meta' => ['last_page', 'total']]);
        $this->actingAs($medewerker)->getJson('/api/vip/aanmeldingen?status=nieuw')->assertJsonCount(3, 'data');
        $this->actingAs($medewerker)->getJson('/api/vip/aanmeldingen?zoek=zoekmij 9481')
            ->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $goed->id);
        $this->actingAs($medewerker)->getJson("/api/vip/aanmeldingen?organisatie={$goed->organisatie_id}")
            ->assertJsonCount(1, 'data');
        $this->actingAs($medewerker)->getJson('/api/vip/aanmeldingen?status=onzin')->assertStatus(422);
    }

    public function test_goedkeuren_slaat_op_wie_en_wanneer(): void
    {
        $aanmelding = Aanmelding::factory()->status('nieuw')->create(['periode_id' => $this->OpenPeriode()->id]);
        $medewerker = $this->Medewerker();

        $this->actingAs($medewerker)->patchJson("/api/vip/aanmeldingen/{$aanmelding->id}/status", ['status' => 'goedgekeurd'])
            ->assertOk()
            ->assertJsonPath('data.status', 'goedgekeurd')
            ->assertJsonPath('data.beoordeeld_door', $medewerker->naam);

        $this->assertNotNull($aanmelding->refresh()->beoordeeld_op);

        $this->actingAs($medewerker)->patchJson("/api/vip/aanmeldingen/{$aanmelding->id}/status", ['status' => 'concept'])
            ->assertStatus(422)->assertJsonPath('errors.status.0', 'Kies goedgekeurd of afgekeurd.');
    }

    public function test_concept_kan_niet_beoordeeld_worden(): void
    {
        $aanmelding = Aanmelding::factory()->create(['periode_id' => $this->OpenPeriode()->id]);

        $this->actingAs($this->Medewerker())->patchJson("/api/vip/aanmeldingen/{$aanmelding->id}/status", ['status' => 'goedgekeurd'])
            ->assertStatus(422);
    }

    public function test_dubbele_naast_elkaar_en_vlag_weg_na_afkeuren(): void
    {
        $this->OpenPeriode();
        $eerste = $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens())->json('data.id');
        $tweede = $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens())->json('data.id');
        Aanmelding::query()->update(['status' => 'nieuw']);

        $medewerker = $this->Medewerker();

        $this->actingAs($medewerker)->getJson("/api/vip/aanmeldingen/{$eerste}")
            ->assertOk()
            ->assertJsonPath('data.mogelijk_dubbel', true)
            ->assertJsonCount(1, 'data.mogelijke_dubbels')
            ->assertJsonPath('data.mogelijke_dubbels.0.id', $tweede);

        $this->actingAs($medewerker)->getJson('/api/vip/aanmeldingen?dubbel=1')->assertJsonCount(2, 'data');

        $this->actingAs($medewerker)->patchJson("/api/vip/aanmeldingen/{$tweede}/status", ['status' => 'afgekeurd'])->assertOk();

        $this->assertFalse(Aanmelding::find($eerste)->mogelijk_dubbel);
        $this->assertFalse(Aanmelding::find($tweede)->mogelijk_dubbel);
    }

    public function test_vip_kan_gegevens_aanpassen(): void
    {
        $aanmelding = Aanmelding::factory()->status('nieuw')->create(['periode_id' => $this->OpenPeriode()->id]);

        $this->actingAs($this->Medewerker())
            ->putJson("/api/vip/aanmeldingen/{$aanmelding->id}", $this->VrijwilligerGegevens(['achternaam' => 'Verbeterd']))
            ->assertOk()
            ->assertJsonPath('data.vrijwilliger.achternaam', 'Verbeterd')
            ->assertJsonPath('data.status', 'nieuw');
    }

    public function test_organisaties_met_aantallen(): void
    {
        $periode = $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();
        Aanmelding::factory(2)->status('nieuw')->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);
        Aanmelding::factory()->status('goedgekeurd')->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);
        Aanmelding::factory()->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);

        $this->actingAs($this->Medewerker())->getJson('/api/vip/organisaties')
            ->assertOk()
            ->assertJsonPath('data.0.email', $gebruiker->email)
            ->assertJsonPath('data.0.aantal_aanmeldingen', 3)
            ->assertJsonPath('data.0.aantal_nieuw', 2)
            ->assertJsonPath('data.0.aantal_goedgekeurd', 1);
    }

    public function test_overzicht_voor_het_dashboard(): void
    {
        $periode = $this->OpenPeriode();
        Aanmelding::factory(2)->create(['periode_id' => $periode->id]);
        Aanmelding::factory(3)->status('nieuw')->create(['periode_id' => $periode->id]);
        Aanmelding::factory()->status('goedgekeurd')->create(['periode_id' => $periode->id, 'mogelijk_dubbel' => true]);

        $this->actingAs($this->Medewerker())->getJson('/api/vip/overzicht')
            ->assertOk()
            ->assertJsonPath('periode.id', $periode->id)
            ->assertJsonPath('aantal_aanmeldingen', 4)
            ->assertJsonPath('aantal_nieuw', 3)
            ->assertJsonPath('aantal_goedgekeurd', 1)
            ->assertJsonPath('aantal_dubbel', 1)
            ->assertJsonPath('aantal_organisaties', 6);
    }

    public function test_een_organisatie_en_zoeken(): void
    {
        $gebruiker = $this->OrganisatieGebruiker();
        $gebruiker->organisatie->update(['naam' => 'VV Vries', 'plaats' => 'Vries']);
        $this->OrganisatieGebruiker()->organisatie->update(['naam' => 'Zorgclub', 'plaats' => 'Eelde']);
        $medewerker = $this->Medewerker();

        $this->actingAs($medewerker)->getJson("/api/vip/organisaties/{$gebruiker->organisatie_id}")
            ->assertOk()
            ->assertJsonPath('data.naam', 'VV Vries')
            ->assertJsonPath('data.email', $gebruiker->email)
            ->assertJsonPath('data.aantal_aanmeldingen', 0);

        $this->actingAs($medewerker)->getJson('/api/vip/organisaties?zoek=vries')->assertJsonCount(1, 'data');
        $this->actingAs($medewerker)->getJson('/api/vip/organisaties/9999')->assertNotFound();
    }
}
