'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCcw, Lock, Truck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#172337] text-white select-none font-sans text-left mt-auto border-t-2 border-[#2874f0]">
      {/* 1. Trust & Quality Assurance Strip */}
      <div className="bg-[#212f45] border-b border-[#2d3e58] py-4 px-3">
        <div className="max-w-[520px] mx-auto grid grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-start gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#2874f0]/20 text-[#2874f0] shrink-0 mt-0.5">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-black text-white leading-tight">100% Original</p>
              <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Direct from certified brands</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#388e3c]/20 text-[#388e3c] shrink-0 mt-0.5">
              <RotateCcw className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-black text-white leading-tight">7-Day Returns</p>
              <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Hassle-free replacement</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#ff9f00]/20 text-[#ff9f00] shrink-0 mt-0.5">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-black text-white leading-tight">Secure Payments</p>
              <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">256-bit SSL encrypted</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#2874f0]/20 text-[#2874f0] shrink-0 mt-0.5">
              <Truck className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-black text-white leading-tight">Free Express Delivery</p>
              <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Fast tracked shipping</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[520px] mx-auto px-4 py-6 space-y-6">
        {/* 2. Structured Policy & Navigation Links */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 border-b border-[#28354a] pb-6">
          {/* Column 1: About */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              About Flpkart
            </h4>
            <ul className="space-y-1.5 text-[11px] font-semibold text-slate-300">
              <li>
                <Link href="/about" className="hover:text-[#2874f0] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2874f0] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#2874f0] transition-colors">
                  Flpkart Stories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#2874f0] transition-colors">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Help & Support */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Help & Support
            </h4>
            <ul className="space-y-1.5 text-[11px] font-semibold text-slate-300">
              <li>
                <Link href="/shipping" className="hover:text-[#2874f0] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/return-refund" className="hover:text-[#2874f0] transition-colors">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2874f0] transition-colors">
                  FAQ & Helpdesk
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2874f0] transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Consumer Policy */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Consumer Policy
            </h4>
            <ul className="space-y-1.5 text-[11px] font-semibold text-slate-300">
              <li>
                <Link href="/return-refund" className="hover:text-[#2874f0] transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#2874f0] transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#2874f0] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-[#2874f0] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2874f0] transition-colors">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Customer Support
            </h4>
            <div className="space-y-1.5 text-[11px] font-semibold text-slate-300">
              <p className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-orange-400 shrink-0" />
                <a href="tel:+918946084219" className="hover:underline text-white">
                  +91 8946084219
                </a>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-[#2874f0] shrink-0" />
                <a href="mailto:support@flpkart.com" className="hover:underline text-white">
                  support@flpkart.com
                </a>
              </p>
              <p className="text-[10px] text-slate-400 pt-0.5">
                Mon – Sat: 9:00 AM – 7:00 PM IST
              </p>
              <p className="text-[10px] text-slate-400">
                24x7 Online Assistance
              </p>
            </div>
          </div>
        </div>

        {/* 3. Registered Office & Mail Us Details (Strict Ad Compliance) */}
        <div className="bg-[#1e2a3f] border border-[#2d3e58] rounded-xl p-3.5 space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-[#ff9f00] shrink-0 mt-0.5" />
            <div className="text-[10.5px] leading-relaxed text-slate-300">
              <p className="font-bold text-white mb-0.5 uppercase tracking-wide">
                Registered Office & Operating Address:
              </p>
              <p className="text-slate-400">
                Flpkart Internet Private Limited, Buildings Alyssa, Begonia & Clove Embassy Tech Village, Outer Ring Road, Devarabeesanahalli Village, Bengaluru, 560103, Karnataka, India
              </p>
              <p className="text-[9.5px] text-slate-400 mt-1">
                CIN: U51109KA2012PTC066107 | GSTIN: 29AABCF1428P1Z8
              </p>
            </div>
          </div>
        </div>

        {/* 4. Flipkart Quick Action Strip */}
        <div className="grid grid-cols-2 gap-2 border-t border-b border-[#28354a] py-3 text-[11px] font-bold text-slate-200">
          <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#f4a43a]/20 flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="2" fill="#f4a43a"/>
                <path d="M8 7V5a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <span>Become a Seller</span>
          </Link>

          <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#f4a43a]/20 flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#f4a43a"/>
              </svg>
            </span>
            <span>Advertise</span>
          </Link>

          <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#f4a43a]/20 flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="10" width="20" height="11" rx="2" fill="#f4a43a"/>
                <circle cx="12" cy="15" r="2" fill="#fff"/>
              </svg>
            </span>
            <span>Gift Cards</span>
          </Link>

          <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#f4a43a]/20 flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#f4a43a"/>
                <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2.5-2.5 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="0.8" fill="#fff"/>
              </svg>
            </span>
            <span>Help Center</span>
          </Link>
        </div>

        {/* 5. Payment Security & Partner Badges */}
        <div className="space-y-2 text-center pt-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            100% Secure & Verified Payment Methods
          </p>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center justify-center border border-slate-700 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'18px'}}>
              <svg viewBox="0 0 50 16" height="8" width="22"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1a1f71">VISA</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-700 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'18px'}}>
              <svg viewBox="0 0 38 24" height="10" width="16"><circle cx="13" cy="12" r="9" fill="#eb001b"/><circle cx="25" cy="12" r="9" fill="#f79e1b"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#ff5f00"/></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-700 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'18px'}}>
              <svg viewBox="0 0 54 16" height="8" width="24"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#1a6b3c">Ru</text><text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#f47920">Pay</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-700 rounded px-1.5 py-0.5 bg-[#016fd0] shrink-0" style={{height:'18px'}}>
              <svg viewBox="0 0 44 14" height="7" width="20"><text x="0" y="11" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">AMEX</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-700 rounded px-1.5 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'18px'}}>
              <span className="text-[8px] font-black text-[#5f259f]">UPI</span>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-700 rounded px-1.5 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'18px'}}>
              <span className="text-[8px] font-bold text-slate-800">NetBanking</span>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-700 rounded px-1.5 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'18px'}}>
              <span className="text-[8px] font-bold text-emerald-700">COD</span>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-700 rounded px-1.5 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'18px'}}>
              <span className="text-[8px] font-bold text-blue-700">Easy EMI</span>
            </span>
          </div>
        </div>

        {/* 6. Legal Ad-Compliance Disclaimer & Copyright */}
        <div className="space-y-3 pt-2 text-center text-slate-400">
          <p className="text-[9.5px] leading-relaxed text-slate-400 font-medium px-2">
            <strong>Disclaimer:</strong> All product names, logos, brands, and trademarks displayed on this site are property of their respective owners. All company, product, and service names used on this website are for identification purposes only. Flpkart is an independent e-commerce store committed to delivering authentic lifestyle, kitchen, and consumer products with 100% buyer protection across India.
          </p>

          <div className="border-t border-[#28354a] pt-3 text-[11px] font-semibold text-slate-400">
            © 2008–2026 Flpkart.com — All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
