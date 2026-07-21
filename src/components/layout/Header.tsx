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
    const locationType = localStorage.getItem('user_location_type');
    if (cached) {
      setLocationText(cached);
    }

    // Only fetch IP location if we don't have a high-accuracy GPS location cached
    if (locationType !== 'gps') {
      resolveIPLocation();
    }

    // 2. Request high-accuracy GPS browser location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // 2a. Try Nominatim reverse geocode
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const localName = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city || '';
              const regionName = addr.city || addr.district || addr.state || '';
              
              let finalLoc = '';
              if (localName && regionName && localName !== regionName) {
                finalLoc = `${localName}, ${regionName}`;
              } else {
                finalLoc = localName || regionName || 'Detected Location';
              }
              
              setLocationText(finalLoc);
              localStorage.setItem('user_live_location', finalLoc);
              localStorage.setItem('user_location_type', 'gps');
              return;
            }
          } catch (e) {
            console.error('Reverse geocode via Nominatim failed:', e);
          }

          // 2b. Fallback to BigDataCloud reverse geocode if Nominatim fails (due to rate limit/CORS)
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (res.ok) {
              const data = await res.json();
              const localName = data.locality || data.city || '';
              const regionName = data.principalSubdivision || '';
              let finalLoc = '';
              if (localName && regionName && localName !== regionName) {
                finalLoc = `${localName}, ${regionName}`;
              } else {
                finalLoc = localName || regionName || 'Detected Location';
              }
              setLocationText(finalLoc);
              localStorage.setItem('user_live_location', finalLoc);
              localStorage.setItem('user_location_type', 'gps');
            }
          } catch (err) {
            console.error('Fallback reverse geocode failed:', err);
          }
        },
        (error) => {
          console.warn('Browser GPS permission denied or failed:', error);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 3600000 }
      );
    }
  }, [resolveIPLocation]);

  const handleRefreshLocation = () => {
    setLocationText('Detecting...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // 1. Try Nominatim
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const localName = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city || '';
              const regionName = addr.city || addr.district || addr.state || '';
              
              let finalLoc = '';
              if (localName && regionName && localName !== regionName) {
                finalLoc = `${localName}, ${regionName}`;
              } else {
                finalLoc = localName || regionName || 'Detected Location';
              }
              setLocationText(finalLoc);
              localStorage.setItem('user_live_location', finalLoc);
              localStorage.setItem('user_location_type', 'gps');
              return;
            }
          } catch (e) {
            console.error('Nominatim failed:', e);
          }

          // 2. Try BigDataCloud fallback
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (res.ok) {
              const data = await res.json();
              const localName = data.locality || data.city || '';
              const regionName = data.principalSubdivision || '';
              let finalLoc = '';
              if (localName && regionName && localName !== regionName) {
                finalLoc = `${localName}, ${regionName}`;
              } else {
                finalLoc = localName || regionName || 'Detected Location';
              }
              setLocationText(finalLoc);
              localStorage.setItem('user_live_location', finalLoc);
              localStorage.setItem('user_location_type', 'gps');
              return;
            }
          } catch (err) {
            console.error('BigDataCloud failed:', err);
          }

          // Fallback to IP lookup if GPS geocoders both fail
          resolveIPLocation();
        },
        () => {
          resolveIPLocation();
        }
      );
    } else {
      resolveIPLocation();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-[#2874f0] text-white">
      {/* Top blue bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2874f0]">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="text-white active:scale-95 transition-transform cursor-pointer"
          >
            <svg fill="#FFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </button>
          
          {/* Logo */}
          <Link href="/" className="block select-none overflow-hidden" style={{ height: '20px' }}>
            <img 
              src="/uploads/Q18Ifxk.webp" 
              alt="Flipkart Lite" 
              style={{ width: '75px', height: 'auto', display: 'block' }} 
              className="object-contain" 
            />
          </Link>
        </div>

        {/* Cart Icon with red badge */}
        <div className="relative p-2 flex items-center justify-center select-none">
          <svg width="18" height="18" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
            <g fill="#fff" fillRule="evenodd">
              <path d="m5.189 13.04c0 .996-.791 1.804-1.767 1.804-.976 0-1.767-.808-1.767-1.804 0-.996.791-1.804 1.767-1.804.976 0 1.767.808 1.767 1.804"></path>
              <path d="m14.912 2.259h-14.298l2.247 6.917c.042.129.16.216.293.216h8.06c-.064.69-.629 1.841-1.702 1.841h-6.04l1.072 1.991h5.611c1.881 0 2.938-2.278 3.657-4.719.888-3.01 1.219-6.245 1.106-6.245"></path>
              <path d="m.615 2.259l-.592-1.828c-.08-.207.069-.431.287-.431h1.482c.126 0 .24.079.287.198l.682 2.061c0 0-.63 1.642-1.942.066"></path>
              <path d="m2.262.756c0 0 .498 1.503 2.234 1.503l-1.736.749-1.104-.749.607-1.503"></path>
              <path d="m13.424 13.325c0 .837-.664 1.516-1.484 1.516-.82 0-1.484-.679-1.484-1.516 0-.837.664-1.516 1.484-1.516.82 0 1.484.679 1.484 1.516"></path>
            </g>
          </svg>
          <span className="absolute top-0 right-0 bg-[#ff1212] text-white rounded-full text-[9px] font-black h-4.5 w-4.5 flex items-center justify-center border border-[#2874f0]">
            1
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="px-3 pb-2 pt-0.5 bg-[#2874f0]">
        <form onSubmit={handleSearch} className="w-full">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for Products, Brands and More"
            className="w-full bg-white text-slate-800 text-[14px] px-3.5 py-1.5 rounded-[4px] outline-none placeholder:text-slate-400 border-none shadow-xs"
          />
        </form>
      </div>

      {/* Categories Row */}
      <div className="w-full bg-white border-b border-slate-200">
        <img 
          src="/uploads/top-bg.a2aad345a2d903ce5659.jpg" 
          alt="Categories" 
          className="w-full h-auto object-cover select-none pointer-events-none" 
        />
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
