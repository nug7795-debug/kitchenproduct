'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Camera, QrCode, MapPin, ChevronDown, Bell } from 'lucide-react';
import { Button } from '../ui/button';

export const Header = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-[#2874f0] text-white">
      {/* Top Tabs */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 bg-[#2874f0]">
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#fbde3b] text-[#2874f0] h-11 rounded-[4px] font-black text-[15px] shadow-sm tracking-tight active:scale-95 transition-transform overflow-hidden px-2">
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" 
            alt="Flipkart" 
            className="h-5 w-auto object-contain"
          />
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-800 h-11 rounded-[4px] font-black text-[15px] shadow-sm active:scale-95 transition-transform">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/travel-logo-v2_71cd51.png" alt="Travel" className="h-4 w-auto" />
          Travel
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-800 h-11 rounded-[4px] font-black text-[15px] shadow-sm active:scale-95 transition-transform">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/grocery-logo-v3_0877d1.png" alt="Grocery" className="h-4 w-auto" />
          Grocery
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2874f0]">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={16} className="text-white" />
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[13px] font-black uppercase tracking-wide">HOME</span>
            <span className="text-[11px] text-white/90 truncate max-w-[200px]">Dhing, Dhing Subdistrict, Naga...</span>
            <ChevronDown size={14} className="text-white/80" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#f6ba00]/20 px-2 py-1 rounded-full border border-[#f6ba00]/30 shadow-inner">
           <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-[#2874f0] font-black border border-white/40 shadow-sm">⚡</div>
           <span className="text-[13px] font-black text-white">0</span>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex-1 relative flex items-center bg-white rounded-md h-[44px] shadow-inner overflow-hidden border border-slate-200">
          <div className="absolute left-3 text-slate-400">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder="Search for products"
            className="w-full bg-transparent text-slate-800 py-3 pl-10 pr-12 text-sm font-medium focus:outline-none placeholder:text-slate-400"
          />
          <div className="absolute right-3 flex items-center gap-3 text-slate-400">
            <Camera size={24} strokeWidth={1.5} />
          </div>
        </div>
        <div className="flex items-center justify-center w-11 h-11 bg-transparent active:scale-95 transition-transform">
           <QrCode size={30} className="text-white" strokeWidth={1.5} />
        </div>
      </div>
    </header>
  );
};
