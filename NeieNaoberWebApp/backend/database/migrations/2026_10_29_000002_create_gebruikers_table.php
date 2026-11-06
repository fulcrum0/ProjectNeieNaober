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
            // Eén account per organisatie; de beheerder (VIP!) heeft geen organisatie.
            // Wordt de organisatie verwijderd, dan gaat het account mee.
            $table->foreignId('organisatie_id')->nullable()->unique()->constrained('organisaties')->cascadeOnDelete();
            $table->string('naam', 100);
            $table->string('email')->unique();
            $table->string('wachtwoord');
            $table->enum('rol', ['beheerder', 'organisatie'])->default('organisatie');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gebruikers');
    }
};
