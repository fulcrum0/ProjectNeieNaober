<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Alleen de velden die de gemeente nodig heeft (AVG): geen telefoon, geen geboortedatum
        Schema::create('vrijwilligers', function (Blueprint $table)
        {
            $table->id();
            $table->enum('aanhef', ['dhr.', 'mevr.'])->nullable();
            $table->string('voornaam', 50);
            $table->string('tussenvoegsel', 20)->nullable();
            $table->string('achternaam', 100);
            $table->string('straat', 100);
            $table->string('huisnummer', 10);
            $table->char('postcode', 6);
            $table->string('woonplaats', 80);
            $table->timestamps();

            // Snel zoeken voor "Ben ik al aangemeld?" en de dubbel-check
            $table->index(['postcode', 'huisnummer']);
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb']))
        {
            DB::statement("ALTER TABLE vrijwilligers ADD CONSTRAINT vrijwilligers_postcode_check CHECK (postcode REGEXP '^[1-9][0-9]{3}[A-Z]{2}$')");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('vrijwilligers');
    }
};
