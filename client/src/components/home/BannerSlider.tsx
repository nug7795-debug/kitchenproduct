'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

export const BannerSlider = () => {
  const [banners, setBanners] = React.useState<any[]>([]);
  const [current, setCurrent] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (data && data.length > 0) {
        setBanners(data);
      } else {
        // Fallback banners if none in DB
        setBanners([
          {
            id: '1',
            title: 'Mobiles Sale',
            image_url: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/7a2707328905a5a9.jpg',
          },
          {
            id: '2',
            title: 'Electronics',
            image_url: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/f1bd38c83177d612.png',
          },
          {
            id: '3',
            title: 'Home Appliances',
            image_url: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/0d75b34f7d8f13a7.png',
          }
        ]);
      }
      setLoading(false);
    };

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

  if (loading) {
    return (
      <div className="w-full aspect-[21/9] md:aspect-[21/7] rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
        <ImageIcon className="h-10 w-10 text-slate-200" />
      </div>
    );
  }

  return (
    <div className="px-3 py-2 bg-white">
      <div className="relative w-full aspect-[16/8] overflow-hidden rounded-2xl shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={banners[current]?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={banners[current]?.image_url}
              alt={banners[current]?.title || 'Banner'}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/40 text-[7px] text-white px-2 py-0.5 rounded-full font-black tracking-widest backdrop-blur-sm">AD</div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 space-x-1">
          {banners.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 transition-all duration-300",
                current === i ? "w-4 bg-black/60 rounded-full" : "w-1 bg-black/20 rounded-full"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
