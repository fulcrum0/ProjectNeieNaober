<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vrijwilliger extends Model
{
    use HasFactory;

    protected $table = 'vrijwilligers';

    protected $fillable = [
        'organisatie_id', 'voornaam', 'tussenvoegsel', 'achternaam', 'email', 'telefoon', 'geboortedatum',
        'straat', 'huisnummer', 'toevoeging', 'postcode', 'verstuurd_op',
    ];

    protected function casts(): array
    {
        return [
            'geboortedatum' => 'date',
            'verstuurd_op' => 'datetime',
        ];
    }

    public function organisatie(): BelongsTo
    {
        return $this->belongsTo(Organisatie::class, 'organisatie_id');
    }

    public function IsVerstuurd(): bool
    {
        return $this->verstuurd_op !== null;
    }

    // Een organisatie ziet al haar eigen vrijwilligers (ook concepten),
    // de beheerder ziet van elke organisatie alleen wat is verstuurd
    public function scopeZichtbaarVoor(Builder $query, Gebruiker $gebruiker): Builder
    {
        return $gebruiker->IsBeheerder()
            ? $query->whereNotNull('verstuurd_op')
            : $query->where('organisatie_id', $gebruiker->organisatie_id);
    }

    public function scopeConcept(Builder $query): Builder
    {
        return $query->whereNull('verstuurd_op');
    }

    // Dubbel-check: dezelfde persoon binnen één organisatie heeft hetzelfde e-mailadres,
    // óf dezelfde voornaam, tussenvoegsel, achternaam en geboortedatum. Geeft het veld terug waarop het misgaat, of null.
    public static function DubbelVeld(int $organisatieId, array $kolommen): ?string
    {
        $vrijwilligers = self::query()->where('organisatie_id', $organisatieId);

        if (filled($kolommen['email']) && (clone $vrijwilligers)->whereRaw('LOWER(email) = ?', [mb_strtolower($kolommen['email'])])->exists())
        {
            return 'email';
        }

        if (filled($kolommen['achternaam']) && filled($kolommen['geboortedatum']))
        {
            $zelfdePersoon = (clone $vrijwilligers)
                ->whereRaw('LOWER(voornaam) = ?', [mb_strtolower($kolommen['voornaam'])])
                ->whereRaw("LOWER(COALESCE(tussenvoegsel, '')) = ?", [mb_strtolower($kolommen['tussenvoegsel'] ?? '')])
                ->whereRaw('LOWER(achternaam) = ?', [mb_strtolower($kolommen['achternaam'])])
                ->whereDate('geboortedatum', $kolommen['geboortedatum'])
                ->exists();

            if ($zelfdePersoon)
            {
                return 'birthDate';
            }
        }

        return null;
    }
}
