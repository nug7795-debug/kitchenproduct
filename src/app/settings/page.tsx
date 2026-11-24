'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  Languages, 
  Bell, 
  Headphones, 
  Store, 
  HelpCircle 
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();

  return (
    <div className="w-full bg-[#f1f3f6] min-h-screen flex flex-col items-center pb-[72px]">
      <div className="w-full max-w-[460px] bg-[#f1f3f6] min-h-screen flex flex-col shadow-md relative select-none">
        
        {/* Header */}
        <div className="flex items-center px-4 py-3 bg-white shadow-2xs border-b border-slate-200 h-[52px] gap-3.5 sticky top-0 z-10">
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                router.push('/');
              }
            }}
            className="text-slate-800 hover:text-slate-900 active:scale-95 transition-transform outline-none cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5.5 h-5.5 stroke-[2.2]" />
          </button>
          <span className="text-[18px] font-bold text-[#111827] tracking-tight">Account</span>
        </div>

        {/* Top Login Card Banner */}
        <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200">
          <span className="text-[14px] font-bold text-[#111827]">
            Log in to get exclusive offers
          </span>
          <button className="bg-[#2874f0] hover:bg-[#1a64df] active:scale-95 transition-all text-white text-[13px] font-bold px-6 py-2 rounded-md shadow-2xs cursor-pointer">
            Log In
          </button>
        </div>

        {/* 1. Finance On UPI Section */}
        <div className="w-full mt-2 flex flex-col">
          <div className="px-4 py-2.5 bg-[#f1f3f6]">
            <span className="text-[15px] font-bold text-[#111827] tracking-tight">Finance On UPI</span>
          </div>

          <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4.5 h-4.5 text-[#2874f0] stroke-[2.2]" />
              </div>
              <div className="flex flex-col leading-snug">
                <span className="text-[14px] font-bold text-[#111827]">
                  superCard | Buy Now Pay later in 3
                </span>
                <span className="text-[12px] font-medium text-[#4b5563] mt-0.5">
                  Enjoy 3% cashback | Activate Fk UPI and pay in 3 months
                </span>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0 ml-2" />
          </div>
        </div>

        {/* 2. Sponsored Section */}
        <div className="w-full mt-2 flex flex-col">
          <div className="px-4 py-2.5 bg-[#f1f3f6]">
            <span className="text-[15px] font-bold text-[#111827] tracking-tight">Sponsored</span>
          </div>

          <div className="bg-white p-3 border-b border-slate-200/80 flex items-center justify-center">
            <img 
              src="/uploads/airtel_finance_banner.png" 
              alt="Airtel Finance - Pay. Borrow. Bank." 
              className="w-full h-auto object-contain rounded-xl shadow-2xs select-none"
            />
          </div>
        </div>

        {/* 3. Account Settings Section */}
        <div className="w-full mt-2 flex flex-col">
          <div className="px-4 py-2.5 bg-[#f1f3f6]">
            <span className="text-[15px] font-bold text-[#111827] tracking-tight">Account Settings</span>
          </div>

          <div className="bg-white divide-y divide-slate-100 border-b border-slate-200/80">
            {/* Select Language */}
            <div className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Languages className="w-4.5 h-4.5 text-[#2874f0] stroke-[2.2]" />
                </div>
                <span className="text-[14px] font-bold text-[#111827]">Select Language</span>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            </div>

            {/* Notification Settings */}
            <div className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Bell className="w-4.5 h-4.5 text-[#2874f0] stroke-[2.2]" />
                </div>
                <span className="text-[14px] font-bold text-[#111827]">Notification Settings</span>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            </div>

            {/* Help Center */}
            <div className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Headphones className="w-4.5 h-4.5 text-[#2874f0] stroke-[2.2]" />
                </div>
                <span className="text-[14px] font-bold text-[#111827]">Help Center</span>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* 4. Earn with Flpkart Section */}
        <div className="w-full mt-2 flex flex-col">
          <div className="px-4 py-2.5 bg-[#f1f3f6]">
            <span className="text-[15px] font-bold text-[#111827] tracking-tight">Earn with Flpkart</span>
          </div>

          <div className="bg-white border-b border-slate-200/80">
            <div className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Store className="w-4.5 h-4.5 text-[#2874f0] stroke-[2.2]" />
                </div>
                <span className="text-[14px] font-bold text-[#111827]">Sell on Flpkart</span>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* 5. Feedback & Information Section */}
        <div className="w-full mt-2 flex flex-col mb-4">
          <div className="px-4 py-2.5 bg-[#f1f3f6]">
            <span className="text-[15px] font-bold text-[#111827] tracking-tight">Feedback & Information</span>
          </div>

          <div className="bg-white divide-y divide-slate-100 border-b border-slate-200/80">
            {/* Terms, Policies and Licenses */}
            <div className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5 text-[#2874f0] stroke-[2.2]" />
                </div>
                <span className="text-[14px] font-bold text-[#111827]">Terms, Policies and Licenses</span>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            </div>

            {/* Browse FAQs */}
            <div className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4.5 h-4.5 text-[#2874f0] stroke-[2.2]" />
                </div>
                <span className="text-[14px] font-bold text-[#111827]">Browse FAQs</span>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
