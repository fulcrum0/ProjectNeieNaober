# Neie Naober – backend (Laravel API)

JSON-API voor de vrijwilligersregistratie van VIP! Tynaarlo (horecabon).
Gebouwd volgens het **Technisch Ontwerp v0.3** en het **Functioneel Ontwerp v0.2**.

**Stack:** PHP 8.4 · Laravel 13 · Sanctum (sessie-cookie) · PhpSpreadsheet 5 · MySQL 8.4 / MariaDB

## Snel: één commando

Vanuit de map `NeieNaoberWebApp`:

```bash
npm run check   # alles installeren + 54 tests + de API echt aanroepen + frontend bouwen
npm run dev     # backend (:8000) en frontend (:5173) samen starten
npm run reset   # database leeg en opnieuw vullen met testgegevens
```

Zonder `.env` gebruikt het script SQLite, zodat je niets hoeft in te stellen.
Wil je MySQL (zoals in het TO)? Zet dan `DB_CONNECTION=mysql` en de gegevens in `backend/.env`.

## Lokaal starten (stap voor stap)

```bash
cd NeieNaoberWebApp/backend
composer install
cp .env.example .env          # DB_DATABASE, DB_USERNAME, DB_PASSWORD invullen
php artisan key:generate
php artisan migrate:fresh --seed   # 7 tabellen + nep-testgegevens
php artisan serve                  # http://localhost:8000
```

Maak eerst een lege database `neienaober` in MySQL.

### Testaccounts (alleen nep-gegevens uit de seeder)

| Rol | E-mail | Wachtwoord |
|---|---|---|
| beheerder | lorem@vip.tynaarlo.nl | Wachtwoord1234 |
| medewerker | medewerker@vip.tynaarlo.nl | Wachtwoord1234 |
| organisatie | a@organisatie.nl, b@organisatie.nl | Wachtwoord1234 |

Dezelfde accounts en vrijwilligers als in `frontend/src/data/mockData.js`.

Een echte beheerder maak je met `php artisan app:maak-beheerder` (of `--rol=medewerker`).

### De React-app

De frontend praat alleen via `frontend/src/services/ApiClient.js` met deze API (cookie + XSRF-token, 401/419/422).
`frontend/vite.config.js` stuurt `/api` en `/sanctum` door naar `localhost:8000`, dus lokaal is het één domein (TO 7).
`npm run build` zet de React-build in `backend/public/app`; Laravel geeft die zelf aan de browser.

## Tests

```bash
php artisan test
```

54 feature-tests: inloggen en rollen, max. 3 aanmeldingen, dubbel-check, versturen met verklaring,
export (alleen goedgekeurd, alles als tekst, 3000 rijen < 10 s), sjablonen, beheer, openbaar en de AVG-opruiming.
De tests gebruiken SQLite in het geheugen, dus je echte database blijft leeg.

## Endpoints

Alles is JSON, alle paden beginnen met `/api`, lijsten hebben 50 rijen per pagina (`?page=2`).
Een fout in een formulier geeft **422** met `errors` per veld, in gewone taal.

