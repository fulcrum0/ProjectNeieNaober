<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Gebruiker extends Authenticatable
{
    use HasFactory;

    public const ROL_BEHEERDER = 'beheerder';
    public const ROL_ORGANISATIE = 'organisatie';

    protected $table = 'gebruikers';

    // Onze kolom heet "wachtwoord" in plaats van "password"
    protected $authPasswordName = 'wachtwoord';

    // We hebben geen "onthoud mij", dus ook geen kolom remember_token
    protected $rememberTokenName = '';

    protected $fillable = ['organisatie_id', 'naam', 'email', 'wachtwoord', 'rol'];

    protected $hidden = ['wachtwoord'];

    protected function casts(): array
    {
        return [
            'wachtwoord' => 'hashed',
        ];
    }

    public function organisatie(): BelongsTo
    {
        return $this->belongsTo(Organisatie::class, 'organisatie_id');
    }

    public function IsBeheerder(): bool
    {
        return $this->rol === self::ROL_BEHEERDER;
    }
}
