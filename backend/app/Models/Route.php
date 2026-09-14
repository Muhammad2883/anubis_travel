<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
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
        'prices',
        'image_url',
        'rating',
        'reviews_count',
        'highlights',
        'itinerary',
        'inclusions',
        'exclusions',
        'is_popular',
        'show_in_catalog',
    ];

    protected $casts = [
        'prices' => 'array',
        'highlights' => 'array',
        'itinerary' => 'array',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'is_popular' => 'boolean',
        'show_in_catalog' => 'boolean',
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
            'estimatedDuration' => [
                'ar' => $this->duration_ar,
                'en' => $this->duration_en,
            ],
            'prices' => $this->prices ?? ['sedan' => 0, '7seater' => 0, 'h1' => null, 'hiace' => null],
            'imageUrl' => $this->image_url,
            'rating' => (float) ($this->rating ?? 5.0),
            'reviewsCount' => $this->reviews_count ?? 0,
            'highlights' => $this->highlights ?? ['ar' => [], 'en' => []],
            'itinerary' => $this->itinerary ?? [],
            'inclusions' => $this->inclusions ?? ['ar' => [], 'en' => []],
            'exclusions' => $this->exclusions ?? ['ar' => [], 'en' => []],
            'isPopular' => $this->is_popular,
            'showInCatalog' => $this->show_in_catalog,
        ];
    }
}
