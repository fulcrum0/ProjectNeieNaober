// Eén commando voor het hele project, zodat iedereen het op dezelfde manier doet:
//   npm run setup  -> alles installeren en de database klaarzetten
//   npm run check  -> setup + alle tests + de API echt aanroepen + frontend bouwen
//   npm run dev    -> backend (Laravel) en frontend (Vite) samen starten
//   npm run reset  -> database leeg en opnieuw vullen met nep-testgegevens
// Geen extra npm-pakketten nodig: alleen Node, PHP en Composer.

import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BACKEND = join(ROOT, 'backend');
const FRONTEND = join(ROOT, 'frontend');
const MIN_PHP = [8, 3];
const PHP_EXTENSIES = ['mbstring', 'xml', 'zip', 'gd', 'fileinfo', 'pdo'];
const BACKEND_POORT = 8000;
const CHECK_POORT = 8765;

const KLEUR = { groen: '\x1b[32m', rood: '\x1b[31m', geel: '\x1b[33m', blauw: '\x1b[36m', grijs: '\x1b[90m', uit: '\x1b[0m' };
const resultaten = [];

function Kop(tekst)
{
    console.log(`\n${KLEUR.blauw}▶ ${tekst}${KLEUR.uit}`);
}

function Goed(tekst)
{
    resultaten.push({ goed: true, tekst });
    console.log(`  ${KLEUR.groen}✓${KLEUR.uit} ${tekst}`);
}

function Fout(tekst, hint = '')
{
    resultaten.push({ goed: false, tekst });
    console.log(`  ${KLEUR.rood}✗ ${tekst}${KLEUR.uit}${hint ? `\n    ${KLEUR.geel}→ ${hint}${KLEUR.uit}` : ''}`);
}

function Stop(tekst, hint)
{
    Fout(tekst, hint);
    Samenvatting();
    process.exit(1);
}

// Toont de uitvoer alleen als het misgaat, zodat het scherm rustig blijft
function Draai(commando, args, map, { stil = true } = {})
{
    const resultaat = spawnSync(commando, args, { cwd: map, encoding: 'utf8', stdio: stil ? 'pipe' : 'inherit', shell: process.platform === 'win32' });

    if (resultaat.error)
    {
        return { ok: false, uitvoer: String(resultaat.error.message) };
    }

    return { ok: resultaat.status === 0, uitvoer: `${resultaat.stdout ?? ''}${resultaat.stderr ?? ''}` };
}

function DraaiOfStop(omschrijving, commando, args, map, hint)
{
    const resultaat = Draai(commando, args, map);

    if (!resultaat.ok)
    {
        console.log(KLEUR.grijs + resultaat.uitvoer.trim().split('\n').slice(-25).join('\n') + KLEUR.uit);
        Stop(omschrijving + ' is mislukt', hint);
    }

    Goed(omschrijving);

    return resultaat.uitvoer;
}

function ControleerGereedschap()
{
    Kop('Gereedschap controleren');

    const php = Draai('php', ['-r', 'echo PHP_VERSION;'], ROOT);

    if (!php.ok)
    {
        Stop('PHP niet gevonden', 'Installeer PHP 8.4, bijvoorbeeld met: brew install php');
    }

    const [major, minor] = php.uitvoer.trim().split('.').map(Number);

    if (major < MIN_PHP[0] || (major === MIN_PHP[0] && minor < MIN_PHP[1]))
    {
        Stop(`PHP ${php.uitvoer.trim()} is te oud (minimaal ${MIN_PHP.join('.')})`, 'brew upgrade php');
    }

    Goed(`PHP ${php.uitvoer.trim()}`);

    const ontbrekend = Draai('php', ['-r', `echo implode(',', array_filter(${JSON.stringify(PHP_EXTENSIES)}, fn ($e) => !extension_loaded($e)));`], ROOT);

    if (ontbrekend.uitvoer.trim() !== '')
    {
        Stop(`PHP-extensies ontbreken: ${ontbrekend.uitvoer.trim()}`, 'Zet ze aan in php.ini of installeer PHP via Homebrew (die heeft ze allemaal)');
    }

    Goed('PHP-extensies');

    if (!Draai('composer', ['--version'], ROOT).ok)
    {
        Stop('Composer niet gevonden', 'brew install composer');
    }

    Goed('Composer');
    Goed(`Node ${process.version}`);
}

function LeesEnv()
{
    return readFileSync(join(BACKEND, '.env'), 'utf8');
}

