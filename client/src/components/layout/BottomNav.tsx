'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, User, LayoutDashboard, Package, ShoppingCart, CreditCard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const customerItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Categories', icon: Search, href: '/categories' },
  { name: 'Cart', icon: ShoppingBag, href: '/cart', count: 0 },
  { name: 'Wishlist', icon: Heart, href: '/wishlist' },
  { name: 'Account', icon: User, href: '/login' },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  
  if (isAdmin) return null;

  const navItems = customerItems;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50 p-2">
        <div className="grid grid-cols-5 font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex flex-col items-center justify-center px-2 py-2 group relative"
              >
                <div className="relative">
                  <item.icon 
                    className={cn(
                      "w-6 h-6 mb-1 transition-all duration-300",
                      isActive ? "text-orange-500 scale-110" : "text-slate-400 group-hover:text-white"
                    )} 
                  />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white border-2 border-slate-900">
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </div>
                <span 
                  className={cn(
                    "text-[8px] uppercase font-black tracking-widest transition-colors",
                    isActive ? "text-orange-500" : "text-slate-500 group-hover:text-slate-300"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
