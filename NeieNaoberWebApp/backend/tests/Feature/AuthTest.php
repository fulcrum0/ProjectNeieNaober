<?php

namespace Tests\Feature;

use App\Models\Gebruiker;
use App\Models\Organisatie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_beheerder_logt_in_en_krijgt_de_vorm_van_de_frontend(): void
    {
        Gebruiker::factory()->create(['naam' => 'VIP TYNAARLO', 'email' => 'lorem@vip.tynaarlo.nl']);

        $this->ViaFrontend()->postJson('/api/login', ['email' => ' Lorem@vip.tynaarlo.nl ', 'password' => 'password123'])
            ->assertOk()
            ->assertExactJson([
                'id' => '1', 'email' => 'lorem@vip.tynaarlo.nl', 'name' => 'VIP TYNAARLO',
                'initials' => 'VT', 'role' => 'admin', 'orgId' => null,
            ]);

        $this->getJson('/api/user')->assertOk()->assertJsonPath('role', 'admin');
    }

    public function test_organisatie_logt_in_met_orgid_als_tekst(): void
    {
        $organisatie = Organisatie::factory()->create();
        $gebruiker = $this->OrganisatieGebruiker($organisatie);

        $this->ViaFrontend()->postJson('/api/login', ['email' => $gebruiker->email, 'password' => 'password123'])
            ->assertOk()
            ->assertJsonPath('role', 'organisation')
            ->assertJsonPath('orgId', (string) $organisatie->id);
    }

    public function test_fout_wachtwoord_geeft_nette_melding(): void
    {
        $gebruiker = $this->Beheerder();

        $this->ViaFrontend()->postJson('/api/login', ['email' => $gebruiker->email, 'password' => 'fout'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'E-mail of wachtwoord klopt niet.');
    }

    public function test_niet_ingelogd_geeft_401(): void
    {
        $this->ViaFrontend()->getJson('/api/user')->assertStatus(401);
        $this->ViaFrontend()->getJson('/api/volunteers')->assertStatus(401);
    }

    public function test_uitloggen(): void
    {
        $this->actingAs($this->Beheerder());

        $this->ViaFrontend()->postJson('/api/logout')->assertNoContent();
    }

    public function test_na_5_pogingen_geblokkeerd(): void
    {
        $gebruiker = $this->Beheerder();

        foreach (range(1, 5) as $poging)
        {
            $this->ViaFrontend()->postJson('/api/login', ['email' => $gebruiker->email, 'password' => 'fout'])->assertStatus(422);
        }

        $this->ViaFrontend()->postJson('/api/login', ['email' => $gebruiker->email, 'password' => 'fout'])->assertStatus(429);
    }
}
