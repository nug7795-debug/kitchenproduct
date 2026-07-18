'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const BANNERS_DATA = [
  {
    id: '1',
    title: 'BIG BILLION DAYS',
    subtitle: 'Pressure Cookers & Cookware Sets',
    offer: '40% - 80% OFF',
    priceText: 'Starting from ₹399',
    bg: 'linear-gradient(135deg, #ff9900 0%, #ff5500 100%)',
    productImg: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'BIG BILLION DAYS SPECIAL',
    subtitle: 'Premium Juicers & Mixers',
    offer: 'MIN 50% OFF',
    priceText: 'Extra 5% UPI Cashback',
    bg: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    productImg: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'BIG BILLION DAYS FESTIVE',
    subtitle: 'Kadai, Fry Pan & Tawa Combos',
    offer: 'FLAT 50% OFF',
    priceText: 'Free Delivery Today',
    bg: 'linear-gradient(135deg, #9f2089 0%, #761865 100%)',
    productImg: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop'
  }
];

export const BannerSlider = () => {
  const [current, setCurrent] = React.useState(0);

  const next = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % BANNERS_DATA.length);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = BANNERS_DATA[current];

  return (
    <div className="w-full bg-[#f1f3f6] select-none">
      <div className="relative mx-3.5 mt-1.5 aspect-[2/1] overflow-hidden rounded-2xl shadow-3xs">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0.5, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.5, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative h-full w-full flex items-center justify-between p-4 px-6 text-white"
            style={{ background: slide.bg }}
          >
            {/* Left Content Column */}
            <div className="flex flex-col justify-center space-y-1.5 max-w-[62%] z-10">
              <div className="space-y-0.5 pt-1">
                <span className="text-[10px] font-black tracking-widest text-[#FFE11B] block uppercase opacity-95">
                  {slide.title}
                </span>
                <h3 className="text-sm font-black tracking-tight leading-tight line-clamp-2">
                  {slide.subtitle}
                </h3>
              </div>

              <div className="space-y-0.5">
                <div className="text-lg font-black text-[#FFE11B] leading-none tracking-tighter">
                  {slide.offer}
                </div>
                <div className="text-[10px] font-bold opacity-90 leading-tight">
                  {slide.priceText}
                </div>
              </div>
            </div>

            {/* Right Product & BBD Logo Column */}
            <div className="relative h-full w-[35%] flex items-center justify-center">
              {/* BBD Floating Circular Badge */}
              <div className="absolute -top-1 -right-2 w-14 h-14 rounded-full overflow-hidden border-2 border-[#FFE11B] shadow-md z-20 bg-[#9f2089]">
                <img 
                  src="/bbd_logo.jpg" 
                  alt="The Big Billion Days" 
                  className="w-full h-full object-cover scale-110" 
                />
              </div>

              {/* Product Cutout Image */}
              <div className="h-[82%] w-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-2xs border border-white/15 flex items-center justify-center p-1.5 shadow-sm">
                <img
                  src={slide.productImg}
                  alt={slide.subtitle}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xs pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* Bottom Advertisement Tag */}
            <div className="absolute bottom-2.5 left-4.5 bg-black/25 text-[7px] text-white/90 px-1 py-0.5 rounded-xs font-semibold tracking-wider backdrop-blur-3xs">
              AD
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Dots Indicators */}
      <div className="flex justify-center items-center mt-2.5 pb-2 space-x-1.5">
        {BANNERS_DATA.map((_, i) => (
          <div
            key={i}
            className={cn(
              "transition-all duration-300",
              current === i 
                ? "w-8 h-1 bg-[#111111] rounded-full" 
                : "w-1.5 h-1.5 bg-[#d6d8db] rounded-full"
            )}
          />
        ))}
      </div>
    </div>
  );
};
