<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameDeliverysToDeliveriesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('deliverys', 'deliveries');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('deliveries', 'deliverys');
    }
}
