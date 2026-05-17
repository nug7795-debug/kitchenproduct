'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Camera, QrCode, MapPin, ChevronDown, Bell, Smartphone, Shirt, Monitor, Home as HomeIcon } from 'lucide-react';
import { Button } from '../ui/button';

export const Header = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-[#2874f0] text-white">
      {/* Top Tabs */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 bg-[#2874f0]">
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#fbde3b] text-[#2874f0] h-10 rounded-full font-black text-[14px] shadow-sm tracking-tight active:scale-95 transition-transform px-2">
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" 
            alt="Flipkart" 
            className="h-4 w-auto object-contain"
          />
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-800 h-10 rounded-full font-black text-[14px] shadow-sm active:scale-95 transition-transform px-2">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/travel-logo-v2_71cd51.png" alt="Travel" className="h-4 w-auto" />
          Travel
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-800 h-10 rounded-full font-black text-[14px] shadow-sm active:scale-95 transition-transform px-2">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/grocery-logo-v3_0877d1.png" alt="Grocery" className="h-4 w-auto" />
          Grocery
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#2874f0]">
        <div className="flex items-center gap-2 min-w-0">
          <HomeIcon size={16} className="text-white fill-white" />
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[13px] font-black uppercase tracking-wide">HOME</span>
            <span className="text-[12px] text-white truncate max-w-[180px]">Dhing, Dhing Subdistrict, Naga...</span>
            <ChevronDown size={16} className="text-white/90" />
          </div>
        </div>
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

      {/* Categories Row */}
      <div className="flex items-center justify-between px-4 pb-0 pt-1 overflow-x-auto no-scrollbar gap-6">
        <div className="flex flex-col items-center gap-1.5 min-w-max relative pb-2">
          <div className="w-7 h-7 flex items-center justify-center bg-transparent border-[1.5px] border-white/90 rounded-[8px]">
             <div className="w-3.5 h-3.5 bg-transparent border-[1.5px] border-white/90 rounded-[2px]" />
          </div>
          <span className="text-[11px] font-bold text-white tracking-wide">For You</span>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#fbde3b] rounded-t-full" />
        </div>
        <div className="flex flex-col items-center gap-1.5 min-w-max pb-2 opacity-90">
          <Shirt className="w-7 h-7 text-white stroke-[1.5px]" />
          <span className="text-[11px] font-medium text-white tracking-wide">Fashion</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 min-w-max pb-2 opacity-90">
          <Smartphone className="w-7 h-7 text-white stroke-[1.5px]" />
          <span className="text-[11px] font-medium text-white tracking-wide">Mobiles</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 min-w-max pb-2 opacity-90">
          <div className="w-7 h-7 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white">
               <path d="M7 11h10v10H7zM9 11V7c0-1.5 1-3 3-3s3 1.5 3 3v4" />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-white tracking-wide">Beauty</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 min-w-max pb-2 opacity-90">
          <Monitor className="w-7 h-7 text-white stroke-[1.5px]" />
          <span className="text-[11px] font-medium text-white tracking-wide">Electronics</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 min-w-max pb-2 opacity-90">
          <HomeIcon className="w-7 h-7 text-white stroke-[1.5px]" />
          <span className="text-[11px] font-medium text-white tracking-wide">Home</span>
        </div>
      </div>
    </header>
  );
};
