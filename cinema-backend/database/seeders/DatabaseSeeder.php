<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Cinema;
use App\Models\SeatType;
use App\Models\Hall;
use App\Models\Seat;
use App\Models\Movie;
use App\Models\Showtime;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Main Tenant
        $tenant = Tenant::create([
            'name' => 'Cinema City',
            'domain' => 'cinemacity.test',
            'subscription_status' => 'active',
            'config' => ['theme' => 'luxury', 'currency' => 'USD'],
        ]);

        // 2. Create Seat Types
        $standard = SeatType::create([
            'tenant_id' => $tenant->id,
            'name' => 'Standard',
            'price_multiplier' => 1.00,
            'description' => 'Comfortable ergonomic seating.'
        ]);

        $vip = SeatType::create([
            'tenant_id' => $tenant->id,
            'name' => 'VIP',
            'price_multiplier' => 1.50,
            'description' => 'Premium luxury recliners with extra legroom.'
        ]);

        // 3. Create Cinema
        $cinema = Cinema::create([
            'tenant_id' => $tenant->id,
            'name' => 'Cinema City Beirut',
            'location' => 'Beirut Souks',
            'contact_email' => 'info@cinemacity.test',
        ]);

        // 4. Create Halls and Seats
        $this->createHallWithSeats($cinema, 'IMAX Hall 1', 10, 15, $standard, $vip);
        $this->createHallWithSeats($cinema, 'Standard Hall 2', 8, 12, $standard, null);
        $hall3 = $this->createHallWithSeats($cinema, 'VIP Lounge', 5, 8, $vip, $vip);

        // 5. Create Movies
        $dune = Movie::create([
            'tenant_id' => $tenant->id, // Optional depending on schema
            'title' => 'Dune: Part Two',
            'slug' => 'dune-part-two',
            'description' => 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge.',
            'poster_url' => 'https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?q=80&w=1200&auto=format&fit=crop',
            'duration_minutes' => 166,
            'rating' => 9.8,
            'genre' => ['Sci-Fi', 'Adventure'],
            'release_date' => '2024-03-01',
            'status' => 'published',
        ]);

        $oppenheimer = Movie::create([
            'tenant_id' => $tenant->id,
            'title' => 'Oppenheimer',
            'slug' => 'oppenheimer',
            'description' => 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
            'poster_url' => 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
            'duration_minutes' => 180,
            'rating' => 9.5,
            'genre' => ['Drama', 'History'],
            'release_date' => '2023-07-21',
            'status' => 'published',
        ]);

        // 6. Create Showtimes
        // Use first hall for simplicity since createHallWithSeats returns void/null in current impl, let's fix that or fetch.
        $hall = Hall::where('name', 'IMAX Hall 1')->first();

        if ($hall) {
            Showtime::create([
                'movie_id' => $dune->id,
                'hall_id' => $hall->id,
                'start_time' => now()->addHours(2), // Today + 2h
                'end_time' => now()->addHours(5),
                'price_matrix' => ['base' => 10],
            ]);

            Showtime::create([
                'movie_id' => $oppenheimer->id,
                'hall_id' => $hall->id,
                'start_time' => now()->addHours(6),
                'end_time' => now()->addHours(9),
                'price_matrix' => ['base' => 12],
            ]);
        }
    }

    private function createHallWithSeats($cinema, $name, $rows, $cols, $defaultType, $premiumType)
    {
        $hall = Hall::create([
            'cinema_id' => $cinema->id,
            'name' => $name,
            'capacity' => $rows * $cols,
            'seat_layout' => ['rows' => $rows, 'cols' => $cols],
        ]);

        $seats = [];
        for ($r = 0; $r < $rows; $r++) {
            $rowLabel = chr(65 + $r); // A, B, C...

            // Logic: Last 2 rows are Premium if available
            $type = ($premiumType && $r >= $rows - 2) ? $premiumType : $defaultType;

            for ($c = 1; $c <= $cols; $c++) {
                $seats[] = [
                    'id' => Str::uuid(),
                    'hall_id' => $hall->id,
                    'seat_type_id' => $type->id,
                    'row' => $rowLabel,
                    'number' => (string) $c,
                    'status' => 'available',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        Seat::insert($seats);

        return $hall;
    }
}
