'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ChevronRight, ShoppingBag, Truck } from 'lucide-react';

function PaymentConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [txnid, setTxnid] = useState('');
  const [amount, setAmount] = useState('0');
  const [utr, setUtr] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    setTxnid(searchParams.get('transactionId') || '');
    setAmount(searchParams.get('amount') || '0');
    setUtr(searchParams.get('utr') || '');

    // Calculate delivery date (usually 3-4 days from today)
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    setDeliveryDate(date.toLocaleDateString('en-US', options));

    // Clear cart upon successful order
    try {
      localStorage.removeItem('cart');
      localStorage.removeItem('active_transaction_id');
      localStorage.removeItem('active_upi_url');
    } catch (e) {}
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans flex flex-col justify-between pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[#eaeaf2] py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-[#2874f0]">Kitchen Stove</h1>
          <button 
            onClick={() => router.push('/')}
            className="text-sm font-bold text-[#2874f0]"
          >
            Shop More
          </button>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto px-4 flex-1 flex flex-col justify-center py-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 text-center mb-6">
          {/* Stunning animations / circle */}
          <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-green-50 rounded-full text-green-500">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-2">Order Confirmed!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your payment was successfully verified and your order has been placed.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3 mb-2 border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800">{txnid || 'N/A'}</span>
            </div>
            {utr && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Bank Ref / UTR</span>
                <span className="font-mono font-bold text-slate-800">{utr}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs pt-2 border-t border-dashed">
              <span className="text-slate-500 font-medium">Amount Paid</span>
              <span className="font-extrabold text-base text-slate-800">₹{amount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Schedule Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Expected Delivery</h4>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Arriving by {deliveryDate}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-[#2874f0] hover:bg-[#1b5ec2] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-white border border-[#2874f0] text-[#2874f0] py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            Go to My Orders <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Kitchen Stove. Secure Indian Payment.
      </div>
    </div>
  );
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="text-slate-500 font-bold">Loading confirmation details...</div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  );
}
