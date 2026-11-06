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
