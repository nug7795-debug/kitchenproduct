'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getDynamicDeliveryDate } from '@/lib/utils';

export default function CartPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [resolvedLocation, setResolvedLocation] = React.useState('Select Address');

  React.useEffect(() => {
    // 1. Load cart items from localStorage (starts empty)
    const cachedItems = localStorage.getItem('cart_items');
    if (cachedItems) {
      try {
        setItems(JSON.parse(cachedItems));
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }

    // 2. Load address location
    const cachedLocation = localStorage.getItem('user_live_location');
    if (cachedLocation) {
      setResolvedLocation(cachedLocation);
    }
    
    setLoading(false);
  }, []);

  const saveCart = (updatedItems: any[]) => {
    setItems(updatedItems);
    localStorage.setItem('cart_items', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveCart(updated);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f1f3f6]">
        {/* Header */}
        <div className="bg-white text-slate-900 border-b border-slate-100 px-4 py-3.5 flex items-center gap-4 sticky top-0 z-50">
          <Link href="/" className="text-slate-800 hover:text-slate-900"><ChevronLeft className="h-6 w-6" /></Link>
          <h1 className="text-[17px] font-black tracking-tight">My Cart</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // If cart is empty, render the beautifully authentic Flipkart Empty Cart Page
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f1f3f6]">
        {/* Header */}
        <div className="bg-white text-slate-900 border-b border-slate-100 px-4 py-3.5 flex items-center gap-4 sticky top-0 z-50">
          <Link href="/" className="text-slate-800 hover:text-slate-900"><ChevronLeft className="h-6 w-6" /></Link>
          <h1 className="text-[17px] font-black tracking-tight">My Cart</h1>
        </div>

        {/* Empty Cart Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white my-2 mx-0 shadow-sm border-y border-slate-100">
          {/* Authentic Vector Flipkart-Style Empty Cart Illustration */}
          <div className="relative w-44 h-44 mb-6 flex items-center justify-center bg-slate-50 rounded-full border border-slate-100/60 shadow-xs">
            <svg viewBox="0 0 64 64" className="w-24 h-24 text-slate-300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f1f3f6" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>
              {/* Basket contour */}
              <path d="M12 18 L18 42 C 18.5 45, 20.5 46, 23 46 L 49 46 C 51.5 46, 53.5 45, 54 42 L 60 18 Z" fill="url(#cartGrad)" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
              {/* Grid lines */}
              <line x1="22" y1="18" x2="26" y2="46" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="32" y1="18" x2="32" y2="46" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="42" y1="18" x2="38" y2="46" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="52" y1="18" x2="48" y2="46" stroke="#94a3b8" strokeWidth="1.5" />
              
              <line x1="14" y1="26" x2="58" y2="26" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="16" y1="36" x2="56" y2="36" stroke="#94a3b8" strokeWidth="1.5" />
              
              {/* Cart handle */}
              <path d="M12 18 L8 12 L2 12" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Wheels */}
              <circle cx="24" cy="54" r="5" fill="#475569" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="48" cy="54" r="5" fill="#475569" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            <div className="absolute -top-1 -right-1 bg-[#fb641b] text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center animate-bounce shadow-md">
              0
            </div>
          </div>

          <h2 className="text-[16px] font-semibold text-slate-800 tracking-tight">Your Cart is empty!</h2>
          <p className="text-[12px] text-slate-500 mt-1 text-center font-medium">Add items to it now to place an order</p>
          
          <Button className="mt-6 bg-[#2874f0] hover:bg-[#1a5fcc] text-white px-10 py-5 rounded-[4px] font-bold text-sm tracking-wide shadow-md transition-all active:scale-95 border-none" asChild>
            <Link href="/">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalOriginal = items.reduce((sum, item) => sum + (item.price || item.salePrice) * item.quantity, 0);
  const totalSale = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  const totalDiscount = totalOriginal - totalSale;

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f6] pb-24">
      {/* Header */}
      <div className="bg-white text-slate-900 border-b border-slate-150 px-4 py-3.5 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <Link href="/" className="text-slate-800 hover:text-slate-900"><ChevronLeft className="h-6 w-6" /></Link>
        <h1 className="text-[17px] font-black tracking-tight">My Cart</h1>
      </div>

      {/* Cart Items */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 border-b border-slate-100 shadow-xs">
            {/* Super Deals Tag */}
            <div className="text-[10px] font-extrabold text-green-700 tracking-wider mb-2 uppercase select-none">
              SUPER DEALS
            </div>

            <div className="flex gap-4">
               {/* Left Column: Image and Qty Selector */}
               <div className="flex flex-col items-center">
                  <div className="relative h-20 w-20 shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-100/80">
                     <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1.5" />
                  </div>
                  
                  {/* Native-looking interactive Qty dropdown selector */}
                  <div className="mt-3.5 relative border border-slate-200 rounded px-2.5 py-0.5 flex items-center gap-1.5 bg-white select-none cursor-pointer text-xs font-bold text-slate-800 hover:border-slate-400 transition-colors">
                     <span>Qty: {item.quantity}</span>
                     <span className="text-[7px] text-slate-500">▼</span>
                     <select 
                       value={item.quantity} 
                       onChange={(e) => {
                         const q = parseInt(e.target.value);
                         saveCart(items.map(it => it.id === item.id ? { ...it, quantity: q } : it));
                       }}
                       className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                     >
                       {[1,2,3,4,5,6,7,8,9,10].map(q => (
                         <option key={q} value={q}>{q}</option>
                       ))}
                     </select>
                  </div>
               </div>

               {/* Right Column: Detailed Product Info */}
               <div className="flex-1 space-y-1">
                  <h3 className="text-xs font-bold text-[#007185] line-clamp-2 leading-tight">{item.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Premium Edition, {item.seller || 'KitchenPro Retail'}</p>
                  
                  {/* Rating & Assured Badge */}
                  <div className="flex items-center gap-1.5 pt-0.5 select-none">
                     <div className="flex items-center gap-0.5 bg-[#388e3c] text-white px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold shrink-0">
                       <span>4.4</span>
                       <span className="text-[7px]">★</span>
                     </div>
                     <span className="text-[10px] text-slate-400 font-medium">(66)</span>
                     <img 
                       src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                       alt="fAssured" 
                       className="h-[13px] w-auto inline shrink-0" 
                     />
                  </div>

                  {/* Price Block with down green arrow percentage */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap select-none">
                     {item.price > item.salePrice && (
                       <span className="text-green-700 text-xs font-extrabold flex items-center">
                         <span className="text-sm font-semibold leading-none">↓</span>
                         {Math.round(((item.price - item.salePrice) / item.price) * 100)}%
                       </span>
                     )}
                     {item.price > item.salePrice && (
                       <span className="text-xs text-slate-400 line-through">₹{item.price.toLocaleString()}</span>
                     )}
                     <span className="text-sm font-black text-slate-900">₹{item.salePrice.toLocaleString()}</span>
                  </div>

                  {/* WOW! Offer Price Badge */}
                  <div className="flex items-center gap-1.5 pt-1.5 select-none">
                     <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black italic text-[9px] px-1 py-0.5 rounded-sm tracking-tight leading-none scale-95 origin-left shadow-xs">
                       WOW!
                     </div>
                     <span className="text-[11px] font-extrabold text-slate-800 leading-none">
                       Buy at ₹{(item.salePrice - 50 > 0 ? item.salePrice - 50 : item.salePrice).toLocaleString()}
                     </span>
                  </div>

                  {/* Protect Promise Fee Line */}
                  <div className="flex items-center gap-1.5 pt-2 text-[11px] text-slate-500 font-medium select-none">
                     <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#2874f0] focus:ring-[#2874f0] h-3.5 w-3.5" />
                     <span className="text-slate-600 font-semibold">+ ₹19 Protect Promise Fee</span>
                     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                       <circle cx="8" cy="8" r="6" />
                       <path d="M8 7v4M8 5h.01" strokeLinecap="round" />
                     </svg>
                  </div>

                  {/* 6 Offers Available Line */}
                  <div className="text-[11px] text-green-700 font-black pt-1 select-none">
                     6 Offers Available
                  </div>
               </div>
            </div>

            {/* Delivery Promise Row */}
            <div className="mt-3.5 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium border-t border-slate-50 pt-2.5 pb-1 select-none">
               <span className="text-slate-800 font-black italic tracking-tighter text-[10px]">⚡ EXPRESS</span>
               <span>Delivery by {getDynamicDeliveryDate(item.id)}</span>
            </div>

            {/* Bottom Row Horizontal Separated Action Buttons */}
            <div className="flex items-center border-t border-slate-100 mt-2.5 select-none">
               <button 
                 onClick={() => removeItem(item.id)}
                 className="flex-1 py-2.5 text-xs font-black text-slate-500 uppercase tracking-wide flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
               >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
               </button>
               <div className="h-5 w-px bg-slate-200" />
               <button 
                 className="flex-1 py-2.5 text-xs font-black text-slate-500 uppercase tracking-wide flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
               >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save for later
               </button>
               <div className="h-5 w-px bg-slate-200" />
               <Link 
                 href={`/checkout?productId=${item.id}`}
                 className="flex-1 py-2.5 text-xs font-black text-[#2874f0] uppercase tracking-wide flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
               >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Buy this now
               </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="bg-white mt-2.5 p-4 space-y-4">
         <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-3">Price Details</h2>
         <div className="space-y-3">
            <div className="flex justify-between text-sm">
               <span className="text-slate-600 font-semibold">Price ({items.length} item{items.length > 1 ? 's' : ''})</span>
               <span className="text-slate-800 font-semibold">₹{totalOriginal.toLocaleString()}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                 <span className="text-slate-600 font-semibold">Discount</span>
                 <span className="text-green-600 font-bold">- ₹{totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
               <span className="text-slate-600 font-semibold">Delivery Charges</span>
               <span className="text-green-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-base font-black pt-3 border-t border-dashed">
               <span>Total Amount</span>
               <span>₹{totalSale.toLocaleString()}</span>
            </div>
         </div>
         
         {/* Green Discount Saved Alert Bar */}
         {totalDiscount > 0 && (
           <div className="bg-[#f6fff6] border border-green-100 rounded-md px-3.5 py-2.5 mt-2 flex items-center gap-2 select-none">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-600 shrink-0" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p className="text-[11px] font-black text-green-700 leading-none">
                You'll save ₹{totalDiscount.toLocaleString()} on this order!
              </p>
           </div>
         )}
      </div>

      {/* Safety Badges */}
      <div className="p-6 flex flex-col items-center gap-2 opacity-50">
         <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-center">Safe and Secure Payments. 100% Authentic products.</span>
         </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t px-4 py-2.5 flex items-center justify-between shadow-2xl">
         <div className="flex flex-col justify-center leading-tight">
            {totalOriginal > totalSale && (
               <span className="text-[11px] text-slate-400 line-through font-semibold">₹{totalOriginal.toLocaleString()}</span>
            )}
            <div className="flex items-center gap-1 mt-0.5">
               <span className="text-[17px] font-black text-slate-900">₹{totalSale.toLocaleString()}</span>
               <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-slate-400 shrink-0 align-middle inline-block" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M8 7v4M8 5h.01" strokeLinecap="round" />
               </svg>
            </div>
         </div>
         <Button className="bg-[#fb641b] hover:bg-[#f35c12] text-white rounded-[4px] px-8 py-5 font-black text-[14px] shadow-md border-none transition-transform active:scale-95 uppercase tracking-wide" asChild>
            <Link href="/checkout">Place Order</Link>
         </Button>
      </div>
    </div>
  );
}
