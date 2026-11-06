<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Velden van een vrijwilliger in de frontend: orgId, firstName, lastName, email, phone,
        // birthDate, street, houseNumber, addition, postcode, createdAt
        Schema::create('vrijwilligers', function (Blueprint $table)
        {
            $table->id();
            // CASCADE: verwijder je een organisatie, dan gaan haar vrijwilligers mee
            $table->foreignId('organisatie_id')->constrained('organisaties')->cascadeOnDelete();
            $table->string('voornaam', 50);
            // Leeg mag bij een Excel-import; het formulier vraagt ze wel altijd
            $table->string('achternaam', 100)->nullable();
            $table->string('email')->nullable();
            $table->string('telefoon', 30)->nullable();
            $table->date('geboortedatum')->nullable();
            $table->string('straat', 100)->nullable();
            $table->string('huisnummer', 10)->nullable();
            $table->string('toevoeging', 10)->nullable();
            $table->string('postcode', 10)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vrijwilligers');
    }
};
