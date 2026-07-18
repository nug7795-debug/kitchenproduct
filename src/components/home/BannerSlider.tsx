'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const BANNERS = [
  '/banners/banner1.png',
  '/banners/banner2.png',
  '/banners/banner3.png'
];

export const BannerSlider = () => {
  const [current, setCurrent] = React.useState(0);

  const next = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="w-full bg-[#f1f3f6] select-none">
      <div className="relative mx-3.5 mt-1.5 aspect-[2/1] overflow-hidden rounded-2xl bg-white shadow-3xs">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0.5, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.5, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative h-full w-full"
          >
            <img
              src={BANNERS[current]}
              alt={`Banner ${current + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            {/* Bottom Advertisement Tag */}
            <div className="absolute bottom-2.5 right-2.5 bg-black/25 text-[7px] text-white/90 px-1 py-0.5 rounded-xs font-semibold tracking-wider backdrop-blur-3xs">
              AD
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Dots Indicators */}
      <div className="flex justify-center items-center mt-2.5 pb-2 space-x-1.5">
        {BANNERS.map((_, i) => (
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
