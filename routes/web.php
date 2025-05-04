<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DashboardController;

// Route::get('/', function () {
//     return Inertia::render('dashboard');
// })->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [TransactionController::class, 'index'])->name('home');
    Route::get('/charts', [DashboardController::class, 'charts'])->name('charts');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
