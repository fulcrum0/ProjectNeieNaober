<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SjabloonUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Alleen .xlsx en max. 2 MB, zodat er geen macro's of grote bestanden binnenkomen
            'bestand' => ['required', 'file', 'mimes:xlsx', 'max:2048'],
            'naam' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'bestand.mimes' => 'Kies een Excel-bestand (.xlsx).',
        ];
    }
}
