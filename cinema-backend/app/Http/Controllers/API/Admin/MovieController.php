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
            'poster_url' => 'nullable|string', // make optional if uploading
            'trailer_url' => 'nullable|string|max:255',
            'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'duration_minutes' => 'required|integer',
            'rating' => 'required|numeric',
            'genre' => 'nullable|array',
            'release_date' => 'required|date',
            'director' => 'nullable|string|max:255',
            'writers' => 'nullable|string|max:255',
            'status' => 'required|in:draft,now_showing,coming_soon',
            'content_rating' => 'nullable|string|max:20',
        ]);

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster_url'] = asset('storage/' . $path);
        }

        unset($validated['poster']); // Remove file object from creation data

        $validated['slug'] = Str::slug($validated['title']);
        // simple uniqueness check logic could be added here if needed

        $movie = Movie::create($validated);

        if ($movie->status !== 'draft') {
            try {
                \App\Events\MoviePublished::dispatch($movie);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Broadcasting failed: " . $e->getMessage());
            }
        }

        return response()->json($movie, 201);
    }

    public function show(string $id)
    {
        return response()->json(Movie::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $movie = Movie::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'poster_url' => 'sometimes|string',
            'trailer_url' => 'nullable|string|max:255',
            'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'duration_minutes' => 'sometimes|integer',
            'rating' => 'sometimes|numeric',
            'genre' => 'nullable|array',
            'release_date' => 'sometimes|date',
            'director' => 'nullable|string|max:255',
            'writers' => 'nullable|string|max:255',
            'status' => 'sometimes|in:draft,now_showing,coming_soon',
            'content_rating' => 'nullable|string|max:20',
        ]);

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster_url'] = asset('storage/' . $path);
        }

        unset($validated['poster']);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $movie->update($validated);

        return response()->json($movie);
    }

    public function destroy(string $id)
    {
        $movie = Movie::findOrFail($id);
        $movie->delete();

        return response()->json(['message' => 'Movie deleted successfully']);
    }
}
