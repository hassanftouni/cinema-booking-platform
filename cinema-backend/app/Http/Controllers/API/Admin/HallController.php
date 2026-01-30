<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hall;
use Illuminate\Http\Request;

class HallController extends Controller
{
    public function index()
    {
        // Return all halls with their cinema info
        return response()->json(Hall::with('cinema')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cinema_id' => 'required|exists:cinemas,id',
            'name' => 'required|string|max:255',
            'rows' => 'required|integer|min:1|max:50',
            'cols' => 'required|integer|min:1|max:50',
            'seat_type_id' => 'nullable|exists:seat_types,id', // Optional, will fallback
        ]);

        $rows = (int) $validated['rows'];
        $cols = (int) $validated['cols'];
        $capacity = $rows * $cols;

        // Get or Create generic Seat Type
        $seatTypeId = $request->seat_type_id;
        if (!$seatTypeId) {
            $seatType = \App\Models\SeatType::first();
            if (!$seatType) {
                // Determine tenant from cinema
                $cinema = \App\Models\Cinema::find($validated['cinema_id']);
                $seatType = \App\Models\SeatType::create([
                    'tenant_id' => $cinema->tenant_id,
                    'name' => 'Standard',
                    'price_multiplier' => 1.0,
                    'description' => 'Standard Seat'
                ]);
            }
            $seatTypeId = $seatType->id;
        }

        $hall = Hall::create([
            'cinema_id' => $validated['cinema_id'],
            'name' => $validated['name'],
            'capacity' => $capacity,
            'seat_layout' => ['rows' => $rows, 'cols' => $cols],
        ]);

        // Generate Seats
        $seats = [];
        for ($r = 0; $r < $rows; $r++) {
            $rowLabel = chr(65 + $r); // A, B, C...
            for ($c = 1; $c <= $cols; $c++) {
                $seats[] = [
                    'id' => \Illuminate\Support\Str::uuid(),
                    'hall_id' => $hall->id,
                    'seat_type_id' => $seatTypeId,
                    'row' => $rowLabel,
                    'number' => (string) $c,
                    'status' => 'available',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        \App\Models\Seat::insert($seats);

        return response()->json($hall->load('cinema'), 201);
    }

    public function destroy(string $id)
    {
        $hall = Hall::findOrFail($id);

        // Remove related seats first? Cascade usually handles it but explicit is safer
        // Migration has cascadeOnDelete for foreign keys usually?
        // Let's rely on model interactions or raw deletes if needed.
        // Seats might not cascade if using softDeletes (not used here).

        // Check for future showtimes?
        // If hall has future showtimes, we should warn.

        $hall->delete();

        return response()->json(['message' => 'Hall deleted successfully']);
    }
}
