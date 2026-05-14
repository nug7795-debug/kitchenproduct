'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Trash2, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function CartPage() {
  const [items, setItems] = React.useState([
    {
      id: '1',
      name: 'Pro-Mixer Master 500W with Stainless Steel Blades',
      price: 12999,
      salePrice: 9999,
      imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8ca28?q=80&w=1974',
      quantity: 1,
      seller: 'KitchenPro Retail'
    }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const totalOriginal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSale = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  const totalDiscount = totalOriginal - totalSale;

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f6] pb-24">
      {/* Header */}
      <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        <h1 className="text-lg font-medium">My Cart</h1>
      </div>

      {/* Address Bar */}
      <div className="bg-white px-4 py-4 mb-2 flex items-center justify-between border-b">
         <div className="text-xs">
            <p className="text-slate-500 font-medium">Deliver to: <span className="text-slate-900 font-bold">Ansarul, 700001</span></p>
            <p className="text-slate-400 mt-0.5">Kolkata, West Bengal</p>
         </div>
         <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-[#2874f0] border-[#2874f0] text-[10px] font-black uppercase">Change</Button>
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
                  <p className="text-[10px] text-slate-400">Seller: {item.seller}</p>
                  <div className="flex items-center gap-2 pt-1">
                     <span className="text-lg font-bold text-slate-900">₹{item.salePrice.toLocaleString()}</span>
                     <span className="text-xs text-slate-400 line-through">₹{item.price.toLocaleString()}</span>
                     <span className="text-xs font-bold text-green-600">
                        {Math.round(((item.price - item.salePrice) / item.price) * 100)}% Off
                     </span>
                  </div>
                  <p className="text-[10px] text-green-600 font-bold">1 offer applied</p>
               </div>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-50">
               <div className="flex items-center border rounded-lg h-8">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 font-bold text-lg">-</button>
                  <span className="px-4 py-1 text-sm font-bold border-x">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 font-bold text-lg">+</button>
               </div>
               <button className="text-xs font-bold text-slate-700 uppercase tracking-tight">Save for later</button>
               <button className="text-xs font-bold text-slate-700 uppercase tracking-tight">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="bg-white mt-2 p-4 space-y-4">
         <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-3">Price Details</h2>
         <div className="space-y-3">
            <div className="flex justify-between text-sm">
               <span className="text-slate-700">Price ({items.length} item)</span>
               <span className="text-slate-900">₹{totalOriginal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
               <span className="text-slate-700">Discount</span>
               <span className="text-green-600">- ₹{totalDiscount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
               <span className="text-slate-700">Delivery Charges</span>
               <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-3 border-t border-dashed">
               <span>Total Amount</span>
               <span>₹{totalSale.toLocaleString()}</span>
            </div>
         </div>
         <p className="text-xs font-bold text-green-600">You will save ₹{totalDiscount.toLocaleString()} on this order</p>
      </div>

      {/* Safety Badges */}
      <div className="p-6 flex flex-col items-center gap-2 opacity-50">
         <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Safe and Secure Payments. 100% Authentic products.</span>
         </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t px-4 py-3 flex items-center justify-between shadow-2xl">
         <div>
            <span className="text-[10px] text-slate-400 line-through block">₹{totalOriginal.toLocaleString()}</span>
            <span className="text-lg font-bold text-slate-900">₹{totalSale.toLocaleString()}</span>
         </div>
         <Button className="bg-[#fb641b] hover:bg-[#f4511e] text-white rounded-lg px-8 py-6 font-bold text-base shadow-lg transition-transform active:scale-95">
            PLACE ORDER
         </Button>
      </div>
    </div>
  );
}
