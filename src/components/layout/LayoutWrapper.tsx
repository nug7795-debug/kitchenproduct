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
    // Initialize shared offer ends time to 15 minutes from now on fresh load/refresh
    const endsAt = Date.now() + 15 * 60 * 1000;
    sessionStorage.setItem('shared_offer_ends_at', endsAt.toString());
  }, []);
  
  // Hide layout elements on specialized pages
  const isCheckout = pathname?.startsWith('/checkout');
  const isPayment = pathname?.toLowerCase()?.startsWith('/payment') || 
                    pathname?.toLowerCase()?.startsWith('/paymentconfirmation') || 
                    pathname?.toLowerCase()?.startsWith('/paymentfailed');
  const isAdmin = pathname?.startsWith('/admin');
  const isSearch = pathname?.startsWith('/search');
  const isProduct = pathname?.startsWith('/product');
  const shouldHide = isCheckout || isPayment || isAdmin || isSearch || isProduct;

  if (shouldHide) {
    return <>{children}</>;
  }

  const isHomepage = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen items-center overflow-x-hidden bg-slate-100">
      <div className="w-full bg-white shadow-2xl relative flex flex-col min-h-screen max-w-[500px]">
        {pathname !== '/cart' && <Header />}
        <main className={cn("flex-grow flex flex-col justify-between", isHomepage && "pb-[60px]")}>
          <div>
            {children}
          </div>
          {pathname !== '/cart' && <Footer />}
        </main>
        {isHomepage && <BottomNav />}
      </div>
    </div>
  );
}
