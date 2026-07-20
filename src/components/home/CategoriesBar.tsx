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
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (data) {
          const filtered = data.filter((cat: any) => {
            const name = (cat.name || '').toLowerCase();
            return name.includes('home') || name.includes('kitchen') || name.includes('appliance');
          });
          setCategories(filtered);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Default icons if none in DB
  const getIcon = (cat: any) => {
    if (cat.image_url) return cat.image_url;
    const name = cat.name.toLowerCase();
    if (name.includes('mob')) return 'https://rukminim2.flixcart.com/flap/128/128/image/22fddf3510011279.png?q=100';
    if (name.includes('fashion')) return 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8f13a7.png?q=100';
    if (name.includes('elec')) return 'https://rukminim2.flixcart.com/flap/128/128/image/69cffacc2c18036c.png?q=100';
    if (name.includes('home')) return 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2c021f97a8fe.png?q=100';
    if (name.includes('app')) return 'https://rukminim2.flixcart.com/flap/128/128/image/0ff097d12432bbd3.png?q=100';
    if (name.includes('beauty')) return 'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100';
    if (name.includes('grocery')) return 'https://rukminim2.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100';
    if (name.includes('toy')) return 'https://rukminim2.flixcart.com/flap/128/128/image/dca37fb30d87393f.png?q=100';
    return 'https://rukminim2.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100'; // Top Offers
  };

  return (
    <div className="flex overflow-x-auto no-scrollbar py-3 px-3 gap-5 bg-white border-b border-slate-100">
      {loading ? (
        Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 animate-pulse">
            <div className="h-[52px] w-[52px] rounded-full bg-slate-100" />
            <div className="h-2 w-10 bg-slate-100 rounded" />
          </div>
        ))
      ) : (
        categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.id}`} className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition-transform group">
            <div className="h-[52px] w-[52px] rounded-full flex items-center justify-center p-1 bg-slate-50 border border-slate-50 transition-all group-hover:shadow-md">
               <img 
                 src={getIcon(cat)} 
                 alt={cat.name} 
                 className="w-full h-full object-contain drop-shadow-sm"
               />
            </div>
            <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap tracking-tight">{cat.name}</span>
          </Link>
        ))
      )}
    </div>
  );
};
