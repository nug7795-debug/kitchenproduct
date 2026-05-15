'use client';

import * as React from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const [stats, setStats] = React.useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    activeProducts: 0
  });
  const [loading, setLoading] = React.useState(true);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, profilesRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('total_amount', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' })
      ]);

      const totalSales = ordersRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalSales,
        totalOrders: ordersRes.count || 0,
        totalUsers: profilesRes.count || 0,
        activeProducts: productsRes.count || 0
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', trend: '+12%', up: true },
    { name: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+5%', up: true },
    { name: 'Active Customers', value: stats.totalUsers.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+18%', up: true },
    { name: 'Products Live', value: stats.activeProducts.toString(), icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100', trend: 'Stable', up: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground">Detailed overview of your store performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", card.bg)}>
                <card.icon className={cn("h-6 w-6", card.color)} />
              </div>
              <div className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full", card.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                {card.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {card.trend}
              </div>
            </div>
            <div className="text-2xl font-bold">{loading ? '...' : card.value}</div>
            <div className="text-sm text-muted-foreground">{card.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Sales Overview</h3>
            <Button variant="outline" size="sm" className="rounded-full">Monthly</Button>
          </div>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-slate-50 text-muted-foreground italic">
            Sales chart will be integrated soon...
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Top Selling Categories</h3>
            <Button variant="outline" size="sm" className="rounded-full">All Time</Button>
          </div>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-slate-50 text-muted-foreground italic">
            Category distribution chart will be integrated soon...
          </div>
        </div>
      </div>
    </div>
  );
}
