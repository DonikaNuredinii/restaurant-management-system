<?php

namespace App\Http\Controllers;

use App\Models\Firm;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class FirmController extends Controller
{
    // 🟢 Merr të gjitha firmat me totalet e tyre
    public function index()
    {
        $firms = Firm::with(['orders', 'payments'])->get()->map(function ($firm) {
            $totalOrders = $firm->orders->sum('total_amount');
            $totalPayments = $firm->payments->sum('amount');
            $debt = $totalOrders - $totalPayments;

            return [
                'id' => $firm->id,
                'name' => $firm->name,
                'phone' => $firm->phone,
                'address' => $firm->address,
                'total_orders' => $totalOrders,
                'total_payments' => $totalPayments,
                'debt' => $debt,
            ];
        });

        return response()->json($firms);
    }

    // 🟢 Krijo firmë të re
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
        ]);

        $firm = Firm::create($request->all());

        return response()->json(['message' => 'Firm created successfully', 'firm' => $firm]);
    }

    // 🟢 Merr detajet e një firme specifike
    public function show($id)
    {
        $firm = Firm::with(['orders', 'payments'])->findOrFail($id);
        return response()->json($firm);
    }

    // 🟢 Përditëso firmën
    public function update(Request $request, $id)
    {
        $firm = Firm::findOrFail($id);
        $firm->update($request->all());

        return response()->json(['message' => 'Firm updated successfully', 'firm' => $firm]);
    }

    // 🟢 Fshi firmën
    public function destroy($id)
    {
        $firm = Firm::findOrFail($id);
        $firm->delete();

        return response()->json(['message' => 'Firm deleted successfully']);
    }

    // 🟢 Raport Mujor për të gjitha firmat
public function monthlyReport(Request $request)
{
    $month = $request->query('month', now()->month);
    $year = $request->query('year', now()->year);

    $firms = Firm::with(['orders', 'payments'])->get()->map(function ($firm) use ($month, $year) {
        $monthlyOrders = $firm->orders
            ->whereBetween('date', ["$year-$month-01", "$year-$month-31"])
            ->sum('total_amount');

        $monthlyPayments = $firm->payments
            ->whereBetween('date', ["$year-$month-01", "$year-$month-31"])
            ->sum('amount');

        return [
            'id' => $firm->id,
            'name' => $firm->name,
            'total_orders' => $monthlyOrders,
            'total_payments' => $monthlyPayments,
            'debt' => $monthlyOrders - $monthlyPayments,
        ];
    });

    $grandTotal = $firms->sum('debt');

    return response()->json([
        'month' => $month,
        'year' => $year,
        'firms' => $firms,
        'grand_total_debt' => $grandTotal
    ]);
}


public function downloadMonthlyReport(Request $request)
{
    $month = $request->query('month', now()->month);
    $year = $request->query('year', now()->year);

    $firms = Firm::with(['orders', 'payments'])->get()->map(function ($firm) use ($month, $year) {
        $monthlyOrders = $firm->orders
            ->whereBetween('date', ["$year-$month-01", "$year-$month-31"])
            ->sum('total_amount');

        $monthlyPayments = $firm->payments
            ->whereBetween('date', ["$year-$month-01", "$year-$month-31"])
            ->sum('amount');

        return [
            'name' => $firm->name,
            'total_orders' => $monthlyOrders,
            'total_payments' => $monthlyPayments,
            'debt' => $monthlyOrders - $monthlyPayments,
        ];
    });

    $grandTotal = $firms->sum('debt');

    $pdf = Pdf::loadView('reports.monthly-report', [
        'firms' => $firms,
        'month' => $month,
        'year' => $year,
        'grandTotal' => $grandTotal,
    ]);

    return $pdf->download("Raporti_Mujor_{$month}_{$year}.pdf");
}


}
