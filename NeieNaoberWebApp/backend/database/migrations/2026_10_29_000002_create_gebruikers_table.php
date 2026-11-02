<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gebruikers', function (Blueprint $table)
        {
            $table->id();
            // Uniek: één account per organisatie. Medewerkers en beheerders hebben geen organisatie.
            $table->foreignId('organisatie_id')->nullable()->unique()->constrained('organisaties');
            $table->string('naam', 100);
            $table->string('email')->unique();
            $table->string('wachtwoord');
            $table->enum('rol', ['organisatie', 'medewerker', 'beheerder'])->default('organisatie');
            $table->boolean('actief')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gebruikers');
    }
};
