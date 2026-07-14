'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Camera, QrCode, ChevronDown, Bell, Smartphone, Shirt, Monitor, Plane, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

export const Header = () => {
  const router = useRouter();
  const [locationText, setLocationText] = React.useState('Detecting location...');

  // Perform fast IP geolocation fallback (requires no browser prompt)
  const resolveIPLocation = React.useCallback(async () => {
    // Try ipapi.co first
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.city) {
          const loc = `${data.city}, ${data.region_code || data.region}`;
          setLocationText(loc);
          localStorage.setItem('user_live_location', loc);
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

    // Always fetch latest location via IP geolocator in background to refresh
    resolveIPLocation();

    // 2. Request high-accuracy GPS browser location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
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
            }
          } catch (e) {
            console.error('Reverse geocode failed:', e);
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
            }
          } catch (e) {
            resolveIPLocation();
          }
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
      {/* Top Tabs */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 bg-[#2874f0]">
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#fbde3b] text-[#2874f0] h-10 rounded-[8px] font-black text-[14px] shadow-sm tracking-tight active:scale-95 transition-transform px-2 italic">
          <span className="text-[#2874f0] font-black italic text-[16px]">f</span> Flipkart
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-800 h-10 rounded-[8px] font-bold text-[13px] shadow-sm active:scale-95 transition-transform px-2">
          <Plane className="text-[#ff4343] fill-[#ff4343] w-4 h-4" />
          Travel
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-800 h-10 rounded-[8px] font-bold text-[13px] shadow-sm active:scale-95 transition-transform px-2">
          <ShoppingCart className="text-[#388e3c] fill-[#388e3c] w-4 h-4" />
          Grocery
        </button>
      </div>

      {/* Address Bar - Clean dynamic version strictly matching Flipkart mobile web */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2874f0]">
        <button 
          onClick={handleRefreshLocation}
          className="flex items-center gap-1 min-w-0 bg-transparent text-left border-none p-0 outline-none active:opacity-80 transition-opacity"
        >
          <MapPin size={13} className="text-white shrink-0" />
          <span className="text-[12px] font-bold text-white truncate max-w-[260px] tracking-wide ml-0.5">
            {locationText}
          </span>
          <ChevronDown size={14} className="text-white/90 shrink-0 mt-0.5" />
        </button>
        <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1.5 rounded-full backdrop-blur-sm">
           <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-white font-black">⚡</div>
           <span className="text-[12px] font-black text-white">0</span>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex-1 relative flex items-center bg-white rounded-full h-[46px] shadow-md overflow-hidden">
          <div className="absolute left-3 text-slate-500">
            <Search size={20} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="tv"
            className="w-full bg-transparent text-slate-800 py-3 pl-10 pr-12 text-[15px] font-medium focus:outline-none placeholder:text-slate-400"
          />
          <div className="absolute right-4 text-slate-500">
            <Camera size={22} strokeWidth={2} />
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 active:scale-95 transition-transform">
           <QrCode size={26} className="text-white" strokeWidth={1.5} />
        </div>
      </div>

      {/* Categories Row - Cropped/Copied from highsale-combopack.shop/endsale/ */}
      <div className="flex overflow-x-auto bg-white py-3 px-2.5 gap-3.5 no-scrollbar border-b-[6px] border-[#f1f3f6]">
        {/* For You (Active) */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-[58px] pb-2 border-b-[3px] border-[#2874f0] active:scale-95 transition-transform shrink-0">
          <div className="w-[42px] h-[42px] flex items-center justify-center bg-[#d0e7ff] rounded-xl scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M9.93061 6.51562H22.0706C24.0006 6.51562 25.6206 7.98562 25.8306 9.92562L27.5106 25.2356C27.7606 27.5056 26.0006 29.4856 23.7506 29.4856H8.25061C5.99061 29.4856 4.24061 27.5056 4.49061 25.2356L6.17061 9.92562C6.38061 7.98562 8.00061 6.51562 9.93061 6.51562Z" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
              <path d="M22.0507 11.7061C22.0507 15.0861 19.3407 17.8261 16.0107 17.8261C12.6807 17.8261 9.9707 15.0861 9.9707 11.7061" fill="#ffe51f"></path>
              <path d="M22.0507 11.7061C22.0507 15.0861 19.3407 17.8261 16.0107 17.8261C12.6807 17.8261 9.9707 15.0861 9.9707 11.7061" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
            </svg>
          </div>
          <span className="text-[12px] text-black font-bold whitespace-nowrap">For You</span>
        </Link>

        {/* Fashion */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-[58px] pb-2 border-b-[3px] border-transparent active:scale-95 transition-transform shrink-0">
          <div className="w-[42px] h-[42px] flex items-center justify-center scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8.58301 24.6445H23.3717V25.7525C23.3717 27.4093 22.0285 28.7525 20.3717 28.7525H11.583C9.92615 28.7525 8.58301 27.4093 8.58301 25.7525V24.6445Z" fill="#ffe51f"></path>
              <path d="M16.0003 10.6766C13.1536 10.6766 12.1563 8.21071 11.9404 6.48294C11.8966 6.13193 11.5352 5.88942 11.2056 6.01794C10.418 6.3251 9.33827 6.73537 8.60601 6.97946C7.6201 7.3081 6.82589 8.75958 6.55203 9.44424L4.79622 14.7117C4.62878 15.214 4.88191 15.7597 5.37351 15.9564L8.60601 17.2494V26.7517C8.60601 27.8562 9.50144 28.7517 10.606 28.7517H21.3947C22.4992 28.7517 23.3947 27.8562 23.3947 26.7517V17.2494L26.6645 15.9414C27.1406 15.751 27.3961 15.232 27.2499 14.7405C26.631 12.6601 25.6079 9.47765 25.0379 8.62264C24.3806 7.63673 23.6685 7.11639 23.3947 6.97946L20.7839 6.00041C20.457 5.87783 20.1047 6.11968 20.0623 6.4662C19.8508 8.19473 18.8563 10.6766 16.0003 10.6766Z" stroke="#333333" strokeWidth="1.4"></path>
              <path d="M8.99414 24.6445H22.9612" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"></path>
              <path d="M23.3941 17.661V13.9639M8.60547 17.661V13.9639" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"></path>
            </svg>
          </div>
          <span className="text-[12px] text-[#424242] whitespace-nowrap font-medium">Fashion</span>
        </Link>

        {/* Mobiles */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-[58px] pb-2 border-b-[3px] border-transparent active:scale-95 transition-transform shrink-0">
          <div className="w-[42px] h-[42px] flex items-center justify-center scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <g clipPath="url(#clip0_3415_178959_new)">
                <path d="M9.7998 24.9199V27.1199C9.7998 28.5899 10.9898 29.7799 12.4598 29.7799H19.7598C21.2298 29.7799 22.4198 28.5899 22.4198 27.1199V25.0799" fill="#ffe51f"></path>
                <path d="M9.7998 24.9199V27.1199C9.7998 28.5899 10.9898 29.7799 12.4598 29.7799H19.7598C21.2298 29.7799 22.4198 28.5899 22.4198 27.1199V25.0799" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
                <path d="M12.4198 6.7998H19.7998C21.2498 6.7998 22.4198 7.9698 22.4198 9.4198V27.1298C22.4198 28.5998 21.2298 29.7898 19.7598 29.7898H12.4598C10.9898 29.7898 9.7998 28.5998 9.7998 27.1298V9.4198C9.7998 7.9698 10.9698 6.7998 12.4198 6.7998Z" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
                <path d="M14.8994 9.24023H16.8994" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
                <path d="M14.1699 27.4102H18.1699" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
              </g>
              <defs><clipPath id="clip0_3415_178959_new"><rect width="14.22" height="24.59" fill="#ffe51f" transform="translate(9 6)"></rect></clipPath></defs>
            </svg>
          </div>
          <span className="text-[12px] text-[#424242] whitespace-nowrap font-medium">Mobiles</span>
        </Link>

        {/* Beauty */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-[58px] pb-2 border-b-[3px] border-transparent active:scale-95 transition-transform shrink-0">
          <div className="w-[42px] h-[42px] flex items-center justify-center scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M12.2291 14.4229H19.5191C20.3191 14.4229 20.9691 15.0729 20.9691 15.8729V26.9529C20.9691 28.2529 19.9091 29.3129 18.6091 29.3129H13.1491C11.8491 29.3129 10.7891 28.2529 10.7891 26.9529V15.8729C10.7891 15.0729 11.4391 14.4229 12.2391 14.4229H12.2291Z" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
              <path d="M18.1886 14.4427V9.24269C18.1886 9.06269 18.1086 8.88269 17.9586 8.77269L14.5386 6.03269C14.1386 5.71269 13.5586 6.00269 13.5586 6.50269V14.4427H18.1886Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
              <path d="M11.3691 17.4727L20.8691 17.6027" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
            </svg>
          </div>
          <span className="text-[12px] text-[#424242] whitespace-nowrap font-medium">Beauty</span>
        </Link>

        {/* Electronics */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-[58px] pb-2 border-b-[3px] border-transparent active:scale-95 transition-transform shrink-0">
          <div className="w-[42px] h-[42px] flex items-center justify-center scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M4.99121 23.2591V10.0236C4.99121 9.03574 5.78867 8.23828 6.77657 8.23828H25.3086C26.2965 8.23828 27.094 9.03574 27.094 10.0236V23.2591" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
              <path d="M2.26483 24.3418H29.7475V26.508C29.7475 28.0315 28.5096 29.2694 26.9861 29.2694H5.01428C3.49078 29.2694 2.25293 28.0315 2.25293 26.508V24.3418H2.26483Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
              <path d="M13.751 26.9131H18.3453" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
            </svg>
          </div>
          <span className="text-[12px] text-[#424242] whitespace-nowrap font-medium">Electronics</span>
        </Link>

        {/* Home */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-[58px] pb-2 border-b-[3px] border-transparent active:scale-95 transition-transform shrink-0">
          <div className="w-[42px] h-[42px] flex items-center justify-center scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1_Home" version="1.1" viewBox="0 0 32 32" width="32" height="32">
              <path fill="#ffe51f" d="M20.86,8.76h-9.69l1.07-3.25h7.41l.56,1.75.5,1.51h.15Z"></path>
              <path fill="none" stroke="#333333" strokeWidth="1.4px" strokeMiterlimit="10" d="M16.03,27.82v-10.18"></path>
              <line strokeLinecap="round" fill="none" stroke="#333333" strokeWidth="1.4px" strokeMiterlimit="10" x1="10.67" y1="27.82" x2="21.33" y2="27.82"></line>
              <path strokeLinecap="round" fill="none" stroke="#333333" strokeWidth="1.4px" strokeMiterlimit="10" strokeLinejoin="round" d="M9.05,17.64h13.95c.66,0,1.13-.64.92-1.27l-3.57-10.87c-.13-.4-.5-.67-.92-.67h-6.91c-.42,0-.79.27-.92.67l-3.47,10.87c-.2.62.27,1.26.92,1.26Z"></path>
            </svg>
          </div>
          <span className="text-[12px] text-[#424242] whitespace-nowrap font-medium">Home</span>
        </Link>

        {/* Furniture */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-[58px] pb-2 border-b-[3px] border-transparent active:scale-95 transition-transform shrink-0">
          <div className="w-[42px] h-[42px] flex items-center justify-center scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M28.1679 23.9892C28.0729 24.8557 27.2301 25.5205 26.2211 25.5205H5.13934C4.09475 25.5205 3.22821 24.8083 3.1926 23.918L2.21923 18.2439C2.17175 17.8641 2.51599 17.5317 2.95519 17.5317H5.28179C5.60229 17.5317 5.88718 17.7098 5.98214 17.9709C5.98214 17.9709 5.98214 17.9828 5.98214 17.9946L7.08609 21.4133C7.19292 21.7338 7.52529 21.9475 7.90514 21.9475H23.9302C24.3219 21.9475 24.6661 21.7219 24.7611 21.3896L25.7345 17.9828C25.8175 17.6979 26.1143 17.4961 26.4585 17.4961H29.0344C29.3291 17.4961 29.5804 17.6451 29.7028 17.8545C29.7727 17.9741 29.8006 18.1134 29.7704 18.2558L28.1679 23.9892Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
              <path d="M5.38965 29.1298L6.65978 26.9219" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
              <path d="M26.3277 29.1298L25.0576 26.9219" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
              <path d="M8.03613 21.7937L9.22317 12.1193C9.22317 10.505 10.5289 9.19922 12.1433 9.19922H19.7047C21.3191 9.19922 22.6248 10.505 22.6248 12.1193L23.8119 21.7937" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" stroke-linecap="round"></path>
            </svg>
          </div>
          <span className="text-[12px] text-[#424242] whitespace-nowrap font-medium">Furniture</span>
        </Link>
      </div>
    </header>
  );
};
