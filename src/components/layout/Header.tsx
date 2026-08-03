'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Camera, QrCode, ChevronDown, Bell, Smartphone, Shirt, Monitor, Plane, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

const getStateCode = (stateName: string): string => {
  const statesMap: { [key: string]: string } = {
    'andhra pradesh': 'AP', 'arunachal pradesh': 'AR', 'assam': 'AS', 'bihar': 'BR',
    'chhattisgarh': 'CG', 'goa': 'GA', 'gujarat': 'GJ', 'haryana': 'HR',
    'himachal pradesh': 'HP', 'jammu and kashmir': 'JK', 'jharkhand': 'JH',
    'karnataka': 'KA', 'kerala': 'KL', 'madhya pradesh': 'MP', 'maharashtra': 'MH',
    'manipur': 'MN', 'meghalaya': 'ML', 'mizoram': 'MZ', 'nagaland': 'NL',
    'odisha': 'OR', 'punjab': 'PB', 'rajasthan': 'RJ', 'sikkim': 'SK',
    'tamil nadu': 'TN', 'telangana': 'TG', 'tripura': 'TR', 'uttar pradesh': 'UP',
    'uttarakhand': 'UK', 'west bengal': 'WB', 'delhi': 'DL', 'puducherry': 'PY',
    'chandigarh': 'CH', 'dadra and nagar haveli': 'DN', 'daman and diu': 'DD',
    'lakshadweep': 'LD', 'ladakh': 'LA', 'andaman and nicobar islands': 'AN'
  };
  return statesMap[stateName.toLowerCase()] || stateName;
};

