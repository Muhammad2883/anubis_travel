<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tours Table
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('category')->default('day_trip');
            $table->string('title_ar');
            $table->string('title_en');
            $table->string('subtitle_ar')->nullable();
            $table->string('subtitle_en')->nullable();
            $table->text('overview_ar')->nullable();
            $table->text('overview_en')->nullable();
            $table->string('duration_ar')->nullable();
            $table->string('duration_en')->nullable();
            $table->decimal('base_price_egp', 10, 2)->default(0);
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->string('image_url')->nullable();
            $table->jsonb('highlights')->nullable();
            $table->jsonb('itinerary')->nullable();
            $table->jsonb('inclusions')->nullable();
            $table->jsonb('exclusions')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Routes (Transfers & Day Trips) Table
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable()->unique();
            $table->string('category')->default('airport');
            $table->string('title_ar');
            $table->string('title_en');
            $table->string('subtitle_ar')->nullable();
            $table->string('subtitle_en')->nullable();
            $table->text('overview_ar')->nullable();
            $table->text('overview_en')->nullable();
            $table->string('duration_ar')->nullable();
            $table->string('duration_en')->nullable();
            $table->jsonb('prices'); // { sedan: 1200, 7seater: 1500, h1: 2200, hiace: 2500 }
            $table->string('image_url')->nullable();
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->jsonb('highlights')->nullable();
            $table->jsonb('itinerary')->nullable();
            $table->jsonb('inclusions')->nullable();
            $table->jsonb('exclusions')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('show_in_catalog')->default(true);
            $table->timestamps();
        });

        // 3. Vehicles Fleet Table
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_ar');
            $table->string('name_en');
            $table->unsignedSmallInteger('passenger_capacity')->default(3);
            $table->unsignedSmallInteger('luggage_capacity')->default(3);
            $table->jsonb('features')->nullable();
            $table->string('image_url')->nullable();
            $table->string('badge_ar')->nullable();
            $table->string('badge_en')->nullable();
            $table->unsignedSmallInteger('requires_advance_notice_days')->default(0);
            $table->jsonb('models')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // 4. Bookings Table
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique()->index();
            $table->string('type')->default('transfer');
            $table->unsignedBigInteger('item_id')->default(0);
            $table->string('item_name');
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->string('flight_number')->nullable();
            $table->string('pickup_date');
            $table->string('pickup_time');
            $table->text('pickup_location');
            $table->text('dropoff_location')->nullable();
            $table->string('selected_vehicle')->nullable();
            $table->boolean('is_far_hotel')->default(false);
            $table->unsignedSmallInteger('passengers_count')->default(1);
            $table->unsignedSmallInteger('luggage_count')->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('currency', 10)->default('EGP');
            $table->text('notes')->nullable();
            $table->string('status')->default('pending')->index();
            $table->string('payment_status')->default('unpaid');
            $table->string('booking_method')->default('website');
            $table->string('source')->nullable();
            $table->timestamps();
        });

        // 5. Regular Clients (VIP / Corporate)
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company_name')->nullable();
            $table->string('phone')->index();
            $table->string('email')->nullable();
            $table->string('client_type')->default('vip');
            $table->decimal('account_balance_egp', 12, 2)->default(0);
            $table->unsignedInteger('trips_count')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('routes');
        Schema::dropIfExists('tours');
    }
};
