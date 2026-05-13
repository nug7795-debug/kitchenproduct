'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Layers, ShoppingBag, Users, Settings, BarChart3, Image as ImageIcon, CreditCard, LifeBuoy, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Categories', icon: Layers, href: '/admin/categories' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Banners', icon: ImageIcon, href: '/admin/banners' },
  { name: 'Payments', icon: CreditCard, href: '/admin/payments' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

export const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/login');
    } else {
      alert('Error logging out: ' + error.message);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-slate-900 text-slate-300 transition-transform hidden md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-slate-800">
          <span className="text-xl font-bold text-white">ADMIN<span className="text-orange-500">DASH</span></span>
        </div>
        
        <div className="flex-grow overflow-y-auto px-3 py-6">
          <ul className="space-y-2 font-black text-xs uppercase tracking-widest">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center rounded-2xl p-4 hover:bg-slate-800 hover:text-white transition-all group"
                >
                  <item.icon className="h-5 w-5 text-slate-500 group-hover:text-orange-500 transition-colors" />
                  <span className="ms-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
           <button className="w-full flex items-center rounded-2xl p-4 hover:bg-slate-800 hover:text-white transition-all group text-xs font-black uppercase tracking-widest text-slate-500">
              <LifeBuoy className="h-5 w-5 mr-3 group-hover:text-blue-500" />
              Help Center
           </button>
           <button 
            onClick={handleLogout}
            className="w-full flex items-center rounded-2xl p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group text-xs font-black uppercase tracking-widest">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
           </button>
        </div>
      </div>
    </aside>
  );
};
