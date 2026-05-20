'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

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
    <div className="group relative bg-white flex flex-col border-[0.5px] border-slate-100 overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
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

        {/* Floating Ratings overlay at bottom-left of image */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5 text-[9px] font-bold text-slate-800 shadow-xs border border-slate-100 select-none">
          <span>{ratingValue}</span>
          <span className="text-green-600 text-[8px] font-bold">★</span>
          <span className="text-slate-300 font-normal mx-0.5">|</span>
          <span className="text-slate-500 font-medium">{ratingCountStr}</span>
        </div>

        {/* Floating variants pill at bottom right of the image */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs border border-slate-200 px-2 py-0.5 rounded-full text-[9px] font-black text-[#2874f0] shadow-xs select-none">
          2 variants
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-2.5 flex flex-col flex-1">
        {/* Brand and Description (Clean Flipkart mobile split) */}
        <div className="mb-1 leading-snug">
          <span className="block text-[11px] font-black text-slate-900 uppercase tracking-wide">
            {brandName}
          </span>
          <span className="block text-[11px] font-medium text-slate-500 line-clamp-1 mt-0.5">
            {description}
          </span>
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

          {/* WOW! Bank Offer Section */}
          <div className="pt-1.5 border-t border-slate-100/60 space-y-0.5">
            <div className="flex items-center gap-1 leading-none">
              <span className="inline-flex items-center justify-center px-1 py-[1.5px] border border-[#1C54D4] rounded-[2.5px] bg-white text-[8px] font-black text-[#1C54D4] italic tracking-tighter leading-none select-none align-middle mr-0.5">
                WOW!
              </span>
              <span className="text-[11px] font-black text-[#1C54D4] align-middle">
                ₹{bankOfferPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[9px] font-bold text-[#1C54D4] leading-none pl-[1px]">with Bank offer</p>
          </div>

        </div>
      </div>
    </div>
  );
};



