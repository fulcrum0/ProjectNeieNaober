<?php

namespace App\Http\Requests;

use App\Models\ExportSjabloon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SjabloonUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'naam' => ['sometimes', 'string', 'max:100'],
            'kolommen' => ['sometimes', 'array', 'min:1'],
            // Sleutel = kolomletter (A, B, ... AA), waarde = veld uit ExportSjabloon::VELDEN
            'kolommen.*' => ['nullable', Rule::in(ExportSjabloon::VELDEN)],
            'actief' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'kolommen.*.in' => 'Kies een bestaand veld voor deze kolom.',
        ];
    }

    public function after(): array
    {
        return [
            function ($validator)
            {
                foreach (array_keys($this->input('kolommen', [])) as $letter)
                {
                    if (! preg_match('/^[A-Z]{1,2}$/', (string) $letter))
                    {
                        $validator->errors()->add('kolommen', 'Gebruik kolomletters zoals A, B of AA.');
                        break;
                    }
                }
            },
        ];
    }
}
