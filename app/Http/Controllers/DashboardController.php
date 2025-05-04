<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function charts()
    {
        $user = auth()->user();

        $transactions = $user->transactions()->get();

        // Prepare chartData (same logic from your dashboard page)
        $chartData = $transactions->groupBy('date')->map(function ($group) {
            return [
                'date' => $group->first()->date,
                'income' => $group->where('type', 'income')->sum('amount'),
                'expense' => $group->where('type', 'expense')->sum('amount'),
            ];
        })->values();

        $monthlyData = $transactions->groupBy(function ($t) {
            return \Carbon\Carbon::parse($t->date)->format('Y-m');
        })->map(function ($group) {
            $income = $group->where('type', 'income')->sum('amount');
            $expense = $group->where('type', 'expense')->sum('amount');
            return [
                'month' => \Carbon\Carbon::parse($group->first()->date)->format('M Y'),
                'income' => $income,
                'expense' => $expense,
                'savings' => $income - $expense,
            ];
        })->values();

        $categoryData = $transactions->groupBy('category')->map(function ($group, $category) {
            return [
                'category' => $category ?? 'Uncategorized',
                'income' => $group->where('type', 'income')->sum('amount'),
                'expense' => $group->where('type', 'expense')->sum('amount'),
            ];
        })->values();

        return Inertia::render('charts', [
            'chartData' => $chartData,
            'monthlyData' => $monthlyData,
            'categoryData' => $categoryData,
        ]);
    }
}