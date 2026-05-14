'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const FLIPKART_CATS = [
  { name: 'For You', icon: 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header_cart-eed150.svg' }, // Placeholder icon
  { name: 'Fashion', icon: 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8f13a7.png' },
  { name: 'Mobiles', icon: 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/05d708653beff580.png' },
  { name: 'Beauty', icon: 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/480deed3dcf8e330.png' },
  { name: 'Electronics', icon: 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/69c6589653afdb9a.png' },
  { name: 'Home', icon: 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/ab7e2b021f45226.png' },
];

export const CategoriesBar = () => {
  return (
    <div className="flex overflow-x-auto no-scrollbar py-3 px-3 gap-5 bg-[#2874f0]">
      {FLIPKART_CATS.map((cat, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center p-1 border border-white/5 shadow-sm">
             <div className="relative w-full h-full">
               <Image src={cat.icon} alt={cat.name} fill className="object-contain" />
             </div>
          </div>
          <span className="text-[10px] font-bold text-white whitespace-nowrap">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};
