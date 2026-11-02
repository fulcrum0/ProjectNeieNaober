<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VrijwilligersUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bestand' => ['required', 'file', 'mimes:xlsx,csv,txt', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'bestand.mimes' => 'Kies een Excel-bestand (.xlsx) of een CSV-bestand.',
        ];
    }
}
