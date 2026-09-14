<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Route::query()->where('show_in_catalog', true);

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $routes = $query->get()->map(fn ($r) => $r->toFrontendFormat());

        return response()->json([
            'success' => true,
            'data' => $routes,
            'routes' => $routes,
        ]);
    }

    public function show($id): JsonResponse
    {
        $route = Route::where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $route->toFrontendFormat(),
        ]);
    }
}
