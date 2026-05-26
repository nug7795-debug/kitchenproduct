'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Layers, ShoppingBag, Users, Settings, LifeBuoy, LogOut, Star, Ticket, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Categories', icon: Layers, href: '/admin/categories' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Banners', icon: ImageIcon, href: '/admin/banners' }, // Keep support for ImageIcon even if custom name or imported as ImageIcon
  { name: 'Reviews', icon: Star, href: '/admin/reviews' },
  { name: 'Coupons', icon: Ticket, href: '/admin/coupons' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

import { Image as ImageIcon } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    localStorage.removeItem('admin_session');
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    window.location.href = '/admin';
  };

  return (
    <>
      {/* Click-to-close Backdrop overlay on mobile viewports */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* Sidebar aside panel */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-800 bg-[#0F172A] text-slate-400 transition-transform duration-300 shadow-2xl flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header section with brand and responsive close button */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">ADMIN<span className="text-orange-500">PRO</span></span>
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="md:hidden h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Close Navigation Sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex-grow overflow-y-auto px-4 py-8 no-scrollbar">
            <div className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Main Menu</div>
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose} // Auto-close drawer on link click for seamless mobile navigation UX
                      className={cn(
                        "flex items-center rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 group",
                        isActive 
                          ? "bg-orange-500/10 text-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.2)]" 
                          : "hover:bg-slate-800/50 hover:text-white"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        isActive ? "text-orange-500" : "text-slate-500 group-hover:text-slate-300"
                      )} />
                      <span className="ms-3">{item.name}</span>
                      {isActive && <div className="ms-auto h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Support</div>
            <button className="w-full flex items-center rounded-xl px-4 py-3.5 text-sm font-bold hover:bg-slate-800/50 hover:text-white transition-all duration-300 group">
              <LifeBuoy className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              <span className="ms-3">Help Center</span>
            </button>
          </div>

          <div className="p-4 border-t border-slate-800/50 shrink-0">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center rounded-2xl p-4 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-500 group text-xs font-black uppercase tracking-widest border border-rose-500/10 hover:border-rose-500 shadow-lg hover:shadow-rose-500/20"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
              Logout Account
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
