'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { cn } from '../../lib/utils';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    // Initialize shared offer ends time to 15 minutes from now on fresh load/refresh
    const endsAt = Date.now() + 15 * 60 * 1000;
    sessionStorage.setItem('shared_offer_ends_at', endsAt.toString());
  }, [pathname]);

  React.useEffect(() => {
    if (!headerRef.current) return;
    
    const updateHeight = () => {
      setHeaderHeight(headerRef.current?.getBoundingClientRect().height || 0);
    };
    
    // Run height update on mount
    updateHeight();
    
    // Reset transform style on pathname changes
    headerRef.current.style.transform = 'translateY(0)';
    
    // Add extra checks to measure after layout/image loads
    const t1 = setTimeout(updateHeight, 300);
    const t2 = setTimeout(updateHeight, 800);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;
      
      if (headerRef.current) {
        if (currentScrollY < 80) {
          headerRef.current.style.transform = 'translateY(0)';
        } else {
          // Use a small 5px threshold to prevent micro-vibrations from toggling the header
          if (Math.abs(diff) > 5) {
            if (diff > 0) {
              // Scrolling down -> Hide header instantly/smoothly
              headerRef.current.style.transform = 'translateY(-100%)';
            } else {
              // Scrolling up -> Show header instantly/smoothly
              headerRef.current.style.transform = 'translateY(0)';
            }
          }
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateHeight);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateHeight);
    };
  }, [pathname]); // Re-run when pathname changes to measure height on different pages
  
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
          <div 
            ref={headerRef} 
            className="fixed top-0 z-50 w-full max-w-[500px] transition-transform duration-300 ease-in-out transform translate-y-0"
          >
            <Header />
          </div>
        )}
        <main 
          className="flex-grow flex flex-col justify-between"
          style={{ paddingTop: hasHeader ? headerHeight : 0 }}
        >
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
