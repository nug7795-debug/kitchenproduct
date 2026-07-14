'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const LOCAL_BANNERS = [
  { id: '1', title: 'Sale 1', image_url: '/banners/banner1.png' },
  { id: '2', title: 'Sale 2', image_url: '/banners/banner2.png' },
  { id: '3', title: 'Sale 3', image_url: '/banners/banner3.png' },
  { id: '4', title: 'Sale 4', image_url: '/banners/banner4.png' }
];

export const BannerSlider = () => {
  const [current, setCurrent] = React.useState(0);
  const [banners] = React.useState<any[]>(LOCAL_BANNERS);

  const next = () => {
    if (banners.length === 0) return;
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  React.useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  return (
    <div className="w-full bg-[#f1f3f6]">
      {/* Preload first banner image for instant rendering on slow networks */}
      <link rel="preload" href="/banners/banner1.png" as="image" fetchPriority="high" />

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
            {/* Using standard img with no-referrer to bypass CDN blocks */}
            <img
              src={banners[current]?.image_url}
              alt={banners[current]?.title || 'Banner'}
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              style={{ WebkitTouchCallout: 'none' }}
            />
            <div className="absolute bottom-2.5 right-2.5 bg-black/35 text-[7px] text-white px-1.5 py-0.5 rounded-xs font-semibold tracking-wider backdrop-blur-3xs select-none pointer-events-none">AD</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Indicators placed below the banner exactly like native Flipkart */}
      <div className="flex justify-center items-center mt-2.5 pb-2 space-x-1.5">
        {banners.map((_, i) => (
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
