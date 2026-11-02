<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Vrijwilliger;
use Illuminate\Validation\Rule;

class VrijwilligerRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Wie wat mag, regelen de middleware en de policy
        return true;
    }

    // Eerst netjes maken, dan controleren (TO 6: spaties weg, postcode in hoofdletters)
    protected function prepareForValidation(): void
    {
        $this->merge(self::Opschonen($this->all()));
    }

    public function rules(): array
    {
        return self::Regels();
    }

    public function messages(): array
    {
        return self::Meldingen();
    }

    // Static, zodat de Excel-upload en zelf aanmelden precies dezelfde regels gebruiken
    public static function Regels(): array
    {
        return [
            'aanhef' => ['nullable', Rule::in(['dhr.', 'mevr.'])],
            'voornaam' => ['required', 'string', 'max:50', 'not_regex:/^(dhr|mevr)\b/i'],
            'tussenvoegsel' => ['nullable', 'string', 'max:20'],
            'achternaam' => ['required', 'string', 'max:100'],
            'straat' => ['required', 'string', 'max:100'],
            'huisnummer' => ['required', 'string', 'max:10', 'regex:/^[1-9][0-9]*/'],
            'postcode' => ['required', 'string', 'regex:/^[1-9][0-9]{3}[A-Z]{2}$/'],
            'woonplaats' => ['required', 'string', 'max:80'],
        ];
    }

    public static function Meldingen(): array
    {
        return [
            'aanhef.in' => 'Kies dhr. of mevr. als aanhef, of laat het leeg.',
            'postcode.regex' => 'Vul een postcode in zoals 9481 AB.',
            'voornaam.not_regex' => 'Zet dhr. of mevr. niet bij de voornaam. Kies de aanhef.',
            'huisnummer.regex' => 'Vul een huisnummer in dat begint met een cijfer, zoals 12 of 12a.',
        ];
    }

    public static function Opschonen(array $invoer): array
    {
        $schoon = [];

        foreach (Vrijwilliger::VELDEN as $veld)
        {
            if (! array_key_exists($veld, $invoer))
            {
                continue;
            }

            $waarde = $invoer[$veld];

            if (is_string($waarde) || is_numeric($waarde))
            {
                // Dubbele spaties uit Excel of kopiëren-plakken weghalen
                $waarde = preg_replace('/\s+/u', ' ', trim((string) $waarde));
            }

            if ($waarde === '')
            {
                $waarde = null;
            }

            $schoon[$veld] = $waarde;
        }

        if (isset($schoon['postcode']))
        {
            // De database slaat de postcode op zonder spatie, bijvoorbeeld 9481AB
            $schoon['postcode'] = strtoupper(str_replace(' ', '', $schoon['postcode']));
        }

        if (isset($schoon['aanhef']))
        {
            $schoon['aanhef'] = self::AanhefNetjes($schoon['aanhef']);
        }

        return $schoon;
    }

    // "Dhr", "dhr." en "DHR." betekenen hetzelfde; in de database mag alleen "dhr." of "mevr."
    private static function AanhefNetjes(string $aanhef): string
    {
        $kort = rtrim(strtolower($aanhef), '.');

        return in_array($kort, ['dhr', 'mevr'], true) ? $kort . '.' : $aanhef;
    }
}
