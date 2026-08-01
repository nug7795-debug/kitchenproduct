'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { cn } from '../../lib/utils';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  React.useEffect(() => {
    // Initialize shared offer ends time to 15 minutes from now on fresh load/refresh if not exists
    const stored = localStorage.getItem('shared_offer_ends_at');
    if (stored) {
      const endsAt = parseInt(stored, 10);
      if (endsAt > Date.now()) {
        return; // Valid timer exists
      }
    }
    const endsAt = Date.now() + 15 * 60 * 1000;
    localStorage.setItem('shared_offer_ends_at', endsAt.toString());
  }, [pathname]);
  
  // Hide layout elements on specialized pages
  const isCheckout = pathname?.startsWith('/checkout');
  const isPayment = pathname?.toLowerCase()?.startsWith('/payment') || 
                    pathname?.toLowerCase()?.startsWith('/paymentconfirmation') || 
                    pathname?.toLowerCase()?.startsWith('/paymentfailed');
  const isAdmin = pathname?.startsWith('/admin');
  const isSearch = pathname?.startsWith('/search');
  const isProduct = pathname?.startsWith('/product');
  const shouldHide = isCheckout || isPayment || isAdmin || isSearch || isProduct;

  const isFooterPage = pathname === '/about' ||
                       pathname === '/privacy' ||
                       pathname === '/terms' ||
                       pathname === '/disclaimer' ||
                       pathname === '/dmca' ||
                       pathname === '/return-refund' ||
                       pathname === '/affiliate-disclosure' ||
                       pathname === '/contact';

  if (shouldHide) {
    return <>{children}</>;
  }

  const hasHeader = pathname !== '/cart' && !isFooterPage;

  return (
    <div className="flex flex-col min-h-screen items-center overflow-x-clip bg-slate-100">
      <div className="w-full bg-white shadow-2xl relative flex flex-col min-h-screen max-w-[500px]">
        {hasHeader && (
          <div className="w-full max-w-[500px] shrink-0">
            <Header />
          </div>
        )}
        <main className="flex-grow flex flex-col justify-between">
          <div>
            {children}
          </div>
          {pathname !== '/' && pathname !== '/cart' && <Footer />}
        </main>
        {pathname === '/' && <BottomNav />}
      </div>
    </div>
  );
}
