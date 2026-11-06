<?php

namespace Tests\Feature;

use App\Models\Gebruiker;
use App\Models\Organisatie;
use App\Models\Vrijwilliger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganisatieTest extends TestCase
{
    use RefreshDatabase;

    public function test_beheerder_ziet_alle_organisaties_in_de_vorm_van_de_frontend(): void
    {
        Organisatie::factory()->create([
            'naam' => 'Organisatie A', 'telefoon' => '06 1234 5678', 'email' => 'contact@organisatiea.com',
            'locatie' => 'Tynaarlo / Drenthe', 'soort' => 'Horeca',
        ]);
        Organisatie::factory()->create(['telefoon' => null, 'soort' => null]);

        $this->actingAs($this->Beheerder())->getJson('/api/organisations')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0', [
                'id' => '1', 'name' => 'Organisatie A', 'phone' => '06 1234 5678', 'email' => 'contact@organisatiea.com',
                'location' => 'Tynaarlo / Drenthe', 'type' => 'Horeca',
            ])
            ->assertJsonPath('1.phone', '')
            ->assertJsonPath('1.type', '');
    }

    public function test_organisatie_ziet_alleen_zichzelf(): void
    {
        $eigen = Organisatie::factory()->create();
        Organisatie::factory()->create();

        $this->actingAs($this->OrganisatieGebruiker($eigen))->getJson('/api/organisations')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', (string) $eigen->id);
    }

    public function test_import_slaat_lege_en_bestaande_namen_over(): void
    {
        Organisatie::factory()->create(['naam' => 'Bestaat al']);

        $this->actingAs($this->Beheerder())->postJson('/api/organisations/import', ['organisations' => [
            ['name' => 'Nieuw', 'location' => 'Vries', 'email' => '', 'phone' => '', 'type' => ''],
            ['name' => '', 'location' => 'Eelde'],
            ['name' => 'Bestaat al', 'location' => 'Eelde'],
        ]])
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.name', 'Nieuw')
            ->assertJsonPath('0.location', 'Vries');

        $this->assertSame(2, Organisatie::count());
    }

    public function test_verwijderen_neemt_account_en_vrijwilligers_mee(): void
    {
        $organisatie = Organisatie::factory()->create();
        $this->OrganisatieGebruiker($organisatie);
        Vrijwilliger::factory()->count(2)->create(['organisatie_id' => $organisatie->id]);
        $ander = Vrijwilliger::factory()->create();

        $this->actingAs($this->Beheerder())->deleteJson('/api/organisations', ['ids' => [(string) $organisatie->id]])
            ->assertNoContent();

        $this->assertModelMissing($organisatie);
        $this->assertSame(0, Gebruiker::where('organisatie_id', $organisatie->id)->count());
        $this->assertSame([$ander->id], Vrijwilliger::pluck('id')->all());
    }

    public function test_organisatie_mag_niet_beheren(): void
    {
        $gebruiker = $this->OrganisatieGebruiker();

        $this->actingAs($gebruiker)->postJson('/api/organisations/import', ['organisations' => [['name' => 'X']]])->assertForbidden();
        $this->actingAs($gebruiker)->deleteJson('/api/organisations', ['ids' => [$gebruiker->organisatie_id]])->assertForbidden();
    }
}
