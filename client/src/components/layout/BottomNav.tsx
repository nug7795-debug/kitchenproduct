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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex items-center justify-around py-2 px-1 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex flex-col items-center gap-1 min-w-[64px]"
          >
            <div className="relative">
              <Icon className={cn(
                "h-6 w-6 transition-colors",
                isActive ? "text-[#2874f0] fill-[#2874f0]/10" : "text-slate-500"
              )} />
              {item.badge && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff4343] text-[10px] font-bold text-white border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-colors",
              isActive ? "text-[#2874f0]" : "text-slate-500"
            )}>
              {item.name}
            </span>
            {isActive && (
              <div className="absolute -top-2 w-8 h-1 bg-[#2874f0] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
