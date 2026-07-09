'use client';

import * as React from 'react';

export default function SettingsPage() {
  const [upiData, setUpiData] = React.useState({
    upi: '',
    upi2: '',
    upi3: '',
    Gpay: true,
    Phonepe: true,
    Paytm: true,
    Bhim: true,
    WPay: true
  });

  const [pixelId, setPixelId] = React.useState('');
  const [orderCount, setOrderCount] = React.useState(0);
  const [loadingUpi, setLoadingUpi] = React.useState(false);
  const [loadingPixel, setLoadingPixel] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/upichange');
        if (res.ok) {
          const data = await res.json();
          if (data.upi) {
            setUpiData({
              upi: data.upi.upi || '',
              upi2: data.upi.upi2 || '',
              upi3: data.upi.upi3 || '',
              Gpay: data.upi.Gpay !== false,
              Phonepe: data.upi.Phonepe !== false,
              Paytm: data.upi.Paytm !== false,
              Bhim: data.upi.Bhim !== false,
              WPay: data.upi.WPay !== false
            });
          }
          if (data.pixelId) {
            setPixelId(data.pixelId.FacebookPixel || '');
            setOrderCount(data.pixelId.order || 0);
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingUpi(true);
    try {
      const res = await fetch('/api/upichange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upiData)
      });
      const data = await res.json();
      if (data.status === 1) {
        showToast('UPI submitted successfully');
      } else {
        showToast('Error submitting UPI');
      }
    } catch (err) {
      showToast('Error submitting UPI');
    } finally {
      setLoadingUpi(false);
    }
  };

  const handlePixelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPixel(true);
    try {
      const res = await fetch('/api/facebookPixel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pixelId })
      });
      const data = await res.json();
      if (data.status === 1) {
        showToast('Pixel submitted successfully');
      } else {
        showToast('Error submitting Pixel');
      }
    } catch (err) {
      showToast('Error submitting Pixel');
    } finally {
      setLoadingPixel(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl transition-all animate-in fade-in duration-300">
          {toastMessage}
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <a className="text-xl font-black text-slate-900 tracking-tight" href="#">Admin</a>
        <div className="flex gap-4">
          <a className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors" href="/admin/products">Product</a>
          <a className="text-sm font-bold text-slate-950 border-b-2 border-slate-950 pb-0.5" href="/settings">Setting</a>
        </div>
      </nav>

      {/* Main Containers */}
      <div className="max-w-md mx-auto px-4 mt-8 space-y-8">
        
        {/* UPI Add Form */}
        <form onSubmit={handleUpiSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">UPI Add</h1>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="upi" className="text-xs font-bold text-slate-400 uppercase tracking-wider">UPI ID 1 (Default / GPay)</label>
              <input
                id="upi"
                type="text"
                value={upiData.upi}
                onChange={(e) => setUpiData({ ...upiData, upi: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-slate-400 transition-all"
                placeholder="upi id 1"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="upi2" className="text-xs font-bold text-slate-400 uppercase tracking-wider">UPI ID 2 (PhonePe)</label>
              <input
                id="upi2"
                type="text"
                value={upiData.upi2}
                onChange={(e) => setUpiData({ ...upiData, upi2: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-slate-400 transition-all"
                placeholder="upi id 2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="upi3" className="text-xs font-bold text-slate-400 uppercase tracking-wider">UPI ID 3 (Paytm)</label>
              <input
                id="upi3"
                type="text"
                value={upiData.upi3}
                onChange={(e) => setUpiData({ ...upiData, upi3: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-slate-400 transition-all"
                placeholder="upi id 3"
              />
            </div>
          </div>

          {/* Payment Method Switches */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Select Payment Method</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Google Pay</span>
                <input
                  type="checkbox"
                  checked={upiData.Gpay}
                  onChange={(e) => setUpiData({ ...upiData, Gpay: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">PhonePe</span>
                <input
                  type="checkbox"
                  checked={upiData.Phonepe}
                  onChange={(e) => setUpiData({ ...upiData, Phonepe: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Paytm</span>
                <input
                  type="checkbox"
                  checked={upiData.Paytm}
                  onChange={(e) => setUpiData({ ...upiData, Paytm: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">BHIM UPI</span>
                <input
                  type="checkbox"
                  checked={upiData.Bhim}
                  onChange={(e) => setUpiData({ ...upiData, Bhim: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">W-Pay</span>
                <input
                  type="checkbox"
                  checked={upiData.WPay}
                  onChange={(e) => setUpiData({ ...upiData, WPay: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingUpi}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-md text-sm"
          >
            {loadingUpi ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Pixel Add Form */}
        <form onSubmit={handlePixelSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Add Pixel</h1>
            <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-wider">
              order : {orderCount}
            </span>
          </div>

          <div className="space-y-1">
            <label htmlFor="pixelId" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pixel ID / Script</label>
            <textarea
              id="pixelId"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              rows={5}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold outline-none focus:border-slate-400 transition-all font-mono"
              placeholder="<!-- Meta Pixel Code -->"
            />
          </div>

          <button
            type="submit"
            disabled={loadingPixel}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-md text-sm"
          >
            {loadingPixel ? 'Submitting...' : 'Submit'}
          </button>
        </form>

      </div>
    </div>
  );
}
