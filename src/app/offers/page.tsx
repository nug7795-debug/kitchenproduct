'use client';

import * as React from 'react';
import { ProductCard } from '../../components/product/ProductCard';
import { motion } from 'framer-motion';
import { Percent, Timer, Tag } from 'lucide-react';

const offers = [
  {
    id: 'off1',
    name: 'Pro-Mixer Master',
    category: 'Appliances',
    price: 12999,
    salePrice: 9999,
    imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8ca28?q=80&w=1974&auto=format&fit=crop',
    rating: 4.9
  },
  {
    id: 'off2',
    name: 'Smart Induction Cooktop',
    category: 'Appliances',
    price: 4500,
    salePrice: 3899,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop',
    rating: 4.7
  },
  {
    id: 'off3',
    name: 'Steel-Core Cookware Set',
    category: 'Cookware',
    price: 8499,
    salePrice: 6299,
    imageUrl: 'https://images.unsplash.com/photo-1584990333910-efed3bc651d5?q=80&w=1974&auto=format&fit=crop',
    rating: 4.5
  }
];

export default function OffersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-rose-500 p-8 md:p-16 text-white mb-16">
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm mb-4">
            <Timer className="h-4 w-4 animate-pulse" /> Limited Time Remaining
          </div>
          <h1 className="text-4xl font-bold md:text-6xl max-w-2xl">Weekend Flash Sale Extravaganza</h1>
          <p className="mt-6 text-lg text-rose-100 max-w-xl">
            Save big on your favorite kitchen essentials. These prices won't last long!
          </p>
          <div className="mt-10 flex gap-4">
            <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl backdrop-blur-md min-w-[80px]">
              <span className="text-2xl font-bold">08</span>
              <span className="text-[10px] uppercase font-bold tracking-tighter">Hours</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl backdrop-blur-md min-w-[80px]">
              <span className="text-2xl font-bold">45</span>
              <span className="text-[10px] uppercase font-bold tracking-tighter">Mins</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl backdrop-blur-md min-w-[80px]">
              <span className="text-2xl font-bold">22</span>
              <span className="text-[10px] uppercase font-bold tracking-tighter">Secs</span>
            </div>
          </div>
        </div>
        
        {/* Background Icons */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
          <Percent size={400} strokeWidth={1} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="mt-16 bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Extra 10% Off</h3>
            <p className="text-slate-500">Use code <span className="font-bold text-slate-900">KITCHEN10</span> at checkout</p>
          </div>
        </div>
        <button className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95">
          Copy Code
        </button>
      </div>
    </div>
  );
}
