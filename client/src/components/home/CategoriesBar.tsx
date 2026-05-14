'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const FLIPKART_CATS = [
  { name: 'For You', icon: '🎁', bgColor: 'bg-blue-50' },
  { name: 'Fashion', icon: '👕', bgColor: 'bg-pink-50' },
  { name: 'Mobiles', icon: '📱', bgColor: 'bg-green-50' },
  { name: 'Beauty', icon: '💄', bgColor: 'bg-purple-50' },
  { name: 'Electronics', icon: '💻', bgColor: 'bg-indigo-50' },
  { name: 'Home', icon: '🪑', bgColor: 'bg-orange-50' },
  { name: 'Appliances', icon: '🍳', bgColor: 'bg-red-50' },
];

export const CategoriesBar = () => {
  return (
    <div className="flex overflow-x-auto no-scrollbar py-4 px-4 gap-6 bg-white border-b border-slate-50">
      {FLIPKART_CATS.map((cat, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
          <div className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-sm border border-slate-100 ${cat.bgColor}`}>
            <span>{cat.icon}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};
