<?php

namespace Tests\Feature;

use App\Mail\UitnodigingMail;
use App\Models\Gebruiker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_inloggen_geeft_naam_rol_en_organisatie(): void
    {
        $gebruiker = $this->OrganisatieGebruiker();

        $this->ViaFrontend()
            ->postJson('/api/login', ['email' => $gebruiker->email, 'wachtwoord' => 'Wachtwoord1234'])
            ->assertOk()
            ->assertJsonPath('data.rol', 'organisatie')
            ->assertJsonPath('data.organisatie.id', $gebruiker->organisatie_id)
            ->assertJsonMissingPath('data.wachtwoord');

        $this->ViaFrontend()->getJson('/api/ik')->assertOk()->assertJsonPath('data.email', $gebruiker->email);
    }

    public function test_fout_wachtwoord_geeft_altijd_dezelfde_melding(): void
    {
        $gebruiker = $this->Medewerker();

        $this->ViaFrontend()
            ->postJson('/api/login', ['email' => $gebruiker->email, 'wachtwoord' => 'fout'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'E-mail of wachtwoord klopt niet.');

        $this->ViaFrontend()
            ->postJson('/api/login', ['email' => 'bestaat.niet@test.nl', 'wachtwoord' => 'fout'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'E-mail of wachtwoord klopt niet.');
    }

    public function test_niet_actief_account_kan_niet_inloggen(): void
    {
        $gebruiker = Gebruiker::factory()->create(['actief' => false]);

        $this->ViaFrontend()
            ->postJson('/api/login', ['email' => $gebruiker->email, 'wachtwoord' => 'Wachtwoord1234'])
            ->assertStatus(422);
    }

    public function test_na_5_pogingen_even_wachten(): void
    {
        for ($i = 0; $i < 5; $i++)
        {
            $this->ViaFrontend()->postJson('/api/login', ['email' => 'x@test.nl', 'wachtwoord' => 'fout'])->assertStatus(422);
        }

        $this->ViaFrontend()
            ->postJson('/api/login', ['email' => 'x@test.nl', 'wachtwoord' => 'fout'])
            ->assertStatus(429)
            ->assertJsonPath('message', 'Te vaak geprobeerd. Wacht even en probeer het opnieuw.');
    }

    public function test_limiet_geldt_per_email_niet_voor_het_hele_kantoor(): void
    {
        for ($i = 0; $i < 5; $i++)
        {
            $this->ViaFrontend()->postJson('/api/login', ['email' => 'x@test.nl', 'wachtwoord' => 'fout']);
        }

        // Een collega op hetzelfde IP-adres kan nog gewoon inloggen
        $collega = $this->Medewerker();
        $this->ViaFrontend()
            ->postJson('/api/login', ['email' => $collega->email, 'wachtwoord' => 'Wachtwoord1234'])
            ->assertOk();
    }

    public function test_niet_ingelogd_geeft_401(): void
    {
        $this->getJson('/api/ik')->assertStatus(401)->assertJsonPath('message', 'U bent niet ingelogd.');
    }

    public function test_uitloggen(): void
    {
        $gebruiker = $this->Medewerker();
        $this->ViaFrontend()->postJson('/api/login', ['email' => $gebruiker->email, 'wachtwoord' => 'Wachtwoord1234']);

        $this->ViaFrontend()->postJson('/api/logout')->assertNoContent();
        $this->app['auth']->forgetGuards();
        $this->ViaFrontend()->getJson('/api/ik')->assertStatus(401);
    }

    public function test_wachtwoord_maken_met_link_uit_uitnodiging(): void
    {
        Mail::fake();
        $beheerder = $this->Beheerder();

        $this->actingAs($beheerder)
            ->postJson('/api/beheer/organisaties', ['naam' => 'VV Vries', 'plaats' => 'Vries', 'email' => 'Info@VVVries.test'])
            ->assertCreated();

        $link = null;
        Mail::assertSent(UitnodigingMail::class, function (UitnodigingMail $mail) use (&$link)
        {
            $link = $mail->link;

            return $mail->hasTo('info@vvvries.test');
        });

        // De link in de tekst van de mail zelf (niet alleen in het object) moet kloppen
        $tekst = (new UitnodigingMail(Gebruiker::where('email', 'info@vvvries.test')->first(), $link))->render();
        $this->assertStringContainsString($link, $tekst);
        $this->assertStringNotContainsString('&amp;', $tekst);

        parse_str(parse_url($link, PHP_URL_QUERY), $query);

        $this->postJson('/api/wachtwoord', [
            'token' => $query['token'],
            'email' => $query['email'],
            'wachtwoord' => 'kort',
            'wachtwoord_confirmation' => 'kort',
        ])->assertStatus(422)->assertJsonValidationErrors('wachtwoord');

        $this->postJson('/api/wachtwoord', [
            'token' => $query['token'],
            'email' => $query['email'],
            'wachtwoord' => 'EenLangWachtwoord2026',
            'wachtwoord_confirmation' => 'EenLangWachtwoord2026',
        ])->assertOk();

        $this->app['auth']->forgetGuards();

        $this->ViaFrontend()
            ->postJson('/api/login', ['email' => 'info@vvvries.test', 'wachtwoord' => 'EenLangWachtwoord2026'])
            ->assertOk()
            ->assertJsonPath('data.organisatie.naam', 'VV Vries');
    }

    public function test_verkeerde_token_geeft_422(): void
    {
        $gebruiker = $this->OrganisatieGebruiker();

        $this->postJson('/api/wachtwoord', [
            'token' => 'verzonnen',
            'email' => $gebruiker->email,
            'wachtwoord' => 'EenLangWachtwoord2026',
            'wachtwoord_confirmation' => 'EenLangWachtwoord2026',
        ])->assertStatus(422)->assertJsonValidationErrors('token');
    }

    public function test_wachtwoord_vergeten_zegt_niet_of_adres_bestaat(): void
    {
        Password::shouldReceive('sendResetLink')->twice();

        $this->postJson('/api/wachtwoord-vergeten', ['email' => 'bestaat.niet@test.nl'])->assertOk();
        $this->postJson('/api/wachtwoord-vergeten', ['email' => $this->Medewerker()->email])->assertOk();
    }

    public function test_rol_komt_uit_de_database(): void
    {
        $organisatie = $this->OrganisatieGebruiker();
        $medewerker = $this->Medewerker();

        $this->actingAs($organisatie)->getJson('/api/vip/aanmeldingen')->assertForbidden()
            ->assertJsonPath('message', 'U mag dit niet doen.');
        $this->actingAs($medewerker)->getJson('/api/mijn/vrijwilligers')->assertForbidden();
        $this->actingAs($medewerker)->postJson('/api/beheer/periodes', [])->assertForbidden();
    }
}
