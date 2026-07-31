'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { cn } from '../../lib/utils';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const headerRef = React.useRef<HTMLDivElement>(null);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    // Initialize shared offer ends time to 15 minutes from now on fresh load/refresh
    const endsAt = Date.now() + 15 * 60 * 1000;
    sessionStorage.setItem('shared_offer_ends_at', endsAt.toString());
  }, [pathname]);

  React.useEffect(() => {
    if (!headerRef.current) return;
    
    // Reset transform style and body class on pathname changes to ensure header is visible
    headerRef.current.style.transform = 'translateY(0)';
    document.body.classList.remove('header-hidden');

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;
      
      if (headerRef.current) {
        if (currentScrollY < 80) {
          headerRef.current.style.transform = 'translateY(0)';
          document.body.classList.remove('header-hidden');
        } else {
          // Use a small 5px threshold to prevent micro-vibrations from toggling the header
          if (Math.abs(diff) > 5) {
            if (diff > 0) {
              // Scrolling down -> Hide header instantly/smoothly
              headerRef.current.style.transform = 'translateY(-100%)';
              document.body.classList.add('header-hidden');
            } else {
              // Scrolling up -> Show header instantly/smoothly
              headerRef.current.style.transform = 'translateY(0)';
              document.body.classList.remove('header-hidden');
            }
          }
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('header-hidden');
    };
  }, [pathname]); // Re-run when pathname changes to hook scroll listeners correctly
  
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
  
  // CSS Header height calculation based on exact header image aspect ratio (1585 / 4133)
  // Max width of wrapper is 500px. If screen is smaller than 500px, it matches 100vw.
  const headerHeightCSS = 'calc(min(100vw, 500px) * 1585 / 4133)';

  return (
    <div className="flex flex-col min-h-screen items-center overflow-x-clip bg-slate-100">
      <div className="w-full bg-white shadow-2xl relative flex flex-col min-h-screen max-w-[500px]">
        {hasHeader && (
          <div 
            ref={headerRef} 
            className="fixed top-0 z-50 w-full max-w-[500px] transition-transform duration-300 ease-in-out transform translate-y-0"
            style={{ height: headerHeightCSS }}
          >
            <Header />
          </div>
        )}
        <main 
          className="flex-grow flex flex-col justify-between"
          style={{ paddingTop: hasHeader ? headerHeightCSS : 0 }}
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
