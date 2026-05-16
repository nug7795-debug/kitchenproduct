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

  return (
    <div className="group relative bg-white flex flex-col border-[0.5px] border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-slate-100 shadow-sm transition-transform active:scale-90">
        <Heart className="h-4 w-4 text-slate-300" />
      </button>

      <Link href={`/product/${id}`} className="block relative aspect-[4/5] bg-slate-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{categoryName}</p>
        
        <Link href={`/product/${id}`} className="block mb-1">
          <h3 className="text-xs font-medium text-slate-800 line-clamp-2 leading-relaxed h-[2.5rem]">
            {name}
          </h3>
        </Link>

        <div className="mt-auto space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
              4.5 <Star className="h-2.5 w-2.5 fill-current" />
            </div>
            <span className="text-[10px] text-slate-400 font-bold">(428)</span>
            <div className="ml-auto">
               <Image src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" width={55} height={15} className="h-3 w-auto object-contain" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm font-bold text-slate-900">₹{displaySalePrice?.toLocaleString() || displayPrice?.toLocaleString()}</span>
            {displaySalePrice && displaySalePrice < displayPrice && (
              <>
                <span className="text-[10px] text-slate-400 line-through">₹{displayPrice?.toLocaleString()}</span>
                <span className="text-[10px] text-green-600 font-bold">{discount}% off</span>
              </>
            )}
          </div>
          
          <p className="text-[10px] text-slate-500 font-medium">Free delivery</p>
        </div>
      </div>
    </div>
  );
};
