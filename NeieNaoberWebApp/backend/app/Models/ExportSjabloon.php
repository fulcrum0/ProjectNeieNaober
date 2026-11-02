<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExportSjabloon extends Model
{
    // De velden waaraan VIP! een kolom uit het sjabloon kan koppelen
    public const VELDEN = [
        'aanhef', 'voornaam', 'tussenvoegsel', 'achternaam', 'straat', 'huisnummer',
        'postcode', 'woonplaats', 'organisatie', 'periode',
    ];

    protected $table = 'export_sjablonen';

    protected $fillable = ['naam', 'bestandsnaam', 'kolommen', 'actief', 'geupload_door'];

    protected function casts(): array
    {
        return [
            'kolommen' => 'array',
            'actief' => 'boolean',
        ];
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(Gebruiker::class, 'geupload_door');
    }

    public static function Actief(): ?self
    {
        return self::query()->where('actief', true)->first();
    }
}
