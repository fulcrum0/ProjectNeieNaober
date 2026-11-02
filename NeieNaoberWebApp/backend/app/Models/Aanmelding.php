<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aanmelding extends Model
{
    use HasFactory;

    public const STATUS_CONCEPT = 'concept';
    public const STATUS_NIEUW = 'nieuw';
    public const STATUS_GOEDGEKEURD = 'goedgekeurd';
    public const STATUS_AFGEKEURD = 'afgekeurd';

    protected $table = 'aanmeldingen';

    protected $fillable = [
        'vrijwilliger_id', 'periode_id', 'organisatie_id', 'organisatie_naam', 'verklaring_id',
        'status', 'mogelijk_dubbel', 'beoordeeld_door', 'beoordeeld_op',
    ];

    protected function casts(): array
    {
        return [
            'mogelijk_dubbel' => 'boolean',
            'beoordeeld_op' => 'datetime',
        ];
    }

    public function vrijwilliger(): BelongsTo
    {
        return $this->belongsTo(Vrijwilliger::class, 'vrijwilliger_id');
    }

    public function periode(): BelongsTo
    {
        return $this->belongsTo(Periode::class, 'periode_id');
    }

    public function organisatie(): BelongsTo
    {
        return $this->belongsTo(Organisatie::class, 'organisatie_id');
    }

    public function verklaring(): BelongsTo
    {
        return $this->belongsTo(Verklaring::class, 'verklaring_id');
    }

    public function beoordelaar(): BelongsTo
    {
        return $this->belongsTo(Gebruiker::class, 'beoordeeld_door');
    }

    // Bij zelf aanmelden is er geen organisatie_id, alleen de getypte naam
    public function OrganisatieNaam(): ?string
    {
        return $this->organisatie?->naam ?? $this->organisatie_naam;
    }
}
