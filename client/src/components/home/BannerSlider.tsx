'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const banners = [
  {
    id: 1,
    title: 'Modern Kitchen Essentials',
    subtitle: 'Upgrade your cooking experience with our premium collection.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop',
    cta: 'Shop Now',
    color: 'bg-blue-600'
  },
  {
    id: 2,
    title: 'Smart Appliances for Smart Homes',
    subtitle: 'Efficiency meets style in our latest smart appliance range.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',
    cta: 'Explore More',
    color: 'bg-orange-600'
  }
];

export const BannerSlider = () => {
  const [current, setCurrent] = React.useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  React.useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-2xl md:h-[500px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          <Image
            src={banners[current].image}
            alt={banners[current].title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold md:text-5xl lg:text-6xl max-w-2xl"
            >
              {banners[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-sm md:text-lg text-gray-200 max-w-xl"
            >
              {banners[current].subtitle}
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Button size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white border-none px-8">
                {banners[current].cta}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              current === i ? "bg-orange-500 w-8" : "bg-white/50"
            )}
          />
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors md:left-8"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors md:right-8"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};
