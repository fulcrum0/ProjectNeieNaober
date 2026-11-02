<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Verklaring extends Model
{
    protected $table = 'verklaringen';

    // De tabel heeft alleen created_at: een verklaring wordt nooit aangepast
    public const UPDATED_AT = null;

    protected $fillable = ['organisatie_id', 'periode_id', 'gebruiker_id', 'naam_invuller', 'versie_privacy'];

    public function organisatie(): BelongsTo
    {
        return $this->belongsTo(Organisatie::class, 'organisatie_id');
    }

    public function periode(): BelongsTo
    {
        return $this->belongsTo(Periode::class, 'periode_id');
    }
}
