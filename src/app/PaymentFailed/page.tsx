'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [txnid, setTxnid] = useState('');
  const [amount, setAmount] = useState('0');
  const [amount1, setAmount1] = useState('0');

  useEffect(() => {
    setTxnid(searchParams.get('transactionId') || '');
    setAmount(searchParams.get('amount') || '0');
    setAmount1(searchParams.get('amount1') || '0');
  }, [searchParams]);

  const handleRetry = () => {
    // Redirect back to payment screen for another try
    const routeParam = amount1 && Number(amount1) > 0 ? `${amount}.${amount1}` : `${amount}`;
    router.push(`/payment/${routeParam}?txnid=${txnid}`);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans flex flex-col justify-between pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[#eaeaf2] py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-[#2874f0]">Kitchen Stove</h1>
          <button 
            onClick={() => router.push('/')}
            className="text-sm font-bold text-slate-500"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto px-4 flex-1 flex flex-col justify-center py-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 text-center mb-6">
          {/* Failure Circle */}
          <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-red-50 rounded-full text-red-500">
            <XCircle className="w-12 h-12" />
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-2">Payment Failed</h2>
          <p className="text-sm text-slate-500 mb-6">
            We couldn't confirm your transaction with your bank. Any amount deducted will be refunded within 3-5 business days.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3 mb-2 border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800">{txnid || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-dashed">
              <span className="text-slate-500 font-medium">Attempted Amount</span>
              <span className="font-extrabold text-base text-slate-800">₹{amount}</span>
            </div>
          </div>
        </div>

        {/* Security Warning Box */}
        <div className="bg-[#fff9f4] border border-[#fbeee6] rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#fb641b]/10 flex items-center justify-center text-[#fb641b]">
            <AlertCircle className="w-5 h-5 text-[#fb641b]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#fb641b]">Need help?</h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Please check your internet connection or use another payment app.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleRetry}
            className="w-full bg-[#2874f0] hover:bg-[#1b5ec2] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Payment
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-white border border-[#2874f0] text-[#2874f0] py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            Go Back to Shop
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Kitchen Stove. Secure Indian Payment.
      </div>
    </div>
  );
}
