<?php

namespace App\Http\Requests;

use App\Models\Vrijwilliger;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class VrijwilligerRequest extends FormRequest
{
    private const NAAM = "/^\\p{L}[\\p{L}\\s'.-]*$/u";

    private const TUSSENVOEGSEL = "/^[\\p{L}\\s'.-]+$/u";

    public const DUBBEL_MELDINGEN = [
        'email' => 'Deze vrijwilliger is al geregistreerd bij deze organisatie (zelfde e-mailadres).',
        'birthDate' => 'Deze vrijwilliger is al geregistreerd bij deze organisatie (zelfde naam en geboortedatum).',
    ];

    public function rules(): array
    {
        return [
            'orgId' => [$this->user()->IsBeheerder() ? 'required' : 'nullable', 'integer', 'exists:organisaties,id'],
            ...self::Velden(),
            'firstName' => ['required', 'string', 'max:50', 'regex:' . self::NAAM],
            'infix' => ['nullable', 'string', 'max:20', 'regex:' . self::TUSSENVOEGSEL],
            'lastName' => ['required', 'string', 'max:100', 'regex:' . self::NAAM],
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

    public function OrganisatieId(): int
    {
        return $this->user()->IsBeheerder() ? $this->integer('orgId') : $this->user()->organisatie_id;
    }

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

    private static function Hoofdletter(string $tekst): string
    {
        $tekst = trim($tekst);

        return mb_strtoupper(mb_substr($tekst, 0, 1)) . mb_substr($tekst, 1);
    }
}
