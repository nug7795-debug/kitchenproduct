'use client';

import * as React from 'react';
import Link from 'next/link';
import { getDynamicDeliveryDate } from '../../lib/utils';

interface ProductCardProps {
  product: any;
}

// Crisp inline WOW! speech-bubble badge SVG matching Flipkart
const WowBadge = () => (
  <svg 
    viewBox="0 0 38 16" 
    className="h-[15px] w-auto shrink-0 select-none align-middle inline-block" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M 3 1 L 35 1 C 36.5 1, 37 1.5, 37 3 L 37 11 C 37 12.5, 36.5 13, 35 13 L 9 13 L 5 15.5 L 6.5 13 L 3 13 C 1.5 13, 1 12.5, 1 11 L 1 3 C 1 1.5, 1.5 1, 3 1 Z" 
      fill="#FFFFFF" 
      stroke="#1c54d4" 
      strokeWidth="1.1" 
      strokeLinejoin="round"
    />
    <text 
      x="19" 
      y="10.2" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="8.5" 
      fontWeight="900" 
      fontStyle="italic" 
      fill="#1c54d4" 
      textAnchor="middle"
      letterSpacing="-0.1"
    >
      WOW!
    </text>
  </svg>
);

// High-fidelity Star Rating (4 filled stars + 1 hollow star)
const StarRating = () => (
  <div className="flex items-center gap-[1px] shrink-0 text-[#26a541] font-bold text-[11px]">
    ★★★★☆
  </div>
);

export const ProductCard = ({ product }: ProductCardProps) => {
  if (!product) return null;

  const {
    id,
    name,
    price,
    sale_price,
    product_images,
  } = product;

  const displayPrice = price || product.price || 0;
  const displaySalePrice = sale_price || product.salePrice || displayPrice;
  const imageUrl = product_images?.[0]?.image_url || product.imageUrl || 'https://via.placeholder.com/300';
  
  const discount = (displaySalePrice && displayPrice && displayPrice > displaySalePrice) ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) : 99;

  const numericId = typeof id === 'number' ? id : (id?.charCodeAt(0) || 0);
  const totalRatings = product.total_ratings || 500;

  const offerPrice = displaySalePrice;
  const isLowStock = numericId % 4 === 0;
  const isSpecialOffer = numericId % 3 === 0;

  return (
    <Link 
      href={`/product/${id}`} 
      className="item flex flex-col w-full h-full text-left bg-white p-[10px] rounded-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_rgba(0,0,0,0.15)] cursor-pointer overflow-hidden select-none"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {/* Product Image Wrapper */}
      <div className="img-wrap w-full h-[160px] flex items-center justify-center mb-[10px] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="max-w-full max-h-full w-auto h-auto object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="details flex flex-col flex-1 w-full min-w-0">
        {/* Title */}
        <div className="title text-[13px] font-medium text-[#212121] leading-[1.4] line-clamp-2 mb-[6px] break-words">
          {name}
        </div>

        {/* Rating Row (4 filled stars + 1 hollow star + (500) + F-Assured Badge inline) */}
        <div className="rating-row flex items-center gap-[4px] mb-[6px] min-w-0 max-w-full flex-wrap">
          <StarRating />
          <span className="count text-[11px] text-[#878787]">({totalRatings})</span>
          <img 
            src="/fa_62673a.png" 
            alt="Assured" 
            className="assured h-[14px] ml-[2px] max-w-[55px] object-contain inline-block shrink-0" 
          />
        </div>

        {/* Price Row (Discount % + Strikethrough Price + Sale Price) */}
        <div className="price-row flex items-center gap-[6px] mb-[4px] min-w-0 flex-wrap">
          <span className="disc text-[14px] font-bold text-[#388e3c] shrink-0">
            ↓{discount}%
          </span>
          {displayPrice > displaySalePrice && (
            <span className="mrp text-[12px] font-medium text-[#878787] line-through shrink-0">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="sell text-[16px] font-bold text-[#212121] shrink-0">
            ₹{displaySalePrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* WOW! Offer Row */}
        <div className="wow flex items-center gap-[5px] mb-[6px] min-w-0 flex-wrap">
          <WowBadge />
          <span className="wow-price text-[14px] font-bold text-[#1a4fb8]">
            ₹{offerPrice.toLocaleString('en-IN')}
          </span>
          <span className="wow-text text-[12px] text-[#1a4fb8]">
            with offer
          </span>
        </div>

        {/* Tag (Special offer / Best deals / Only 2 left) */}
        <div className="stock-text text-[12px] font-semibold mb-[4px]" style={{ color: isLowStock ? '#d32f2f' : '#388e3c' }}>
          {isLowStock ? 'Only 2 left' : (isSpecialOffer ? 'Special offer' : 'Best deals')}
        </div>

        {/* Delivery Row */}
        <div className="delivery text-[12px] text-[#212121] mt-auto break-words">
          Delivery by <b className="font-semibold">{getDynamicDeliveryDate(id)}</b>
        </div>
      </div>
    </Link>
  );
};




