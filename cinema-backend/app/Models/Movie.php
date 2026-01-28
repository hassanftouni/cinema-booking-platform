<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Movie extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'poster_url',
        'trailer_url',
        'duration_minutes',
        'rating',
        'genre',
        'release_date',
        'director',
        'writers',
        'status',
        'content_rating',
        'tenant_id'
    ];

    protected $casts = [
        'genre' => 'array',
        'release_date' => 'date',
    ];

    public function showtimes(): HasMany
    {
        return $this->hasMany(Showtime::class);
    }
}
