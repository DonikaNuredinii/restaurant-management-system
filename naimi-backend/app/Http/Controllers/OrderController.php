<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Firm;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // 🟢 Merr të gjitha porositë e një firme
    public function index($firmId)
    {
        $orders = Order::where('firm_id', $firmId)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($orders);
    }

    // 🟢 Krijo porosi të re
    public function store(Request $request, $firmId)
    {
        $request->validate([
            'date' => 'required|date',
            'persons' => 'required|integer|min:1',
            'price_per_person' => 'required|numeric|min:0',
        ]);

        $totalAmount = $request->persons * $request->price_per_person;

        $order = Order::create([
            'firm_id' => $firmId,
            'date' => $request->date,
            'persons' => $request->persons,
            'price_per_person' => $request->price_per_person,
            'total_amount' => $totalAmount,
        ]);

        return response()->json([
            'message' => 'Order added successfully',
            'order' => $order
        ]);
    }
}
