<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name_ar',
        'name_en',
        'passenger_capacity',
        'luggage_capacity',
        'features',
        'image_url',
        'badge_ar',
        'badge_en',
        'requires_advance_notice_days',
        'models',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'models' => 'array',
        'passenger_capacity' => 'integer',
        'luggage_capacity' => 'integer',
        'requires_advance_notice_days' => 'integer',
    ];

    public function toFrontendFormat(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => [
                'ar' => $this->name_ar,
                'en' => $this->name_en,
            ],
            'passenger_capacity' => $this->passenger_capacity,
            'luggage_capacity' => $this->luggage_capacity,
            'features' => $this->features ?? ['ar' => [], 'en' => []],
            'image_url' => $this->image_url,
            'badge' => $this->badge_ar ? [
                'ar' => $this->badge_ar,
                'en' => $this->badge_en,
            ] : null,
            'requiresAdvanceNoticeDays' => $this->requires_advance_notice_days,
            'models' => $this->models ?? [],
        ];
    }
}
