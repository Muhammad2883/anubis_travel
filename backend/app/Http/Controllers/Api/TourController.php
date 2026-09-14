<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TourController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tour::query()->where('is_active', true);

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $tours = $query->get()->map(fn ($t) => $t->toFrontendFormat());

        return response()->json([
            'success' => true,
            'data' => $tours,
        ]);
    }

    public function featured(): JsonResponse
    {
        $tours = Tour::where('is_active', true)
            ->where('is_featured', true)
            ->get()
            ->map(fn ($t) => $t->toFrontendFormat());

        return response()->json([
            'success' => true,
            'data' => $tours,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $tour = Tour::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? $slug : 0)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $tour->toFrontendFormat(),
        ]);
    }
}
