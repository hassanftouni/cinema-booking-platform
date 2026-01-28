<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cinema;
use Illuminate\Http\Request;

class CinemaController extends Controller
{
    public function index()
    {
        $cinemas = Cinema::with('halls')->get();
        return response()->json($cinemas);
    }

    public function show(string $id)
    {
        $cinema = Cinema::with('halls.showtimes.movie')->findOrFail($id);
        return response()->json($cinema);
    }
}
