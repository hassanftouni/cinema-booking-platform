<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Showtime;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'showtime_id' => 'required|exists:showtimes,id',
            'seat_ids' => 'required|array|min:1',
            'seat_ids.*' => 'exists:seats,id',
        ]);

        $showtime = Showtime::with(['hall', 'movie'])->findOrFail($request->showtime_id);
        $tenantId = $showtime->hall->cinema->tenant_id ?? DB::table('tenants')->first()->id;

        // Check if any seat is already booked for this showtime
        $alreadyBooked = Ticket::whereIn('seat_id', $request->seat_ids)
            ->whereHas('booking', function ($query) use ($request) {
                $query->where('showtime_id', $request->showtime_id)
                    ->whereIn('status', ['confirmed', 'pending']);
            })->exists();

        if ($alreadyBooked) {
            return response()->json(['message' => 'One or more selected seats are already booked.'], 422);
        }

        // Dummy price calculation (could be more complex if using seat type prices)
        // Let's assume a flat price from price_matrix or a default
        $basePrice = 12.50; // default fallback
        if (isset($showtime->price_matrix['standard'])) {
            $basePrice = $showtime->price_matrix['standard'];
        }

        try {
            return DB::transaction(function () use ($request, $showtime, $basePrice, $tenantId) {
                $booking = Booking::create([
                    'tenant_id' => $tenantId,
                    'user_id' => auth()->id(),
                    'showtime_id' => $showtime->id,
                    'total_price' => $basePrice * count($request->seat_ids),
                    'status' => 'confirmed', // skipping actual payment for now
                    'qr_code' => Str::random(32),
                ]);

                foreach ($request->seat_ids as $seatId) {
                    Ticket::create([
                        'booking_id' => $booking->id,
                        'seat_id' => $seatId,
                        'price' => $basePrice,
                        'status' => 'valid',
                    ]);
                }

                return response()->json($booking->load('tickets.seat'), 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Booking failed: ' . $e->getMessage()], 500);
        }
    }

    public function userBookings()
    {
        $bookings = Booking::with(['showtime.movie', 'tickets.seat', 'showtime.hall.cinema'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }
}
