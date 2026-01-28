<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use App\Events\ContactSubmitted;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        // Notify Admin (Real-time) - Wrapped in try-catch to prevent crash if Reverb is down
        try {
            event(new ContactSubmitted($contact));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Broadcasting failed: " . $e->getMessage());
        }

        return response()->json(['message' => 'Your message has been sent successfully. We will contact you soon.'], 201);
    }

    public function index()
    {
        return response()->json(Contact::orderBy('created_at', 'desc')->paginate(20));
    }

    public function unreadCount()
    {
        $count = Contact::where('status', 'unread')->count();
        return response()->json(['count' => $count]);
    }

    public function updateStatus(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->update(['status' => $request->status]);
        return response()->json($contact);
    }
}