function SchrijfEnvWaarde(sleutel, waarde)
{
    const env = LeesEnv();
    const regel = `${sleutel}=${waarde}`;
    const nieuw = new RegExp(`^${sleutel}=.*$`, 'm').test(env)
        ? env.replace(new RegExp(`^${sleutel}=.*$`, 'm'), regel)
        : `${env.trimEnd()}\n${regel}\n`;

    writeFileSync(join(BACKEND, '.env'), nieuw);
}

function SetupBackend()
{
    Kop('Backend (Laravel) klaarzetten');

    if (!existsSync(join(BACKEND, 'vendor')))
    {
        console.log(`  ${KLEUR.grijs}composer install... (eerste keer duurt dit even)${KLEUR.uit}`);
        DraaiOfStop('composer install', 'composer', ['install', '--no-interaction'], BACKEND, 'Kijk of je internet hebt en of composer.json klopt');
    }
    else
    {
        Goed('composer-pakketten al geïnstalleerd');
    }

    if (!existsSync(join(BACKEND, '.env')))
    {
        // Zonder instellingen werkt het meteen met SQLite (één bestand). Wil je MySQL? Pas dan .env aan.
        copyFileSync(join(BACKEND, '.env.example'), join(BACKEND, '.env'));
        SchrijfEnvWaarde('DB_CONNECTION', 'sqlite');
        SchrijfEnvWaarde('DB_DATABASE', join(BACKEND, 'database', 'database.sqlite'));
        Goed('.env gemaakt (met SQLite, zodat je niets hoeft in te stellen)');
    }
    else
    {
        Goed(`.env gevonden (database: ${LeesEnv().match(/^DB_CONNECTION=(.*)$/m)?.[1] ?? '?'})`);
    }

    // SQLite: het databasebestand moet bestaan voordat Laravel het kan vullen
    if (/^DB_CONNECTION=sqlite$/m.test(LeesEnv()))
    {
        const bestand = LeesEnv().match(/^DB_DATABASE=(.+)$/m)?.[1]?.trim() || join(BACKEND, 'database', 'database.sqlite');
        writeFileSync(bestand, '', { flag: 'a' });
    }

    if (!/^APP_KEY=.+$/m.test(LeesEnv()))
    {
        DraaiOfStop('APP_KEY gemaakt', 'php', ['artisan', 'key:generate', '--force'], BACKEND);
    }

    // Alleen vullen als de database nog leeg is, anders komen de testgegevens er dubbel in
    const leeg = Draai('php', ['artisan', 'migrate:status'], BACKEND).uitvoer.includes('Migration table not found');
    DraaiOfStop(leeg ? 'Database gemaakt (migraties + testgegevens)' : 'Database bijgewerkt (migraties)', 'php', ['artisan', 'migrate', '--force', ...(leeg ? ['--seed'] : [])], BACKEND,
        'Klopt de database in .env? Bij MySQL: bestaat de database "neienaober" en draait MySQL?');
}

function SetupFrontend()
{
    Kop('Frontend (React) klaarzetten');

    if (!existsSync(FRONTEND))
    {
        Fout('Map frontend niet gevonden');

        return;
    }

    // npm schrijft dit bestand pas als de installatie helemaal gelukt is
    if (!existsSync(join(FRONTEND, 'node_modules', '.package-lock.json')))
    {
        console.log(`  ${KLEUR.grijs}npm install... (eerste keer duurt dit even)${KLEUR.uit}`);
        DraaiOfStop('npm install', 'npm', ['install', '--no-audit', '--no-fund'], FRONTEND);
    }
    else
    {
        Goed('npm-pakketten al geïnstalleerd');
    }
}

function Wacht(ms)
{
    return new Promise((klaar) => setTimeout(klaar, ms));
}

function StartBackend(poort, stdio = 'pipe')
{
    return spawn('php', ['artisan', 'serve', `--port=${poort}`, '--no-reload'], { cwd: BACKEND, stdio });
}

async function WachtOpServer(basis)
{
    for (let poging = 0; poging < 40; poging++)
    {
        try
        {
            if ((await fetch(`${basis}/up`)).ok)
            {
                return true;
            }
        }
        catch
        {
            // Server is nog aan het opstarten
        }

        await Wacht(250);
    }

    return false;
}

// Een mini-browser: bewaart cookies en stuurt het XSRF-token mee, net als React straks doet (TO 3.5)
class Browser
{
    constructor(basis)
    {
        this.basis = basis;
        this.cookies = new Map();
    }

