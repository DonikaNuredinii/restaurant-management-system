<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index($firmId)
    {
        $payments = Payment::where('firm_id', $firmId)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($payments);
    }

    public function store(Request $request, $firmId)
    {
        $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'method' => 'nullable|string|max:50'
        ]);

        $payment = Payment::create([
            'firm_id' => $firmId,
            'date' => $request->date,
            'amount' => $request->amount,
            'method' => $request->method
        ]);

        return response()->json([
            'message' => 'Payment added successfully',
            'payment' => $payment
        ]);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'method' => 'nullable|string|max:50',
        ]);

        $payment->update([
            'date' => $request->date,
            'amount' => $request->amount,
            'method' => $request->method,
        ]);

        return response()->json([
            'message' => 'Payment updated successfully',
            'payment' => $payment,
        ]);
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
