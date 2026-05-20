'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';

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
  const categoryName = categories?.name || product.category || 'Kitchen';
  const imageUrl = product_images?.[0]?.image_url || product.imageUrl || 'https://via.placeholder.com/300';
  
  const discount = displaySalePrice ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) : 0;
  const bankOfferPrice = Math.round((displaySalePrice || displayPrice) * 0.95);

  // Generate deterministic dynamic ratings and counts based on product ID
  const numericId = typeof id === 'number' ? id : (id?.charCodeAt(0) || 0);
  const ratingCount = (numericId * 73) % 400 + 80;
  const filledStarsCount = (numericId % 2 === 0) ? 5 : 4;

  return (
    <div className="group relative bg-white flex flex-col border-[0.5px] border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Floating wishlist button */}
      <button className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-slate-100 shadow-sm transition-transform active:scale-90">
        <Heart className="h-4 w-4 text-slate-300" />
      </button>

      {/* Product Image and Variants Pill */}
      <Link href={`/product/${id}`} className="block relative aspect-[4/5] bg-slate-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        {/* Floating variants pill at bottom right of the image */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs border border-slate-200 px-2 py-0.5 rounded-full text-[9px] font-black text-[#2874f0] shadow-sm select-none">
          2 variants
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        {/* Sponsored Label and Category */}
        <div className="flex items-center gap-1.5 mb-1 text-[9px] font-extrabold tracking-wider leading-none">
          <span className="text-slate-400 uppercase">Sponsored</span>
          <span className="text-slate-300 font-bold">|</span>
          <span className="text-slate-400 uppercase">{categoryName}</span>
        </div>
        
        {/* Product Title */}
        <Link href={`/product/${id}`} className="block mb-1.5">
          <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed h-[2.5rem]">
            {name}
          </h3>
        </Link>

        <div className="mt-auto space-y-1.5">
          {/* Star Ratings and Assured Badge */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => {
                const filled = index < filledStarsCount;
                return (
                  <Star 
                    key={index} 
                    className={`h-2.5 w-2.5 ${filled ? "fill-green-600 text-green-600" : "fill-slate-200 text-slate-200"}`} 
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-slate-400 font-bold">({ratingCount})</span>
            <div className="ml-auto shrink-0">
               <img 
                 src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                 alt="Assured" 
                 width={55} 
                 height={15} 
                 className="h-3 w-auto object-contain" 
               />
            </div>
          </div>

          {/* Pricing Row: Down Arrow, Discount, Crossed Original, Sale Price */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {displaySalePrice && displaySalePrice < displayPrice && (
              <>
                <span className="text-[11px] font-black text-green-600 flex items-center gap-0.5 shrink-0">
                  <span className="text-xs font-extrabold">↓</span>{discount}%
                </span>
                <span className="text-[11px] text-slate-400 line-through font-medium">
                  ₹{displayPrice?.toLocaleString()}
                </span>
              </>
            )}
            <span className="text-sm font-black text-slate-900">
              ₹{(displaySalePrice || displayPrice)?.toLocaleString()}
            </span>
          </div>

          {/* RED BOX: WOW! Bank Offer and Express Delivery Section */}
          <div className="pt-1 border-t border-slate-100/60 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="inline-block px-1 py-0.5 border border-[#2874f0] bg-white rounded-[3px] text-[8px] font-extrabold text-[#2874f0] italic tracking-tighter leading-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                WOW!
              </span>
              <span className="text-[11px] font-extrabold text-[#2874f0]">
                ₹{bankOfferPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[9px] font-bold text-[#2874f0] leading-none pl-0.5">with Bank offer</p>
            <div className="flex items-center gap-1.5 pt-1 leading-none pl-0.5">
              <span className="text-[10px]">🚚</span>
              <span className="text-[9px] font-black italic tracking-tighter text-slate-900 uppercase">EXPRESS</span>
              <span className="text-[9px] font-bold text-slate-500">2 day delivery</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full border border-[#2874f0]/30 hover:border-[#2874f0] bg-white text-[#2874f0] py-1.5 rounded-md text-[11px] font-extrabold text-center mt-2.5 hover:bg-[#2874f0]/5 active:scale-[0.97] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

