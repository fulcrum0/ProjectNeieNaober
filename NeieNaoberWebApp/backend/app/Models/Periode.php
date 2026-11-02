<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Periode extends Model
{
    use HasFactory;

    protected $table = 'periodes';

    protected $fillable = ['naam', 'startdatum', 'einddatum', 'geexporteerd_op', 'gegevens_verwijderd_op'];

    protected function casts(): array
    {
        return [
            'startdatum' => 'date',
            'einddatum' => 'date',
            'geexporteerd_op' => 'datetime',
            'gegevens_verwijderd_op' => 'datetime',
        ];
    }

    public function aanmeldingen(): HasMany
    {
        return $this->hasMany(Aanmelding::class, 'periode_id');
    }

    // Aanmelden kan alleen tussen start- en einddatum (FE-8)
    public function scopeOpen(Builder $query): Builder
    {
        $vandaag = now()->toDateString();

        return $query->whereDate('startdatum', '<=', $vandaag)->whereDate('einddatum', '>=', $vandaag);
    }

    public static function HuidigeOpen(): ?self
    {
        return self::query()->open()->first();
    }
}
