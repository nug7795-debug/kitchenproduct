'use client';

import * as React from 'react';
import { 
  ShoppingBag, Eye, CheckCircle, Clock, Truck, XCircle, Search, 
  Filter, ArrowUpRight, User, MoreHorizontal, Download, Loader2, 
  Phone, MapPin, CreditCard, RefreshCw, X 
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    price: number;
    sale_price: number;
  } | null;
}

interface OrderAddress {
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
}

interface DbOrder {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  discount_amount: number;
  shipping_charge: number;
  addresses: OrderAddress | null;
  order_items: OrderItem[];
}

const statusConfig = {
  paid: { label: 'Paid', style: 'bg-green-100 text-green-700 shadow-green-100/50', icon: CheckCircle },
  pending: { label: 'Pending', style: 'bg-amber-100 text-amber-700 shadow-amber-100/50', icon: Clock },
  shipped: { label: 'Shipped', style: 'bg-blue-100 text-blue-700 shadow-blue-100/50', icon: Truck },
  delivered: { label: 'Delivered', style: 'bg-slate-100 text-slate-700 shadow-slate-100/50', icon: CheckCircle },
  cancelled: { label: 'Cancelled', style: 'bg-red-100 text-red-700 shadow-red-100/50', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<DbOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  
  // Drawer / Modal details state
  const [selectedOrder, setSelectedOrder] = React.useState<DbOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  // Fetch orders on mount or refresh
  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            total_amount,
            discount_amount,
            shipping_charge,
            addresses (
              full_name,
              phone,
              street_address,
              city,
              state,
              postal_code
            ),
            order_items (
              id,
              quantity,
              price,
              products (
                name,
                price,
                sale_price
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          // Cast relationship structures to typescript interface
          const formatted: DbOrder[] = data.map((order: any) => ({
            id: order.id,
            created_at: order.created_at,
            status: order.status || 'pending',
            total_amount: parseFloat(order.total_amount || 0),
            discount_amount: parseFloat(order.discount_amount || 0),
            shipping_charge: parseFloat(order.shipping_charge || 0),
            addresses: Array.isArray(order.addresses) ? order.addresses[0] : order.addresses,
            order_items: (order.order_items || []).map((item: any) => ({
              id: item.id,
              quantity: item.quantity,
              price: parseFloat(item.price || 0),
              products: Array.isArray(item.products) ? item.products[0] : item.products
            }))
          }));
          setOrders(formatted);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Enable Supabase Realtime channel to capture newly placed orders instantly!
    const channel = supabase
      .channel('orders_realtime_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          setRefreshTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshTrigger]);

  // Handle Order Status updates
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update state locally
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      alert('Order status successfully updated!');
    } catch (e: any) {
      console.error(e);
      alert('Failed to update status: ' + (e.message || e));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Stat calculations
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const activeShipmentsCount = orders.filter(o => o.status === 'shipped' || o.status === 'paid').length;

  const pendingPayoutsTotal = orders
    .filter(o => o.status === 'pending')
    .reduce((sum, o) => sum + o.total_amount, 0);

  // Search and Filter logic
  const filteredOrders = orders.filter(order => {
    const customerName = order.addresses?.full_name || '';
    const phone = order.addresses?.phone || '';
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportLedger = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Customer,Phone,Amount,Status,Date"].join(",") + "\n"
      + filteredOrders.map(o => `"${o.id}","${o.addresses?.full_name || 'Guest'}","${o.addresses?.phone || ''}",${o.total_amount},"${o.status}","${new Date(o.created_at).toLocaleDateString()}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Fulfillment</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Track real-time transactions and delivery status</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={exportLedger}
            variant="outline" 
            className="rounded-full h-11 px-6 border-2 font-black text-xs tracking-widest uppercase hover:bg-slate-50 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" /> Export Ledger
          </Button>
          <Button 
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 font-black shadow-xl shadow-slate-200 gap-2 uppercase text-xs tracking-wider transition-all"
          >
             <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: '+18%', icon: ShoppingBag, color: 'bg-orange-500' },
           { label: 'Active Shipments', value: `${activeShipmentsCount} Orders`, trend: 'Live', icon: Truck, color: 'bg-blue-600' },
           { label: 'Pending Orders', value: `₹${pendingPayoutsTotal.toLocaleString()}`, trend: 'Awaiting', icon: Clock, color: 'bg-amber-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xs flex items-center gap-5">
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

      {/* Order List Table card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders by ID, name or phone..." 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-orange-500 transition-all" 
                />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2 items-center flex-wrap">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Status:</span>
                {['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all",
                      statusFilter === st 
                        ? "bg-slate-900 text-white shadow-xs" 
                        : "bg-slate-100 text-slate-650 hover:bg-slate-200"
                    )}
                  >
                    {st}
                  </button>
                ))}
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-orange-500" />
                    <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Loading Live Orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    No orders matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                  const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
                  
                  return (
                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                           ORD-{order.id.substring(0, 8).toUpperCase()} <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest mt-1">
                          <Clock className="h-3 w-3" /> {new Date(order.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                               <User className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="font-black text-slate-800 tracking-tight leading-none">
                                 {order.addresses?.full_name || 'Guest Customer'}
                               </p>
                               <p className="text-[10px] text-slate-400 font-bold lowercase mt-1 flex items-center gap-1">
                                 <Phone className="h-2.5 w-2.5 shrink-0" /> {order.addresses?.phone || 'N/A'}
                               </p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xs border border-transparent",
                          config.style
                        )}>
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <p className="font-black text-slate-900">₹{order.total_amount.toLocaleString()}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                           {totalItems} SKU Item{totalItems > 1 ? 's' : ''}
                         </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 hover:shadow-sm transition-all"
                            title="View Order Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beautiful Custom Detail Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Order Information</h3>
                <h2 className="text-xl font-black tracking-tight mt-1">
                  ORD-{selectedOrder.id.substring(0, 12).toUpperCase()}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Customer Profile & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-550" /> Customer Information
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-800 leading-none">
                      {selectedOrder.addresses?.full_name || 'Guest Customer'}
                    </p>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 pt-1">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {selectedOrder.addresses?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-550" /> Shipping Address
                  </h4>
                  {selectedOrder.addresses ? (
                    <div className="text-xs text-slate-600 font-bold leading-normal space-y-0.5">
                      <p>{selectedOrder.addresses.street_address}</p>
                      <p>{selectedOrder.addresses.city}, {selectedOrder.addresses.state} - {selectedOrder.addresses.postal_code}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No address submitted</p>
                  )}
                </div>
              </div>

              {/* Items List Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Product Name</th>
                      <th className="px-5 py-3 text-center">Qty</th>
                      <th className="px-5 py-3 text-right">Price</th>
                      <th className="px-5 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.order_items.map((item) => (
                      <tr key={item.id} className="font-bold text-slate-700">
                        <td className="px-5 py-3.5 max-w-[240px] truncate">
                          {item.products?.name || 'Unknown Mixer Product'}
                        </td>
                        <td className="px-5 py-3.5 text-center text-slate-900 font-black">{item.quantity}</td>
                        <td className="px-5 py-3.5 text-right">₹{item.price.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right font-black text-slate-800">
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3 max-w-sm ml-auto">
                <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                  <span>Subtotal</span>
                  <span>₹{(selectedOrder.total_amount + selectedOrder.discount_amount).toLocaleString()}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between items-center text-xs text-green-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{selectedOrder.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center text-sm font-black text-slate-800 uppercase tracking-wide">
                  <span>Paid Total</span>
                  <span className="text-slate-950 font-black text-lg">₹{selectedOrder.total_amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Update Status Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Order Status</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Progress order along fulfillment stages</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <button
                      key={status}
                      disabled={isUpdatingStatus || selectedOrder.status === status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border shrink-0",
                        selectedOrder.status === status
                          ? "bg-slate-900 border-slate-900 text-white cursor-default"
                          : "bg-white border-slate-200 hover:border-slate-350 text-slate-650 hover:bg-slate-50 active:scale-98"
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
