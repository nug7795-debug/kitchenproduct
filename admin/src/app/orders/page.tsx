'use client';

import * as React from 'react';
import { ShoppingBag, Eye, CheckCircle, Clock, Truck, XCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const statusStyles = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (full_name),
          order_items (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      alert(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-slate-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-10 bg-slate-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {searchTerm ? `No orders matching "${searchTerm}"` : 'No orders found.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold uppercase">{order.id.slice(0, 8)}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{order.profiles?.full_name || 'Guest'}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", statusStyles[order.status as keyof typeof statusStyles])}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">Order Items</td>
                    <td className="px-6 py-4 font-bold">₹{order.total_amount}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-green-600" 
                          title="Mark as Paid"
                          onClick={() => handleStatusUpdate(order.id, 'paid')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-orange-600" 
                          title="Mark as Shipped"
                          onClick={() => handleStatusUpdate(order.id, 'shipped')}
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
