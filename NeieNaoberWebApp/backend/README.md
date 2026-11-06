# Neie Naober – backend (Laravel API)

JSON-API voor de vrijwilligersregistratie van VIP! Tynaarlo. De API levert precies wat de frontend nodig heeft:
inloggen, organisaties, vrijwilligers en het versturen van vrijwilligers naar VIP! Tynaarlo (gemeente).

## Regels

- **Versturen.** Een vrijwilliger die een organisatie registreert is eerst een *concept*: alleen die organisatie ziet hem.
  Op de pagina "Gegevens versturen" stuurt de organisatie haar concepten naar VIP! Tynaarlo. Pas dan ziet de beheerder ze.
  Verstuurde vrijwilligers kan de organisatie niet meer verwijderen (de beheerder wel).
  Wat de beheerder zelf toevoegt of importeert, is meteen verstuurd.
- **Dubbel-check.** Binnen één organisatie mag dezelfde persoon maar één keer voorkomen. Dezelfde persoon =
  hetzelfde e-mailadres, óf dezelfde voornaam, achternaam en geboortedatum (hoofdletters tellen niet).
  Bij een andere organisatie mag het wel. Het formulier waarschuwt meteen; de API weigert met 422;
  de Excel-import slaat dubbelen over (ook dubbelen binnen hetzelfde bestand).

**Stack:** PHP 8.4 · Laravel 13 · Sanctum (sessie-cookie) · MySQL of SQLite

## Snel: één commando

Vanuit de map `NeieNaoberWebApp`:

```bash
npm run setup   # alles installeren + database klaarzetten (met testgegevens)
npm run dev     # backend (:8000) en frontend (:5173) samen starten → open http://localhost:5173
npm run check   # setup + tests + de API echt aanroepen + frontend bouwen
npm run reset   # database leeg en opnieuw vullen met testgegevens
```

Zonder `backend/.env` gebruikt het script SQLite, zodat je niets hoeft in te stellen.
Wil je MySQL? Maak een lege database `neienaober` en zet `DB_CONNECTION=mysql` en de gegevens in `backend/.env`.

## Lokaal starten (stap voor stap)

```bash
cd NeieNaoberWebApp/backend
composer install
cp .env.example .env               # DB_DATABASE, DB_USERNAME, DB_PASSWORD invullen
php artisan key:generate
php artisan migrate:fresh --seed   # tabellen + testgegevens
php artisan serve                  # http://localhost:8000

cd ../frontend
npm install
npm run dev                        # http://localhost:5173
```

### Testaccounts (nep-gegevens uit de seeder, dezelfde als de oude mockData)

| Rol | E-mail | Wachtwoord |
|---|---|---|
| beheerder (admin) | lorem@vip.tynaarlo.nl | password123 |
| organisatie | a@organisatie.nl, b@organisatie.nl | password123 |

## Hoe de frontend met de API praat

- `frontend/src/services/api.js` doet alle verzoeken (sessie-cookie + XSRF-token).
- `frontend/src/context/AuthContext.jsx` en `DataContext.jsx` halen de gegevens uit de API; de pagina's en componenten zijn gelijk aan v1.0.
- `frontend/vite.config.js` stuurt `/api` en `/sanctum` door naar `localhost:8000`, dus voor de browser is het één domein.
- Excel-import en -export gebeuren in de browser (zoals in v1.0); de API krijgt alleen de rijen.

## Database

| Tabel | Kolommen | In de frontend |
|---|---|---|
| organisaties | naam (uniek), telefoon, email, locatie, soort | name, phone, email, location, type |
| gebruikers | organisatie_id, naam, email, wachtwoord, rol (`beheerder`/`organisatie`) | name, email, initials, role (`admin`/`organisation`), orgId |
| vrijwilligers | organisatie_id, voornaam, achternaam, email, telefoon, geboortedatum, straat, huisnummer, toevoeging, postcode, verstuurd_op | orgId, firstName, lastName, email, phone, birthDate, street, houseNumber, addition, postcode, createdAt, sentAt (`""` = concept) |

Verwijder je een organisatie, dan gaan haar account en vrijwilligers mee (CASCADE).
Ids gaan als tekst naar de frontend, omdat die ze vergelijkt met ids uit de URL.

## Endpoints

Alles is JSON en begint met `/api`. Een fout in een formulier geeft **422** met `errors` per veld, in gewone taal.

| Methode | Pad | Wie | Wat |
|---|---|---|---|
| POST | /login | iedereen (5/min per e-mail) | `email`, `password` → gebruiker |
| GET | /user | ingelogd | wie ben ik? (401 als niet ingelogd) |
| POST | /logout | ingelogd | 204 |
| GET | /organisations | ingelogd | beheerder: alle; organisatie: alleen zichzelf |
| POST | /organisations/import | beheerder | `organisations: [{name, location, …}]`; lege en bestaande namen worden overgeslagen |
| DELETE | /organisations | beheerder | `ids: [...]` |
| GET | /volunteers | ingelogd | beheerder: alleen verstuurde; organisatie: alle eigen (ook concepten) |
| POST | /volunteers | ingelogd | velden van het formulier, met dubbel-check; organisatie maakt een concept, beheerder geeft `orgId` mee |
| POST | /volunteers/send | organisatie | `ids: [...]` → eigen concepten worden verstuurd naar VIP! |
| POST | /volunteers/import | beheerder | `volunteers: [{orgId, firstName, …}]`; ongeldige rijen worden overgeslagen |
| DELETE | /volunteers | ingelogd | `ids: [...]`; een organisatie kan alleen eigen concepten verwijderen (verstuurd → 422) |

## Tests

```bash
php artisan test
```

De tests gebruiken SQLite in het geheugen, dus je echte database blijft leeg.
