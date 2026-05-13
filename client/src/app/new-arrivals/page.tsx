'use client';

import * as React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';

const newArrivals = [
  {
    id: 'na1',
    name: 'Smart Induction Hub v2',
    category: 'Appliances',
    price: 8999,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop',
    rating: 5.0
  },
  {
    id: 'na2',
    name: 'Obsidian Knife Set',
    category: 'Cutlery',
    price: 3499,
    imageUrl: 'https://images.unsplash.com/photo-1593611664162-f79cb73774cd?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8
  },
  {
    id: 'na3',
    name: 'Eco-Flow Kettle',
    category: 'Appliances',
    price: 1899,
    imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8ca28?q=80&w=1974&auto=format&fit=crop',
    rating: 4.9
  },
  {
    id: 'na4',
    name: 'Titanium Pan Set',
    category: 'Cookware',
    price: 6799,
    imageUrl: 'https://images.unsplash.com/photo-1584990333910-efed3bc651d5?q=80&w=1974&auto=format&fit=crop',
    rating: 4.7
  }
];

export default function NewArrivalsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">
            <Sparkles className="h-4 w-4" /> Just Landed
          </div>
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">New Arrivals</h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl">
            The latest innovations in kitchen technology and design, fresh in our inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-all font-medium">
            <ArrowDown className="h-4 w-4" /> Sort by: Newest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
        {newArrivals.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>

      {/* Newsletter / Call to Action */}
      <section className="mt-20 rounded-3xl bg-orange-500 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold md:text-3xl">Get early access to new drops</h2>
          <p className="mt-2 text-orange-100">Subscribe to our newsletter and be the first to know about upcoming products.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 rounded-full px-6 py-3 text-slate-900 focus:outline-none min-w-[250px]"
          />
          <button className="rounded-full bg-slate-900 px-6 py-3 font-bold hover:bg-slate-800 transition-all">
            Join Now
          </button>
        </div>
      </section>
    </div>
  );
}
