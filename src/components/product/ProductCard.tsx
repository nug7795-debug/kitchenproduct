'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

// Highly authentic inline AssuredBadge matching Flipkart
const AssuredBadge = () => (
  <svg viewBox="0 0 54 13" className="h-[11px] w-auto shrink-0 select-none align-middle inline-block ml-1.5" xmlns="http://www.w3.org/2000/svg">
    {/* Blue shield with yellow border */}
    <path d="M1 4.5 C1 2 4.5 1 6.5 1 C8.5 1 12 2 12 4.5 C12 8 8 11.5 6.5 12 C5 11.5 1 8 1 4.5 Z" fill="#2874f0" stroke="#FFE500" strokeWidth="0.8" />
    {/* Yellow 'f' inside */}
    <text x="6.5" y="8.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="7" fontWeight="900" fill="#FFE500" textAnchor="middle">f</text>
    {/* 'Assured' in bold italic blue */}
    <text x="14" y="9.5" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontSize="10" fontWeight="900" fontStyle="italic" fill="#2874f0" letterSpacing="-0.3">Assured</text>
  </svg>
);

// High-fidelity speech bubble slanted WOW! SVG badge matching Flipkart
const WowIcon = () => (
  <svg 
    viewBox="0 0 38 16" 
    className="h-[12px] w-auto shrink-0 select-none align-middle inline-block mr-1.5" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outline slanted Speech bubble bubble */}
    <path 
      d="M 3 1 L 35 1 C 36.5 1, 37 1.5, 37 3 L 37 11 C 37 12.5, 36.5 13, 35 13 L 9 13 L 5 15.5 L 6.5 13 L 3 13 C 1.5 13, 1 12.5, 1 11 L 1 3 C 1 1.5, 1.5 1, 3 1 Z" 
      fill="#FFFFFF" 
      stroke="#1c54d4" 
      strokeWidth="0.9" 
      strokeLinejoin="round"
    />
    <text 
      x="19" 
      y="9.5" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="8" 
      fontWeight="900" 
      fontStyle="italic" 
      fill="#1c54d4" 
      textAnchor="middle"
      letterSpacing="-0.2"
    >
      WOW!
    </text>
  </svg>
);

// Extremely clean motion delivery truck icon SVG matching Flipkart
const DeliveryTruckIcon = () => (
  <svg 
    viewBox="0 0 16 12" 
    className="h-[11px] w-auto shrink-0 text-slate-800 align-middle inline-block mr-1" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Motion speed lines */}
    <line x1="1" y1="3" x2="4" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="0" y1="5.5" x2="3" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="1" y1="8" x2="4" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    
    {/* Truck cargo body */}
    <rect x="4.5" y="2" width="7" height="6" rx="0.5" fill="currentColor" />
    
    {/* Driver's cab */}
    <path d="M 11.5 4 L 14 4 L 15 6 L 15 8 L 11.5 8 Z" fill="currentColor" />
    {/* Cab window */}
    <path d="M 12 4.6 L 13.6 4.6 L 14.2 5.8 L 12 5.8 Z" fill="#FFFFFF" />

    {/* Wheels */}
    <circle cx="6.5" cy="8.8" r="1.3" fill="currentColor" stroke="#FFFFFF" strokeWidth="0.5" />
    <circle cx="12.5" cy="8.8" r="1.3" fill="currentColor" stroke="#FFFFFF" strokeWidth="0.5" />
  </svg>
);

