<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vrijwilligers', function (Blueprint $table)
        {
            // "van der" in "Jan van der Berg", los van de achternaam
            $table->string('tussenvoegsel', 20)->nullable()->after('voornaam');
        });
    }

    public function down(): void
    {
        Schema::table('vrijwilligers', function (Blueprint $table)
        {
            $table->dropColumn('tussenvoegsel');
        });
    }
};
