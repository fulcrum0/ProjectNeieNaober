<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ZelfAanmeldenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(VrijwilligerRequest::Opschonen($this->all()));

        if (is_string($this->input('organisatie_naam')))
        {
            $this->merge(['organisatie_naam' => trim($this->input('organisatie_naam'))]);
        }
    }

    public function rules(): array
    {
        return array_merge(VrijwilligerRequest::Regels(), [
            'organisatie_naam' => ['required', 'string', 'max:150'],
            'akkoord_privacy' => ['accepted'],
        ]);
    }

    public function messages(): array
    {
        return array_merge(VrijwilligerRequest::Meldingen(), [
            'akkoord_privacy.accepted' => 'Zet het vinkje bij de privacyverklaring aan. Zonder vinkje kunt u niet versturen.',
        ]);
    }
}
