'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

// Highly authentic inline AssuredBadge matching Flipkart
const AssuredBadge = () => (
  <div className="inline-flex items-center gap-0.5 select-none align-middle ml-1.5 shrink-0">
    <div className="relative flex items-center justify-center bg-[#2874f0] text-white text-[7px] font-black h-[10px] w-[10px] rounded-full border-[0.5px] border-yellow-400 leading-none">
      f
    </div>
    <span className="text-[9px] font-black italic text-[#2874f0] leading-none tracking-tighter">Assured</span>
  </div>
);

// High-fidelity speech bubble slanted WOW! SVG badge
const WowIcon = () => (
  <svg 
    viewBox="0 0 38 16" 
    className="h-[13px] w-auto shrink-0 select-none align-middle inline-block mr-1" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M 3 1 L 35 1 C 36.5 1, 37 1.5, 37 3 L 37 11 C 37 12.5, 36.5 13, 35 13 L 9 13 L 5 15.5 L 6.5 13 L 3 13 C 1.5 13, 1 12.5, 1 11 L 1 3 C 1 1.5, 1.5 1, 3 1 Z" 
      fill="#FFFFFF" 
      stroke="#1C54D4" 
      strokeWidth="0.8" 
      strokeLinejoin="round"
    />
    <text 
      x="19" 
      y="9.5" 
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
      fontSize="7.5" 
      fontWeight="900" 
      fontStyle="italic" 
      fill="#1C54D4" 
      textAnchor="middle"
      letterSpacing="-0.2"
    >
      WOW!
    </text>
  </svg>
);

// Extremely clean motion delivery truck icon SVG
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
    <svg viewBox="0 0 16 16" className="h-3 w-3 text-[#1C54D4]" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" strokeDasharray="2 1" />
      <path d="M5 8h6M8 5v6" />
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

  // Dynamically calculate standard delivery date (+4 days)
  const getDeliveryDateStr = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    
    const getOrdinal = (n: number) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
      }
    };
    return `${day}${getOrdinal(day)} ${month}`;
  };

  const deliveryDate = getDeliveryDateStr();

  // Split title into Brand and Description
  const words = name.split(' ');
  const brandName = words[0] || 'Premium';
  const description = words.slice(1).join(' ') || 'High Quality Product';

  // Odd/even check to decide whether to show express delivery or standard delivery
  const isExpress = numericId % 2 === 0;

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

        {/* Dynamic ISI Certified Badge overlay */}
        {numericId % 3 === 0 && <ISICertifiedBadge />}

        {/* Floating variants pill at bottom right of the image */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs border border-slate-200 px-2 py-0.5 rounded-full text-[9px] font-black text-[#2874f0] shadow-xs select-none">
          2 variants
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-3 flex flex-col flex-1">
        {/* Brand and Description (Clean Flipkart mobile split) */}
        <div className="mb-1 leading-snug">
          <span className="block text-[11px] font-black text-slate-900 uppercase tracking-wide">
            {brandName}
          </span>
          <span className="block text-[11px] font-medium text-slate-500 line-clamp-1 mt-0.5">
            {description}
          </span>
        </div>

        {/* Star Rating & Assured Badge Row */}
        <div className="flex items-center gap-0.5 mb-1 leading-none select-none">
          <div className="flex items-center text-green-600 gap-[1px]">
            <span className="text-[10px]">★</span>
            <span className="text-[10px]">★</span>
            <span className="text-[10px]">★</span>
            <span className="text-[10px]">★</span>
            <span className="text-[10px] text-slate-200">★</span>
          </div>
          <span className="text-[9px] font-medium text-slate-400 ml-1">({ratingCountStr})</span>
          <AssuredBadge />
        </div>

        <div className="mt-auto space-y-1">
          {/* Pricing Section (2 Lines to match Flipkart mobile layout) */}
          <div className="pt-0.5">
            {displaySalePrice && displaySalePrice < displayPrice && (
              <div className="flex items-center gap-1 leading-none mb-0.5">
                <span className="text-[11px] font-extrabold text-green-600 flex items-center">
                  <span className="text-[10px] font-bold mr-[1px]">↓</span>{discount}%
                </span>
                <span className="text-[10px] text-slate-400 line-through font-semibold">
                  ₹{displayPrice?.toLocaleString()}
                </span>
              </div>
            )}
            <span className="text-xs font-black text-slate-900 block leading-none">
              ₹{(displaySalePrice || displayPrice)?.toLocaleString()}
            </span>
          </div>

          {/* WOW! Bank Offer Section (Matches the marked red box perfectly!) */}
          <div className="pt-1.5 border-t border-slate-100/60 space-y-1">
            <div className="flex items-center gap-1 leading-none">
              <WowIcon />
              <span className="text-[11px] font-black text-[#1C54D4] align-middle">
                ₹{bankOfferPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[9px] font-bold text-[#1C54D4] leading-none pl-[1px]">with Bank offer</p>
            
            {/* Delivery Line */}
            {isExpress ? (
              <div className="flex items-center gap-0.5 pt-0.5 leading-none">
                <DeliveryTruckIcon />
                <span className="text-[9px] font-black italic text-slate-800 tracking-tight">EXPRESS</span>
                <span className="text-[9px] font-medium text-slate-500 ml-0.5">2 day delivery</span>
              </div>
            ) : (
              <p className="text-[9px] text-slate-500 font-medium leading-none pt-0.5 pl-[1px]">
                Delivery by <span className="font-extrabold text-slate-900">{deliveryDate}</span>
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button className="w-full mt-2.5 py-1.5 border border-[#2874f0] rounded-[4px] bg-white text-[#2874f0] font-bold text-xs tracking-wide transition-all active:scale-97 hover:bg-[#2874f0]/2 shadow-xs flex items-center justify-center select-none">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
