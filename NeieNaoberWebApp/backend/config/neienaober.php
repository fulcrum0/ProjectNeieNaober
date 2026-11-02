<?php

return [

    // Versie van de privacytekst; komt in elke verklaring (FE-5). Ophogen als de tekst verandert.
    'privacy_versie' => env('PRIVACY_VERSIE', '1.0'),

    // Hier gaat de mail heen als de AVG-opruiming niets mocht verwijderen (geen export)
    'vip_email' => env('VIP_EMAIL', 'info@viptynaarlo.nl'),

    // De React-app; de link in de uitnodiging wijst hierheen
    'frontend_url' => env('FRONTEND_URL', env('APP_URL', 'http://localhost:5173')),

    // FE-9: gegevens gaan weg 1 maand na de einddatum, maar pas na de export
    'bewaren_maanden' => (int) env('BEWAREN_MAANDEN', 1),

    // Max. aantal aanmeldingen per vrijwilliger per periode (FE-4)
    'max_aanmeldingen' => 3,

    'per_pagina' => 50,
];
