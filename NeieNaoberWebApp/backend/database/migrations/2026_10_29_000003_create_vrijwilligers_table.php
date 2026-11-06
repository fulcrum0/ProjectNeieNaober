<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vrijwilligers', function (Blueprint $table)
        {
            $table->id();
            $table->foreignId('organisatie_id')->constrained('organisaties')->cascadeOnDelete();
            $table->string('voornaam', 50);
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
