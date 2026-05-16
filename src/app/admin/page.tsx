'use client';

import { ShoppingBag, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

const stats = [
  { 
    name: 'Total Revenue', 
    value: '₹1,24,500', 
    change: '+12.5%', 
    trend: 'up',
    icon: TrendingUp, 
    color: 'from-emerald-500 to-teal-600',
    lightColor: 'bg-emerald-50 text-emerald-600'
  },
  { 
    name: 'Orders Today', 
    value: '24', 
    change: '+3', 
    trend: 'up',
    icon: ShoppingBag, 
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'bg-blue-50 text-blue-600'
  },
  { 
    name: 'Active Users', 
    value: '1,200', 
    change: '-2.4%', 
    trend: 'down',
    icon: Users, 
    color: 'from-purple-500 to-violet-600',
    lightColor: 'bg-purple-50 text-purple-600'
  },
  { 
    name: 'Low Stock', 
    value: '5', 
    change: 'Action Required', 
    trend: 'neutral',
    icon: Package, 
    color: 'from-orange-500 to-amber-600',
    lightColor: 'bg-orange-50 text-orange-600'
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h2>
        <p className="text-slate-500 font-medium text-sm">Welcome back, Ansarul! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div 
            key={stat.name} 
            className="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.lightColor} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                stat.trend === 'up' ? "bg-emerald-100 text-emerald-700" : 
                stat.trend === 'down' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
              )}>
                {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
              <h3 className="mt-1 text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
            
            {/* Background Decorative Gradient */}
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Orders</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">LATEST 10 TRANSACTIONS</p>
            </div>
            <button className="rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="pb-4 px-2">Order ID</th>
                  <th className="pb-4 px-2">Customer</th>
                  <th className="pb-4 px-2">Status</th>
                  <th className="pb-4 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: '#ORD-1234', customer: 'Ansarul', status: 'Paid', amount: '₹5,499', color: 'text-emerald-600 bg-emerald-50' },
                  { id: '#ORD-1235', customer: 'Rahul', status: 'Pending', amount: '₹1,299', color: 'text-amber-600 bg-amber-50' },
                  { id: '#ORD-1236', customer: 'Sumi', status: 'Shipped', amount: '₹2,850', color: 'text-blue-600 bg-blue-50' },
                  { id: '#ORD-1237', customer: 'Kabir', status: 'Paid', amount: '₹12,499', color: 'text-emerald-600 bg-emerald-50' },
                ].map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-2 text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{order.id}</td>
                    <td className="py-5 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-5 px-2">
                      <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tight", order.color)}>
                        <span className="mr-1.5 h-1 w-1 rounded-full bg-current" />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-5 px-2 text-right text-sm font-black text-slate-900">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Sellers Side Card */}
        <div className="rounded-3xl bg-slate-900 p-8 shadow-xl text-white overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="text-xl font-black tracking-tight mb-2">Top Performers</h3>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-8">THIS MONTH</p>
            
            <div className="space-y-6">
              {[
                { name: 'Pro-Mixer Master', category: 'Appliances', sales: 45, price: '₹12,999', iconColor: 'text-orange-400' },
                { name: 'Steel-Core Cookware', category: 'Cookware', sales: 32, price: '₹5,499', iconColor: 'text-blue-400' },
                { name: 'Silicone Utensil Set', category: 'Kitchenware', sales: 28, price: '₹1,499', iconColor: 'text-emerald-400' },
                { name: 'Power Blender X', category: 'Appliances', sales: 24, price: '₹8,999', iconColor: 'text-purple-400' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-4 group/item cursor-pointer">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white/10 transition-colors">
                    <Package className={cn("h-6 w-6", item.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate group-hover/item:text-orange-400 transition-colors">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.category}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-bold text-orange-500/80 uppercase tracking-wider">{item.sales} SALES</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-10 rounded-2xl bg-orange-500 py-4 text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 active:scale-95">
              Generate Report
            </button>
          </div>
          
          {/* Background Decorative Blob */}
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-all duration-700" />
        </div>
      </div>
    </div>
  );
}
