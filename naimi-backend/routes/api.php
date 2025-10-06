<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FirmController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Këtu regjistrohen të gjitha API-t që do përdor React Dashboard.
|
*/

// Ky route është default për sanctum (mund ta lësh)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 📦 Routes për Firm
Route::get('/firms', [FirmController::class, 'index']);
Route::post('/firms', [FirmController::class, 'store']);
Route::get('/firms/{id}', [FirmController::class, 'show']);
Route::put('/firms/{id}', [FirmController::class, 'update']);
Route::delete('/firms/{id}', [FirmController::class, 'destroy']);

// 📦 Routes për Orders
Route::get('/firms/{id}/orders', [OrderController::class, 'index']);
Route::post('/firms/{id}/orders', [OrderController::class, 'store']);

// 📦 Routes për Payments
Route::get('/firms/{id}/payments', [PaymentController::class, 'index']);
Route::post('/firms/{id}/payments', [PaymentController::class, 'store']);

Route::get('/monthly-report', [FirmController::class, 'monthlyReport']);
Route::get('/monthly-report/pdf', [FirmController::class, 'downloadMonthlyReport']);
// 📦 Update & Delete për Orders dhe Payments
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

Route::put('/payments/{id}', [PaymentController::class, 'update']);
Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);


