'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';

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
        <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-4 sticky top-0 z-50">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          <h1 className="text-lg font-medium">My Cart</h1>
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
        <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-4 sticky top-0 z-50">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          <h1 className="text-lg font-medium">My Cart</h1>
        </div>

        {/* Flipkart Tabs */}
        <div className="bg-white px-3 py-2.5 flex items-center gap-2 border-b border-slate-100">
           <button className="bg-[#1259e2] text-white font-extrabold text-[13px] px-5 py-2 rounded-lg shadow-sm select-none">
              Flipkart (0)
           </button>
           <button className="bg-white text-slate-600 border border-slate-200/80 font-bold text-[13px] px-5 py-2 rounded-lg select-none">
              Grocery
           </button>
           <button className="bg-white text-slate-600 border border-slate-200/80 font-bold text-[13px] px-5 py-2 rounded-lg select-none">
              Minutes
           </button>
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
      <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        <h1 className="text-lg font-medium">My Cart</h1>
      </div>

      {/* Flipkart Tabs */}
      <div className="bg-white px-3 py-2.5 flex items-center gap-2 border-b border-slate-100">
         <button className="bg-[#1259e2] text-white font-extrabold text-[13px] px-5 py-2 rounded-lg shadow-sm select-none">
            Flipkart ({items.reduce((sum, item) => sum + item.quantity, 0)})
         </button>
         <button className="bg-white text-slate-600 border border-slate-200/80 font-bold text-[13px] px-5 py-2 rounded-lg select-none">
            Grocery
         </button>
         <button className="bg-white text-slate-600 border border-slate-200/80 font-bold text-[13px] px-5 py-2 rounded-lg select-none">
            Minutes
         </button>
      </div>

      {/* Address Bar */}
      <div className="bg-white px-4 py-4 mb-2 flex items-center justify-between border-b border-slate-100">
         <div className="text-xs">
            <p className="text-slate-500 font-medium">Deliver to: <span className="text-slate-900 font-bold">{resolvedLocation}</span></p>
         </div>
         <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-[#2874f0] border-[#2874f0] text-[10px] font-black uppercase" asChild>
            <Link href="/">Change</Link>
         </Button>
      </div>

      {/* Cart Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4">
            <div className="flex gap-4">
               <div className="relative h-24 w-24 shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
               </div>
               <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">{item.name}</h3>
                  <p className="text-[10px] text-slate-400">Seller: {item.seller || 'KitchenPro Retail'}</p>
                  <div className="flex items-center gap-2 pt-1">
                     <span className="text-lg font-bold text-slate-900">₹{item.salePrice.toLocaleString()}</span>
                     {item.price > item.salePrice && (
                       <>
                         <span className="text-xs text-slate-400 line-through">₹{item.price.toLocaleString()}</span>
                         <span className="text-xs font-bold text-green-600">
                            {Math.round(((item.price - item.salePrice) / item.price) * 100)}% Off
                         </span>
                       </>
                     )}
                  </div>
                  <p className="text-[10px] text-green-600 font-bold">1 offer applied</p>
               </div>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-50">
               <div className="flex items-center border rounded-lg h-8">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 font-bold text-lg select-none">-</button>
                  <span className="px-4 py-1 text-sm font-bold border-x select-none">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 font-bold text-lg select-none">+</button>
               </div>
               <button className="text-xs font-bold text-slate-700 uppercase tracking-tight">Save for later</button>
               <button onClick={() => removeItem(item.id)} className="text-xs font-bold text-red-600 uppercase tracking-tight">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="bg-white mt-2 p-4 space-y-4">
         <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-3">Price Details</h2>
         <div className="space-y-3">
            <div className="flex justify-between text-sm">
               <span className="text-slate-700">Price ({items.length} item{items.length > 1 ? 's' : ''})</span>
               <span className="text-slate-900">₹{totalOriginal.toLocaleString()}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                 <span className="text-slate-700">Discount</span>
                 <span className="text-green-600">- ₹{totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
               <span className="text-slate-700">Delivery Charges</span>
               <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-3 border-t border-dashed">
               <span>Total Amount</span>
               <span>₹{totalSale.toLocaleString()}</span>
            </div>
         </div>
         {totalDiscount > 0 && (
           <p className="text-xs font-bold text-green-600">You will save ₹{totalDiscount.toLocaleString()} on this order</p>
         )}
      </div>

      {/* Safety Badges */}
      <div className="p-6 flex flex-col items-center gap-2 opacity-50">
         <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Safe and Secure Payments. 100% Authentic products.</span>
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
         <Button className="bg-[#ffc200] hover:bg-[#e6af00] text-slate-900 rounded-lg px-8 py-5 font-black text-[14px] shadow-md border-none transition-transform active:scale-95 uppercase tracking-wide" asChild>
            <Link href="/checkout">Place Order</Link>
         </Button>
      </div>
    </div>
  );
}
