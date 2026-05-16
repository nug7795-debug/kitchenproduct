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

  if (shouldHide) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen items-center overflow-x-hidden bg-slate-100">
      <div className="w-full bg-white shadow-2xl relative flex flex-col min-h-screen max-w-[500px]">
        <Header />
        <main className="flex-grow pb-20">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
