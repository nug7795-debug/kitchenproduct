'use client';

import * as React from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, MapPin, Mail } from 'lucide-react';

export const Footer = () => {
  const [settings, setSettings] = React.useState({
    storeName: 'Kitchen Product',
    supportEmail: 'kitchenproduct@gmail.com'
  });

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'global_settings')
          .maybeSingle();
        if (data?.value) {
          setSettings({
            storeName: data.value.storeName || 'Kitchen Product',
            supportEmail: data.value.supportEmail || 'kitchenproduct@gmail.com'
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  return (
    <footer className="bg-slate-900 text-white pt-10 pb-20 mt-auto w-full">
      <div className="px-6 space-y-8">
        {/* Brand Header */}
        <div className="space-y-3">
          <Link href="/" className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 uppercase">
            <span className="text-[#fbde3b]">★</span> {settings.storeName}
          </Link>
          <p className="text-slate-400 text-xs font-bold leading-relaxed">
            Your premium destination for kitchen tools, cookware, and professional appliances in India.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-b border-slate-800 py-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500">Navigation</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><Link href="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500">Legal & Policies</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-orange-400 transition-colors">Disclaimer</Link></li>
              <li><Link href="/dmca" className="hover:text-orange-400 transition-colors">DMCA</Link></li>
              <li><Link href="/return-refund" className="hover:text-orange-400 transition-colors">Return & Refund</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-orange-400 transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Support Box */}
        <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl flex gap-3 items-center">
          <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Need help? Email us</p>
            <a href={`mailto:${settings.supportEmail}`} className="text-xs font-bold text-slate-200 hover:underline">
              {settings.supportEmail}
            </a>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="text-[10px] text-slate-500 leading-relaxed text-center border-t border-slate-800 pt-4 px-2">
          <p className="font-bold mb-1 text-slate-400 uppercase tracking-wider">Affiliate Disclosure</p>
          <p>
            kitchenandhomeproducts.vercel.app is a participant in affiliate marketing programs. 
            We may earn a small commission on qualifying purchases made through our links, 
            at no extra cost to you.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="space-y-4 pt-4">
          <p className="text-[10px] font-bold text-slate-500 tracking-wide text-center">
            © 2026 Kitchen Product. All Rights Reserved.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#388e3c]" /> PCI-DSS COMPLIANT
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-orange-500" /> MADE IN INDIA
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