export const Header = () => {
  const router = useRouter();
  const [locationText, setLocationText] = React.useState('Detecting location...');
  const [isLocationModalOpen, setIsLocationModalOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [pincode, setPincode] = React.useState('');
  const [pincodeError, setPincodeError] = React.useState('');
  const [pincodeLoading, setPincodeLoading] = React.useState(false);

  const [searchInput, setSearchInput] = React.useState('');
  const [cartCount, setCartCount] = React.useState(0);
  const [headerImage, setHeaderImage] = React.useState('/uploads/upor5.webp');

  React.useEffect(() => {
    setHeaderImage(`/uploads/upor5.webp?t=${Date.now()}`);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  React.useEffect(() => {
    const updateCartCount = () => {
      try {
        const storedCart = localStorage.getItem('cart_items') || localStorage.getItem('cart');
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          if (Array.isArray(parsed)) {
            const count = parsed.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartCount(count);
          }
        } else {
          setCartCount(0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const handlePincodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeError('Enter a valid 6-digit pincode');
      return;
    }
    setPincodeLoading(true);
    setPincodeError('');
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]?.Status === 'Success') {
          const postOfficeList = data[0].PostOffice;
          if (postOfficeList && postOfficeList.length > 0) {
            const po = postOfficeList[0];
            const city = po.District || po.Name;
            const state = po.State;
            const stateCode = getStateCode(state);
            const resolvedLoc = `${city}, ${stateCode} - ${pincode}`;
            setLocationText(resolvedLoc);
            localStorage.setItem('user_live_location', resolvedLoc);
            localStorage.setItem('user_location_type', 'pincode');
            setIsLocationModalOpen(false);
            setPincode('');
          } else {
            setPincodeError('Invalid Pincode. Please check and try again.');
          }
        } else {
          setPincodeError('Invalid Pincode. Please check and try again.');
        }
      } else {
        setPincodeError('Service error. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setPincodeError('Network error. Please try again.');
    } finally {
      setPincodeLoading(false);
    }
  };

  // Perform fast IP geolocation fallback (requires no browser prompt)
  const resolveIPLocation = React.useCallback(async () => {
    // If we already have a high-accuracy GPS location, don't downgrade it to IP
    const locationType = localStorage.getItem('user_location_type');
    if (locationType === 'gps') {
      return false;
    }

    // Try ipapi.co first
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.city) {
          const loc = `${data.city}, ${data.region_code || data.region}`;
          setLocationText(loc);
          localStorage.setItem('user_live_location', loc);
          localStorage.setItem('user_location_type', 'ip');
          return true;
        }
      }
    } catch (err) {
      console.error('ipapi.co error:', err);
    }

    // Try freeipapi.com as fallback
    try {
      const res = await fetch('https://freeipapi.com/api/json');
      if (res.ok) {
        const data = await res.json();
        if (data && data.cityName) {
          const loc = `${data.cityName}, ${data.regionName}`;
          setLocationText(loc);
          localStorage.setItem('user_live_location', loc);
          localStorage.setItem('user_location_type', 'ip');
          return true;
        }
      }
    } catch (err) {
      console.error('freeipapi.com error:', err);
    }
    return false;
  }, []);

  React.useEffect(() => {
    // 1. Try local storage cache first for instant load
    const cached = localStorage.getItem('user_live_location');
    if (cached) {
      setLocationText(cached);
    }

    // Fetch IP location in the background (no browser popup prompt)
    resolveIPLocation();
  }, [resolveIPLocation]);

  const handleRefreshLocation = () => {
    setLocationText('Detecting...');
    resolveIPLocation();
  };

  return (
    <header className="relative w-full flex flex-col bg-white text-slate-800 shadow-sm select-none">
      {/* Cropped Header Image with overlays */}
      <div className="relative w-full aspect-[4133/1585]">
        <img 
          src={headerImage} 
          alt="Flipkart Header" 
          className="w-full h-auto block pointer-events-none" 
        />
        

        {/* Brand Mall OFF Toggle Overlay */}
        <div 
          className="absolute cursor-pointer bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors"
          style={{ left: '0%', top: '57%', width: '24%', height: '43%' }}
          title="Brand Mall Toggle"
        />

        {/* Transparent Search Input Overlay */}
        <div 
          className="absolute flex items-center bg-transparent"
          style={{ left: '24%', top: '57%', width: '76%', height: '43%' }}
        >
          <form onSubmit={handleSearch} className="w-full h-full flex items-center">
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search mobiles..."
              className="w-full h-full bg-transparent text-[13px] text-slate-800 outline-none font-medium placeholder:text-transparent"
              style={{ paddingLeft: '32px', paddingRight: '32px' }}
            />
          </form>
        </div>
      </div>

      {/* Location Selector Bottom Drawer */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
          {/* Translucent Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsLocationModalOpen(false)}
          />
          
          {/* Drawer Body (styled exactly like Flipkart's location drawer) */}
          <div className="relative bg-white text-slate-800 w-full max-w-[500px] rounded-t-[24px] p-6 pb-10 shadow-2xl z-10 transition-transform duration-300 translate-y-0 transform select-none border-t border-slate-100">
            {/* Header indicator bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-black text-slate-900 tracking-tight">Select Delivery Location</h3>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 p-1.5 hover:bg-slate-100 rounded-full transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4">
              Enter a pincode to check delivery availability
            </p>

            <form onSubmit={handlePincodeSubmit} className="flex gap-2.5 mb-5">
              <div className="flex-1 relative">
                <input
                  type="tel"
                  maxLength={6}
                  required
                  value={pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPincode(val);
                    setPincodeError('');
                  }}
                  placeholder="Enter 6 digit pincode"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#2874f0] focus:bg-white rounded-xl py-3.5 px-4 text-sm font-black text-slate-800 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={pincodeLoading}
                className="bg-[#2874f0] hover:bg-[#2874f0]/90 text-white font-black text-xs uppercase px-6 py-3.5 rounded-xl shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {pincodeLoading ? 'Verifying...' : 'Submit'}
              </button>
            </form>

            {pincodeError && (
              <p className="text-[11px] font-bold text-red-500 mb-4 bg-red-50 border border-red-100 p-2.5 rounded-lg">
                ⚠️ {pincodeError}
              </p>
            )}

            {/* Current Active Location */}
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl mb-4 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Current Location:</span>
              <span className="text-slate-900 font-extrabold">{locationText}</span>
            </div>

            {/* Or Separator */}
            <div className="relative flex items-center justify-center my-6">
              <div className="flex-grow border-t border-slate-150" />
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">OR</span>
              <div className="flex-grow border-t border-slate-150" />
            </div>

            {/* Use Current GPS Location Option */}
            <button
              type="button"
              onClick={() => {
                setIsLocationModalOpen(false);
                handleRefreshLocation();
              }}
              className="w-full bg-[#2874f0]/10 hover:bg-[#2874f0]/15 text-[#2874f0] font-black text-sm uppercase py-4 rounded-xl flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
            >
              <MapPin className="h-4.5 w-4.5 text-[#2874f0]" />
              Use My Current Location
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[2000] flex">
          {/* Translucent Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Body (Clean white background, no complex dark patterns) */}
          <div className="relative bg-white text-slate-800 w-[280px] h-full shadow-2xl z-10 flex flex-col transition-transform duration-300 animate-slide-in-left">
            {/* Header: Clean Menu header with Close icon */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="font-black text-sm uppercase tracking-wider text-slate-900">Menu</span>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-650 p-1.5 hover:bg-slate-50 rounded-full transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links List */}
            <div className="flex-grow overflow-y-auto py-3">
              <div className="px-5 py-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-450 mb-2">Navigation</p>
                <ul className="space-y-1">
                  <li>
                    <Link 
                      href="/" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/about" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="border-t border-slate-100 my-2" />

              <div className="px-5 py-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-450 mb-2">Legal & Policies</p>
                <ul className="space-y-1">
                  <li>
                    <Link 
                      href="/privacy" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/terms" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/disclaimer" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      Disclaimer
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dmca" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      DMCA
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/return-refund" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      Return & Refund
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/affiliate-disclosure" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center py-2.5 text-sm font-bold text-slate-700 hover:text-[#2874f0] transition-colors"
                    >
                      Affiliate Disclosure
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer inside drawer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 text-center">
              © 12 Jul 2016 Kitchen Product
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
