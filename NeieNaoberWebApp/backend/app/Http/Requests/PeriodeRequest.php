<?php

namespace App\Http\Requests;

use App\Models\Periode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class PeriodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'naam' => ['required', 'string', 'max:100'],
            'startdatum' => ['required', 'date'],
            'einddatum' => ['required', 'date', 'after:startdatum'],
        ];
    }

    public function messages(): array
    {
        return [
            'einddatum.after' => 'De einddatum moet na de startdatum liggen.',
        ];
    }

    // Periodes mogen niet overlappen (TO 4.3); dat kan geen gewone regel controleren
    public function after(): array
    {
        return [
            function (Validator $validator)
            {
                if ($validator->errors()->isNotEmpty())
                {
                    return;
                }

                $overlapt = Periode::query()
                    ->whereDate('startdatum', '<=', $this->input('einddatum'))
                    ->whereDate('einddatum', '>=', $this->input('startdatum'))
                    ->exists();

                if ($overlapt)
                {
                    $validator->errors()->add('startdatum', 'Deze periode overlapt met een andere periode.');
                }
            },
        ];
    }
}
