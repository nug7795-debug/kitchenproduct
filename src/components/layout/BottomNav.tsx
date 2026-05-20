'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlayCircle, Grid, User, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  icon: React.ComponentType<any>;
  href: string;
  activePath: string;
  badge?: number | string;
}

const navItems: NavItem[] = [
  { name: 'Home', icon: Home, href: '/', activePath: '/' },
  { name: 'Play', icon: PlayCircle, href: '/', activePath: '/play' },
  { name: 'Categories', icon: Grid, href: '/', activePath: '/categories' },
  { name: 'Account', icon: User, href: '/', activePath: '/account' },
  { name: 'Cart', icon: ShoppingCart, href: '/cart', activePath: '/cart' },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const updateCount = () => {
      try {
        const cached = localStorage.getItem('cart_items');
        if (cached) {
          const items = JSON.parse(cached);
          setCartCount(Array.isArray(items) ? items.length : 0);
        } else {
          setCartCount(0);
        }
      } catch { setCartCount(0); }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  // Inject badge into Cart nav item dynamically
  const itemsWithBadge = navItems.map(item =>
    item.name === 'Cart' && cartCount > 0 ? { ...item, badge: cartCount } : item
  );

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white border-t border-slate-100 flex items-center justify-around py-2 px-1 z-[60] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {itemsWithBadge.map((item) => {
        const isActive = pathname === item.activePath;
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
