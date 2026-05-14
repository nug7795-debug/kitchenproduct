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
        <button className="flex items-center gap-1.5 bg-[#fbde3b] text-[#2874f0] px-4 py-2 rounded-[4px] font-black text-[12px] shadow-sm tracking-tight">
          <Image src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/logo_lite-cbb1e2.png" alt="F" width={16} height={16} />
          Flipkart
        </button>
        <button className="flex items-center gap-1.5 bg-white text-slate-800 px-4 py-2 rounded-[4px] font-bold text-[12px] shadow-sm">
          <Image src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flight-9d1078.png" alt="Travel" width={16} height={16} />
          Travel
        </button>
        <button className="flex items-center gap-1.5 bg-white text-slate-800 px-4 py-2 rounded-[4px] font-bold text-[12px] shadow-sm">
          <Image src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/grocery-product-bc30f9.png" alt="Grocery" width={16} height={16} />
          Grocery
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#2874f0]">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin size={14} className="text-white/80" />
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[11px] font-bold uppercase">Home</span>
            <span className="text-[10px] text-white/70 truncate max-w-[180px]">Dhing, Dhing Subdistrict, Naga...</span>
            <ChevronDown size={12} className="text-white/70" />
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
           <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] text-[#2874f0] font-black">⚡</div>
           <span className="text-[11px] font-black text-white">0</span>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="flex-1 relative flex items-center bg-white rounded-md h-10 shadow-sm overflow-hidden">
          <div className="absolute left-3 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search for products"
            className="w-full bg-transparent text-slate-800 py-2 pl-10 pr-12 text-sm focus:outline-none"
          />
          <div className="absolute right-3 flex items-center gap-3 text-slate-400">
            <Camera size={20} />
          </div>
        </div>
        <div className="flex items-center gap-1">
           <div className="relative p-1">
             <div className="w-6 h-6 border-[1.5px] border-white/90 rounded-[4px] flex items-center justify-center p-0.5">
                <div className="w-full h-full border border-white/60 rounded-[1px] relative">
                  <div className="absolute top-0 left-0 w-1 h-1 bg-white"></div>
                  <div className="absolute top-0 right-0 w-1 h-1 bg-white"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-white"></div>
                  <div className="absolute bottom-0 right-0 w-1 h-1 bg-white"></div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </header>
  );
};
