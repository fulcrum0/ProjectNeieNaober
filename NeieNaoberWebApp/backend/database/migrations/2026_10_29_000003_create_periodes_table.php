<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periodes', function (Blueprint $table)
        {
            $table->id();
            $table->string('naam', 100);
            $table->date('startdatum');
            $table->date('einddatum');
            // Zonder exportdatum mag de nachtelijke AVG-opruiming niets verwijderen
            $table->dateTime('geexporteerd_op')->nullable();
            $table->dateTime('gegevens_verwijderd_op')->nullable();
            $table->timestamps();
        });

        // Laravel kent geen CHECK in de Blueprint; SQLite (tests) slaan we over
        if (in_array(DB::getDriverName(), ['mysql', 'mariadb']))
        {
            DB::statement('ALTER TABLE periodes ADD CONSTRAINT periodes_datums_check CHECK (einddatum > startdatum)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('periodes');
    }
};
