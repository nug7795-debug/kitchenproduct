'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Layers, ShoppingBag, Users, Settings, BarChart3, Image as ImageIcon, CreditCard, LifeBuoy, LogOut, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Categories', icon: Layers, href: '/admin/categories' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Banners', icon: ImageIcon, href: '/admin/banners' },
  { name: 'Reviews', icon: Star, href: '/admin/reviews' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
    } else {
      alert('Error logging out: ' + error.message);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-[#0F172A] text-slate-400 transition-all duration-300 hidden md:block shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center px-8 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">ADMIN<span className="text-orange-500">PRO</span></span>
          </div>
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

        <div className="p-4 border-t border-slate-800/50">
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
  );
};
