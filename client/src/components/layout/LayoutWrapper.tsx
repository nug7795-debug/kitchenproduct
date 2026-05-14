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
    <>
      {!shouldHide && <Header />}
      <main className={`flex-grow ${!shouldHide ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>
      {!shouldHide && <BottomNav />}
      {!shouldHide && <Footer />}
    </>
  );
}
