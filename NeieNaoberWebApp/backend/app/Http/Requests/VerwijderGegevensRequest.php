<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerwijderGegevensRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Definitief verwijderen kan niet terug; daarom moet de beheerder het woord typen
            'bevestiging' => ['required', 'in:VERWIJDER'],
        ];
    }

    public function messages(): array
    {
        return [
            'bevestiging.in' => 'Typ VERWIJDER in hoofdletters om te bevestigen.',
        ];
    }
}
