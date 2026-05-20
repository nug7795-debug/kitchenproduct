'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Camera, QrCode, MapPin, ChevronDown, Bell, Smartphone, Shirt, Monitor, Home as HomeIcon, Plane } from 'lucide-react';
import { Button } from '../ui/button';

export const Header = () => {
  const router = useRouter();

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

      {/* Categories Row - Authentic Flipkart White Background & Colorful Images */}
      <div className="flex flex-col bg-white border-b border-slate-100/90 shadow-2xs">
        <div className="flex items-center justify-between px-4 pb-2 pt-2.5 overflow-x-auto no-scrollbar gap-6">
          <Link href="/" className="flex flex-col items-center gap-1.5 min-w-max relative pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center p-0.5 rounded-full bg-[#f8f9fa] border border-slate-100/30">
               <img 
                 src="https://rukminim2.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100" 
                 alt="For You" 
                 className="w-full h-full object-contain"
               />
            </div>
            <span className="text-[10px] font-black text-slate-800 tracking-tight">For You</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2874f0] rounded-t-full" />
          </Link>

          <Link href="/search?q=fashion" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center p-0.5 rounded-full bg-[#f8f9fa] border border-slate-100/30">
               <img 
                 src="https://rukminim2.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8f13a7.png?q=100" 
                 alt="Fashion" 
                 className="w-full h-full object-contain"
               />
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Fashion</span>
          </Link>

          <Link href="/search?q=mobiles" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center p-0.5 rounded-full bg-[#f8f9fa] border border-slate-100/30">
               <img 
                 src="https://rukminim2.flixcart.com/flap/128/128/image/22fddf3510011279.png?q=100" 
                 alt="Mobiles" 
                 className="w-full h-full object-contain"
               />
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Mobiles</span>
          </Link>

          <Link href="/search?q=beauty" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center p-0.5 rounded-full bg-[#f8f9fa] border border-slate-100/30">
               <img 
                 src="https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100" 
                 alt="Beauty" 
                 className="w-full h-full object-contain"
               />
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Beauty</span>
          </Link>

          <Link href="/search?q=appliances" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center p-0.5 rounded-full bg-[#f8f9fa] border border-slate-100/30">
               <img 
                 src="https://rukminim2.flixcart.com/flap/128/128/image/69cffacc2c18036c.png?q=100" 
                 alt="Electronics" 
                 className="w-full h-full object-contain"
               />
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Electronics</span>
          </Link>

          <Link href="/search?q=cooker" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center p-0.5 rounded-full bg-[#f8f9fa] border border-slate-100/30">
               <img 
                 src="https://rukminim2.flixcart.com/flap/128/128/image/ab7e2c021f97a8fe.png?q=100" 
                 alt="Home" 
                 className="w-full h-full object-contain"
               />
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Home</span>
          </Link>
        </div>

        {/* Categories Scroll Progress Bar */}
        <div className="w-full px-2 pb-1.5">
          <div className="w-full h-[3px] bg-slate-100 rounded-full overflow-hidden flex">
            <div className="w-[15%] h-full bg-[#2874f0] rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
