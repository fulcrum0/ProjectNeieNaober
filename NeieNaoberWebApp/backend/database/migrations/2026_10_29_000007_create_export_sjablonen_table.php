<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('export_sjablonen', function (Blueprint $table)
        {
            $table->id();
            $table->string('naam', 100);
            $table->string('bestandsnaam');
            // Welke kolom welk veld is, bijvoorbeeld {"A": "aanhef", "B": "voornaam"}
            $table->json('kolommen');
            $table->boolean('actief')->default(false);
            $table->foreignId('geupload_door')->nullable()->constrained('gebruikers')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('export_sjablonen');
    }
};
