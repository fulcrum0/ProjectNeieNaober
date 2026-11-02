<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Gebruiker extends Authenticatable
{
    use HasFactory, Notifiable;

    public const ROL_ORGANISATIE = 'organisatie';
    public const ROL_MEDEWERKER = 'medewerker';
    public const ROL_BEHEERDER = 'beheerder';

    protected $table = 'gebruikers';

    // Onze kolom heet "wachtwoord" in plaats van "password"
    protected $authPasswordName = 'wachtwoord';

    // We hebben geen "onthoud mij", dus ook geen kolom remember_token
    protected $rememberTokenName = '';

    protected $fillable = ['organisatie_id', 'naam', 'email', 'wachtwoord', 'rol', 'actief'];

    protected $hidden = ['wachtwoord'];

    protected function casts(): array
    {
        return [
            'wachtwoord' => 'hashed',
            'actief' => 'boolean',
        ];
    }

    public function organisatie(): BelongsTo
    {
        return $this->belongsTo(Organisatie::class, 'organisatie_id');
    }

    public function IsVip(): bool
    {
        return in_array($this->rol, [self::ROL_MEDEWERKER, self::ROL_BEHEERDER], true);
    }
}
