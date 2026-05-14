'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { 
  Sparkles, 
  Shirt, 
  Smartphone, 
  Heart, 
  Cpu, 
  Home as HomeIcon, 
  Gamepad2, 
  WashingMachine, 
  Plane, 
  LayoutGrid 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const CATEGORIES = [
  { name: 'For You', icon: '🎁', color: 'bg-blue-50' },
  { name: 'Fashion', icon: '👕', color: 'bg-pink-50' },
  { name: 'Mobiles', icon: '📱', color: 'bg-green-50' },
  { name: 'Beauty', icon: '💄', color: 'bg-red-50' },
  { name: 'Electronics', icon: '💻', color: 'bg-purple-50' },
  { name: 'Home', icon: '🏠', color: 'bg-orange-50' },
  { name: 'Appliances', icon: '🧺', color: 'bg-cyan-50' },
  { name: 'Travel', icon: '✈️', color: 'bg-indigo-50' },
];

export const CategoriesBar = () => {
  return (
    <div className="flex overflow-x-auto no-scrollbar py-5 px-3 gap-6 bg-[#2874f0]">
      {CATEGORIES.map((cat, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0 active:scale-95 transition-transform">
          <div className="h-[56px] w-[56px] rounded-2xl bg-white flex items-center justify-center text-3xl shadow-lg border border-white/20 relative overflow-hidden">
             {cat.icon}
          </div>
          <span className="text-[11px] font-black text-white whitespace-nowrap tracking-tight">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};
