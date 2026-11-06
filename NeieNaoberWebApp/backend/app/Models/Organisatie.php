<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Organisatie extends Model
{
    use HasFactory;

    // Laravel raadt tabelnamen met Engelse regels; bij Nederlandse namen zetten we hem zelf vast
    protected $table = 'organisaties';

    protected $fillable = ['naam', 'telefoon', 'email', 'locatie', 'soort'];

    public function gebruiker(): HasOne
    {
        return $this->hasOne(Gebruiker::class, 'organisatie_id');
    }

    public function vrijwilligers(): HasMany
    {
        return $this->hasMany(Vrijwilliger::class, 'organisatie_id');
    }
}
