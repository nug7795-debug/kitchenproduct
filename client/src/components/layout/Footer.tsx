'use client';

import * as React from 'react';
import Link from 'next/link';
import { MessageCircle, Send, Camera, Video, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-20 border-b border-slate-800">
           {[
             { icon: ShieldCheck, title: 'Secure Payment', desc: '100% Secure UPI & Cards' },
             { icon: Truck, title: 'Fast Delivery', desc: 'Across India within 3-5 days' },
             { icon: RotateCcw, title: 'Easy Returns', desc: '7-day replacement policy' },
             { icon: Headphones, title: '24/7 Support', desc: 'Dedicated kitchen experts' },
           ].map((benefit, i) => (
             <div key={i} className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-lg shadow-black/20">
                   <benefit.icon className="h-6 w-6" />
                </div>
                <div>
                   <p className="font-black text-sm uppercase tracking-tight">{benefit.title}</p>
                   <p className="text-xs text-slate-400 font-bold uppercase">{benefit.desc}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Main Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 py-20">
           <div className="lg:col-span-4 space-y-8">
              <Link href="/" className="text-2xl font-black tracking-tighter flex items-center">
                KITCHEN<span className="text-orange-500">PRODUCT</span>
              </Link>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                Elevate your culinary experience with professional-grade tools and premium kitchen appliances. Trusted by thousands of home chefs across India.
              </p>
              <div className="flex gap-4">
                 {[MessageCircle, Send, Camera, Video].map((Icon, i) => (
                   <button key={i} className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                      <Icon className="h-5 w-5" />
                   </button>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Shop</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                 <li><Link href="/categories/appliances" className="hover:text-orange-500 transition-colors">Appliances</Link></li>
                 <li><Link href="/categories/cookware" className="hover:text-orange-500 transition-colors">Cookware</Link></li>
                 <li><Link href="/categories/accessories" className="hover:text-orange-500 transition-colors">Accessories</Link></li>
                 <li><Link href="/offers" className="hover:text-orange-500 transition-colors text-orange-400">Exclusive Offers</Link></li>
              </ul>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Company</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                 <li><Link href="/about" className="hover:text-orange-500 transition-colors">Our Story</Link></li>
                 <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
                 <li><Link href="/blog" className="hover:text-orange-500 transition-colors">Culinary Blog</Link></li>
                 <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              </ul>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-6">
                 <h4 className="font-black text-lg tracking-tight">Join the Inner Circle</h4>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Get early access to drops & recipes.</p>
                 <div className="relative">
                    <input type="email" placeholder="chef@example.com" className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-orange-500 transition-all" />
                    <button className="absolute right-2 top-2 bottom-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 flex items-center justify-center transition-all">
                       <ArrowRight className="h-5 w-5" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              © 2024 KitchenProduct Premium India. All Rights Reserved.
           </p>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <ShieldCheck className="h-4 w-4 text-green-500" /> PCI-DSS COMPLIANT
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <MapPin className="h-4 w-4 text-orange-500" /> MADE IN INDIA
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};
