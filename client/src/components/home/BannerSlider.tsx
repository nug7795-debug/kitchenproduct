'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

export const BannerSlider = () => {
  const [current, setCurrent] = React.useState(0);
  const [banners, setBanners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setBanners(data);
      } else {
        // Fallback banners
        setBanners([
          { id: '1', title: 'Sale', image_url: 'https://static-assets-web.flixcart.com/fk-p-flap/1600/270/image/7a2707328905a5a9.jpg' },
          { id: '2', title: 'SBI', image_url: 'https://static-assets-web.flixcart.com/fk-p-flap/1600/270/image/f1bd38c83177d612.png' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBanners();
  }, []);

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
    <div className="px-3 py-2 bg-white">
      <div className="relative w-full aspect-[16/8] overflow-hidden rounded-2xl shadow-sm">
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
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            <div className="absolute top-2 right-2 bg-black/40 text-[7px] text-white px-2 py-0.5 rounded-full font-black tracking-widest backdrop-blur-sm">AD</div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 space-x-1.5 items-center">
          {banners.map((_, i) => (
            <div
              key={i}
              className={cn(
                "transition-all duration-300",
                current === i 
                  ? "w-8 h-1.5 bg-black rounded-full" 
                  : "w-1.5 h-1.5 bg-slate-300 rounded-full"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
