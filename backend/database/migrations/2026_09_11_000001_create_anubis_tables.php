<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Vehicles
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // {"en": "...", "ar": "..."}
            $table->string('slug')->unique();
            $table->integer('passenger_capacity');
            $table->integer('luggage_capacity');
            $table->json('features')->default('[]');
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Routes
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->json('origin_name');
            $table->json('destination_name');
            $table->string('category')->default('transfer'); // airport, day_tour, overday, intercity
            $table->decimal('distance_km', 8, 2)->nullable();
            $table->integer('estimated_duration_mins')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Route Vehicle Prices Matrix
        Schema::create('route_vehicle_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('route_id')->constrained('routes')->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('cascade');
            $table->decimal('price_egp', 10, 2);
            $table->decimal('price_usd', 10, 2);
            $table->decimal('price_eur', 10, 2);
            $table->timestamps();

            $table->unique(['route_id', 'vehicle_id']);
        });

        // 4. Tours Catalog
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->string('slug')->unique();
            $table->string('category')->default('day_trip'); // day_trip, cultural, adventure, nile_cruise
            $table->json('overview');
            $table->json('itinerary')->default('[]');
            $table->json('inclusions')->default('[]');
            $table->json('exclusions')->default('[]');
            $table->decimal('base_price_usd', 10, 2);
            $table->decimal('base_price_eur', 10, 2);
            $table->decimal('base_price_egp', 10, 2);
            $table->integer('duration_hours');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Bookings CRM
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique();
            $table->enum('type', ['transfer', 'tour']);
            $table->unsignedBigInteger('item_id');
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->string('customer_phone');
            $table->string('flight_number')->nullable();
            $table->dateTime('pickup_datetime');
            $table->string('pickup_location')->nullable();
            $table->string('dropoff_location')->nullable();
            $table->integer('passengers_count')->default(1);
            $table->integer('luggage_count')->default(0);
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->decimal('total_amount', 10, 2);
            $table->string('currency', 10)->default('EGP');
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('tours');
        Schema::dropIfExists('route_vehicle_prices');
        Schema::dropIfExists('routes');
        Schema::dropIfExists('vehicles');
    }
};
