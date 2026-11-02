<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VersturenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'akkoord_privacy' => ['accepted'],
            'naam_invuller' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'akkoord_privacy.accepted' => 'Zet het vinkje bij de privacyverklaring aan. Zonder vinkje kunt u niet versturen.',
        ];
    }
}
