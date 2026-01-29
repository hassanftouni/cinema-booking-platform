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
}