// ISI Certified badge overlay for bottom-left of image
const ISICertifiedBadge = () => (
  <div className="absolute bottom-2 left-2 bg-white/95 border border-[#1C54D4]/30 px-1 py-0.5 rounded-[4px] shadow-xs flex items-center gap-1 select-none pointer-events-none">
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[#1C54D4] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeDasharray="1.5 1" />
      <circle cx="8" cy="8" r="5" stroke="currentColor" />
      <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="0.8" />
    </svg>
    <span className="text-[7.5px] font-black text-[#1C54D4] tracking-tighter uppercase leading-none">ISI Certified</span>
  </div>
);

export const ProductCard = ({ product }: ProductCardProps) => {
  const {
    id,
    name,
    price,
    sale_price,
    categories,
    product_images
  } = product;

  // Handle both database object and flat props
  const displayPrice = price || product.price;
  const displaySalePrice = sale_price || product.salePrice;
  const categoryName = categories?.name || product.category || 'Kitchen';
  const imageUrl = product_images?.[0]?.image_url || product.imageUrl || 'https://via.placeholder.com/300';
  
  const discount = displaySalePrice ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) : 0;
  const bankOfferPrice = Math.round((displaySalePrice || displayPrice) * 0.95);

  // Generate deterministic dynamic ratings and counts based on product ID to match the real Flipkart look
  const numericId = typeof id === 'number' ? id : (id?.charCodeAt(0) || 0);
  const ratingCount = (numericId * 73) % 400 + 80;
  const ratingValue = (4.0 + (numericId % 5) * 0.1).toFixed(1);
  const ratingCountStr = ratingCount > 250 ? `${Math.floor(ratingCount / 100)}k` : `${ratingCount}`;

  // Split title into Brand and Description
  const words = name.split(' ');
  const brandName = words[0] || 'Premium';
  const description = words.slice(1).join(' ') || 'High Quality Product';

  return (
    <div className="group relative bg-white flex flex-col border-[0.5px] border-slate-100 overflow-hidden shadow-xs hover:shadow-sm transition-all pb-3">
      {/* Product Image Box */}
      <div className="relative aspect-[1/1] bg-slate-50 overflow-hidden">
        <Link href={`/product/${id}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-103"
          />
        </Link>

        {/* Floating Wishlist Button */}
        <button className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-xs transition-transform active:scale-90">
          <Heart className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
        </button>

        {/* ISI Certified Badge overlay on ALL products */}
        <ISICertifiedBadge />

        {/* Floating variants pill at bottom right of the image */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs border border-slate-200 px-2 py-0.5 rounded-full text-[9px] font-black text-[#2874f0] shadow-xs select-none">
          2 variants
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-3 flex flex-col flex-1">
        {/* Sponsored Label at the very top */}
        <span className="block text-[8px] font-bold text-slate-400 select-none leading-none mb-1">
          Sponsored
        </span>

        {/* Brand and Description (Clean Flipkart mobile split) */}
        <div className="mb-1 leading-snug">
          <span className="block text-[11px] font-black text-slate-900 uppercase tracking-wide">
            {brandName}
          </span>
          <span className="block text-[11px] font-medium text-slate-500 line-clamp-1 mt-0.5">
            {description}
          </span>
        </div>

        {/* Star Rating & Assured Badge Row on ALL products */}
        <div className="flex items-center gap-0.5 mb-1.5 leading-none select-none">
          <div className="flex items-center text-[#388e3c] gap-[0.5px]">
            <span className="text-[10px]">★</span>
            <span className="text-[10px]">★</span>
            <span className="text-[10px]">★</span>
            <span className="text-[10px]">★</span>
            <span className="text-[10px]">★</span>
          </div>
          <span className="text-[9px] font-medium text-slate-400 ml-1">({ratingCountStr})</span>
          <AssuredBadge />
        </div>

        <div className="mt-auto space-y-1.5">
          {/* Pricing Section (Lined up horizontally on a single line matching cooker category) */}
          <div className="flex items-center gap-1.5 leading-none pt-0.5 select-none">
            {displaySalePrice && displaySalePrice < displayPrice && (
              <>
                <span className="text-[11px] font-extrabold text-[#388e3c] flex items-center shrink-0">
                  <span className="text-[10px] font-bold mr-[1px]">↓</span>{discount}%
                </span>
                <span className="text-[10px] text-slate-400 line-through font-semibold shrink-0">
                  ₹{displayPrice?.toLocaleString()}
                </span>
              </>
            )}
            <span className="text-xs font-black text-slate-900 shrink-0">
              ₹{(displaySalePrice || displayPrice)?.toLocaleString()}
            </span>
          </div>

          {/* WOW! Bank Offer & Express Delivery Container (The perfect marked red box on ALL products!) */}
          <div className="pt-1.5 border-t border-slate-100/60 space-y-1 select-none">
            <div className="flex items-center gap-1 leading-none">
              <WowIcon />
              <span className="text-[11px] font-black text-[#1c54d4] align-middle">
                ₹{bankOfferPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[9px] font-bold text-[#1c54d4] leading-none pl-[1px]">with Bank offer</p>
            
            {/* Express Delivery Truck & Tag Line */}
            <div className="flex items-center gap-1 pt-0.5 leading-none">
              <DeliveryTruckIcon />
              <span className="text-[9px] font-black italic text-slate-800 tracking-tight">EXPRESS</span>
              <span className="text-[9px] font-medium text-slate-500 ml-0.5">2 day delivery</span>
            </div>
          </div>

          {/* Add to Cart Button on ALL products */}
          <button className="w-full mt-2 py-1.5 border border-[#2874f0] rounded-[4px] bg-white text-[#2874f0] font-bold text-xs tracking-wide transition-all active:scale-97 hover:bg-[#2874f0]/2 shadow-xs flex items-center justify-center select-none">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
