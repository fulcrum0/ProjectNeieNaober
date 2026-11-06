<?php

namespace Tests\Feature;

use App\Models\Organisatie;
use App\Models\Vrijwilliger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VersturenEnDubbelTest extends TestCase
{
    use RefreshDatabase;

    private function Formulier(array $anders = []): array
    {
        return array_merge([
            'firstName' => 'Anna', 'lastName' => 'Jansen', 'email' => 'anna@example.nl', 'birthDate' => '2000-01-02',
        ], $anders);
    }

    public function test_nieuwe_registratie_is_concept_en_niet_zichtbaar_voor_beheerder(): void
    {
        $organisatie = $this->OrganisatieGebruiker();

        $this->actingAs($organisatie)->postJson('/api/volunteers', $this->Formulier())
            ->assertCreated()
            ->assertJsonPath('sentAt', '');

        $this->actingAs($organisatie)->getJson('/api/volunteers')->assertJsonCount(1);
        $this->actingAs($this->Beheerder())->getJson('/api/volunteers')->assertJsonCount(0);
    }

    public function test_na_versturen_ziet_de_beheerder_de_gegevens(): void
    {
        $organisatie = $this->OrganisatieGebruiker();
        $a = Vrijwilliger::factory()->create(['organisatie_id' => $organisatie->organisatie_id]);
        $b = Vrijwilliger::factory()->create(['organisatie_id' => $organisatie->organisatie_id]);

        $this->actingAs($organisatie)->postJson('/api/volunteers/send', ['ids' => [(string) $a->id]])
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', (string) $a->id)
            ->assertJsonPath('0.sentAt', now()->toDateString());

        $this->actingAs($this->Beheerder())->getJson('/api/volunteers')
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', (string) $a->id);

        $this->assertNull($b->fresh()->verstuurd_op);
    }

    public function test_versturen_negeert_vrijwilligers_van_een_andere_organisatie(): void
    {
        $ander = Vrijwilliger::factory()->create();

        $this->actingAs($this->OrganisatieGebruiker())->postJson('/api/volunteers/send', ['ids' => [$ander->id]])
            ->assertOk()
            ->assertJsonCount(0);

        $this->assertNull($ander->fresh()->verstuurd_op);
    }

    public function test_beheerder_kan_niet_versturen(): void
    {
        $this->actingAs($this->Beheerder())->postJson('/api/volunteers/send', ['ids' => [1]])->assertForbidden();
    }

    public function test_verstuurde_vrijwilliger_kan_organisatie_niet_verwijderen_beheerder_wel(): void
    {
        $organisatie = $this->OrganisatieGebruiker();
        $verstuurd = Vrijwilliger::factory()->create(['organisatie_id' => $organisatie->organisatie_id, 'verstuurd_op' => now()]);
        $concept = Vrijwilliger::factory()->create(['organisatie_id' => $organisatie->organisatie_id]);

        $this->actingAs($organisatie)->deleteJson('/api/volunteers', ['ids' => [$verstuurd->id, $concept->id]])
            ->assertStatus(422)
            ->assertJsonPath('errors.ids.0', 'Verstuurde vrijwilligers kun je niet meer verwijderen. Neem hiervoor contact op met VIP! Tynaarlo.');
        $this->assertModelExists($concept);

        $this->actingAs($organisatie)->deleteJson('/api/volunteers', ['ids' => [$concept->id]])->assertNoContent();
        $this->actingAs($this->Beheerder())->deleteJson('/api/volunteers', ['ids' => [$verstuurd->id]])->assertNoContent();
        $this->assertSame(0, Vrijwilliger::count());
    }

    public function test_beheerder_voegt_toe_en_importeert_als_verstuurd(): void
    {
        $organisatie = Organisatie::factory()->create();
        $this->actingAs($this->Beheerder());

        $this->postJson('/api/volunteers', $this->Formulier(['orgId' => $organisatie->id]))->assertJsonPath('sentAt', now()->toDateString());
        $this->postJson('/api/volunteers/import', ['volunteers' => [['orgId' => $organisatie->id, 'firstName' => 'Piet']]])
            ->assertJsonPath('0.sentAt', now()->toDateString());
    }

    public function test_zelfde_emailadres_in_dezelfde_organisatie_is_dubbel(): void
    {
        $organisatie = $this->OrganisatieGebruiker();
        $this->actingAs($organisatie)->postJson('/api/volunteers', $this->Formulier())->assertCreated();

        $this->postJson('/api/volunteers', $this->Formulier(['firstName' => 'Anne', 'email' => 'ANNA@example.nl']))
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Deze vrijwilliger is al geregistreerd bij deze organisatie (zelfde e-mailadres).');
    }

    public function test_zelfde_naam_en_geboortedatum_in_dezelfde_organisatie_is_dubbel(): void
    {
        $this->actingAs($this->OrganisatieGebruiker())->postJson('/api/volunteers', $this->Formulier())->assertCreated();

        $this->postJson('/api/volunteers', $this->Formulier(['firstName' => 'anna', 'lastName' => 'JANSEN', 'email' => 'ander@example.nl']))
            ->assertStatus(422)
            ->assertJsonPath('errors.birthDate.0', 'Deze vrijwilliger is al geregistreerd bij deze organisatie (zelfde naam en geboortedatum).');

        // Ander tussenvoegsel: "Anna de Jansen" is een andere persoon dan "Anna Jansen"
        $this->postJson('/api/volunteers', $this->Formulier(['infix' => 'de', 'email' => 'derde@example.nl']))->assertCreated();

        // Zelfde naam, andere geboortedatum: een andere persoon
        $this->postJson('/api/volunteers', $this->Formulier(['email' => 'ander@example.nl', 'birthDate' => '1990-05-05']))->assertCreated();
    }

    public function test_zelfde_persoon_bij_een_andere_organisatie_mag_wel(): void
    {
        $this->actingAs($this->OrganisatieGebruiker())->postJson('/api/volunteers', $this->Formulier())->assertCreated();
        $this->actingAs($this->OrganisatieGebruiker())->postJson('/api/volunteers', $this->Formulier())->assertCreated();
    }

    public function test_import_slaat_dubbelen_over_ook_binnen_hetzelfde_bestand(): void
    {
        $organisatie = Organisatie::factory()->create();
        Vrijwilliger::factory()->create(['organisatie_id' => $organisatie->id, 'email' => 'bestaat@example.nl']);

        $this->actingAs($this->Beheerder())->postJson('/api/volunteers/import', ['volunteers' => [
            ['orgId' => $organisatie->id, 'firstName' => 'Al', 'email' => 'bestaat@example.nl'],
            ['orgId' => $organisatie->id, 'firstName' => 'Nieuw', 'email' => 'nieuw@example.nl'],
            ['orgId' => $organisatie->id, 'firstName' => 'Nieuw', 'email' => 'NIEUW@example.nl'],
        ]])
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.email', 'nieuw@example.nl');
    }
}
