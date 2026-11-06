<?php

namespace Tests\Feature;

use App\Models\Organisatie;
use App\Models\Vrijwilliger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VrijwilligerTest extends TestCase
{
    use RefreshDatabase;

    // Precies wat VolunteerForm.jsx uit v1.0 opstuurt
    private function Formulier(array $anders = []): array
    {
        return array_merge([
            'firstName' => 'Anna', 'lastName' => 'Jansen', 'email' => 'anna@example.nl', 'phone' => '',
            'street' => 'Brink', 'houseNumber' => '12', 'addition' => 'a', 'postcode' => '9481 ab', 'birthDate' => '2000-01-02',
        ], $anders);
    }

    public function test_organisatie_registreert_een_vrijwilliger(): void
    {
        $gebruiker = $this->OrganisatieGebruiker();

        $this->actingAs($gebruiker)->postJson('/api/volunteers', $this->Formulier())
            ->assertCreated()
            ->assertExactJson([
                'id' => '1', 'orgId' => (string) $gebruiker->organisatie_id, 'firstName' => 'Anna', 'infix' => '', 'lastName' => 'Jansen',
                'email' => 'anna@example.nl', 'phone' => '', 'birthDate' => '2000-01-02', 'street' => 'Brink', 'houseNumber' => '12',
                'addition' => 'a', 'postcode' => '9481AB', 'createdAt' => now()->toDateString(), 'sentAt' => '',
            ]);
    }

    public function test_organisatie_kan_niet_voor_een_andere_organisatie_registreren(): void
    {
        $gebruiker = $this->OrganisatieGebruiker();
        $ander = Organisatie::factory()->create();

        $this->actingAs($gebruiker)->postJson('/api/volunteers', $this->Formulier(['orgId' => $ander->id]))
            ->assertCreated()
            ->assertJsonPath('orgId', (string) $gebruiker->organisatie_id);
    }

    public function test_verplichte_velden_en_geldig_emailadres(): void
    {
        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/volunteers', $this->Formulier(['firstName' => '', 'email' => 'geen-mail', 'birthDate' => now()->addDay()->toDateString()]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['firstName', 'email', 'birthDate']);
    }

    public function test_formulier_controleert_namen_telefoon_huisnummer_en_postcode(): void
    {
        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/volunteers', $this->Formulier([
                'firstName' => 'Anna1', 'lastName' => '', 'birthDate' => '1800-01-01', 'phone' => '06-abc', 'houseNumber' => '12a', 'postcode' => '0123 AB',
            ]))
            ->assertStatus(422)
            ->assertJsonPath('errors.firstName.0', 'Een voornaam bevat alleen letters.')
            ->assertJsonPath('errors.lastName.0', 'Vul de achternaam in.')
            ->assertJsonPath('errors.birthDate.0', 'Vul een geldige geboortedatum in (niet in de toekomst).')
            ->assertJsonPath('errors.phone.0', 'Vul een geldig telefoonnummer in, bijvoorbeeld 06 1234 5678.')
            ->assertJsonPath('errors.houseNumber.0', 'Een huisnummer bevat alleen cijfers. Letters horen bij de toevoeging.')
            ->assertJsonPath('errors.postcode.0', 'Vul een postcode in zoals 9481 AB.');
    }

    public function test_formulier_accepteert_geldige_namen_en_telefoonnummers(): void
    {
        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/volunteers', $this->Formulier(['firstName' => 'Anne-Marie', 'infix' => "van 't", 'lastName' => 'Hof', 'phone' => '+31 6 1234 5678']))
            ->assertCreated()
            ->assertJsonPath('infix', "van 't")
            ->assertJsonPath('lastName', 'Hof');

        $this->postJson('/api/volunteers', $this->Formulier(['phone' => '06 123']))->assertStatus(422)->assertJsonValidationErrors('phone');
    }

    public function test_emailadres_of_telefoonnummer_is_verplicht_de_rest_niet(): void
    {
        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/volunteers', $this->Formulier(['email' => '', 'phone' => '']))
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Vul een e-mailadres of telefoonnummer in.')
            ->assertJsonPath('errors.phone.0', 'Vul een e-mailadres of telefoonnummer in.');

        // Alleen een naam en een telefoonnummer is genoeg
        $this->postJson('/api/volunteers', [
            'firstName' => 'Piet', 'lastName' => 'Bakker', 'phone' => '06 1234 5678',
            'email' => '', 'birthDate' => '', 'street' => '', 'houseNumber' => '', 'addition' => '', 'postcode' => '',
        ])
            ->assertCreated()
            ->assertJsonPath('email', '')
            ->assertJsonPath('birthDate', '');
    }

        public function test_namen_krijgen_een_hoofdletter_tussenvoegsel_niet(): void
    {
        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/volunteers', $this->Formulier(['firstName' => ' émile ', 'infix' => 'Van Der', 'lastName' => 'berg']))
            ->assertCreated()
            ->assertJsonPath('firstName', 'Émile')
            ->assertJsonPath('infix', 'van der')
            ->assertJsonPath('lastName', 'Berg');

        $this->postJson('/api/volunteers', $this->Formulier(['email' => 'ander@example.nl', 'infix' => '123']))
            ->assertStatus(422)
            ->assertJsonPath('errors.infix.0', 'Een tussenvoegsel bevat alleen letters, zoals "van der".');
    }

        public function test_beheerder_moet_een_organisatie_kiezen(): void
    {
        $organisatie = Organisatie::factory()->create();
        $this->actingAs($this->Beheerder());

        $this->postJson('/api/volunteers', $this->Formulier())->assertStatus(422)->assertJsonValidationErrors('orgId');
        $this->postJson('/api/volunteers', $this->Formulier(['orgId' => (string) $organisatie->id]))
            ->assertCreated()
            ->assertJsonPath('orgId', (string) $organisatie->id);
    }

    public function test_organisatie_ziet_alleen_eigen_vrijwilligers_beheerder_alleen_verstuurde(): void
    {
        $gebruiker = $this->OrganisatieGebruiker();
        Vrijwilliger::factory()->create(['organisatie_id' => $gebruiker->organisatie_id]);
        Vrijwilliger::factory()->create(['organisatie_id' => $gebruiker->organisatie_id, 'verstuurd_op' => now()]);
        Vrijwilliger::factory()->create(['verstuurd_op' => now()]);

        $this->actingAs($gebruiker)->getJson('/api/volunteers')->assertOk()->assertJsonCount(2);
        $this->actingAs($this->Beheerder())->getJson('/api/volunteers')->assertOk()->assertJsonCount(2);
    }

    public function test_organisatie_verwijdert_alleen_eigen_vrijwilligers(): void
    {
        $gebruiker = $this->OrganisatieGebruiker();
        $eigen = Vrijwilliger::factory()->create(['organisatie_id' => $gebruiker->organisatie_id]);
        $ander = Vrijwilliger::factory()->create();

        $this->actingAs($gebruiker)->deleteJson('/api/volunteers', ['ids' => [(string) $eigen->id, (string) $ander->id]])
            ->assertNoContent();

        $this->assertModelMissing($eigen);
        $this->assertModelExists($ander);
    }

    public function test_import_slaat_ongeldige_rijen_over(): void
    {
        $organisatie = Organisatie::factory()->create();

        $this->actingAs($this->Beheerder())->postJson('/api/volunteers/import', ['volunteers' => [
            // Excel geeft getallen soms als getal in plaats van tekst
            ['orgId' => (string) $organisatie->id, 'firstName' => 'Piet', 'lastName' => '', 'email' => '', 'houseNumber' => '7', 'phone' => 612345678],
            ['orgId' => (string) $organisatie->id, 'firstName' => ''],
            ['orgId' => '999', 'firstName' => 'Onbekend'],
            ['firstName' => 'Zonder organisatie'],
        ]])
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.firstName', 'Piet')
            ->assertJsonPath('0.lastName', '')
            ->assertJsonPath('0.houseNumber', '7')
            ->assertJsonPath('0.phone', '612345678');
    }

    public function test_organisatie_mag_niet_importeren(): void
    {
        $this->actingAs($this->OrganisatieGebruiker())
            ->postJson('/api/volunteers/import', ['volunteers' => [['firstName' => 'X']]])
            ->assertForbidden();
    }
}
