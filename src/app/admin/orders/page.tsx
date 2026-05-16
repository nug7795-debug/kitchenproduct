'use client';

import * as React from 'react';
import { ShoppingBag, Eye, CheckCircle, Clock, Truck, XCircle, Search, Filter, ArrowUpRight, User, MoreHorizontal, Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

const orders = [
  { id: 'ORD-1234', customer: 'Ansarul K.', email: 'ansarul@example.com', date: '2024-05-13', status: 'paid', amount: '₹5,499', items: 2 },
  { id: 'ORD-1235', customer: 'Rahul Sharma', email: 'rahul@example.com', date: '2024-05-13', status: 'pending', amount: '₹1,299', items: 1 },
  { id: 'ORD-1236', customer: 'Sneha Rao', email: 'sneha@example.com', date: '2024-05-12', status: 'shipped', amount: '₹12,999', items: 3 },
  { id: 'ORD-1237', customer: 'Amit Singh', email: 'amit@example.com', date: '2024-05-12', status: 'delivered', amount: '₹3,899', items: 1 },
];

const statusConfig = {
  paid: { style: 'bg-green-100 text-green-700 shadow-green-100/50', icon: CheckCircle },
  pending: { style: 'bg-amber-100 text-amber-700 shadow-amber-100/50', icon: Clock },
  shipped: { style: 'bg-blue-100 text-blue-700 shadow-blue-100/50', icon: Truck },
  delivered: { style: 'bg-slate-100 text-slate-700 shadow-slate-100/50', icon: CheckCircle },
  cancelled: { style: 'bg-red-100 text-red-700 shadow-red-100/50', icon: XCircle },
};

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Fulfillment</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Track real-time transactions and delivery status</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full h-11 px-6 border-2 font-black text-xs tracking-widest uppercase">
            <Download className="mr-2 h-4 w-4" /> Export Ledger
          </Button>
          <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 font-black shadow-xl shadow-slate-200">
             Process All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Revenue', value: '₹48,290', trend: '+18%', icon: ShoppingBag, color: 'bg-orange-500' },
           { label: 'Active Shipments', value: '14 Orders', trend: 'Live', icon: Truck, color: 'bg-blue-600' },
           { label: 'Pending Payouts', value: '₹5,120', trend: 'Audit', icon: Clock, color: 'bg-amber-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
              <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                  <stat.icon className="h-7 w-7" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className="ml-auto bg-slate-50 px-2 py-1 rounded-lg text-[9px] font-black text-slate-400">
                  {stat.trend}
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search orders by ID, name or email..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-orange-500 transition-all" />
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" className="rounded-full text-[10px] font-black tracking-widest uppercase"><Filter className="h-3 w-3 mr-2" /> More Filters</Button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-[0.15em]">
              <tr>
                <th className="px-8 py-5">Order Reference</th>
                <th className="px-8 py-5">Customer Profile</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Transaction</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => {
                const config = statusConfig[order.status as keyof typeof statusConfig];
                return (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                         {order.id} <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-slate-900 transition-colors" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest mt-1">
                        <Clock className="h-3 w-3" /> {order.date}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                             <User className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="font-black text-slate-800 tracking-tight leading-none">{order.customer}</p>
                             <p className="text-[10px] text-slate-400 font-bold lowercase mt-1">{order.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm", config.style)}>
                        <config.icon className="h-3 w-3" />
                        {order.status}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="font-black text-slate-900">{order.amount}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{order.items} SKU Items</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 hover:shadow-sm transition-all"><Eye className="h-4 w-4" /></button>
                        <button className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 hover:shadow-sm transition-all"><MoreHorizontal className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
