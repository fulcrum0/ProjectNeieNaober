<?php

namespace Tests\Feature;

use App\Models\Aanmelding;
use App\Models\Vrijwilliger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OpenbaarTest extends TestCase
{
    use RefreshDatabase;

    public function test_zelf_aanmelden_wordt_nieuw_zonder_organisatie_id(): void
    {
        $this->OpenPeriode();

        $this->postJson('/api/zelf-aanmelden', $this->VrijwilligerGegevens([
            'organisatie_naam' => 'Voetbalclub Groningen', 'akkoord_privacy' => true,
        ]))->assertCreated()->assertJsonMissingPath('data');

        $aanmelding = Aanmelding::sole();
        $this->assertSame('nieuw', $aanmelding->status);
        $this->assertNull($aanmelding->organisatie_id);
        $this->assertSame('Voetbalclub Groningen', $aanmelding->organisatie_naam);
    }

    public function test_zelf_aanmelden_zonder_vinkje(): void
    {
        $this->OpenPeriode();

        $this->postJson('/api/zelf-aanmelden', $this->VrijwilligerGegevens(['organisatie_naam' => 'Club']))
            ->assertStatus(422)->assertJsonValidationErrors(['akkoord_privacy']);
    }

    public function test_zelf_aanmelden_max_10_per_minuut(): void
    {
        $this->OpenPeriode();

        for ($i = 0; $i < 10; $i++)
        {
            $this->postJson('/api/zelf-aanmelden', [])->assertStatus(422);
        }

        $this->postJson('/api/zelf-aanmelden', [])->assertStatus(429);
    }

    public function test_ben_ik_aangemeld_geeft_alleen_ja_of_nee(): void
    {
        $periode = $this->OpenPeriode();
        $vrijwilliger = Vrijwilliger::factory()->create(['voornaam' => 'Anna', 'achternaam' => 'Jansen', 'postcode' => '9481AB', 'huisnummer' => '12a']);
        Aanmelding::factory()->status('nieuw')->create(['periode_id' => $periode->id, 'vrijwilliger_id' => $vrijwilliger->id]);

        $this->postJson('/api/ben-ik-aangemeld', ['voornaam' => 'anna', 'achternaam' => 'JANSEN', 'postcode' => '9481 ab', 'huisnummer' => '12A'])
            ->assertOk()
            ->assertExactJson(['aangemeld' => true, 'message' => 'U bent aangemeld.']);

        $this->postJson('/api/ben-ik-aangemeld', ['voornaam' => 'Bert', 'achternaam' => 'Jansen', 'postcode' => '9481AB', 'huisnummer' => '12a'])
            ->assertOk()
            ->assertExactJson(['aangemeld' => false, 'message' => 'Wij kunnen u niet vinden. Vraag het na bij uw organisatie.']);
    }

    public function test_concept_telt_nog_niet_als_aangemeld(): void
    {
        $periode = $this->OpenPeriode();
        $vrijwilliger = Vrijwilliger::factory()->create(['voornaam' => 'Anna', 'achternaam' => 'Jansen', 'postcode' => '9481AB', 'huisnummer' => '12']);
        Aanmelding::factory()->create(['periode_id' => $periode->id, 'vrijwilliger_id' => $vrijwilliger->id]);

        $this->postJson('/api/ben-ik-aangemeld', ['voornaam' => 'Anna', 'achternaam' => 'Jansen', 'postcode' => '9481AB', 'huisnummer' => '12'])
            ->assertJsonPath('aangemeld', false);
    }

    public function test_huidige_periode(): void
    {
        $this->getJson('/api/periode')->assertOk()->assertJsonPath('data', null);

        $periode = $this->OpenPeriode();
        $this->getJson('/api/periode')->assertJsonPath('data.id', $periode->id)->assertJsonPath('data.open', true);
    }
}
