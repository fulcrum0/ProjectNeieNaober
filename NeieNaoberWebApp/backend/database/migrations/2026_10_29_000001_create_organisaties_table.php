<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Velden van een organisatie in de frontend: name, phone, email, location, type
        Schema::create('organisaties', function (Blueprint $table)
        {
            $table->id();
            // Uniek: de Excel-import van vrijwilligers koppelt op de naam van de organisatie
            $table->string('naam', 150)->unique();
            $table->string('telefoon', 30)->nullable();
            $table->string('email')->nullable();
            $table->string('locatie', 100)->nullable();
            $table->string('soort', 50)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organisaties');
    }
};
