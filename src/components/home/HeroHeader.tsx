'use client';

import * as React from 'react';
import { Search, Camera, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';

const BANNERS = [
  '/banner1.png',
  '/banner2.jpg',
  '/banner3.jpg',
  '/banner4.jpg',
  '/banner5.jpg'
];

const CATEGORIES = [
  { name: 'Mobiles', img: '/cat_mobiles.jpg' },
  { name: 'Electronics', img: '/cat_electronics.jpg' },
  { name: 'Appliances', img: '/cat_appliances.png' },
  { name: 'Furniture', img: '/cat_furniture.jpg' },
  { name: 'Grocery', img: '/cat_grocery.png' }
];

export const HeroHeader = () => {
  const [activeTab, setActiveTab] = React.useState<'flipkart' | 'travel' | 'pay'>('flipkart');
  const [brandMallOn, setBrandMallOn] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Auto-play banner slide show every 3 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('homeList') || document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#bde2ff] via-[#e2f1ff] to-[#ffffff] pb-1 select-none font-sans max-w-[520px] mx-auto">
      {/* Top Rounded Tab Pills Header */}
      <div className="pt-2 px-3 pb-1.5 flex items-center justify-between gap-2">
        {/* Flipkart Tab */}
        <button
          onClick={() => setActiveTab('flipkart')}
          className={`flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 ${
            activeTab === 'flipkart'
              ? 'bg-[#ffda00] border border-[#f5cb00] text-[#111]'
              : 'bg-white text-slate-700 border border-slate-100'
          }`}
        >
          {/* Flipkart Blue Vector Badge */}
          <div className="w-4.5 h-4.5 rounded-full bg-[#2874f0] flex items-center justify-center italic font-black text-white text-[11px] leading-none shrink-0">
            f
          </div>
          <span className="font-extrabold text-[13px] tracking-tight">Flipkart</span>
        </button>

        {/* Travel Tab */}
        <button
          onClick={() => setActiveTab('travel')}
          className={`flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 ${
            activeTab === 'travel'
              ? 'bg-[#ffda00] border border-[#f5cb00] text-[#111]'
              : 'bg-white text-slate-700 border border-slate-100'
          }`}
        >
          {/* Plane Icon */}
          <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          <span className="font-bold text-[13px] tracking-tight">Travel</span>
        </button>

        {/* Pay Tab */}
        <button
          onClick={() => setActiveTab('pay')}
          className={`flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 ${
            activeTab === 'pay'
              ? 'bg-[#ffda00] border border-[#f5cb00] text-[#111]'
              : 'bg-white text-slate-700 border border-slate-100'
          }`}
        >
          {/* Pay Icon */}
          <div className="w-4.5 h-4.5 rounded-full bg-[#00baF2] flex items-center justify-center font-black text-white text-[10px] italic leading-none shrink-0">
            P
          </div>
          <span className="font-bold text-[13px] tracking-tight">Pay</span>
        </button>
      </div>

      {/* Location Bar Row */}
      <div className="px-3 py-1 flex items-center gap-1.5 text-[12px]">
        <MapPin className="w-3.5 h-3.5 text-slate-900 fill-slate-900 shrink-0" />
        <span className="font-bold text-slate-900">Location not set</span>
        <button className="text-[#2874f0] font-bold flex items-center hover:underline">
          Select delivery location
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Brand Mall Toggle & Search Bar Row */}
      <div className="px-3 pt-1 pb-2 flex items-center gap-2">
        {/* Brand Mall Toggle */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-slate-800 leading-tight">Brand Mall</span>
          <button
            onClick={() => setBrandMallOn(!brandMallOn)}
            className={`w-9 h-4.5 rounded-full p-0.5 transition-colors duration-200 flex items-center mt-0.5 ${
              brandMallOn ? 'bg-[#2874f0] justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-white shadow-md block" />
          </button>
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-tighter leading-none mt-0.5">
            {brandMallOn ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Search Input Box */}
        <div className="flex-1 bg-white border border-slate-200 rounded-full h-10 px-3.5 flex items-center gap-2.5 shadow-2xs">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="mobiles"
            onClick={scrollToProducts}
            readOnly
            className="w-full bg-transparent text-[13px] text-slate-800 placeholder-slate-500 focus:outline-none cursor-pointer"
          />
          <Camera className="w-4 h-4 text-slate-500 shrink-0 cursor-pointer" />
        </div>
      </div>

      {/* Hero Banner Carousel (Slide Show) */}
      <div className="px-2.5 pt-0.5">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-white aspect-[960/460]">
          {/* Banner Images */}
          {BANNERS.map((bannerUrl, index) => (
            <div
              key={bannerUrl}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={bannerUrl}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          ))}

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/35 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/35 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === i
                    ? 'w-5 h-1.5 bg-white shadow-sm'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 5 Categories Row Grid */}
      <div className="bg-white mt-2 px-1 pt-2 pb-1">
        <div className="grid grid-cols-5 gap-1">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={scrollToProducts}
              className="flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-transform group-active:scale-95 overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[12px] font-medium text-[#212121] mt-1 leading-snug">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
