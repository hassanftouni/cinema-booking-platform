<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'domain',
        'subscription_status',
        'config',
    ];

    protected $casts = [
        'config' => 'array',
    ];

    public function cinemas(): HasMany
    {
        return $this->hasMany(Cinema::class);
    }

    public function seatTypes(): HasMany
    {
        return $this->hasMany(SeatType::class);
    }
}
