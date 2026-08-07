'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Camera, Mic, QrCode, MapPin, ChevronDown } from 'lucide-react';

export const Header = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-gradient-to-b from-[#ffa35d] via-[#ffbe86] to-[#ffd7b0] p-2.5 pb-2 gap-2 select-none shadow-sm">
      {/* Top 4 Pills Row */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {/* Pill 1: Flipkart (Yellow) */}
        <div className="bg-[#ffe500] rounded-2xl py-2 px-2 flex items-center justify-center gap-1 shadow-sm font-extrabold text-[13.5px] text-[#0f1115]">
          <span className="italic font-black text-[#2874f0] text-[15px] leading-none">f</span>
          <span className="tracking-tight italic font-black text-[#111]">Flipkart</span>
        </div>

        {/* Pill 2: Value 365 (White) */}
        <div className="bg-white rounded-2xl py-2 px-2 flex items-center justify-center gap-1 shadow-sm font-extrabold text-[12.5px] text-[#111]">
          <span className="w-5 h-5 rounded-md bg-[#ff4d4f] text-white flex items-center justify-center text-[10px] font-black shrink-0">
            %
          </span>
          <span className="tracking-tight shrink-0">Value 365</span>
        </div>

        {/* Pill 3: Travel (White) */}
        <div className="bg-white rounded-2xl py-2 px-2 flex items-center justify-center gap-1 shadow-sm font-extrabold text-[12.5px] text-[#111]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#ff6b35"/>
          </svg>
          <span className="tracking-tight italic shrink-0">Travel</span>
        </div>

        {/* Pill 4: Grocery (White) */}
        <div className="bg-white rounded-2xl py-2 px-2 flex items-center justify-center gap-1 shadow-sm font-extrabold text-[12.5px] text-[#111]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" fill="#ff9f43"/>
          </svg>
          <span className="tracking-tight shrink-0">Grocery</span>
        </div>
      </div>

      {/* Location Bar + Coin Badge */}
      <div className="flex items-center justify-between w-full text-slate-800 text-[12px] font-bold px-1">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-slate-800 fill-slate-800/20 shrink-0" />
          <span className="text-slate-800">Location not set</span>
          <span className="text-[#2874f0] font-black">Select delivery location</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-700 shrink-0" />
        </div>
        <div className="bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200/60 shadow-2xs shrink-0">
          <div className="w-4 h-4 rounded-full bg-amber-400 text-amber-900 font-black text-[9px] flex items-center justify-center">⚡</div>
          <span className="text-[12px] font-black text-slate-800">0</span>
        </div>
      </div>

      {/* Search Bar Input */}
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative w-full bg-white rounded-full flex items-center px-3.5 py-2.5 shadow-sm border border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="mobiles"
            className="w-full bg-transparent text-[14px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
          <div className="flex items-center gap-2.5 text-slate-500 shrink-0 ml-2">
            <Camera className="w-5 h-5 text-slate-500 cursor-pointer" />
            <Mic className="w-5 h-5 text-slate-500 cursor-pointer" />
            <QrCode className="w-5 h-5 text-slate-500 cursor-pointer" />
          </div>
        </div>
      </form>
    </header>
  );
};
