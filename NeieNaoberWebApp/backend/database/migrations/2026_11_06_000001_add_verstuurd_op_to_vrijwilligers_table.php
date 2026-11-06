<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vrijwilligers', function (Blueprint $table)
        {
            // Leeg = concept, alleen de organisatie ziet hem. Gevuld = verstuurd naar VIP! Tynaarlo (gemeente).
            $table->dateTime('verstuurd_op')->nullable()->after('postcode');

            // Vangnet voor de dubbel-check: één e-mailadres maar één keer per organisatie (leeg mag vaker)
            $table->unique(['organisatie_id', 'email'], 'vrijwilligers_organisatie_email_uniek');
        });

        // Wat er al stond was al zichtbaar voor de beheerder; dat blijft zo
        DB::table('vrijwilligers')->update(['verstuurd_op' => DB::raw('created_at')]);
    }

    public function down(): void
    {
        Schema::table('vrijwilligers', function (Blueprint $table)
        {
            $table->dropUnique('vrijwilligers_organisatie_email_uniek');
            $table->dropColumn('verstuurd_op');
        });
    }
};
