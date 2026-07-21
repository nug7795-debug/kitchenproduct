'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

// Highly authentic inline AssuredBadge matching Flipkart
const AssuredBadge = () => (
  <img 
    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
    alt="fAssured" 
    className="h-[15px] w-auto shrink-0 select-none align-middle inline-block ml-1.5" 
  />
);

// High-fidelity speech bubble slanted WOW! SVG badge matching Flipkart
const WowIcon = () => (
  <svg 
    viewBox="0 0 38 16" 
    className="h-[19px] w-auto shrink-0 select-none align-middle inline-block mr-1.5" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outline slanted Speech bubble bubble */}
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

// Extremely clean motion delivery truck icon SVG matching Flipkart
const DeliveryTruckIcon = () => (
  <svg 
    viewBox="0 0 16 12" 
    className="h-[12px] w-auto shrink-0 text-slate-800 align-middle inline-block mr-1" 
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
  if (!product) return null;

  const {
    id,
    name,
    price,
    sale_price,
    categories,
    product_images,
    is_limited_time_deal,
    is_trending,
    is_new_arrival,
    is_best_seller
  } = product;

  // Handle both database object and flat props
  const displayPrice = price || product.price || 0;
  const displaySalePrice = sale_price || product.salePrice || displayPrice;
  const categoryName = categories?.name || product.category || 'Kitchen';
  const imageUrl = product_images?.[0]?.image_url || product.imageUrl || 'https://via.placeholder.com/300';
  
  const discount = (displaySalePrice && displayPrice && displayPrice > displaySalePrice) ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) : 0;
  const bankOfferPrice = Math.round((displaySalePrice || displayPrice || 0) * 0.95);

  // Generate deterministic dynamic ratings and counts based on product ID to match the real Flipkart look
  const numericId = typeof id === 'number' ? id : (id?.charCodeAt(0) || 0);
  const ratingVal = parseFloat(product.average_rating || (4.0 + (numericId % 5) * 0.1)).toFixed(1);
  const totalRatings = product.total_ratings || ((numericId * 73) % 400 + 80);
  const totalRatingsStr = totalRatings >= 1000 ? `${(totalRatings / 1000).toFixed(1)}k` : `${totalRatings}`;

  // Split title into Brand and Description
  const words = (name || '').split(' ');
  const description = words.slice(1).join(' ') || name || 'Kitchen Product';

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`wishlist_${id}`);
      if (saved === 'true') {
        setIsWishlisted(true);
      }
    } catch (e) {
      // Ignore SSR / localStorage errors
    }
  }, [id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    try {
      localStorage.setItem(`wishlist_${id}`, newState ? 'true' : 'false');
    } catch (err) {
      // Ignore
    }
  };

  return (
    <Link 
      href={`/product/${id}`} 
      className="Cs7ycL TcKeCe block" 
      style={{ textDecoration: 'none', padding: '2px', margin: 'auto', width: '100%' }}
    >
      <div className="_2enssu px-3 relative overflow-hidden bg-white border border-[#f0f0f0]" style={{ padding: '16px 12px', display: 'block' }}>
        
        {/* Product Image wrapper */}
        <div className="flex items-center justify-center bg-white" style={{ height: '100px' }}>
          <img 
            className="img-fluid" 
            src={imageUrl} 
            alt={name}
            style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Product Title */}
        <div 
          className="_24B_AU _3SexMn" 
          style={{ 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap', 
            width: '100%', 
            overflow: 'hidden', 
            textAlign: 'left', 
            marginTop: '15px', 
            fontSize: '14px', 
            color: '#007185', 
            fontWeight: '700' 
          }}
          title={name}
        >
          {name}
        </div>

        {/* Discount Line */}
        <div 
          className="_24B_AU _1AQnZC" 
          style={{ 
            fontSize: '14px', 
            color: '#388e3c', 
            marginTop: '8px', 
            textAlign: 'left' 
          }}
        >
          {discount > 0 ? (
            <>
              - {discount}% Off
              <span 
                className="mrp" 
                style={{ 
                  color: '#9A9A9A', 
                  margin: '0 5px', 
                  textDecoration: 'line-through' 
                }}
              >
                ₹{displayPrice}
              </span>
            </>
          ) : (
            <span>No discount</span>
          )}
        </div>

        {/* Price & Assured Logo */}
        <div 
          className="_24B_AU _1AQnZC" 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginTop: '4px'
          }}
        >
          <b 
            className="selling-price" 
            style={{ 
              color: '#000', 
              fontWeight: '600', 
              fontSize: '16px',
              marginRight: '5px'
            }}
          >
            ₹{displaySalePrice}
          </b>
          <img 
            src="https://i.ibb.co/t4RsPCf/SwOvZ3r.png" 
            width="73px" 
            alt="fAssured"
            className="img-fluid" 
            style={{ width: '73px', height: 'auto' }}
          />
        </div>

        {/* Limited Time Deal Button */}
        <button 
          className="btn w-full mt-4" 
          style={{ 
            background: 'rgb(255, 194, 99)', 
            color: 'rgb(0, 0, 0)',
            width: '100%',
            marginTop: '16px',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: 'bold',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Limited time deal
        </button>

        {/* Delivery text */}
        <div 
          className="_3Nxu4r delivery-txt text-dark" 
          style={{ 
            marginTop: '10px', 
            fontSize: '12px',
            color: '#212529',
            textAlign: 'left',
            letterSpacing: '-0.3px'
          }}
        >
          Free Delivery in Two Days
        </div>

      </div>
    </Link>
  );
};
