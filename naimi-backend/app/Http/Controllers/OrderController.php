<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Firm;
use Illuminate\Http\Request;

class OrderController extends Controller
{

    public function index($firmId)
    {
        $orders = Order::where('firm_id', $firmId)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'date' => 'required|date',
            'persons' => 'required|integer|min:1',
            'price_per_person' => 'required|numeric|min:0',
        ]);

        $totalAmount = $request->persons * $request->price_per_person;

        $order->update([
            'date' => $request->date,
            'persons' => $request->persons,
            'price_per_person' => $request->price_per_person,
            'total_amount' => $totalAmount,
        ]);

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order,
        ]);
    }


    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }

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
