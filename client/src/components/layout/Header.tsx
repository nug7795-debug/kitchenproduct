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
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#fbde3b] text-[#2874f0] h-11 rounded-[4px] font-black text-[15px] shadow-sm tracking-tight active:scale-95 transition-transform">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          Flipkart
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-800 h-11 rounded-[4px] font-black text-[15px] shadow-sm active:scale-95 transition-transform">
          <div className="text-[#fb4343]">
             <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
               <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
             </svg>
          </div>
          Travel
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-800 h-11 rounded-[4px] font-black text-[15px] shadow-sm active:scale-95 transition-transform">
          <div className="text-green-600">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
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
