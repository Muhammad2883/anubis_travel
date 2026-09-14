<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'routeId' => 'required|integer',
            'vehicleSlug' => 'required|string',
            'isFarHotel' => 'nullable|boolean',
            'passengers' => 'nullable|integer',
        ]);

        $route = Route::findOrFail($validated['routeId']);
        $vehicleSlug = $validated['vehicleSlug'];
        $isFarHotel = $validated['isFarHotel'] ?? false;

        $prices = $route->prices ?? [];
        $basePrice = $prices[$vehicleSlug] ?? 0;

        if ($basePrice === null || $basePrice === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Selected vehicle is not available for this route.',
            ], 422);
        }

        $farHotelSurcharge = $isFarHotel ? 150 : 0;
        $totalEgp = $basePrice + $farHotelSurcharge;
        $usdRate = 50.0; // Standard USD peg/rate
        $totalUsd = round($totalEgp / $usdRate, 2);

        return response()->json([
            'success' => true,
            'data' => [
                'basePriceEgp' => $basePrice,
                'farHotelSurchargeEgp' => $farHotelSurcharge,
                'totalEgp' => $totalEgp,
                'totalUsd' => $totalUsd,
                'currency' => 'EGP',
                'exchangeRate' => $usdRate,
            ],
        ]);
    }
}
