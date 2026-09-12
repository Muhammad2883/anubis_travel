<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnubisDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with authentic ANUBIS data.
     */
    public function run(): void
    {
        // 1. Seed Vehicles
        $vehicles = [
            [
                'id' => 1,
                'name' => json_encode(['ar' => 'ملاكي سيدان (سيارة خاصة فاخرة)', 'en' => 'Luxury Private Sedan']),
                'slug' => 'sedan',
                'passenger_capacity' => 2,
                'luggage_capacity' => 2,
                'features' => json_encode(['Air Conditioning', 'Professional Chauffeur', 'Complimentary Bottled Water', 'Wi-Fi']),
                'image_url' => 'sedan.png',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => json_encode(['ar' => '7 راكب عائلي (SUV / ميني فان)', 'en' => '7-Seater Family MPV / SUV']),
                'slug' => '7seater',
                'passenger_capacity' => 5,
                'luggage_capacity' => 4,
                'features' => json_encode(['Spacious Cabin', 'Large Luggage Boot', 'Dual AC', 'USB Chargers']),
                'image_url' => '7seater.png',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => json_encode(['ar' => 'هيونداي إتش وان (H1 Luxury Van)', 'en' => 'Hyundai H1 Grand Starex']),
                'slug' => 'h1',
                'passenger_capacity' => 6,
                'luggage_capacity' => 6,
                'features' => json_encode(['Reclining Executive Seats', 'Extra Legroom', 'Privacy Glass', 'Advance 2 Days Booking']),
                'image_url' => 'h1.png',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => json_encode(['ar' => 'تويوتا هاي إس (Toyota HiAce Tourer)', 'en' => 'Toyota HiAce Luxury Tourer']),
                'slug' => 'hiace',
                'passenger_capacity' => 10,
                'luggage_capacity' => 10,
                'features' => json_encode(['High Roof', '10 Passenger Capacity', 'Heavy Duty AC', 'PA Microphone']),
                'image_url' => 'hiace.png',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('vehicles')->upsert($vehicles, ['id']);

        // 2. Seed All 19 Routes from Excel
        $routes = [
            ['id' => 1, 'origin' => ['ar' => 'القاهرة / الجيزة', 'en' => 'Cairo / Giza'], 'destination' => ['ar' => 'هرم - ممفيس - سقارة', 'en' => 'Pyramids - Memphis - Saqqara'], 'cat' => 'day_tour', 'dur' => 540],
            ['id' => 2, 'origin' => ['ar' => 'القاهرة / الجيزة', 'en' => 'Cairo / Giza'], 'destination' => ['ar' => 'هرم - ممفيس - سقارة - دهشور', 'en' => 'Pyramids - Memphis - Saqqara - Dahshur'], 'cat' => 'day_tour', 'dur' => 600],
            ['id' => 3, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'يومية بلد 3 مزارات بالقاهرة', 'en' => 'Cairo City Tour (3 Sights)'], 'cat' => 'day_tour', 'dur' => 480],
            ['id' => 4, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'يومية بلد 4 مزارات بالقاهرة', 'en' => 'Cairo City Tour (4 Sights)'], 'cat' => 'day_tour', 'dur' => 540],
            ['id' => 5, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'نصف يومية مزار فقط', 'en' => 'Half Day Sightseeing Tour'], 'cat' => 'day_tour', 'dur' => 300],
            ['id' => 6, 'origin' => ['ar' => 'القاهرة / النيل', 'en' => 'Cairo'], 'destination' => ['ar' => 'سهرة عشاء (مركب نيلي / مطعم)', 'en' => 'Evening Dinner Tour'], 'cat' => 'day_tour', 'dur' => 300],
            ['id' => 7, 'origin' => ['ar' => 'مطار القاهرة الدولي', 'en' => 'Cairo International Airport'], 'destination' => ['ar' => 'فنادق القاهرة / الجيزة (استقبال أو تسفير)', 'en' => 'Cairo / Giza Hotels Transfer'], 'cat' => 'airport', 'dur' => 90],
            ['id' => 8, 'origin' => ['ar' => 'مطار سفنكس الدولي', 'en' => 'Sphinx International Airport'], 'destination' => ['ar' => 'فنادق القاهرة / الجيزة (استقبال أو تسفير)', 'en' => 'Cairo / Giza Hotels Transfer'], 'cat' => 'airport', 'dur' => 90],
            ['id' => 9, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'أوفر داي إسكندرية (رحلة يوم كامل)', 'en' => 'Alexandria Full Day Tour (Overday)'], 'cat' => 'overday', 'dur' => 780],
            ['id' => 10, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'أوفر داي الفيوم ووادي الريان', 'en' => 'Fayoum Oasis Overday'], 'cat' => 'overday', 'dur' => 660],
            ['id' => 11, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'أوفر داي العين السخنة', 'en' => 'Ain Sokhna Beach Overday'], 'cat' => 'overday', 'dur' => 660],
            ['id' => 12, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'أوفر داي المنيا (آثار تل العمارنة)', 'en' => 'Minya Historic Overday'], 'cat' => 'overday', 'dur' => 900],
            ['id' => 13, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'توصيل الغردقة (اتجاه واحد)', 'en' => 'Cairo to Hurghada Transfer'], 'cat' => 'intercity', 'dur' => 360],
            ['id' => 14, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'توصيل شرم الشيخ (اتجاه واحد)', 'en' => 'Cairo to Sharm El Sheikh Transfer'], 'cat' => 'intercity', 'dur' => 420],
            ['id' => 15, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'توصيلة إسكندرية (اتجاه واحد)', 'en' => 'Cairo to Alexandria Transfer'], 'cat' => 'intercity', 'dur' => 180],
            ['id' => 16, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'توصيلة الأقصر (طريق بري)', 'en' => 'Cairo to Luxor Private Transfer'], 'cat' => 'intercity', 'dur' => 540],
            ['id' => 17, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'الواحات البحرية (2 يوم / 1 ليلة)', 'en' => 'Bahariya Oasis (2 Days / 1 Night)'], 'cat' => 'multiday', 'dur' => 1440],
            ['id' => 18, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'سيوة والواحات (3 يوم / 2 ليلة)', 'en' => 'Siwa Oasis Dream Safari (3 Days / 2 Nights)'], 'cat' => 'multiday', 'dur' => 2880],
            ['id' => 19, 'origin' => ['ar' => 'القاهرة', 'en' => 'Cairo'], 'destination' => ['ar' => 'إسكندرية إقامة (2 يوم / 1 ليلة)', 'en' => 'Alexandria Getaway (2 Days / 1 Night)'], 'cat' => 'multiday', 'dur' => 1440],
        ];

        foreach ($routes as $r) {
            DB::table('routes')->upsert([
                'id' => $r['id'],
                'origin_name' => json_encode($r['origin']),
                'destination_name' => json_encode($r['destination']),
                'category' => $r['cat'],
                'estimated_duration_mins' => $r['dur'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ], ['id']);
        }

        // 3. Seed Route Pricing Matrix (Exact Excel Matrix)
        $prices = [
            // route_id => [sedan, 7seater, h1, hiace]
            1  => [1000, 1500, 2300, 2600],
            2  => [1200, 1700, 2500, 2800],
            3  => [1000, 1500, 2300, 2600],
            4  => [1150, 1700, 2500, 2800],
            5  => [900,  1300, 1800, 3500],
            6  => [800,  1000, 1500, 1700],
            7  => [800,  1000, 1600, 1700],
            8  => [800,  1000, 1700, 1800],
            9  => [3000, 3500, 5000, 5500],
            10 => [2800, 3250, 4500, 5000],
            11 => [2800, 3250, 4500, 5000],
            12 => [2500, 3000, 3900, 4300],
            13 => [5500, 6500, 8500, 9500],
            14 => [6000, 7000, 9000, 10000],
            15 => [2800, 3500, 4700, 5200],
            16 => [8500, 9500, null, null],
            17 => [7000, 8000, 10000, 12000],
            18 => [14000, 16000, 20000, 22000],
            19 => [5500, 7000, 9000, 10000],
        ];

        $usdRate = 48.5;
        $eurRate = 53.0;

        foreach ($prices as $routeId => $vPrices) {
            $vehicleIds = [1, 2, 3, 4];
            foreach ($vehicleIds as $idx => $vId) {
                $egp = $vPrices[$idx];
                if ($egp !== null) {
                    DB::table('route_vehicle_prices')->updateOrInsert(
                        ['route_id' => $routeId, 'vehicle_id' => $vId],
                        [
                            'price_egp' => $egp,
                            'price_usd' => ceil($egp / $usdRate),
                            'price_eur' => ceil($egp / $eurRate),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }
    }
}
