<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aanmeldingen', function (Blueprint $table)
        {
            $table->id();
            // CASCADE: verwijder je een vrijwilliger, dan gaan zijn aanmeldingen mee (AVG)
            $table->foreignId('vrijwilliger_id')->constrained('vrijwilligers')->cascadeOnDelete();
            $table->foreignId('periode_id')->constrained('periodes');
            // Leeg bij zelf aanmelden; dan staat de naam in organisatie_naam
            $table->foreignId('organisatie_id')->nullable()->constrained('organisaties');
            $table->string('organisatie_naam', 150)->nullable();
            $table->foreignId('verklaring_id')->nullable()->constrained('verklaringen')->nullOnDelete();
            $table->enum('status', ['concept', 'nieuw', 'goedgekeurd', 'afgekeurd'])->default('concept');
            $table->boolean('mogelijk_dubbel')->default(false);
            $table->foreignId('beoordeeld_door')->nullable()->constrained('gebruikers')->nullOnDelete();
            $table->dateTime('beoordeeld_op')->nullable();
            $table->timestamps();

            $table->unique(['vrijwilliger_id', 'organisatie_id', 'periode_id'], 'aanmeldingen_uniek');
            $table->index(['periode_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aanmeldingen');
    }
};
