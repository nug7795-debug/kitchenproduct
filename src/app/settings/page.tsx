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
    }
  };

  const handlePixelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
      
      <div style={{ height: '100%' }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#333',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {toastMessage}
          </div>
        )}

        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-5">
          <a className="navbar-brand" href="#">Admin</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-nav flex-row gap-3">
            <a className="nav-item nav-link" href="/admin/products">Product</a>
            <a className="nav-item nav-link active" href="/settings">Setting</a>
          </div>
        </nav>

        {/* Form 1: UPI Add */}
        <form onSubmit={handleUpiSubmit} className="product-form mx-auto my-4 px-4" style={{ maxWidth: '480px' }}>
          <h1 className="h3 mb-3 fw-bold">UPI Add</h1>
          
          <div className="mb-3">
            <label htmlFor="upi" className="form-label">UPI:</label>
            <input
              id="upi"
              name="upi"
              type="text"
              className="form-control"
              value={upiData.upi}
              onChange={(e) => setUpiData({ ...upiData, upi: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="upi2" className="form-label">UPI:</label>
            <input
              id="upi2"
              name="upi2"
              type="text"
              className="form-control"
              value={upiData.upi2}
              onChange={(e) => setUpiData({ ...upiData, upi2: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="upi3" className="form-label">UPI:</label>
            <input
              id="upi3"
              name="upi3"
              type="text"
              className="form-control"
              value={upiData.upi3}
              onChange={(e) => setUpiData({ ...upiData, upi3: e.target.value })}
            />
          </div>

          <div className="container mt-4 px-0">
            <h2 className="h5 mb-3 fw-bold">Select Payment Method</h2>
            
            <div className="form-check form-switch d-flex align-items-center justify-content-between py-1 border-bottom">
              <label className="form-check-label" htmlFor="googlePaySwitch"><b>Google Pay</b></label>
              <input
                className="form-check-input"
                type="checkbox"
                id="googlePaySwitch"
                checked={upiData.Gpay}
                onChange={(e) => setUpiData({ ...upiData, Gpay: e.target.checked })}
              />
            </div>

            <div className="form-check form-switch d-flex align-items-center justify-content-between py-1 border-bottom">
              <label className="form-check-label" htmlFor="phonePaySwitch"><b>PhonePe</b></label>
              <input
                className="form-check-input"
                type="checkbox"
                id="phonePaySwitch"
                checked={upiData.Phonepe}
                onChange={(e) => setUpiData({ ...upiData, Phonepe: e.target.checked })}
              />
            </div>

            <div className="form-check form-switch d-flex align-items-center justify-content-between py-1 border-bottom">
              <label className="form-check-label" htmlFor="paytmSwitch"><b>Paytm</b></label>
              <input
                className="form-check-input"
                type="checkbox"
                id="paytmSwitch"
                checked={upiData.Paytm}
                onChange={(e) => setUpiData({ ...upiData, Paytm: e.target.checked })}
              />
            </div>

            <div className="form-check form-switch d-flex align-items-center justify-content-between py-1 border-bottom">
              <label className="form-check-label" htmlFor="bhimUPIswitch"><b>BHIM UPI</b></label>
              <input
                className="form-check-input"
                type="checkbox"
                id="bhimUPIswitch"
                checked={upiData.Bhim}
                onChange={(e) => setUpiData({ ...upiData, Bhim: e.target.checked })}
              />
            </div>

            <div className="form-check form-switch d-flex align-items-center justify-content-between py-1 border-bottom">
              <label className="form-check-label" htmlFor="wPaySwitch"><b>W-Pay</b></label>
              <input
                className="form-check-input"
                type="checkbox"
                id="wPaySwitch"
                checked={upiData.WPay}
                onChange={(e) => setUpiData({ ...upiData, WPay: e.target.checked })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary my-3 w-100 py-2">Submit</button>
        </form>

        {/* Form 2: Add Pixel */}
        <form onSubmit={handlePixelSubmit} className="product-form mx-auto mt-4 mb-5 px-4" style={{ maxWidth: '480px' }}>
          <h1 className="h3 mb-1 fw-bold">Add Pixel</h1>
          <h2 className="h6 mb-3 text-secondary">order : {orderCount}</h2>
          
          <div className="mb-3">
            <label htmlFor="pixelId" className="form-label">Pixel ID:</label>
            <textarea
              id="pixelId"
              name="pixelId"
              className="form-control font-monospace"
              rows={5}
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary my-2 w-100 py-2">Submit</button>
        </form>
      </div>
    </>
  );
}
