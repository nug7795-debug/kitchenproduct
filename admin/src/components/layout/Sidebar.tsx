import Link from 'next/link';
import { LayoutDashboard, Package, Layers, ShoppingBag, Users, Settings, BarChart3, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Products', icon: Package, href: '/products' },
  { name: 'Categories', icon: Layers, href: '/categories' },
  { name: 'Orders', icon: ShoppingBag, href: '/orders' },
  { name: 'Banners', icon: ImageIcon, href: '/banners' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-slate-950 text-slate-300 transition-transform">
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <span className="text-xl font-bold text-white">ADMIN<span className="text-orange-500">DASH</span></span>
      </div>
      <div className="overflow-y-auto px-3 py-4">
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center rounded-lg p-2 hover:bg-slate-800 hover:text-white transition-colors group"
              >
                <item.icon className="h-5 w-5 transition duration-75" />
                <span className="ms-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
