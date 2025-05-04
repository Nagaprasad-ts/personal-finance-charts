import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';


import { format, parseISO } from 'date-fns';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];

export default function Home({ transactions }: { transactions: any }) {
    const { data, setData, post, reset } = useForm({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: '',
      });
    
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('transactions.store'), {
          onSuccess: () => reset(),
        });
    };

    const [budgetForm, setBudgetForm] = useState({ category: '', limit: '' });

    const submitBudget = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/budgets', budgetForm, {
        onSuccess: () => setBudgetForm({ category: '', limit: '' }),
    });
    };

    // Group transactions by date
    const chartData = Object.values(
        transactions.reduce((acc: any, txn: any) => {
          const date = txn.date;
          if (!acc[date]) {
            acc[date] = { date, income: 0, expense: 0 };
          }
          if (txn.type === 'income') {
            acc[date].income += parseFloat(txn.amount);
          } else {
            acc[date].expense += parseFloat(txn.amount);
          }
          return acc;
        }, {})
    ).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      

    // Group by month (e.g., '2025-05')
    const monthlyData = Object.values(
        transactions.reduce((acc: any, txn: any) => {
        const month = format(parseISO(txn.date), 'yyyy-MM');
        if (!acc[month]) {
            acc[month] = { month, income: 0, expense: 0 };
        }
        if (txn.type === 'income') {
            acc[month].income += parseFloat(txn.amount);
        } else {
            acc[month].expense += parseFloat(txn.amount);
        }
        return acc;
        }, {})
    ).map((entry: any) => ({
        ...entry,
        savings: entry.income - entry.expense,
    }));

    const categoryData = Object.values(
        transactions.reduce((acc: any, txn: any) => {
          const category = txn.category;
          if (!acc[category]) {
            acc[category] = { category, income: 0, expense: 0 };
          }
          if (txn.type === 'income') {
            acc[category].income += parseFloat(txn.amount);
          } else {
            acc[category].expense += parseFloat(txn.amount);
          }
          return acc;
        }, {})
    ).map((entry: any) => ({
        ...entry,
        savings: entry.income - entry.expense,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="mt-5">
                <div className="max-w-7xl p-6 mx-auto space-y-6">
                    <h1 className="text-2xl font-bold">Personal Finance Dashboard</h1>

                    <form onSubmit={submit} className="grid gap-4 grid-cols-2">
                        <div>
                        <Label>Title</Label>
                        <Input value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g., Rent" />
                        </div>

                        <div>
                        <Label>Amount</Label>
                        <Input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} placeholder="e.g., 1200" />
                        </div>

                        <div>
                        <Label>Type</Label>
                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>

                        <div>
                        <Label>Category</Label>
                        <Input value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="e.g., Food, Rent" />
                        </div>

                        <div className="col-span-2">
                        <Label>Date</Label>
                        <Input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                        </div>

                        <Button type="submit" className="col-span-2">Add Transaction</Button>
                    </form>

                    <div className="space-y-3">
                        {transactions.map((txn: any) => (
                        <div key={txn.id} className="p-4 border rounded-md shadow-sm flex justify-between items-center bg-white">
                            <div>
                                <div className="font-semibold">{txn.title}</div>
                                <div className="text-sm text-gray-500">{txn.category} • {txn.date}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className={`text-right font-medium ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {txn.type === 'income' ? '+' : '-'}₹{txn.amount}
                                </div>
                                <Button variant="ghost" size="icon" className="ml-2 h-[34px] w-[34px]">
                                    <Trash className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
