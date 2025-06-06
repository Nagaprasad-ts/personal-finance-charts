<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'amount', 'type', 'category', 'date', 'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