| Methode | Pad | Wie | Wat |
|---|---|---|---|
| POST | /login | iedereen (5/min per e-mail) | `email`, `wachtwoord` → naam, rol, organisatie |
| GET | /ik | ingelogd | wie ben ik? |
| POST | /logout | ingelogd | 204 |
| POST | /wachtwoord | iedereen (5/min) | `token`, `email`, `wachtwoord`, `wachtwoord_confirmation` |
| POST | /wachtwoord-vergeten | iedereen (5/min) | Could: link per mail |
| GET | /periode | iedereen | de open aanmeldperiode (of `null`) |
| POST | /zelf-aanmelden | iedereen (10/min) | vrijwilliger + `organisatie_naam` + `akkoord_privacy` → status nieuw |
| POST | /ben-ik-aangemeld | iedereen (10/min) | `voornaam`, `achternaam`, `postcode`, `huisnummer` → alleen ja/nee |
| GET | /mijn/vrijwilligers | organisatie | eigen lijst van de open periode |
| POST | /mijn/vrijwilligers | organisatie | nieuwe aanmelding, status concept |
| GET/PUT/DELETE | /mijn/vrijwilligers/{id} | organisatie | alleen eigen; wijzigen alleen bij concept |
| POST | /mijn/vrijwilligers/upload | organisatie | Could: .xlsx of .csv, alles-of-niets |
| POST | /mijn/versturen | organisatie | `akkoord_privacy`, `naam_invuller` → concept wordt nieuw |
| GET | /mijn/export | organisatie | Should: eigen lijst als .xlsx |
| GET | /vip/aanmeldingen | medewerker, beheerder | `?periode, organisatie, status, dubbel, zoek, page` |
| GET | /vip/aanmeldingen/{id} | medewerker, beheerder | detail + `mogelijke_dubbels` om te vergelijken |
| PUT | /vip/aanmeldingen/{id} | medewerker, beheerder | gegevens aanpassen |
| PATCH | /vip/aanmeldingen/{id}/status | medewerker, beheerder | `goedgekeurd` of `afgekeurd` |
| GET | /vip/overzicht | medewerker, beheerder | aantallen voor het dashboard (open periode) |
| GET | /vip/organisaties | medewerker, beheerder | met aantallen (`?zoek=`, `?periode=`) |
| GET | /vip/organisaties/{id} | medewerker, beheerder | één organisatie met aantallen |
| GET | /vip/periodes | medewerker, beheerder | alle periodes |
| GET | /vip/export | medewerker, beheerder | `?periode_id=&doorgaan=1` → .xlsx in het actieve sjabloon |
| GET/POST | /vip/sjablonen | medewerker, beheerder | lijst / uploaden (.xlsx, max. 2 MB) |
| PUT/DELETE | /vip/sjablonen/{id} | medewerker, beheerder | `kolommen` (`{"A":"achternaam"}`), `actief` |
| POST | /beheer/organisaties | beheerder | `naam`, `plaats`, `email` → account + uitnodiging |
| POST | /beheer/organisaties/{id}/uitnodiging | beheerder | nieuwe link sturen |
| POST | /beheer/periodes | beheerder | `naam`, `startdatum`, `einddatum` (niet overlappen) |
| DELETE | /beheer/periodes/{id}/gegevens | beheerder | `bevestiging: "VERWIJDER"` |

## Keuzes die niet letterlijk in het TO staan

- **Eén vrijwilliger-record per aanmelding.** Zo kan organisatie A nooit de gegevens van organisatie B veranderen.
  "Dezelfde persoon" (voor max. 3) = zelfde voornaam, achternaam, postcode en huisnummer. Afgekeurd telt niet mee.
- **Mogelijk dubbel** wordt steeds opnieuw berekend: keurt VIP! er één af, dan gaat de vlag bij de ander uit.
- **Export met niet-gecontroleerde aanmeldingen** geeft eerst 422 met een waarschuwing; met `doorgaan=1` gaat het toch (FO UC-4, 3a).
- **Zelf aangemeld** krijgt geen verklaring (de tabel vraagt een organisatie_id); het vinkje is wel verplicht.
- **AVG-opruiming** verwijdert vrijwilligers (aanmeldingen gaan mee door CASCADE). In `verklaringen` blijven datum en versie
  als bewijs, maar de naam van de invuller wordt `(verwijderd)`.
- Extra endpoints: `GET /periode`, `GET /vip/periodes`, `GET /vip/aanmeldingen/{id}`, `GET`/`DELETE /vip/sjablonen`,
  `/beheer/organisaties/{id}/uitnodiging`, `/wachtwoord-vergeten`. Die had de frontend nodig.

## Online zetten (alwaysdata)

Zie TO 7.2. Daarnaast in `.env` op de server: `APP_ENV=production`, `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`,
`SANCTUM_STATEFUL_DOMAINS=<jouwnaam>.alwaysdata.net`. Geplande taak: `0 2 * * * php artisan app:verwijder-gegevens`.
De React-build komt in `public/app`; Laravel geeft dan zelf `index.html` voor elke pagina die geen `/api` is.
