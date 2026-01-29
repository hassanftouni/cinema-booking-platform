<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\VerificationController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/email/resend', [VerificationController::class, 'resend']);
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

Route::prefix('admin')->name('admin.')->group(function () {
    Route::apiResource('movies', \App\Http\Controllers\API\Admin\MovieController::class);
    Route::get('halls', [\App\Http\Controllers\API\Admin\HallController::class, 'index']); // Added Route
    Route::apiResource('users', \App\Http\Controllers\API\Admin\UserController::class)->only(['index', 'update', 'destroy']);
    Route::apiResource('offers', \App\Http\Controllers\API\Admin\OfferController::class);
    Route::get('/contacts', [\App\Http\Controllers\API\ContactController::class, 'index'])->name('contacts.index');
    Route::get('/contacts/unread-count', [\App\Http\Controllers\API\ContactController::class, 'unreadCount'])->name('contacts.unread-count');
    Route::patch('/contacts/{id}/status', [\App\Http\Controllers\API\ContactController::class, 'updateStatus'])->name('contacts.update-status');

    // Booking Management
    Route::get('bookings', [\App\Http\Controllers\API\Admin\BookingController::class, 'index']);
    Route::delete('bookings/{id}', [\App\Http\Controllers\API\Admin\BookingController::class, 'destroy']);
});
