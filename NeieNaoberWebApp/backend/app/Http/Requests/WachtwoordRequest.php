<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class WachtwoordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            // Minimaal 12 tekens en niet uitgelekt; zie Password::defaults() in AppServiceProvider
            'wachtwoord' => ['required', 'string', 'confirmed', Password::defaults()],
        ];
    }
}
