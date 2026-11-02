<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organisaties', function (Blueprint $table)
        {
            $table->id();
            // Uniek, zodat er nooit "VV Vries" én "V.V. Vries" naast elkaar staan
            $table->string('naam', 150)->unique();
            $table->string('plaats', 80);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organisaties');
    }
};