    async Vraag(methode, pad, body = null)
    {
        const headers = { Accept: 'application/json', Origin: 'http://localhost:5173', Referer: 'http://localhost:5173/' };

        if (this.cookies.size > 0)
        {
            headers.Cookie = [...this.cookies].map(([naam, waarde]) => `${naam}=${waarde}`).join('; ');
        }

        if (this.cookies.has('XSRF-TOKEN'))
        {
            headers['X-XSRF-TOKEN'] = decodeURIComponent(this.cookies.get('XSRF-TOKEN'));
        }

        if (body)
        {
            headers['Content-Type'] = 'application/json';
        }

        const antwoord = await fetch(this.basis + pad, { method: methode, headers, body: body ? JSON.stringify(body) : undefined, redirect: 'manual' });

        for (const cookie of antwoord.headers.getSetCookie())
        {
            const [paar] = cookie.split(';');
            const [naam, ...rest] = paar.split('=');
            this.cookies.set(naam.trim(), rest.join('='));
        }

        const type = antwoord.headers.get('content-type') ?? '';
        const data = type.includes('json') ? await antwoord.json() : null;

        return { status: antwoord.status, data, type };
    }

    async Login(email)
    {
        await this.Vraag('GET', '/sanctum/csrf-cookie');

        return this.Vraag('POST', '/api/login', { email, password: 'password123' });
    }
}

async function Verwacht(omschrijving, belofte, controle)
{
    try
    {
        const antwoord = await belofte;

        if (controle(antwoord))
        {
            Goed(omschrijving);
        }
        else
        {
            Fout(omschrijving, `kreeg status ${antwoord.status}: ${JSON.stringify(antwoord.data ?? '').slice(0, 200)}`);
        }
    }
    catch (fout)
    {
        Fout(omschrijving, fout.message);
    }
}

// De echte API aanroepen via HTTP, zoals de React-app het straks doet
async function RookTest()
{
    Kop('API echt aanroepen (zoals de browser)');

    const basis = `http://127.0.0.1:${CHECK_POORT}`;
    const server = StartBackend(CHECK_POORT);

    try
    {
        if (!(await WachtOpServer(basis)))
        {
            Fout('Backend start niet', 'Draai zelf: cd backend && php artisan serve');

            return;
        }

        Goed('Backend gestart');

        const gast = new Browser(basis);
        await Verwacht('Niet ingelogd → 401', gast.Vraag('GET', '/api/user'), (a) => a.status === 401);

        const fout = new Browser(basis);
        await fout.Vraag('GET', '/sanctum/csrf-cookie');
        await Verwacht('Fout wachtwoord → nette melding', fout.Vraag('POST', '/api/login', { email: 'a@organisatie.nl', password: 'fout' }),
            (a) => a.status === 422 && a.data?.errors?.email?.[0] === 'E-mail of wachtwoord klopt niet.');

        const organisatie = new Browser(basis);
        await Verwacht('Inloggen als organisatie', organisatie.Login('a@organisatie.nl'), (a) => a.status === 200 && a.data?.role === 'organisation');
        await Verwacht('Sessie blijft bestaan (GET /api/user)', organisatie.Vraag('GET', '/api/user'), (a) => a.status === 200 && a.data?.email === 'a@organisatie.nl');
        await Verwacht('Ziet alleen de eigen organisatie', organisatie.Vraag('GET', '/api/organisations'), (a) => a.status === 200 && a.data?.length === 1);
        await Verwacht('Eigen vrijwilligers ophalen', organisatie.Vraag('GET', '/api/volunteers'), (a) => a.status === 200 && Array.isArray(a.data));
        await Verwacht('Ongeldig e-mailadres → 422',
            organisatie.Vraag('POST', '/api/volunteers', { firstName: 'Test', lastName: 'Check', email: 'geen-mail' }),
            (a) => a.status === 422 && Boolean(a.data?.errors?.email));
        await Verwacht('Organisatie mag geen organisaties verwijderen → 403', organisatie.Vraag('DELETE', '/api/organisations', { ids: [1] }), (a) => a.status === 403);
        await Verwacht('Uitloggen', organisatie.Vraag('POST', '/api/logout'), (a) => a.status === 204);

        const beheerder = new Browser(basis);
        await Verwacht('Inloggen als beheerder', beheerder.Login('lorem@vip.tynaarlo.nl'), (a) => a.status === 200 && a.data?.role === 'admin');
        await Verwacht('Alle organisaties ophalen', beheerder.Vraag('GET', '/api/organisations'), (a) => a.status === 200 && a.data?.length >= 2);
        await Verwacht('Alle vrijwilligers ophalen', beheerder.Vraag('GET', '/api/volunteers'), (a) => a.status === 200 && a.data?.length >= 1);
    }
    finally
    {
        server.kill();
    }
}

