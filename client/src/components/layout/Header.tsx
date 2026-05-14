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
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#fbde3b] text-[#2874f0] h-10 rounded-[4px] font-black text-[14px] shadow-sm tracking-tight active:scale-95 transition-transform">
          <div className="w-5 h-5 relative">
            <Image src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/logo_lite-cbb1e2.png" alt="F" fill className="object-contain" unoptimized />
          </div>
          Flipkart
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-[#2874f0] h-10 rounded-[4px] font-black text-[14px] shadow-sm active:scale-95 transition-transform">
          <div className="w-5 h-5 relative text-[#fb4343]">
             <Image src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flight-9d1078.png" alt="Travel" fill className="object-contain" unoptimized />
          </div>
          <span className="text-slate-800">Travel</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-800 h-10 rounded-[4px] font-black text-[14px] shadow-sm active:scale-95 transition-transform">
          <div className="w-5 h-5 relative">
             <Image src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/grocery-product-bc30f9.png" alt="Grocery" fill className="object-contain" unoptimized />
          </div>
          <span className="text-slate-800">Grocery</span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2874f0]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-white/20 p-0.5 rounded-full">
            <MapPin size={14} className="text-white" />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[12px] font-black uppercase tracking-wide">HOME</span>
            <span className="text-[11px] text-white/90 truncate max-w-[180px]">Dhing, Dhing Subdistrict, Naga...</span>
            <ChevronDown size={14} className="text-white/80" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full border border-white/10">
           <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-[#2874f0] font-black">⚡</div>
           <span className="text-[12px] font-black text-white">0</span>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex-1 relative flex items-center bg-white rounded-md h-11 shadow-sm overflow-hidden">
          <div className="absolute left-3 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for products"
            className="w-full bg-transparent text-slate-800 py-3 pl-10 pr-12 text-sm focus:outline-none placeholder:text-slate-400"
          />
          <div className="absolute right-3 flex items-center gap-3 text-slate-400">
            <Camera size={22} />
          </div>
        </div>
        <div className="flex items-center justify-center w-11 h-11 bg-[#2874f0] rounded-md active:scale-95 transition-transform">
           <QrCode size={26} className="text-white" />
        </div>
      </div>
    </header>
  );
};
