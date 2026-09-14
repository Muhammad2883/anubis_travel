<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ANUBIS TRAVEL - API ROUTES (Laravel 11)
|--------------------------------------------------------------------------
| These routes provide endpoints for the Next.js Frontend.
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'ANUBIS Travel Backend API',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Tours Endpoints
Route::get('/tours', [TourController::class, 'index']);
Route::get('/tours/featured', [TourController::class, 'featured']);
Route::get('/tours/{slug}', [TourController::class, 'show']);

// Routes & Transfers Endpoints
Route::get('/routes', [RouteController::class, 'index']);
Route::get('/routes/{id}', [RouteController::class, 'show']);

// Fleet & Vehicles Endpoints
Route::get('/vehicles', [VehicleController::class, 'index']);

// Bookings Endpoints
Route::get('/bookings', [BookingController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);
Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus']);

// Pricing Calculation Engine
Route::post('/pricing/calculate', [PricingController::class, 'calculate']);
