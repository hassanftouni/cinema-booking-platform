<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'Cinema API is running',
        'version' => '1.0.0',
        'documentation' => 'Use /api endpoint'
    ]);
});
