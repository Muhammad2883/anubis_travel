<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Booking::query()->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_reference', 'ilike', "%{$search}%")
                  ->orWhere('customer_name', 'ilike', "%{$search}%")
                  ->orWhere('customer_phone', 'ilike', "%{$search}%");
            });
        }

        $bookings = $query->get()->map(fn ($b) => $b->toFrontendFormat());

        return response()->json([
            'success' => true,
            'data' => $bookings,
            'bookings' => $bookings,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'nullable|string|in:transfer,tour',
            'itemId' => 'nullable|integer',
            'itemName' => 'required|string',
            'customerName' => 'required|string|max:255',
            'customerPhone' => 'required|string|max:50',
            'customerEmail' => 'nullable|email|max:255',
            'flightNumber' => 'nullable|string|max:50',
            'pickupDate' => 'required|string',
            'pickupTime' => 'required|string',
            'pickupLocation' => 'required|string',
            'dropoffLocation' => 'nullable|string',
            'selectedVehicle' => 'nullable|string',
            'isFarHotel' => 'nullable|boolean',
            'passengersCount' => 'nullable|integer',
            'luggageCount' => 'nullable|integer',
            'totalAmount' => 'required|numeric',
            'currency' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
            'bookingMethod' => 'nullable|string',
            'source' => 'nullable|string',
        ]);

        $booking = Booking::create([
            'type' => $validated['type'] ?? 'transfer',
            'item_id' => $validated['itemId'] ?? 0,
            'item_name' => $validated['itemName'],
            'customer_name' => $validated['customerName'],
            'customer_phone' => $validated['customerPhone'],
            'customer_email' => $validated['customerEmail'] ?? null,
            'flight_number' => $validated['flightNumber'] ?? null,
            'pickup_date' => $validated['pickupDate'],
            'pickup_time' => $validated['pickupTime'],
            'pickup_location' => $validated['pickupLocation'],
            'dropoff_location' => $validated['dropoffLocation'] ?? null,
            'selected_vehicle' => $validated['selectedVehicle'] ?? null,
            'is_far_hotel' => $validated['isFarHotel'] ?? false,
            'passengers_count' => $validated['passengersCount'] ?? 1,
            'luggage_count' => $validated['luggageCount'] ?? 0,
            'total_amount' => $validated['totalAmount'],
            'currency' => $validated['currency'] ?? 'EGP',
            'notes' => $validated['notes'] ?? null,
            'booking_method' => $validated['bookingMethod'] ?? 'website',
            'source' => $validated['source'] ?? 'Website Form',
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'data' => $booking->toFrontendFormat(),
            'booking' => $booking->toFrontendFormat(),
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $booking = Booking::where('id', $id)
            ->orWhere('booking_reference', $id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $booking->toFrontendFormat(),
        ]);
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,in_progress,completed,cancelled',
        ]);

        $booking = Booking::where('id', $id)
            ->orWhere('booking_reference', $id)
            ->firstOrFail();

        $booking->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $booking->toFrontendFormat(),
        ]);
    }
}
