<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BenIkAangemeldRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(VrijwilligerRequest::Opschonen($this->only(['voornaam', 'achternaam', 'postcode', 'huisnummer'])));
    }

    public function rules(): array
    {
        $regels = VrijwilligerRequest::Regels();

        return [
            'voornaam' => ['required', 'string', 'max:50'],
            'achternaam' => $regels['achternaam'],
            'postcode' => $regels['postcode'],
            'huisnummer' => $regels['huisnummer'],
        ];
    }

    public function messages(): array
    {
        return VrijwilligerRequest::Meldingen();
    }
}
