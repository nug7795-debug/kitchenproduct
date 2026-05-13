'use client';

import * as React from 'react';
import { ShoppingBag, Eye, CheckCircle, Clock, Truck, XCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const orders = [
  { id: 'ORD-1234', customer: 'Ansarul', date: '2024-05-13', status: 'paid', amount: '₹5,499', items: 2 },
  { id: 'ORD-1235', customer: 'Rahul', date: '2024-05-13', status: 'pending', amount: '₹1,299', items: 1 },
  { id: 'ORD-1236', customer: 'Sneha', date: '2024-05-12', status: 'shipped', amount: '₹12,999', items: 3 },
  { id: 'ORD-1237', customer: 'Amit', date: '2024-05-12', status: 'delivered', amount: '₹3,899', items: 1 },
];

const statusStyles = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Manage and track all customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button className="rounded-full bg-slate-900">Export CSV</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by Order ID or Customer..." 
          className="w-full rounded-full border p-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">{order.id}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {order.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", statusStyles[order.status as keyof typeof statusStyles])}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{order.items} items</td>
                  <td className="px-6 py-4 font-bold">{order.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600"><CheckCircle className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600"><Truck className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
