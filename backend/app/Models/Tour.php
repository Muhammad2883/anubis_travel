<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'category',
        'title_ar',
        'title_en',
        'subtitle_ar',
        'subtitle_en',
        'overview_ar',
        'overview_en',
        'duration_ar',
        'duration_en',
        'base_price_egp',
        'rating',
        'reviews_count',
        'image_url',
        'highlights',
        'itinerary',
        'inclusions',
        'exclusions',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'highlights' => 'array',
        'itinerary' => 'array',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'base_price_egp' => 'decimal:2',
        'rating' => 'decimal:1',
        'reviews_count' => 'integer',
    ];

    public function toFrontendFormat(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'category' => $this->category,
            'title' => [
                'ar' => $this->title_ar,
                'en' => $this->title_en,
            ],
            'subtitle' => [
                'ar' => $this->subtitle_ar,
                'en' => $this->subtitle_en,
            ],
            'overview' => [
                'ar' => $this->overview_ar,
                'en' => $this->overview_en,
            ],
            'duration' => [
                'ar' => $this->duration_ar,
                'en' => $this->duration_en,
            ],
            'basePriceEgp' => (float) $this->base_price_egp,
            'rating' => (float) $this->rating,
            'reviewsCount' => $this->reviews_count,
            'imageUrl' => $this->image_url,
            'highlights' => $this->highlights ?? ['ar' => [], 'en' => []],
            'itinerary' => $this->itinerary ?? [],
            'inclusions' => $this->inclusions ?? ['ar' => [], 'en' => []],
            'exclusions' => $this->exclusions ?? ['ar' => [], 'en' => []],
            'isFeatured' => $this->is_featured,
        ];
    }
}
