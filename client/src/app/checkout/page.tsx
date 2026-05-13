'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  ArrowRight, 
  ExternalLink,
  Copy,
  Clock,
  ChevronRight,
  CreditCard,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: 'https://www.gstatic.com/images/branding/product/2x/googleg_96dp.png', color: 'bg-white' },
  { id: 'phonepe', name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg', color: 'bg-purple-50' },
  { id: 'paytm', name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg', color: 'bg-blue-50' },
  { id: 'bhim', name: 'BHIM', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/BHIM_logo.svg', color: 'bg-white' },
];

export default function CheckoutPage() {
  const [step, setStep] = React.useState<'summary' | 'method' | 'upi_intent' | 'utr_entry' | 'verifying' | 'success'>('summary');
  const [loading, setLoading] = React.useState(false);
  const [upiUrl, setUpiUrl] = React.useState<string | null>(null);
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [utr, setUtr] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // 1. Initialize Order & Get Intent
  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Mock order creation (In real app, this creates order in DB)
      const res = await fetch('http://localhost:5000/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: 'ORD-'+Math.floor(Math.random()*10000), amount: 9999 })
      });
      const data = await res.json();
      setUpiUrl(data.upiUrl);
      setTransactionId(data.transactionId);
      setStep('method');
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit UTR for verification
  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (utr.length < 12) {
      setError('Please enter a valid 12-digit UTR/Transaction ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/payments/submit-utr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, utr })
      });
      const data = await res.json();
      if (data.success) {
        setStep('verifying');
        startPolling();
      } else {
        setError(data.error || 'Invalid UTR provided');
      }
    } catch (err) {
      setError('System error. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Poll for backend verification
  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payments/status/${transactionId}`);
        const data = await res.json();
        if (data.status === 'success') {
          clearInterval(interval);
          setStep('success');
        }
      } catch (err) {
        console.error('Polling error');
      }
    }, 3000);

    // Stop polling after 1 minute
    setTimeout(() => clearInterval(interval), 60000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white text-center space-y-2 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500" />
             <h1 className="text-2xl font-black tracking-tight">KITCHEN<span className="text-orange-500">PRODUCT</span></h1>
             <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <Lock className="h-3 w-3" /> Secure Checkout
             </div>
          </div>

          <div className="p-8">
            {/* Step: Summary */}
            {step === 'summary' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-4">
                   <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
                   <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Subtotal (2 Items)</span>
                        <span className="font-bold text-slate-800">₹12,498.00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Shipping</span>
                        <span className="text-green-600 font-bold">FREE</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Offer Discount</span>
                        <span className="text-red-500 font-bold">-₹2,499.00</span>
                      </div>
                      <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-lg font-black text-slate-900 uppercase">Total Payable</span>
                        <span className="text-2xl font-black text-orange-600">₹9,999.00</span>
                      </div>
                   </div>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="w-full py-8 rounded-full bg-slate-900 hover:bg-slate-800 text-lg font-bold shadow-xl active:scale-[0.98] transition-all group"
                >
                  {loading ? 'Preparing Payment...' : 'Proceed to Payment'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* Step: Method Selection */}
            {step === 'method' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center">
                   <h2 className="text-xl font-bold text-slate-800">Select Payment Method</h2>
                   <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">Safe & Instant UPI Payment</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <button 
                     onClick={() => setStep('upi_intent')}
                     className="flex items-center justify-between p-6 rounded-2xl border-2 border-orange-500 bg-orange-50/30 text-left group transition-all"
                   >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                          <Smartphone className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">UPI App / Intent</p>
                          <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm & more</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                   </button>

                   <button className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-200 opacity-60 cursor-not-allowed text-left transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Card / Netbanking</p>
                          <p className="text-[10px] text-slate-500">Currently Unavailable</p>
                        </div>
                      </div>
                   </button>
                </div>
              </div>
            )}

            {/* Step: UPI Intent (App Chooser) */}
            {step === 'upi_intent' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center">
                   <h2 className="text-xl font-bold text-slate-800">Pay via UPI App</h2>
                   <p className="text-[10px] text-muted-foreground mt-1">CHOOSE YOUR PREFERRED APP</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {UPI_APPS.map(app => (
                     <a 
                       key={app.id} 
                       href={upiUrl || '#'} 
                       onClick={() => setStep('utr_entry')}
                       className={cn(
                         "flex flex-col items-center justify-center p-6 rounded-2xl border-2 hover:border-orange-500 hover:shadow-md transition-all active:scale-95 group",
                         app.color
                       )}
                     >
                        <div className="h-12 w-12 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <img src={app.icon} alt={app.name} className="max-h-full max-w-full" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{app.name}</span>
                     </a>
                   ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
                   <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                   <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                     After completing the payment in the app, please come back here to provide your Transaction ID (UTR) for automatic verification.
                   </p>
                </div>
              </div>
            )}

            {/* Step: UTR Entry (Post-Payment) */}
            {step === 'utr_entry' && (
              <form onSubmit={handleSubmitUtr} className="space-y-6 animate-in fade-in zoom-in-95">
                <div className="text-center space-y-1">
                   <h2 className="text-xl font-bold text-slate-800">Verify Transaction</h2>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Step 2: Enter Transaction Details</p>
                </div>

                <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-orange-900 uppercase">12-Digit UTR / Transaction ID</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 4123 4567 8901"
                        className="w-full bg-white border-2 border-orange-200 rounded-xl p-4 text-lg font-mono font-bold tracking-widest focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value.replace(/\s/g, ''))}
                        maxLength={12}
                      />
                   </div>
                   {error && (
                     <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg font-bold animate-pulse text-center">
                       {error}
                     </div>
                   )}
                   <p className="text-[10px] text-orange-700 font-medium">
                     * You can find this in your UPI app's transaction history.
                   </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-8 rounded-full bg-slate-900 hover:bg-slate-800 text-lg font-bold shadow-xl active:scale-[0.98] transition-all"
                >
                  {loading ? 'Submitting...' : 'Verify & Confirm Order'}
                </Button>
              </form>
            )}

            {/* Step: Verifying (Polling) */}
            {step === 'verifying' && (
              <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in fade-in">
                 <div className="relative">
                   <div className="h-24 w-24 rounded-full border-4 border-slate-100 border-t-orange-500 animate-spin" />
                   <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600" />
                   </div>
                 </div>
                 <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-slate-800">Verifying Payment...</h2>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                      Our systems are checking with the bank. This usually takes less than 60 seconds.
                    </p>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-slate-50 px-4 py-2 rounded-full font-bold">
                    <ShieldCheck className="h-3 w-3 text-green-600" /> Secure Server-Side Validation
                 </div>
              </div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
                 <div className="h-28 w-28 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-200">
                    <CheckCircle2 className="h-16 w-16 text-white" />
                 </div>
                 <div className="text-center space-y-3">
                    <h2 className="text-3xl font-black text-slate-900">Order Confirmed!</h2>
                    <p className="text-slate-500">Thank you for your purchase. We've received your payment.</p>
                 </div>
                 <div className="w-full rounded-3xl bg-slate-50 p-8 space-y-4 border border-slate-100">
                    <div className="flex justify-between items-center"><span className="text-xs text-slate-500 uppercase font-bold">Order ID</span><span className="font-bold text-slate-900">#ORD-9921-X</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs text-slate-500 uppercase font-bold">Status</span><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">PAID</span></div>
                 </div>
                 <Button className="w-full py-7 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold" asChild>
                    <a href="/">Return to Store</a>
                 </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
