<?php

namespace Tests\Feature;

use App\Models\Aanmelding;
use App\Models\Periode;
use App\Models\Verklaring;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Tests\TestCase;

class MijnVrijwilligersTest extends TestCase
{
    use RefreshDatabase;

    public function test_vrijwilliger_toevoegen_wordt_concept_en_netjes_opgeslagen(): void
    {
        $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();

        $this->actingAs($gebruiker)
            ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens(['voornaam' => '  Anna ', 'postcode' => '9481 ab']))
            ->assertCreated()
            ->assertJsonPath('data.status', 'concept')
            ->assertJsonPath('data.mogelijk_dubbel', false)
            ->assertJsonPath('data.vrijwilliger.voornaam', 'Anna')
            ->assertJsonPath('data.vrijwilliger.postcode', '9481AB');
    }

    public function test_foutmeldingen_in_gewone_taal(): void
    {
        $this->OpenPeriode();

        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens([
                'postcode' => '0123 AB', 'voornaam' => 'Dhr. Piet', 'achternaam' => '',
            ]))
            ->assertStatus(422)
            ->assertJsonPath('message', 'Niet alle velden zijn goed ingevuld.')
            ->assertJsonPath('errors.postcode.0', 'Vul een postcode in zoals 9481 AB.')
            ->assertJsonPath('errors.voornaam.0', 'Zet dhr. of mevr. niet bij de voornaam. Kies de aanhef.')
            ->assertJsonPath('errors.achternaam.0', 'Vul de achternaam in.');
    }

    public function test_aanhef_mag_alleen_dhr_of_mevr(): void
    {
        $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();

        $this->actingAs($gebruiker)->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens(['aanhef' => 'Dhr']))
            ->assertCreated()->assertJsonPath('data.vrijwilliger.aanhef', 'dhr.');

        $this->actingAs($gebruiker)->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens(['aanhef' => 'prof.', 'voornaam' => 'Bob']))
            ->assertStatus(422)->assertJsonValidationErrors('aanhef');
    }

    public function test_zonder_open_periode_kan_niet_aanmelden(): void
    {
        Periode::factory()->afgelopen()->create();

        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens())
            ->assertStatus(422)
            ->assertJsonValidationErrors('periode');
    }

    public function test_maximaal_3_keer_per_periode(): void
    {
        $this->OpenPeriode();

        for ($i = 0; $i < 3; $i++)
        {
            $this->actingAs($this->OrganisatieGebruiker())
                ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens())
                ->assertCreated();
        }

        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens(['voornaam' => 'ANNA', 'postcode' => '9481AB']))
            ->assertStatus(422)
            ->assertJsonPath('errors.vrijwilliger.0', 'Deze vrijwilliger is in deze periode al 3 keer aangemeld. Meer mag niet.');
    }

    public function test_niet_twee_keer_bij_dezelfde_organisatie(): void
    {
        $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();

        $this->actingAs($gebruiker)->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens())->assertCreated();
        $this->actingAs($gebruiker)->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens())
            ->assertStatus(422)
            ->assertJsonPath('errors.vrijwilliger.0', 'Deze vrijwilliger is al aangemeld bij deze organisatie.');
    }

    public function test_mogelijk_dubbel_bij_andere_organisatie(): void
    {
        $this->OpenPeriode();

        $eerste = $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens())->json('data.id');

        // Andere voornaam, zelfde achternaam en adres: misschien dezelfde persoon, misschien partner
        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/mijn/vrijwilligers', $this->VrijwilligerGegevens(['voornaam' => 'Bert']))
            ->assertCreated()
            ->assertJsonPath('data.mogelijk_dubbel', true);

        $this->assertTrue(Aanmelding::find($eerste)->mogelijk_dubbel);
    }

    public function test_alleen_eigen_lijst_van_de_open_periode(): void
    {
        $periode = $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();

        Aanmelding::factory(2)->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);
        Aanmelding::factory(3)->create(['periode_id' => $periode->id]);

        $this->actingAs($gebruiker)->getJson('/api/mijn/vrijwilligers')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.per_page', 50)
            ->assertJsonPath('periode.id', $periode->id)
            ->assertJsonPath('aantal_concept', 2);
    }

    public function test_aanmelding_van_een_ander_geeft_403(): void
    {
        $periode = $this->OpenPeriode();
        $vreemd = Aanmelding::factory()->create(['periode_id' => $periode->id]);
        $gebruiker = $this->OrganisatieGebruiker();

        $this->actingAs($gebruiker)->getJson("/api/mijn/vrijwilligers/{$vreemd->id}")->assertForbidden();
        $this->actingAs($gebruiker)->putJson("/api/mijn/vrijwilligers/{$vreemd->id}", $this->VrijwilligerGegevens())->assertForbidden();
        $this->actingAs($gebruiker)->deleteJson("/api/mijn/vrijwilligers/{$vreemd->id}")->assertForbidden();
        $this->actingAs($gebruiker)->getJson('/api/mijn/vrijwilligers/99999')->assertNotFound()
            ->assertJsonPath('message', 'Dit record bestaat niet.');
    }

    public function test_aanpassen_en_verwijderen_alleen_bij_concept(): void
    {
        $periode = $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();
        $concept = Aanmelding::factory()->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);
        $verstuurd = Aanmelding::factory()->status('nieuw')->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);

        $this->actingAs($gebruiker)->putJson("/api/mijn/vrijwilligers/{$concept->id}", $this->VrijwilligerGegevens(['woonplaats' => 'Eelde']))
            ->assertOk()->assertJsonPath('data.vrijwilliger.woonplaats', 'Eelde');
        $this->actingAs($gebruiker)->putJson("/api/mijn/vrijwilligers/{$verstuurd->id}", $this->VrijwilligerGegevens())->assertForbidden();
        $this->actingAs($gebruiker)->deleteJson("/api/mijn/vrijwilligers/{$verstuurd->id}")->assertForbidden();

        $this->actingAs($gebruiker)->deleteJson("/api/mijn/vrijwilligers/{$concept->id}")->assertNoContent();
        $this->assertDatabaseMissing('aanmeldingen', ['id' => $concept->id]);
        $this->assertDatabaseMissing('vrijwilligers', ['id' => $concept->vrijwilliger_id]);
    }

    public function test_versturen_zonder_vinkje_kan_niet(): void
    {
        $periode = $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();
        Aanmelding::factory()->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);

        $this->actingAs($gebruiker)->postJson('/api/mijn/versturen', ['akkoord_privacy' => false, 'naam_invuller' => 'Jan'])
            ->assertStatus(422)
            ->assertJsonPath('errors.akkoord_privacy.0', 'Zet het vinkje bij de privacyverklaring aan. Zonder vinkje kunt u niet versturen.');

        $this->assertDatabaseCount('verklaringen', 0);
    }

    public function test_versturen_maakt_verklaring_en_zet_status_op_nieuw(): void
    {
        $periode = $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();
        Aanmelding::factory(3)->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);
        $ander = Aanmelding::factory()->create(['periode_id' => $periode->id]);

        $this->actingAs($gebruiker)->postJson('/api/mijn/versturen', ['akkoord_privacy' => true, 'naam_invuller' => 'Jan de Vries'])
            ->assertOk()
            ->assertJsonPath('aantal_verstuurd', 3);

        $verklaring = Verklaring::sole();
        $this->assertSame('Jan de Vries', $verklaring->naam_invuller);
        $this->assertSame('1.0', $verklaring->versie_privacy);
        $this->assertSame($gebruiker->id, $verklaring->gebruiker_id);
        $this->assertSame(3, Aanmelding::where('status', 'nieuw')->where('verklaring_id', $verklaring->id)->count());
        $this->assertSame('concept', $ander->refresh()->status);

        // Niets meer te versturen
        $this->actingAs($gebruiker)->postJson('/api/mijn/versturen', ['akkoord_privacy' => true, 'naam_invuller' => 'Jan'])
            ->assertStatus(422)->assertJsonValidationErrors('versturen');
    }

    public function test_eigen_lijst_downloaden_als_excel(): void
    {
        $periode = $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();
        Aanmelding::factory(2)->create(['organisatie_id' => $gebruiker->organisatie_id, 'periode_id' => $periode->id]);
        Aanmelding::factory()->create(['periode_id' => $periode->id]);

        $response = $this->actingAs($gebruiker)->get('/api/mijn/export')->assertOk();
        $this->assertStringContainsString('spreadsheetml', $response->headers->get('Content-Type'));

        $sheet = $this->LeesExcel($response->streamedContent());
        $this->assertSame('Achternaam', $sheet->getCell('D1')->getValue());
        $this->assertSame(3, $sheet->getHighestDataRow());
    }

    public function test_upload_csv_met_veel_vrijwilligers(): void
    {
        $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();

        $csv = "Aanhef;Voornaam;Tussenvoegsel;Achternaam;Straat;Huisnummer;Postcode;Woonplaats\n"
            . "mevr.;Anna;;Jansen;Brink;12;9481 AB;Vries\n"
            . "dhr.;Piet;van;Dam;Kerkstraat;3;9471 CD;Zuidlaren\n";

        $this->actingAs($gebruiker)
            ->post('/api/mijn/vrijwilligers/upload', ['bestand' => UploadedFile::fake()->createWithContent('lijst.csv', $csv)], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('aantal_toegevoegd', 2);

        $this->assertSame(2, Aanmelding::where('status', 'concept')->count());
    }

    public function test_upload_met_fout_slaat_niets_op(): void
    {
        $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();

        $csv = "Voornaam,Achternaam,Straat,Huisnummer,Postcode,Woonplaats\n"
            . "Anna,Jansen,Brink,12,9481 AB,Vries\n"
            . "Piet,Dam,Kerkstraat,3,12345,Zuidlaren\n"
            . "Anna,Jansen,Brink,12,9481 AB,Vries\n";

        $this->actingAs($gebruiker)
            ->post('/api/mijn/vrijwilligers/upload', ['bestand' => UploadedFile::fake()->createWithContent('lijst.csv', $csv)], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonPath('fouten.0.rij', 3)
            ->assertJsonPath('fouten.0.meldingen.0', 'Vul een postcode in zoals 9481 AB.');

        $this->assertDatabaseCount('aanmeldingen', 0);
    }

    public function test_upload_dubbele_rij_in_bestand_draait_alles_terug(): void
    {
        $this->OpenPeriode();
        $gebruiker = $this->OrganisatieGebruiker();

        $csv = "Voornaam,Achternaam,Straat,Huisnummer,Postcode,Woonplaats\n"
            . "Anna,Jansen,Brink,12,9481 AB,Vries\n"
            . "Anna,Jansen,Brink,12,9481 AB,Vries\n";

        $this->actingAs($gebruiker)
            ->post('/api/mijn/vrijwilligers/upload', ['bestand' => UploadedFile::fake()->createWithContent('lijst.csv', $csv)], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonPath('fouten.0.rij', 3);

        $this->assertDatabaseCount('aanmeldingen', 0);
        $this->assertDatabaseCount('vrijwilligers', 0);
    }

    private function LeesExcel(string $inhoud)
    {
        $pad = tempnam(sys_get_temp_dir(), 'xlsx');
        file_put_contents($pad, $inhoud);

        return IOFactory::load($pad)->getActiveSheet();
    }
}
