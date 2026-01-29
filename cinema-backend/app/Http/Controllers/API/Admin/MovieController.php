<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MovieController extends Controller
{
    public function index()
    {
        return response()->json(Movie::orderBy('created_at', 'desc')->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'poster_url' => 'nullable|string',
            'background_image_url' => 'nullable|string',
            'trailer_url' => 'nullable|string|max:255',
            'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'duration_minutes' => 'required|integer',
            'rating' => 'required|numeric',
            'genre' => 'nullable|array',
            'release_date' => 'required|date',
            'director' => 'nullable|string|max:255',
            'writers' => 'nullable|string|max:255',
            'status' => 'required|in:draft,now_showing,coming_soon',
            'content_rating' => 'nullable|string|max:20',
            'tagline' => 'nullable|string|max:255', // Experience Category
            'showtimes' => 'nullable|array',
            'showtimes.*.hall_id' => 'required|exists:halls,id',
            'showtimes.*.start_time' => 'required|date',
            'showtimes.*.end_time' => 'nullable|date',
        ]);

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster_url'] = asset('storage/' . $path);
        }

        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('backgrounds', 'public');
            $validated['background_image_url'] = asset('storage/' . $path);
        }

        unset($validated['poster'], $validated['background_image']);

        $validated['slug'] = Str::slug($validated['title']);
        // simple uniqueness check logic could be added here if needed

        $movie = Movie::create($validated);

        // Handle Showtimes
        if ($request->has('showtimes')) {
            foreach ($request->showtimes as $showtimeData) {
                // Calculate or use provided end_time
                $startTime = \Carbon\Carbon::parse($showtimeData['start_time']);
                if (isset($showtimeData['end_time'])) {
                    $endTime = \Carbon\Carbon::parse($showtimeData['end_time']);
                } else {
                    $endTime = $startTime->copy()->addMinutes((int) $movie->duration_minutes);
                }

                \App\Models\Showtime::create([
                    'movie_id' => $movie->id,
                    'hall_id' => $showtimeData['hall_id'],
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'price_matrix' => $showtimeData['price_matrix'] ?? null,
                ]);
            }
        }

        if ($movie->status !== 'draft') {
            try {
                \App\Events\MoviePublished::dispatch($movie);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Broadcasting failed: " . $e->getMessage());
            }
        }

        return response()->json($movie->load('showtimes'), 201);
    }

    public function show(string $id)
    {
        return response()->json(Movie::with('showtimes')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $movie = Movie::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'poster_url' => 'sometimes|string',
            'background_image_url' => 'sometimes|string',
            'trailer_url' => 'nullable|string|max:255',
            'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'duration_minutes' => 'sometimes|integer',
            'rating' => 'sometimes|numeric',
            'genre' => 'nullable|array',
            'release_date' => 'sometimes|date',
            'director' => 'nullable|string|max:255',
            'writers' => 'nullable|string|max:255',
            'status' => 'sometimes|in:draft,now_showing,coming_soon',
            'content_rating' => 'nullable|string|max:20',
            'tagline' => 'nullable|string|max:255',
            'showtimes' => 'nullable|array',
            'showtimes.*.hall_id' => 'required|exists:halls,id',
            'showtimes.*.start_time' => 'required|date',
            'showtimes.*.end_time' => 'nullable|date',
        ]);

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster_url'] = asset('storage/' . $path);
        }

        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('backgrounds', 'public');
            $validated['background_image_url'] = asset('storage/' . $path);
        }

        unset($validated['poster'], $validated['background_image']);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $movie->update($validated);

        // Handle Showtimes Update
        if ($request->has('showtimes')) {
            // Delete existing showtimes NOT in the request (simple replacement strategy for now, or just add new ones?)
            // A better approach for "Edit" is to replace all showtimes or manage them individually. 
            // For simplicity in this iteration: Delete all and re-create.
            $movie->showtimes()->delete();

            foreach ($request->showtimes as $showtimeData) {
                // Calculate or use provided end_time
                $startTime = \Carbon\Carbon::parse($showtimeData['start_time']);
                if (isset($showtimeData['end_time'])) {
                    $endTime = \Carbon\Carbon::parse($showtimeData['end_time']);
                } else {
                    $endTime = $startTime->copy()->addMinutes((int) $movie->duration_minutes);
                }

                \App\Models\Showtime::create([
                    'movie_id' => $movie->id,
                    'hall_id' => $showtimeData['hall_id'],
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'price_matrix' => $showtimeData['price_matrix'] ?? null,
                ]);
            }
        }

        return response()->json($movie->load('showtimes'));
    }

    public function destroy(string $id)
    {
        $movie = Movie::findOrFail($id);

        // Get all showtime IDs for this movie
        $showtimeIds = $movie->showtimes()->pluck('id');

        // Check if there are any bookings
        $hasBookings = \App\Models\Booking::whereIn('showtime_id', $showtimeIds)->exists();

        if ($hasBookings) {
            // If there are bookings, check if movie has future showtimes
            $hasFutureShowtimes = $movie->showtimes()
                ->where('start_time', '>', now())
                ->exists();

            if ($hasFutureShowtimes) {
                return response()->json([
                    'message' => 'Cannot delete this movie because it has existing bookings for upcoming showtimes. Please cancel all bookings first or wait until all showtimes have passed.'
                ], 422);
            }
        }

        // If no bookings OR all showtimes are in the past, we can delete
        $showtimeIds = $movie->showtimes()->pluck('id');

        if ($showtimeIds->isNotEmpty()) {
            // Delete tickets first
            \App\Models\Ticket::whereIn('booking_id', function ($query) use ($showtimeIds) {
                $query->select('id')
                    ->from('bookings')
                    ->whereIn('showtime_id', $showtimeIds);
            })->delete();

            // Delete bookings
            \App\Models\Booking::whereIn('showtime_id', $showtimeIds)->delete();

            // Delete showtimes
            $movie->showtimes()->delete();
        }

        // Finally delete the movie
        $movie->delete();

        return response()->json(['message' => 'Movie deleted successfully']);
    }
}
