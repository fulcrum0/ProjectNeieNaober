export const privacyIntro =
    "Je gegevens verdienen zorgvuldigheid. Hier lees je welke gegevens het vrijwilligersportaal gebruikt, wie ze kan bekijken en waar je terechtkunt met vragen. Deze pagina is zonder inloggen te lezen.";

export const privacySections = [
    {
        title: "Welke gegevens verzamelen we?",
        blocks: [
            { type: "p", text: "Een organisatie registreert de vrijwilliger in het portaal. Daarbij worden de volgende gegevens vastgelegd:" },
            {
                type: "table",
                rows: [
                    ["Vrijwilliger", "Voornaam, achternaam en e-mailadres."],
                    ["Optionele gegevens", "Telefoonnummer en activiteit, als de organisatie deze invult."],
                    ["Registratie", "De gekoppelde organisatie en het registratiejaar."],
                    ["Toestemming en controle", "De toestemmingsbevestiging en review- en auditgegevens, zoals status, controlemomenten en interne beoordelingsnotities."],
                ],
            },
        ],
    },
    {
        title: "Waarvoor gebruiken we de gegevens?",
        blocks: [
            { type: "p", text: "De gegevens worden gebruikt voor vrijwilligersregistratie per organisatie en jaar, contact over de registratie en controle door VIP! Tynaarlo. Zo kunnen onvolledige gegevens worden hersteld en mogelijke dubbele registraties worden beoordeeld." },
            { type: "p", text: "Review- en auditgegevens maken de indiening en beoordeling navolgbaar. Goedgekeurde registraties met toestemming kunnen worden opgenomen in de jaarlijst voor de gemeente; sectie 4 licht dit toe." },
        ],
    },
    {
        title: "Wie kan de gegevens bekijken?",
        blocks: [
            { type: "p", text: "Je accountrol bepaalt welke registraties je kunt bekijken." },
            {
                type: "roles",
                items: [
                    { title: "Gebruikers van de organisatie", text: "Zien alleen de registraties van hun eigen organisatie, niet die van andere organisaties." },
                    { title: "Bevoegde VIP! beheerders", text: "Kunnen alle registraties bekijken voor controle, beoordeling en het voorbereiden van de gemeente-export." },
                ],
            },
            { type: "p", text: "Deze privacyverklaring is openbaar. De persoonsgegevens in het portaal zijn niet openbaar; daarvoor is een bevoegd account nodig." },
        ],
    },
    {
        title: "Delen met de gemeente",
        blocks: [
            { type: "p", text: "VIP! kan goedgekeurde registraties waarvoor toestemming is bevestigd opnemen in een gestandaardiseerd Excel-bestand voor de gemeente Tynaarlo. Hiervoor wordt het actieve jaartemplate gebruikt: dat bepaalt de kolommen en indeling van de jaarlijst." },
            { type: "p", text: "De export is geen kopie van het volledige registratiedossier. Alleen de gegevens die nodig zijn voor de gemeentelijke jaarlijst horen in het bestand." },
            { type: "info", title: "Wat staat niet in de voorbeeldexport?", text: "Onnodige telefoonnummers, interne beoordelingsnotities en bewijs van toestemming worden niet opgenomen in de voorbeeldexport voor de gemeente." },
        ],
    },
    {
        title: "Toestemming en jouw organisatie",
        blocks: [
            { type: "strong", text: "Organisaties zijn verantwoordelijk voor het verkrijgen van toestemming van de vrijwilliger voordat zij diens gegevens indienen." },
            { type: "p", text: "De organisatie informeert de vrijwilliger vooraf over de registratie, de beoordeling door VIP! en de mogelijke opname in de jaarlijst voor de gemeente. Verwijs daarbij naar deze openbare privacyverklaring." },
            { type: "p", text: "Bij het indienen bevestigt de vertegenwoordiger namens de organisatie dat toestemming is verkregen en dat de privacyvoorwaarden zijn geaccepteerd. Dit akkoord vervangt de toestemming van de vrijwilliger niet. Zonder deze bevestiging kan de registratie niet worden ingediend." },
        ],
    },
    {
        title: "Hoe lang bewaren we gegevens?",
        blocks: [
            { type: "p", text: "De bewaartermijnen voor registraties, toestemmingsbevestigingen en review- en auditgegevens moeten nog door VIP! worden vastgesteld en bevestigd vóór publicatie. In dit concept is daarom geen goedgekeurde bewaartermijn opgenomen." },
            { type: "info", title: "Juridische grondslag nog te bevestigen", text: "VIP! moet vóór publicatie de juridische grondslag voor de beschreven verwerkingen bevestigen. De toestemmingsbevestiging in het formulier is geen vaststelling van een juridisch goedgekeurde grondslag." },
            { type: "p", text: "Ook de afspraken over verwijderen of anonimiseren na afloop van de bewaartermijn moeten nog worden bevestigd en in de definitieve verklaring worden toegelicht." },
        ],
    },
    {
        title: "Jouw rechten en contact",
        blocks: [
            { type: "p", text: "Als vrijwilliger kun je vragen welke gegevens over jou zijn vastgelegd en onjuiste gegevens laten corrigeren. Je kunt ook een verzoek doen om gegevens te verwijderen, de verwerking te beperken of bezwaar te maken. Welke rechten van toepassing zijn, hangt af van de verwerking en de wettelijke voorwaarden." },
            { type: "p", text: "Wil je je toestemming intrekken? Neem contact op met je organisatie of VIP! Tynaarlo. VIP! kan toelichten wat dit betekent voor je registratie en eventuele gegevensdeling." },
            { type: "contact", title: "Vragen of een verzoek over jouw gegevens?", email: "vip@neienaober.nl", text: "Vermeld om welke organisatie en registratie het gaat. Stuur geen BSN, kopie van je identiteitsbewijs of medische gegevens mee." },
            { type: "p", text: "Heb je een klacht over de omgang met jouw persoonsgegevens? Bespreek die met VIP! Tynaarlo. Je kunt ook terecht bij de Autoriteit Persoonsgegevens." },
        ],
    },
];