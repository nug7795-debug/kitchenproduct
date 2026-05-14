'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlayCircle, Grid, User, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Play', icon: PlayCircle, href: '/play' },
  { name: 'Categories', icon: Grid, href: '/categories' },
  { name: 'Account', icon: User, href: '/account' },
  { name: 'Cart', icon: ShoppingCart, href: '/cart', badge: 7 },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full max-w-[500px] bg-white border-t border-slate-100 flex items-center justify-around py-2 px-1 z-[60] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex flex-col items-center gap-1 min-w-[64px] relative active:scale-90 transition-transform"
          >
            <div className="relative">
              <Icon className={cn(
                "h-[22px] w-[22px] transition-all duration-200",
                isActive ? "text-[#2874f0] fill-[#2874f0]" : "text-slate-500"
              )} />
              {item.badge && (
                <span className="absolute -top-2 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ff4343] text-[10px] font-black text-white border-[2px] border-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] font-bold transition-all duration-200",
              isActive ? "text-[#2874f0]" : "text-slate-500"
            )}>
              {item.name}
            </span>
            {isActive && (
              <div className="absolute -top-[10px] w-full h-[3px] bg-[#2874f0] rounded-full scale-x-50" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
