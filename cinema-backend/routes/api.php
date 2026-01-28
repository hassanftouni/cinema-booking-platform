<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/bookings', [\App\Http\Controllers\API\BookingController::class, 'store']);
    Route::get('/user/bookings', [\App\Http\Controllers\API\BookingController::class, 'userBookings']);
});

Route::apiResource('movies', \App\Http\Controllers\API\MovieController::class)->only(['index', 'show']);
Route::apiResource('showtimes', \App\Http\Controllers\API\ShowtimeController::class)->only(['index', 'show']);
Route::get('/offers', [\App\Http\Controllers\API\OfferController::class, 'index']);
Route::get('/offers/{id}', [\App\Http\Controllers\API\OfferController::class, 'show']);

Route::get('/cinemas', [\App\Http\Controllers\API\CinemaController::class, 'index']);
Route::get('/cinemas/{id}', [\App\Http\Controllers\API\CinemaController::class, 'show']);

Route::post('/contact', [\App\Http\Controllers\API\ContactController::class, 'store']);

Route::prefix('admin')->group(function () {
    Route::apiResource('movies', \App\Http\Controllers\API\Admin\MovieController::class);
    Route::apiResource('users', \App\Http\Controllers\API\Admin\UserController::class)->only(['index', 'update', 'destroy']);
    Route::apiResource('offers', \App\Http\Controllers\API\Admin\OfferController::class);
    Route::get('/contacts', [\App\Http\Controllers\API\ContactController::class, 'index']);
    Route::get('/contacts/unread-count', [\App\Http\Controllers\API\ContactController::class, 'unreadCount']);
    Route::patch('/contacts/{id}/status', [\App\Http\Controllers\API\ContactController::class, 'updateStatus']);
});
