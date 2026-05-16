'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide layout elements on specialized pages
  const isCheckout = pathname?.startsWith('/checkout');
  const isAdmin = pathname?.startsWith('/admin');
  const isSearch = pathname?.startsWith('/search');
  const shouldHide = isCheckout || isAdmin || isSearch;

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 items-center overflow-x-hidden">
      <div 
        className="w-full bg-white shadow-2xl relative flex flex-col min-h-screen" 
        style={{ maxWidth: '500px', margin: '0 auto' }}
      >
        {!shouldHide && <Header />}
        <main className={`flex-grow ${!shouldHide ? 'pb-20' : ''}`}>
          {children}
        </main>
        {!shouldHide && <BottomNav />}
      </div>
    </div>
  );
}
