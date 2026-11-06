<?php

namespace App\Http\Requests;

use App\Models\Vrijwilliger;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

// Dezelfde velden als het formulier in de frontend (VolunteerForm.jsx)
class VrijwilligerRequest extends FormRequest
{
    // Letters (ook met accenten), spaties, apostrof, punt en streepje: "van 't Hof", "Anne-Marie"
    private const NAAM = "/^\\p{L}[\\p{L}\\s'.-]*$/u";

    // Mag met een apostrof beginnen: "van der", "'t", "in 't"
    private const TUSSENVOEGSEL = "/^[\\p{L}\\s'.-]+$/u";

    public const DUBBEL_MELDINGEN = [
        'email' => 'Deze vrijwilliger is al geregistreerd bij deze organisatie (zelfde e-mailadres).',
        'birthDate' => 'Deze vrijwilliger is al geregistreerd bij deze organisatie (zelfde naam en geboortedatum).',
    ];

    public function rules(): array
    {
        return [
            // Een organisatie registreert altijd voor zichzelf; alleen de beheerder kiest de organisatie
            'orgId' => [$this->user()->IsBeheerder() ? 'required' : 'nullable', 'integer', 'exists:organisaties,id'],
            ...self::Velden(),
            // Strenger dan de Excel-import; dezelfde controles als in het formulier (helpers/validators.js)
            'firstName' => ['required', 'string', 'max:50', 'regex:' . self::NAAM],
            'infix' => ['nullable', 'string', 'max:20', 'regex:' . self::TUSSENVOEGSEL],
            'lastName' => ['required', 'string', 'max:100', 'regex:' . self::NAAM],
            // Minstens één manier om de vrijwilliger te bereiken: niet iedereen heeft e-mail
            'email' => ['required_without:phone', 'nullable', 'string', 'email', 'max:255'],
            'birthDate' => ['nullable', 'date', 'after_or_equal:1900-01-01', 'before_or_equal:today'],
            'phone' => ['required_without:email', 'nullable', 'string', 'max:20', 'regex:/^\+?[0-9 -]+$/', function (string $veld, mixed $waarde, Closure $fout)
            {
                $cijfers = strlen(preg_replace('/\D/', '', $waarde));

                if ($cijfers < 10 || $cijfers > 15)
                {
                    $fout('Vul een geldig telefoonnummer in, bijvoorbeeld 06 1234 5678.');
                }
            }],
            'houseNumber' => ['nullable', 'string', 'max:5', 'regex:/^[0-9]+$/'],
            'postcode' => ['nullable', 'string', 'regex:/^[1-9][0-9]{3} ?[A-Za-z]{2}$/'],
        ];
    }

    // Een organisatie registreert altijd voor zichzelf; alleen de beheerder kiest de organisatie
    public function OrganisatieId(): int
    {
        return $this->user()->IsBeheerder() ? $this->integer('orgId') : $this->user()->organisatie_id;
    }

    // Dubbel-check, pas als alle velden verder goed zijn
    public function after(): array
    {
        return [
            function (Validator $validator)
            {
                if ($validator->errors()->isNotEmpty())
                {
                    return;
                }

                $veld = Vrijwilliger::DubbelVeld($this->OrganisatieId(), self::NaarKolommen($validator->validated()));

                if ($veld)
                {
                    $validator->errors()->add($veld, self::DUBBEL_MELDINGEN[$veld]);
                }
            },
        ];
    }

    // Dezelfde meldingen als in het formulier
    public function messages(): array
    {
        return [
            'firstName.regex' => 'Een voornaam bevat alleen letters.',
            'infix.regex' => 'Een tussenvoegsel bevat alleen letters, zoals "van der".',
            'lastName.regex' => 'Een achternaam bevat alleen letters.',
            'email.required_without' => 'Vul een e-mailadres of telefoonnummer in.',
            'phone.required_without' => 'Vul een e-mailadres of telefoonnummer in.',
            'birthDate.after_or_equal' => 'Vul een geldige geboortedatum in (niet in de toekomst).',
            'birthDate.before_or_equal' => 'Vul een geldige geboortedatum in (niet in de toekomst).',
            'phone.regex' => 'Vul een geldig telefoonnummer in, bijvoorbeeld 06 1234 5678.',
            'houseNumber.regex' => 'Een huisnummer bevat alleen cijfers. Letters horen bij de toevoeging.',
            'postcode.regex' => 'Vul een postcode in zoals 9481 AB.',
        ];
    }

    // Ook gebruikt door de Excel-import, waar alleen de voornaam verplicht is (zoals in v1.0)
    public static function Velden(): array
    {
        return [
            'firstName' => ['required', 'string', 'max:50'],
            'infix' => ['nullable', 'string', 'max:20'],
            'lastName' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'birthDate' => ['nullable', 'date', 'before_or_equal:today'],
            'street' => ['nullable', 'string', 'max:100'],
            'houseNumber' => ['nullable', 'string', 'max:10'],
            'addition' => ['nullable', 'string', 'max:10'],
            'postcode' => ['nullable', 'string', 'max:10'],
        ];
    }

    // Van de namen in de frontend naar de kolommen in de database
    public static function NaarKolommen(array $gegevens): array
    {
        return [
            'voornaam' => self::Hoofdletter($gegevens['firstName']),
            'tussenvoegsel' => filled($gegevens['infix'] ?? null) ? mb_strtolower(trim($gegevens['infix'])) : null,
            'achternaam' => isset($gegevens['lastName']) ? self::Hoofdletter($gegevens['lastName']) : null,
            'email' => isset($gegevens['email']) ? strtolower(trim($gegevens['email'])) : null,
            'telefoon' => $gegevens['phone'] ?? null,
            'geboortedatum' => $gegevens['birthDate'] ?? null,
            'straat' => $gegevens['street'] ?? null,
            'huisnummer' => $gegevens['houseNumber'] ?? null,
            'toevoeging' => $gegevens['addition'] ?? null,
            'postcode' => isset($gegevens['postcode']) ? strtoupper(str_replace(' ', '', $gegevens['postcode'])) : null,
        ];
    }

    // Typen mag in kleine letters; opgeslagen wordt met een hoofdletter: "jan" -> "Jan"
    private static function Hoofdletter(string $tekst): string
    {
        $tekst = trim($tekst);

        return mb_strtoupper(mb_substr($tekst, 0, 1)) . mb_substr($tekst, 1);
    }
}