function Samenvatting()
{
    const fouten = resultaten.filter((r) => !r.goed);

    console.log('');

    if (fouten.length === 0)
    {
        console.log(`${KLEUR.groen}✔ Alles goed (${resultaten.length} controles).${KLEUR.uit}`);
    }
    else
    {
        console.log(`${KLEUR.rood}✘ ${fouten.length} van ${resultaten.length} controles mislukt:${KLEUR.uit}`);
        fouten.forEach((f) => console.log(`  ${KLEUR.rood}- ${f.tekst}${KLEUR.uit}`));
    }
}

function Testaccounts()
{
    console.log(`\n${KLEUR.blauw}Testaccounts${KLEUR.uit} (wachtwoord voor allemaal: password123)`);
    console.log('  lorem@vip.tynaarlo.nl (beheerder) · a@organisatie.nl · b@organisatie.nl');
}

async function Check()
{
    ControleerGereedschap();
    SetupBackend();
    SetupFrontend();

    Kop('Automatische tests (backend)');
    // Direct via PHPUnit: werkt ook als de dev-pakketten voor "artisan test" ontbreken
    const test = Draai('php', ['vendor/bin/phpunit', '--colors=never'], BACKEND);
    const regel = test.uitvoer.split('\n').find((r) => /^(OK \(|Tests:)/.test(r.trim()))?.trim();

    if (test.ok)
    {
        Goed(regel ?? 'Alle tests geslaagd');
    }
    else
    {
        console.log(KLEUR.grijs + test.uitvoer.trim().split('\n').slice(-40).join('\n') + KLEUR.uit);
        Fout(regel ?? 'Tests mislukt', 'Draai zelf: cd backend && php artisan test');
    }

    await RookTest();

    if (existsSync(FRONTEND))
    {
        Kop('Frontend bouwen');
        const bouw = Draai('npm', ['run', 'build'], FRONTEND);
        bouw.ok ? Goed('npm run build') : Fout('npm run build mislukt', bouw.uitvoer.trim().split('\n').slice(-5).join(' | '));
    }

    Samenvatting();
    process.exit(resultaten.some((r) => !r.goed) ? 1 : 0);
}

function Dev()
{
    ControleerGereedschap();
    SetupBackend();
    SetupFrontend();
    Testaccounts();

    console.log(`\n${KLEUR.groen}Backend:  http://localhost:${BACKEND_POORT}${KLEUR.uit}`);
    console.log(`${KLEUR.groen}Frontend: http://localhost:5173${KLEUR.uit}`);
    console.log(`${KLEUR.grijs}Stoppen: Ctrl+C${KLEUR.uit}\n`);

    const processen = [
        ['backend ', KLEUR.geel, StartBackend(BACKEND_POORT)],
        ['frontend', KLEUR.blauw, spawn('npm', ['run', 'dev'], { cwd: FRONTEND, stdio: 'pipe', shell: process.platform === 'win32' })],
    ];

    for (const [naam, kleur, proces] of processen)
    {
        const toon = (data) => data.toString().split('\n').filter(Boolean).forEach((r) => console.log(`${kleur}[${naam}]${KLEUR.uit} ${r}`));
        proces.stdout.on('data', toon);
        proces.stderr.on('data', toon);
        proces.on('exit', (code) => console.log(`${kleur}[${naam}]${KLEUR.uit} gestopt (${code ?? 'signaal'})`));
    }

    const stopAlles = () =>
    {
        processen.forEach(([, , proces]) => proces.kill());
        process.exit(0);
    };

    process.on('SIGINT', stopAlles);
    process.on('SIGTERM', stopAlles);
}

function Reset()
{
    ControleerGereedschap();
    SetupBackend();
    DraaiOfStop('Database leeg en opnieuw gevuld', 'php', ['artisan', 'migrate:fresh', '--seed', '--force'], BACKEND);
    Testaccounts();
    Samenvatting();
}

const opdracht = process.argv[2];

switch (opdracht)
{
    case 'setup':
        ControleerGereedschap();
        SetupBackend();
        SetupFrontend();
        Testaccounts();
        Samenvatting();
        break;
    case 'check':
        await Check();
        break;
    case 'dev':
        Dev();
        break;
    case 'reset':
        Reset();
        break;
    default:
        console.log('Gebruik: npm run setup | check | dev | reset');
        process.exit(1);
}
