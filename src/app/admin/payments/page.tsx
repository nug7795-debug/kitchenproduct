'use client';

import * as React from 'react';
import { CreditCard, CheckCircle, XCircle, Search, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';

interface PendingPayment {
  id: string;
  transactionId: string;
  orderId: string;
  customer: string;
  amount: string;
  utr: string;
  date: string;
}

export default function AdminPaymentsPage() {
  const [loading, setLoading] = React.useState<string | null>(null);
  const [pendingPayments, setPendingPayments] = React.useState<PendingPayment[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Fetch pending payments from Supabase
  React.useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select(`
            id,
            amount,
            transaction_id,
            status,
            created_at,
            raw_response,
            order_id,
            orders (
              id,
              user_id,
              addresses (
                full_name
              )
            )
          `)
          .eq('status', 'processing')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped: PendingPayment[] = data.map((pay: any) => {
            const customerName = pay.orders?.addresses?.full_name || 'Guest Customer';
            return {
              id: pay.id,
              transactionId: pay.transaction_id,
              orderId: pay.order_id,
              customer: customerName,
              amount: `₹${parseFloat(pay.amount).toLocaleString()}`,
              utr: pay.raw_response?.utr || 'N/A',
              date: new Date(pay.created_at).toLocaleString()
            };
          });
          setPendingPayments(mapped);
        }
      } catch (err) {
        console.error('Error fetching pending payments:', err);
      }
    };

    fetchPendingPayments();
  }, [refreshTrigger]);

  const handleAction = async (id: string, orderId: string, action: 'approve' | 'reject') => {
    setLoading(id);
    try {
      const paymentStatus = action === 'approve' ? 'success' : 'failed';
      const orderStatus = action === 'approve' ? 'paid' : 'cancelled';

      // 1. Update payment status in DB
      const { error: payErr } = await supabase
        .from('payments')
        .update({ status: paymentStatus })
        .eq('id', id);

      if (payErr) throw payErr;

      // 2. Update order status in DB
      if (orderId) {
        const { error: orderErr } = await supabase
          .from('orders')
          .update({ status: orderStatus })
          .eq('id', orderId);

        if (orderErr) throw orderErr;
      }

      alert(`Payment has been successfully ${action}d!`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error(err);
      alert(`Error updating payment: ${err.message || err}`);
    } finally {
      setLoading(null);
    }
  };

  const filteredPayments = pendingPayments.filter(pay => 
    pay.utr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pay.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pay.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Payment Verification</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider text-[11px]">Verify customer UTR reference numbers to approve orders</p>
        </div>
        <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 flex items-center gap-2 text-xs font-bold text-orange-700 uppercase">
          <ShieldCheck className="h-4 w-4" />
          <span>Manual UPI Mode Active</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400 shrink-0" />
        <input 
          type="text"
          placeholder="Search by UTR, Customer Name, or Transaction ID..."
          className="w-full text-xs font-medium bg-transparent outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" /> Pending UTR Verifications
              </h3>
              <span className="bg-orange-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                {filteredPayments.length} Pending
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-bold text-xs uppercase">
                  No pending UTR verifications found.
                </div>
              ) : (
                filteredPayments.map((pay) => (
                  <div key={pay.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg text-slate-900">{pay.amount}</span>
                          <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-500 uppercase tracking-wider">
                            ID: {pay.transactionId.substring(0, 12)}...
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          Customer: <span className="font-bold text-slate-800">{pay.customer}</span> • Order: <span className="font-bold text-blue-600">#{pay.orderId.substring(0, 8)}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-mono tracking-wider flex items-center gap-2">
                            UTR: {pay.utr}
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(pay.utr);
                                alert('UTR copied to clipboard!');
                              }} 
                              className="hover:text-orange-400 transition-colors"
                              title="Copy UTR"
                            >
                               <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{pay.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        <Button 
                          onClick={() => handleAction(pay.id, pay.orderId, 'approve')}
                          disabled={loading === pay.id}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 text-xs font-bold"
                        >
                          {loading === pay.id ? 'Processing...' : 'Approve'}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleAction(pay.id, pay.orderId, 'reject')}
                          disabled={loading === pay.id}
                          className="text-red-650 border-red-200 hover:bg-red-50 rounded-xl px-4 text-xs font-bold"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-orange-500" /> Verification Guide
            </h3>
            <ol className="text-xs text-slate-500 space-y-3 list-decimal pl-4 font-medium leading-relaxed">
              <li>Open your <strong>Paytm Business / GPay Business</strong> app or check your bank account statements.</li>
              <li>Locate the transaction matching the <strong>12-digit UTR reference number</strong>.</li>
              <li>Verify that the <strong>Amount</strong> matches the order total exactly.</li>
              <li>Click <strong>Approve</strong> to automatically update order status to <strong>Paid</strong>.</li>
              <li>If the UTR is fake or wrong, click <strong>Reject</strong> to decline the order.</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h4 className="font-black text-blue-900 text-xs uppercase tracking-wider mb-2">Automated Security</h4>
            <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
              The system automatically blocks duplicate UTR submissions. Each UTR can only be used once across all customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
