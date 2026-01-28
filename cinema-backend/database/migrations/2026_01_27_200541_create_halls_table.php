<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('halls', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cinema_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('capacity')->default(0);
            $table->json('seat_layout')->nullable(); // Stores grid/shape data
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('halls');
    }
};
