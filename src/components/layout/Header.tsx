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

      {/* Categories Row - Authentic Flipkart White Background & Beautiful Inline SVGs */}
      <div className="flex flex-col bg-white border-b border-slate-100/90 shadow-2xs">
        <div className="flex items-center justify-between px-4 pb-2 pt-2.5 overflow-x-auto no-scrollbar gap-6">
          <Link href="/" className="flex flex-col items-center gap-1.5 min-w-max relative pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-red-50 border border-red-100/50">
               {/* Gift / Present Box in Red & Gold */}
               <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <linearGradient id="giftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#ff4d4d" />
                     <stop offset="100%" stopColor="#cc0000" />
                   </linearGradient>
                   <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#ffe066" />
                     <stop offset="100%" stopColor="#f5b041" />
                   </linearGradient>
                 </defs>
                 {/* Sparkles */}
                 <path d="M4 6L5 5L4 4L3 5L4 6Z" fill="#f5b041" />
                 <path d="M20 5L21 4L20 3L19 4L20 5Z" fill="#f5b041" />
                 {/* Box Base */}
                 <rect x="5" y="11" width="14" height="9" rx="1.5" fill="url(#giftGrad)" />
                 {/* Box Lid */}
                 <rect x="4" y="9" width="16" height="3" rx="1" fill="url(#goldGrad)" />
                 {/* Ribbon vertical */}
                 <rect x="11" y="11" width="2" height="9" fill="url(#goldGrad)" />
                 {/* Ribbon Bow */}
                 <path d="M12 9C10.5 7 8 7 9.5 9C10.5 10 12 9 12 9Z" fill="url(#goldGrad)" />
                 <path d="M12 9C13.5 7 16 7 14.5 9C13.5 10 12 9 12 9Z" fill="url(#goldGrad)" />
                 <circle cx="12" cy="9" r="1.2" fill="#d35400" />
               </svg>
            </div>
            <span className="text-[10px] font-black text-slate-800 tracking-tight">For You</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2874f0] rounded-t-full" />
          </Link>

          <Link href="/search?q=fashion" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-pink-50 border border-pink-100/50">
               {/* Fashion Shirt in Pink/Orange Gradient */}
               <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <linearGradient id="fashionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#ff758c" />
                     <stop offset="100%" stopColor="#ff7eb3" />
                   </linearGradient>
                 </defs>
                 <path d="M9 4L12 6L15 4L21 6.5L19 11L17 10.5V19C17 19.8 16.3 20.5 15.5 20.5H8.5C7.7 20.5 7 19.8 7 19V10.5L5 11L3 6.5L9 4Z" 
                   fill="url(#fashionGrad)" 
                   stroke="#ff3366" 
                   strokeWidth="1.2" 
                   strokeLinejoin="round" 
                 />
                 <path d="M12 6.5C12 5.5 12.8 4.7 13.5 4.5" stroke="#ff3366" strokeWidth="1.2" strokeLinecap="round" />
               </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Fashion</span>
          </Link>

          <Link href="/search?q=mobiles" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-100/50">
               {/* Mobile Phone in Emerald Green Gradient */}
               <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <linearGradient id="mobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#11998e" />
                     <stop offset="100%" stopColor="#38ef7d" />
                   </linearGradient>
                 </defs>
                 <rect x="6" y="3" width="12" height="18" rx="2" fill="url(#mobGrad)" stroke="#0e7f75" strokeWidth="1.2" />
                 <rect x="7.5" y="4.5" width="9" height="13" rx="0.5" fill="#ffffff" fillOpacity="0.3" />
                 <line x1="10" y1="19" x2="14" y2="19" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                 <circle cx="12" cy="4" r="0.6" fill="#ffffff" />
               </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Mobiles</span>
          </Link>

          <Link href="/search?q=beauty" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-purple-50 border border-purple-100/50">
               {/* Beauty Jar and Lipstick in Lavender/Magenta Gradient */}
               <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <linearGradient id="beautyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#da22ff" />
                     <stop offset="100%" stopColor="#9733ee" />
                   </linearGradient>
                   <linearGradient id="lipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#ff0844" />
                     <stop offset="100%" stopColor="#ffb199" />
                   </linearGradient>
                 </defs>
                 <rect x="5" y="9" width="8" height="11" rx="1.5" fill="url(#beautyGrad)" stroke="#7d1ebd" strokeWidth="0.8" />
                 <rect x="7.5" y="6" width="3" height="3" rx="0.5" fill="#f5b041" />
                 <rect x="15" y="11" width="4" height="9" rx="1" fill="#333333" />
                 <rect x="15" y="14" width="4" height="1.5" fill="#ffe066" />
                 <path d="M16 7.5L18 8.5V11H16V7.5Z" fill="url(#lipGrad)" stroke="#ff0844" strokeWidth="0.5" />
               </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Beauty</span>
          </Link>

          <Link href="/search?q=appliances" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-blue-50 border border-blue-100/50">
               {/* Electronics Laptop in Cyan/Royal Blue Gradient */}
               <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <linearGradient id="elecGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#00c6ff" />
                     <stop offset="100%" stopColor="#0072ff" />
                   </linearGradient>
                 </defs>
                 <rect x="5" y="6" width="14" height="9" rx="1" fill="url(#elecGrad)" stroke="#0056b3" strokeWidth="1" />
                 <rect x="6.5" y="7.5" width="11" height="6" rx="0.5" fill="#ffffff" fillOpacity="0.3" />
                 <path d="M2 16.5C2 15.7 2.7 15 3.5 15H20.5C21.3 15 22 15.7 22 16.5V17C22 17.8 21.3 18.5 20.5 18.5H3.5C2.7 18.5 2 17.8 2 17V16.5Z" fill="#8ca9d3" stroke="#0056b3" strokeWidth="0.5" />
                 <rect x="10" y="15" width="4" height="1" fill="#ffffff" />
               </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Electronics</span>
          </Link>

          <Link href="/search?q=cooker" className="flex flex-col items-center gap-1.5 min-w-max pb-1 active:scale-95 transition-transform group">
            <div className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-amber-50 border border-amber-100/50">
               {/* Home Sofa/Armchair in Orange/Yellow Sunset Gradient */}
               <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <linearGradient id="cushionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#ff9f43" />
                     <stop offset="100%" stopColor="#ffb142" />
                   </linearGradient>
                 </defs>
                 <path d="M4 9C4 7.9 4.9 7 6 7H18C19.1 7 20 7.9 20 9V14H4V9Z" fill="url(#cushionGrad)" stroke="#d35400" strokeWidth="1" />
                 <rect x="3" y="13" width="18" height="4" rx="1" fill="url(#cushionGrad)" stroke="#d35400" strokeWidth="1" />
                 <rect x="2" y="11" width="3" height="6" rx="0.5" fill="url(#cushionGrad)" stroke="#d35400" strokeWidth="1" />
                 <rect x="19" y="11" width="3" height="6" rx="0.5" fill="url(#cushionGrad)" stroke="#d35400" strokeWidth="1" />
                 <rect x="5" y="17" width="2" height="2" fill="#7f8c8d" />
                 <rect x="17" y="17" width="2" height="2" fill="#7f8c8d" />
               </svg>
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
