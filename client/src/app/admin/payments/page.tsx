'use client';

import * as React from 'react';
import { CreditCard, CheckCircle, XCircle, Search, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const pendingPayments = [
  { id: 'PAY-8821', orderId: 'ORD-1234', customer: 'Ansarul', amount: '₹5,499', utr: '412388990011', date: '2024-05-13 14:20' },
  { id: 'PAY-8822', orderId: 'ORD-1235', customer: 'Rahul', amount: '₹1,299', utr: '412388990022', date: '2024-05-13 15:10' },
];

export default function AdminPaymentsPage() {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setLoading(id);
    // Simulate API call to update payment status
    setTimeout(() => {
      setLoading(null);
      alert(`Payment ${id} ${action}d successfully!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payment Verification</h1>
          <p className="text-sm text-muted-foreground">Verify UTRs against your bank statement to confirm orders.</p>
        </div>
        <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 flex items-center gap-2 text-sm text-orange-700">
          <ShieldCheck className="h-4 w-4" />
          <span>Manual UPI Mode Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" /> Pending Verifications
              </h3>
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {pendingPayments.length} NEW
              </span>
            </div>
            
            <div className="divide-y">
              {pendingPayments.map((pay) => (
                <div key={pay.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{pay.amount}</span>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-500">{pay.id}</span>
                      </div>
                      <div className="text-sm">
                        Customer: <span className="font-medium">{pay.customer}</span> • Order: <span className="font-medium text-blue-600">{pay.orderId}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="bg-slate-900 text-white px-3 py-1 rounded text-xs font-mono tracking-wider flex items-center gap-2">
                          UTR: {pay.utr}
                          <button onClick={() => navigator.clipboard.writeText(pay.utr)} className="hover:text-orange-400">
                             <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase">{pay.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAction(pay.id, 'approve')}
                        disabled={loading === pay.id}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 h-10"
                      >
                        {loading === pay.id ? 'Processing...' : 'Approve Payment'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleAction(pay.id, 'reject')}
                        disabled={loading === pay.id}
                        className="text-red-600 border-red-200 hover:bg-red-50 rounded-full h-10"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-orange-500" /> Verification Guide
            </h3>
            <ol className="text-xs text-muted-foreground space-y-3 list-decimal pl-4">
              <li>Open your <strong>GPay/PhonePe Business</strong> app or bank statement.</li>
              <li>Search for the <strong>UTR / Ref No.</strong> shown on the left.</li>
              <li>Verify the <strong>Amount</strong> matches exactly.</li>
              <li>Click <strong>Approve</strong> to automatically mark the order as paid.</li>
              <li>If the UTR is missing or amount is wrong, click <strong>Reject</strong>.</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 text-sm mb-2 text-[13px]">Automated Security</h4>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              The system automatically blocks duplicate UTR submissions. Each UTR can only be used once across all customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
