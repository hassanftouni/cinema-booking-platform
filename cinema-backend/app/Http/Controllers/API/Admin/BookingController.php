<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'showtime.movie', 'tickets.seat'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($bookings);
    }

    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);

        // Delete associated tickets first
        $booking->tickets()->delete();

        // Delete the booking
        $booking->delete();

        return response()->json(['message' => 'Booking cancelled successfully']);
    }
}
