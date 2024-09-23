<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddedOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id', 'product_id', 'description', 'offer_name',
    ];
    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
