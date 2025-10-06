<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = ['firm_id', 'date', 'amount', 'method'];
    public function firm() {
    return $this->belongsTo(Firm::class);
}

}
