'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChefHat, Utensils, Zap, Coffee, Package } from 'lucide-react';

const categories = [
  {
    id: 'appliances',
    name: 'Smart Appliances',
    description: 'Next-gen kitchen tools for efficiency.',
    icon: <Package className="h-8 w-8" />,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop',
    color: 'bg-orange-500',
    itemCount: 42
  },
  {
    id: 'cookware',
    name: 'Premium Cookware',
    description: 'Durable and elegant sets for every chef.',
    icon: <ChefHat className="h-8 w-8" />,
    image: 'https://images.unsplash.com/photo-1584990333910-efed3bc651d5?q=80&w=1974&auto=format&fit=crop',
    color: 'bg-blue-600',
    itemCount: 28
  },
  {
    id: 'accessories',
    name: 'Kitchen Gadgets',
    description: 'Small tools that make a big difference.',
    icon: <Zap className="h-8 w-8" />,
    image: 'https://images.unsplash.com/photo-1593611664162-f79cb73774cd?q=80&w=2070&auto=format&fit=crop',
    color: 'bg-purple-600',
    itemCount: 15
  },
  {
    id: 'dining',
    name: 'Dining & Decor',
    description: 'Beautiful items for your dinner table.',
    icon: <Utensils className="h-8 w-8" />,
    image: 'https://images.unsplash.com/photo-1574937753447-57ac2fab7e57?q=80&w=2070&auto=format&fit=crop',
    color: 'bg-green-600',
    itemCount: 34
  },
  {
    id: 'coffee',
    name: 'Coffee & Tea',
    description: 'Start your morning with the best brews.',
    icon: <Coffee className="h-8 w-8" />,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop',
    color: 'bg-rose-600',
    itemCount: 12
  }
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Shop by Category</h1>
        <p className="mt-4 text-lg text-slate-500">Explore our curated collection of high-quality kitchen products.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/category/${cat.id}`} className="group relative block overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all h-[400px]">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-white">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} text-white shadow-lg`}>
                  {cat.icon}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                      {cat.itemCount} Products
                    </span>
                    <h3 className="mt-1 text-2xl font-bold">{cat.name}</h3>
                    <p className="mt-2 text-sm text-white/80 line-clamp-2 max-w-[250px]">
                      {cat.description}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Specialty Section */}
      <section className="mt-24 rounded-[3rem] bg-slate-950 p-8 md:p-16 text-white overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold md:text-5xl">Professional Grade Kitchenware</h2>
            <p className="mt-6 text-lg text-slate-400">
              We partner with world-renowned chefs to bring you the same tools used in Michelin-starred kitchens.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-full bg-orange-500 px-8 py-4 font-bold hover:bg-orange-600 transition-all">
                Learn More
              </button>
              <button className="rounded-full bg-white/10 px-8 py-4 font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                View Collection
              </button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
              alt="Professional Kitchen"
              fill
              className="object-cover"
            />
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
      </section>
    </div>
  );
}
