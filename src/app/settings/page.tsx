'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="w-full bg-[#f1f3f6] min-h-screen flex flex-col items-center pb-[72px]">
      <div className="w-full max-w-[460px] bg-white min-h-screen flex flex-col shadow-md relative">
        
        {/* Custom Header */}
        <div className="sticky top-0 z-50 flex items-center px-4 py-3.5 bg-white shadow-xs border-b border-slate-100 h-[52px]">
          <span className="text-[17px] font-black text-[#2874f0] tracking-tight">My Account</span>
        </div>

        {/* 1. Explore Black Banner */}
        <div className="w-full px-4 py-4 bg-[#f0f4ff] flex flex-col gap-3 select-none">
          <div className="flex flex-col gap-1">
            <span className="text-[13.5px] font-bold text-[#1c54d4] leading-tight">
              Enjoy FREE YouTube Premium,
            </span>
            <span className="text-[13.5px] font-bold text-[#1c54d4] leading-tight">
              Early Access to sale and more with Black.
            </span>
          </div>
          <div>
            <button className="bg-black hover:bg-slate-900 active:scale-95 transition-all text-white text-[11px] font-black uppercase px-4 py-2.5 rounded-md tracking-wider flex items-center justify-center gap-1">
              Explore <span className="text-white font-extrabold text-[12px] italic tracking-tighter">BLACK</span>
            </button>
          </div>
        </div>

        {/* 2. 2x2 Action Grid */}
        <div className="w-full bg-[#f1f3f6] py-2 px-0 select-none">
          <div className="grid grid-cols-2 gap-2.5 px-3">
            
            {/* Orders Card */}
            <div className="bg-white border border-[#e0e0e0] rounded-md p-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
              <svg className="w-6.5 h-6.5 text-[#1c54d4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span className="text-[14px] font-black text-[#1c54d4] tracking-tight">Orders</span>
            </div>

            {/* Wishlist Card */}
            <div className="bg-white border border-[#e0e0e0] rounded-md p-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
              <svg className="w-6.5 h-6.5 text-[#1c54d4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-[14px] font-black text-[#1c54d4] tracking-tight">Wishlist</span>
            </div>

            {/* Coupons Card */}
            <div className="bg-white border border-[#e0e0e0] rounded-md p-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
              <svg className="w-6.5 h-6.5 text-[#1c54d4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
              </svg>
              <span className="text-[14px] font-black text-[#1c54d4] tracking-tight">Coupons</span>
            </div>

            {/* Help Center Card */}
            <div className="bg-white border border-[#e0e0e0] rounded-md p-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
              <svg className="w-6.5 h-6.5 text-[#1c54d4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="9" r="1" />
                <line x1="12" y1="13" x2="12" y2="13" />
              </svg>
              <span className="text-[14px] font-black text-[#1c54d4] tracking-tight">Help Center</span>
            </div>

          </div>
        </div>

        {/* 3. Add/Verify Email Card */}
        <div className="w-full bg-[#f1f3f6] pb-2 px-0 select-none">
          <div className="bg-white border-y border-slate-200 py-3.5 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Custom Envelope Icon with Gradients */}
              <svg className="w-9 h-9 shrink-0" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="emailGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFAF00" />
                    <stop offset="100%" stopColor="#FF5F00" />
                  </linearGradient>
                </defs>
                <path d="M4 8h28v20H4z" fill="url(#emailGrad1)" />
                <path d="M4 8l14 11L32 8" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M4 28l11-9M32 28L21 19" stroke="white" strokeWidth="2" />
              </svg>
              
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-[13.5px] font-black text-slate-900 flex items-center gap-1.5">
                  Add/Verify your Email <span className="h-1.5 w-1.5 rounded-full bg-[#ff3f3f]" />
                </span>
                <span className="text-[11.5px] font-extrabold text-[#1c54d4] mt-0.5">
                  Get latest updates of your orders
                </span>
              </div>
            </div>

            <button className="bg-[#2874f0] hover:bg-blue-600 active:scale-95 transition-all text-white text-[12px] font-black py-2 px-4 rounded-[4px] shadow-xs">
              Update
            </button>
          </div>
        </div>

        {/* 4. Finance Options Section */}
        <div className="w-full bg-white flex flex-col select-none">
          <div className="px-4 py-3.5 border-b border-slate-100">
            <span className="text-[15.5px] font-black text-slate-900 tracking-tight">Finance Options</span>
          </div>

          {/* Flipkart Personal Loan */}
          <div className="w-full p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3.5">
              <svg className="w-8 h-8 text-[#1c54d4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
                <path d="M9 6h6v4H9z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[13.5px] font-black text-[#1c54d4]">Flipkart Personal Loan</span>
                <span className="text-[11.5px] font-bold text-slate-500 mt-0.5">Instant Cash upto ₹10,00,000</span>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          </div>

          {/* Flipkart EMI */}
          <div className="w-full p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3.5">
              <svg className="w-8 h-8 text-[#1c54d4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h2M10 15h4" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[13.5px] font-black text-[#1c54d4] flex items-center gap-1">
                  Flipkart EMI - <span className="text-green-600 font-extrabold text-[12.5px]">Only for you!</span>
                </span>
                <span className="text-[11.5px] font-bold text-slate-500 mt-0.5">Upto ₹750 off | No Cost EMI*</span>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          </div>

          {/* Apply Now SBI */}
          <div className="w-full p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3.5">
              <svg className="w-8 h-8 text-[#1c54d4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h2M6 12h8" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[13.5px] font-black text-[#1c54d4]">Apply Now for Flipkart SBI Credit Card</span>
                <span className="text-[11.5px] font-bold text-slate-500 mt-0.5">5% Cashback | ₹1250 Welcome Vouchers</span>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* 5. Finance On UPI Section */}
        <div className="w-full bg-white flex flex-col select-none mt-2 border-t border-slate-100">
          <div className="px-4 py-3.5 border-b border-slate-100">
            <span className="text-[15.5px] font-black text-slate-900 tracking-tight">Finance On UPI</span>
          </div>

          {/* superCard */}
          <div className="w-full p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3.5">
              <svg className="w-8 h-8 text-[#1c54d4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 10h18" />
                <path d="M7 15h.01M11 15h.01" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[13.5px] font-black text-[#1c54d4]">superCard | Buy Now Pay later in 3</span>
                <span className="text-[11.5px] font-bold text-slate-500 mt-0.5">Enjoy 3% cashback | Activate Fk UPI and pay in 3 months</span>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          </div>
        </div>

      </div>
    </div>
  );
}
