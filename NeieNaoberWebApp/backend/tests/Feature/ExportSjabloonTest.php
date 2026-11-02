<?php

namespace Tests\Feature;

use App\Models\Aanmelding;
use App\Models\ExportSjabloon;
use App\Models\Periode;
use App\Models\Vrijwilliger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\TestCase;

class ExportSjabloonTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
    }

    public function test_sjabloon_uploaden_vindt_kolommen_en_raadt_velden(): void
    {
        $response = $this->actingAs($this->Medewerker())
            ->post('/api/vip/sjablonen', ['bestand' => $this->SjabloonBestand(['Achternaam', 'Voornaam', 'Postcode', 'Iets anders'])], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('gevonden_kolommen.A', 'Achternaam')
            ->assertJsonPath('data.kolomnamen.D', 'Iets anders')
            ->assertJsonPath('data.kolommen.A', 'achternaam')
            ->assertJsonPath('data.kolommen.C', 'postcode')
            ->assertJsonPath('data.kolommen.D', null)
            ->assertJsonPath('data.actief', true);

        Storage::disk('local')->assertExists(ExportSjabloon::find($response->json('data.id'))->bestandsnaam);
    }

    public function test_alleen_xlsx(): void
    {
        $this->actingAs($this->Medewerker())
            ->post('/api/vip/sjablonen', ['bestand' => UploadedFile::fake()->create('sjabloon.pdf', 10, 'application/pdf')], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonPath('errors.bestand.0', 'Kies een Excel-bestand (.xlsx).');
    }

    public function test_altijd_maar_een_sjabloon_actief(): void
    {
        $medewerker = $this->Medewerker();
        $eerste = $this->actingAs($medewerker)->post('/api/vip/sjablonen', ['bestand' => $this->SjabloonBestand(['Naam'])], ['Accept' => 'application/json'])->json('data.id');
        $tweede = $this->actingAs($medewerker)->post('/api/vip/sjablonen', ['bestand' => $this->SjabloonBestand(['Naam'])], ['Accept' => 'application/json'])
            ->assertJsonPath('data.actief', false)->json('data.id');

        $this->actingAs($medewerker)->putJson("/api/vip/sjablonen/{$tweede}", ['actief' => true, 'kolommen' => ['A' => 'achternaam', 'B' => 'postcode']])
            ->assertOk()->assertJsonPath('data.kolommen.B', 'postcode');

        $this->assertFalse(ExportSjabloon::find($eerste)->actief);
        $this->assertSame(1, ExportSjabloon::where('actief', true)->count());

        $this->actingAs($medewerker)->putJson("/api/vip/sjablonen/{$tweede}", ['actief' => false])->assertStatus(422);
        $this->actingAs($medewerker)->putJson("/api/vip/sjablonen/{$tweede}", ['kolommen' => ['A' => 'wachtwoord']])->assertStatus(422);
        $this->actingAs($medewerker)->putJson("/api/vip/sjablonen/{$tweede}", ['kolommen' => ['1' => 'postcode']])->assertStatus(422);
    }

    public function test_export_met_niet_gecontroleerde_aanmeldingen_waarschuwt(): void
    {
        $periode = $this->ExportKlaar();
        Aanmelding::factory()->status('nieuw')->create(['periode_id' => $periode->id]);

        $this->actingAs($this->Medewerker())->getJson("/api/vip/export?periode_id={$periode->id}")
            ->assertStatus(422)
            ->assertJsonPath('errors.periode_id.0', 'Er zijn nog 1 aanmeldingen niet gecontroleerd. Wilt u toch doorgaan?');

        $this->assertNull($periode->refresh()->geexporteerd_op);

        $this->actingAs($this->Medewerker())->get("/api/vip/export?periode_id={$periode->id}&doorgaan=1")->assertOk();
    }

    public function test_export_alleen_goedgekeurd_als_tekst_in_sjabloonkolommen(): void
    {
        $periode = $this->ExportKlaar();

        $gevaarlijk = Vrijwilliger::factory()->create(['voornaam' => '=HYPERLINK("http://slecht.test")', 'achternaam' => 'Aaa', 'postcode' => '9481AB', 'huisnummer' => '007']);
        Aanmelding::factory()->status('goedgekeurd')->create(['periode_id' => $periode->id, 'vrijwilliger_id' => $gevaarlijk->id]);
        Aanmelding::factory(2)->status('goedgekeurd')->create(['periode_id' => $periode->id]);
        Aanmelding::factory()->status('afgekeurd')->create(['periode_id' => $periode->id]);
        Aanmelding::factory()->status('goedgekeurd')->create(['periode_id' => Periode::factory()->afgelopen(12)->create()->id]);

        $response = $this->actingAs($this->Medewerker())->get("/api/vip/export?periode_id={$periode->id}")->assertOk();
        $sheet = $this->LeesExcel($response->streamedContent());

        // Rij 1 is de kop van de gemeente, daarna 3 goedgekeurde
        $this->assertSame('Achternaam', $sheet->getCell('A1')->getValue());
        $this->assertSame(4, $sheet->getHighestDataRow());

        $rij = collect(range(2, 4))->first(fn ($r) => $sheet->getCell("A{$r}")->getValue() === 'Aaa');
        $this->assertSame('=HYPERLINK("http://slecht.test")', $sheet->getCell("B{$rij}")->getValue());
        $this->assertSame(DataType::TYPE_STRING, $sheet->getCell("B{$rij}")->getDataType());
        $this->assertSame('007', $sheet->getCell("D{$rij}")->getValue());

        $this->assertNotNull($periode->refresh()->geexporteerd_op);
    }

    public function test_export_zonder_actief_sjabloon(): void
    {
        $periode = $this->OpenPeriode();

        $this->actingAs($this->Medewerker())->getJson("/api/vip/export?periode_id={$periode->id}")
            ->assertStatus(422)->assertJsonValidationErrors('sjabloon');
    }

    public function test_export_3000_aanmeldingen_binnen_10_seconden(): void
    {
        $periode = $this->ExportKlaar();
        $organisatie = $this->OrganisatieGebruiker()->organisatie;

        // Snel invoeren met één insert per 500, anders duurt de test zelf te lang
        foreach (array_chunk(range(1, 3000), 500) as $stuk)
        {
            $nu = now();
            Vrijwilliger::insert(array_map(fn ($i) => [
                'voornaam' => "Test{$i}", 'achternaam' => 'Persoon', 'straat' => 'Brink', 'huisnummer' => (string) $i,
                'postcode' => '9481AB', 'woonplaats' => 'Vries', 'created_at' => $nu, 'updated_at' => $nu,
            ], $stuk));
        }

        Aanmelding::insert(Vrijwilliger::pluck('id')->map(fn ($id) => [
            'vrijwilliger_id' => $id, 'periode_id' => $periode->id, 'organisatie_id' => $organisatie->id, 'status' => 'goedgekeurd',
        ])->all());

        $start = microtime(true);
        $response = $this->actingAs($this->Medewerker())->get("/api/vip/export?periode_id={$periode->id}")->assertOk();
        $inhoud = $response->streamedContent();
        $duur = microtime(true) - $start;

        $this->assertLessThan(10, $duur, "Export duurde {$duur} seconden");
        $this->assertSame(3001, $this->LeesExcel($inhoud)->getHighestDataRow());
    }

    private function ExportKlaar(): Periode
    {
        $pad = 'sjablonen/test.xlsx';
        Storage::disk('local')->put($pad, file_get_contents($this->SjabloonBestand(['Achternaam', 'Voornaam', 'Postcode', 'Huisnummer', 'Organisatie'])->getRealPath()));

        ExportSjabloon::create([
            'naam' => 'Test', 'bestandsnaam' => $pad, 'actief' => true,
            'kolommen' => ['A' => 'achternaam', 'B' => 'voornaam', 'C' => 'postcode', 'D' => 'huisnummer', 'E' => 'organisatie'],
        ]);

        return $this->OpenPeriode();
    }

    private function SjabloonBestand(array $koppen): UploadedFile
    {
        $spreadsheet = new Spreadsheet();

        foreach (array_values($koppen) as $index => $kop)
        {
            $spreadsheet->getActiveSheet()->setCellValue(chr(65 + $index) . '1', $kop);
        }

        $pad = tempnam(sys_get_temp_dir(), 'sjabloon') . '.xlsx';
        (new Xlsx($spreadsheet))->save($pad);

        return new UploadedFile($pad, 'sjabloon-gemeente.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);
    }

    private function LeesExcel(string $inhoud)
    {
        $pad = tempnam(sys_get_temp_dir(), 'xlsx');
        file_put_contents($pad, $inhoud);

        return IOFactory::load($pad)->getActiveSheet();
    }
}
