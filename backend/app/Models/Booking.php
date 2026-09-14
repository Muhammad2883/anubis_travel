<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference',
        'type',
        'item_id',
        'item_name',
        'customer_name',
        'customer_phone',
        'customer_email',
        'flight_number',
        'pickup_date',
        'pickup_time',
        'pickup_location',
        'dropoff_location',
        'selected_vehicle',
        'is_far_hotel',
        'passengers_count',
        'luggage_count',
        'total_amount',
        'currency',
        'notes',
        'status',
        'payment_status',
        'booking_method',
        'source',
    ];

    protected $casts = [
        'is_far_hotel' => 'boolean',
        'passengers_count' => 'integer',
        'luggage_count' => 'integer',
        'total_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->booking_reference)) {
                $booking->booking_reference = 'ANB-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
            }
            if (empty($booking->status)) {
                $booking->status = 'pending';
            }
        });
    }

    public function toFrontendFormat(): array
    {
        return [
            'id' => $this->id,
            'bookingReference' => $this->booking_reference,
            'type' => $this->type,
            'itemId' => $this->item_id,
            'itemName' => $this->item_name,
            'customerName' => $this->customer_name,
            'customerPhone' => $this->customer_phone,
            'customerEmail' => $this->customer_email,
            'flightNumber' => $this->flight_number,
            'pickupDate' => $this->pickup_date,
            'pickupTime' => $this->pickup_time,
            'pickupLocation' => $this->pickup_location,
            'dropoffLocation' => $this->dropoff_location,
            'selectedVehicle' => $this->selected_vehicle,
            'isFarHotel' => (bool) $this->is_far_hotel,
            'passengersCount' => $this->passengers_count,
            'luggageCount' => $this->luggage_count,
            'totalAmount' => (float) $this->total_amount,
            'currency' => $this->currency ?? 'EGP',
            'notes' => $this->notes,
            'status' => $this->status,
            'paymentStatus' => $this->payment_status ?? 'unpaid',
            'bookingMethod' => $this->booking_method ?? 'website',
            'source' => $this->source,
            'createdAt' => $this->created_at?->format('Y-m-d H:i') ?? date('Y-m-d H:i'),
        ];
    }
}
