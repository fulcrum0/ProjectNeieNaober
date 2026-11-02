<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganisatieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'naam' => is_string($this->naam) ? preg_replace('/\s+/u', ' ', trim($this->naam)) : $this->naam,
            'email' => is_string($this->email) ? strtolower(trim($this->email)) : $this->email,
        ]);
    }

    public function rules(): array
    {
        return [
            'naam' => ['required', 'string', 'max:150', 'unique:organisaties,naam'],
            'plaats' => ['required', 'string', 'max:80'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:gebruikers,email'],
        ];
    }

    public function messages(): array
    {
        return [
            'naam.unique' => 'Er is al een organisatie met deze naam.',
            'email.unique' => 'Dit e-mailadres heeft al een account.',
        ];
    }
}
