'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { cn } from '../../lib/utils';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide layout elements on specialized pages
  const isCheckout = pathname?.startsWith('/checkout');
  const isAdmin = pathname?.startsWith('/admin');
  const isSearch = pathname?.startsWith('/search');
  const shouldHide = isCheckout || isAdmin || isSearch;

  return (
    <div className={cn(
      "flex flex-col min-h-screen items-center overflow-x-hidden",
      !shouldHide ? "bg-slate-100" : "bg-transparent"
    )}>
      <div 
        className={cn(
          "w-full relative flex flex-col min-h-screen",
          !shouldHide ? "max-w-[500px] bg-white shadow-2xl" : "max-w-none"
        )}
      >
        {!shouldHide && <Header />}
        <main className={cn(
          "flex-grow",
          !shouldHide ? "pb-20" : ""
        )}>
          {children}
        </main>
        {!shouldHide && <BottomNav />}
      </div>
    </div>
  );
}
