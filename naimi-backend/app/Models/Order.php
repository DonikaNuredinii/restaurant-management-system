<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
    'firm_id', 'date', 'persons', 'price_per_person', 'total_amount'
];

    public function firm() {
    return $this->belongsTo(Firm::class);
}

}
