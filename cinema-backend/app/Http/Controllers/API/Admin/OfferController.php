<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Offer;
use Illuminate\Support\Str;

class OfferController extends Controller
{
    public function index()
    {
        return response()->json(Offer::orderBy('created_at', 'desc')->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string',
            'discount_code' => 'nullable|string|max:50',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'expires_at' => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);

        // Handle is_active explicitly from FormData
        $isActive = $request->input('is_active');
        $validated['is_active'] = ($isActive === 'true' || $isActive === '1' || $isActive === true || $isActive === null);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('offers', 'public');
            $validated['image_url'] = $path;
        }

        $offer = Offer::create($validated);

        return response()->json($offer, 201);
    }

    public function update(Request $request, string $id)
    {
        $offer = Offer::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string',
            'discount_code' => 'nullable|string|max:50',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'expires_at' => 'nullable|date',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        }

        if ($request->has('is_active')) {
            $isActive = $request->input('is_active');
            $validated['is_active'] = ($isActive === 'true' || $isActive === '1' || $isActive === true);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('offers', 'public');
            $validated['image_url'] = $path;
        }

        $offer->update($validated);

        return response()->json($offer);
    }

    public function destroy(string $id)
    {
        $offer = Offer::findOrFail($id);
        $offer->delete();

        return response()->json(null, 204);
    }
}
