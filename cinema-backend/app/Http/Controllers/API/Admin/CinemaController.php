<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cinema;
use App\Models\Tenant;
use Illuminate\Http\Request;

class CinemaController extends Controller
{
    public function index()
    {
        return response()->json(Cinema::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'contact_email' => 'nullable|email',
        ]);

        // Assign to first tenant found (Assuming single tenant usage for now)
        $tenant = Tenant::first();
        if (!$tenant) {
            // Fallback: Create a default tenant if none exists (Safety for broken demos)
            $tenant = Tenant::create([
                'name' => 'Default Organization',
                'domain' => 'default.local',
                'subscription_status' => 'active',
            ]);
        }

        $validated['tenant_id'] = $tenant->id;

        $cinema = Cinema::create($validated);

        return response()->json($cinema, 201);
    }

    public function update(Request $request, string $id)
    {
        $cinema = Cinema::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'contact_email' => 'nullable|email',
        ]);

        $cinema->update($validated);

        return response()->json($cinema);
    }

    public function destroy(string $id)
    {
        $cinema = Cinema::findOrFail($id);
        $cinema->delete();

        return response()->json(['message' => 'Cinema deleted successfully']);
    }
}
