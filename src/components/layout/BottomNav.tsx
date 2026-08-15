'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, SquarePlay, LayoutGrid, User, ShoppingCart } from 'lucide-react';
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
  { name: 'Play', icon: SquarePlay, href: '/', activePath: '/offers' },
  { name: 'Categories', icon: LayoutGrid, href: '/', activePath: '/categories' },
  { name: 'Account', icon: User, href: '/settings', activePath: '/settings' },
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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[520px] bg-white border-t border-slate-200 flex items-center justify-around h-[60px] z-[60] shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
      {itemsWithBadge.map((item) => {
        const isActive = pathname === item.activePath || 
                         (item.activePath !== '/' && pathname.startsWith(item.activePath)) ||
                         (item.activePath === '/' && pathname === '/');
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex flex-col items-center justify-center h-full min-w-[64px] relative select-none cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            <div className="relative flex items-center justify-center">
              <Icon className={cn(
                "h-[23px] w-[23px] transition-colors duration-150",
                isActive 
                  ? "text-[#2874f0]" 
                  : "text-[#71748a]",
                isActive && (item.name === 'Home' || item.name === 'Play') && "fill-[#2874f0]"
              )} />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2 flex h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-[#ff4343] text-[9px] font-black text-white border-[1.5px] border-white shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10.5px] mt-0.5 transition-colors duration-150",
              isActive 
                ? "text-[#2874f0] font-bold" 
                : "text-[#71748a] font-medium"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
