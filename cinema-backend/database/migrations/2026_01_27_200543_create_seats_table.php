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
        Schema::create('seats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('hall_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('seat_type_id')->nullable()->constrained('seat_types')->nullOnDelete();
            $table->string('row'); // e.g., "A"
            $table->string('number'); // e.g., "1"
            $table->string('status')->default('available'); // available, blocked
            $table->timestamps();

            // Unique constraint to prevent duplicate seats in same hall
            $table->unique(['hall_id', 'row', 'number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};
