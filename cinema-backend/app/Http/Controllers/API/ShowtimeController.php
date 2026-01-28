<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Showtime;
use App\Models\Ticket;
use Illuminate\Http\Request;

class ShowtimeController extends Controller
{
    public function index(Request $request)
    {
        // Typically fetching showtimes for a specific movie or cinema
        $query = Showtime::with(['movie', 'hall.cinema']);

        if ($request->has('movie_id')) {
            $query->where('movie_id', $request->movie_id);
        }

        if ($request->has('date')) {
            $query->whereDate('start_time', $request->date);
        }

        return response()->json($query->get());
    }

    public function show(string $id)
    {
        $showtime = Showtime::with(['movie', 'hall.cinema', 'hall.seats'])->findOrFail($id);

        // Get already booked/pending seats for this showtime
        $bookedSeatIds = Ticket::whereHas('booking', function ($query) use ($id) {
            $query->where('showtime_id', $id)
                ->whereIn('status', ['confirmed', 'pending']);
        })->pluck('seat_id');

        return response()->json([
            'showtime' => $showtime,
            'booked_seats' => $bookedSeatIds
        ]);
    }
}
