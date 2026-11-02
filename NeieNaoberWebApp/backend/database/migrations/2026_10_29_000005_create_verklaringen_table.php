<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Bewijs dat de organisatie het privacyvinkje heeft aangezet (FE-5)
        Schema::create('verklaringen', function (Blueprint $table)
        {
            $table->id();
            $table->foreignId('organisatie_id')->constrained('organisaties');
            $table->foreignId('periode_id')->constrained('periodes');
            $table->foreignId('gebruiker_id')->nullable()->constrained('gebruikers')->nullOnDelete();
            $table->string('naam_invuller', 100);
            $table->string('versie_privacy', 10);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verklaringen');
    }
};
