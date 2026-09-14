<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;

class VehicleController extends Controller
{
    public function index(): JsonResponse
    {
        $vehicles = Vehicle::query()
            ->orderBy('sort_order', 'asc')
            ->get()
            ->map(fn ($v) => $v->toFrontendFormat());

        return response()->json([
            'success' => true,
            'data' => $vehicles,
        ]);
    }
}
