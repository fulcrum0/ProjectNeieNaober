<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vrijwilliger extends Model
{
    use HasFactory;

    public const VELDEN = ['aanhef', 'voornaam', 'tussenvoegsel', 'achternaam', 'straat', 'huisnummer', 'postcode', 'woonplaats'];

    protected $table = 'vrijwilligers';

    protected $fillable = self::VELDEN;

    public function aanmeldingen(): HasMany
    {
        return $this->hasMany(Aanmelding::class, 'vrijwilliger_id');
    }
}
