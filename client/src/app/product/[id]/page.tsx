'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star, ChevronRight, Share2, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from "../../../lib/utils";
import { supabase } from '../../../lib/supabase';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState(0);

  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name, slug),
          product_images (image_url, is_featured)
        `)
        .eq('id', id)
        .single();

      if (data) {
        setProduct({
          ...data,
          categoryName: data.categories?.name || 'Kitchen',
          images: data.product_images?.length > 0 
            ? data.product_images.map((img: any) => img.image_url)
            : ['https://via.placeholder.com/600']
        });
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return <div className="p-10 text-center">Product not found</div>;

  const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);

  return (
    <div className="flex flex-col bg-white min-h-screen pb-24">
      {/* Mobile Top Header Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white z-50 border-b md:hidden">
         <Link href="/"><ChevronRight className="h-6 w-6 rotate-180" /></Link>
         <div className="flex items-center gap-4">
            <Share2 className="h-5 w-5 text-slate-600" />
            <Heart className="h-5 w-5 text-slate-600" />
            <ShoppingCart className="h-5 w-5 text-slate-600" />
         </div>
      </div>

      <div className="md:container md:mx-auto md:px-4 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12">
          {/* Image Section */}
          <div className="relative">
            <div className="relative aspect-square md:rounded-2xl overflow-hidden bg-white border-b md:border">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
            {/* Horizontal Scroll Thumbnails on Mobile (Simulated) */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 p-4 md:hidden">
               {product.images.map((img: string, i: number) => (
                 <div key={i} className={cn("w-2 h-2 rounded-full", selectedImage === i ? "bg-[#2874f0]" : "bg-slate-200")} />
               ))}
            </div>
            {/* Grid Thumbnails on Desktop */}
            <div className="hidden md:flex gap-4 mt-4">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all",
                    selectedImage === i ? "border-[#2874f0]" : "border-transparent"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="px-4 py-6 md:p-0 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#2874f0] uppercase tracking-wider">{product.categoryName}</p>
                <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                   4.5 <Star className="h-2.5 w-2.5 fill-current" />
                </div>
              </div>
              <h1 className="text-lg md:text-2xl font-medium text-slate-800 leading-snug">{product.name}</h1>
              <div className="flex items-center gap-2 pt-1">
                 <Image src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" width={70} height={20} className="h-4 w-auto object-contain" />
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-slate-900">₹{product.sale_price.toLocaleString()}</span>
              <span className="text-sm text-slate-400 line-through">₹{product.price.toLocaleString()}</span>
              <span className="text-sm font-bold text-green-600">{discount}% off</span>
            </div>

            {/* Available Offers Section */}
            <div className="space-y-3 pt-2">
               <h3 className="text-sm font-bold text-slate-900">Available Offers</h3>
               <div className="space-y-2">
                  {[
                    "Bank Offer 10% instant discount on SBI Credit Card, up to ₹1,750 on orders of ₹5,000 and above",
                    "Bank Offer 5% Cashback on Flipkart Axis Bank Card",
                    "Special Price Get extra 10% off (price inclusive of cashback/coupon)",
                    "Partner Offer Sign up for Flipkart Pay Later and get Flipkart Gift Card worth up to ₹500"
                  ].map((offer, i) => (
                    <div key={i} className="flex gap-2 items-start">
                       <Image src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/offer_94e7c4.png" alt="Offer" width={14} height={14} className="mt-0.5 shrink-0" />
                       <p className="text-[11px] text-slate-800 leading-tight">
                         <span className="font-bold">{offer.split(' ')[0]} {offer.split(' ')[1]}</span> {offer.split(' ').slice(2).join(' ')}
                       </p>
                    </div>
                  ))}
                  <button className="text-[11px] font-bold text-[#2874f0]">View 5 more offers</button>
               </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-[#2874f0]" />
                  </div>
                  <div>
                     <p className="text-xs font-bold">Deliver to Ansarul, 700001</p>
                     <p className="text-[10px] text-slate-500">Kolkata, West Bengal • <span className="text-green-600 font-bold uppercase">FREE Delivery</span></p>
                  </div>
               </div>
               <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-[11px] font-black border-[#2874f0] text-[#2874f0] bg-white">CHANGE</Button>
            </div>

            {/* Highlights Section */}
            <div className="space-y-4 pt-4 border-t">
               <h3 className="text-sm font-bold text-slate-900">Highlights</h3>
               <ul className="space-y-2">
                  {["Premium Build Quality", "Ergonomic Design", "Easy to Clean", "Energy Efficient", "1 Year Warranty"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[12px] text-slate-600">
                       <div className="h-1 w-1 rounded-full bg-slate-400" />
                       {item}
                    </li>
                  ))}
               </ul>
            </div>

            <div className="space-y-4 pt-4 border-t">
               <h3 className="text-sm font-bold text-slate-900">Description</h3>
               <p className="text-[12px] text-slate-600 leading-relaxed line-clamp-4">{product.description}</p>
               <button className="text-[11px] font-bold text-[#2874f0] uppercase">Read More</button>
            </div>

            {/* Seller Information */}
            <div className="pt-4 border-t pb-10">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Seller</h3>
                  <button className="text-[11px] font-bold text-[#2874f0]">View Details</button>
               </div>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[12px] font-bold text-[#2874f0]">Kitchen_Master_Retail</span>
                  <div className="flex items-center gap-1 bg-[#2874f0] text-white px-1 py-0.5 rounded text-[8px] font-bold">
                    4.8 <Star className="h-2 w-2 fill-current" />
                  </div>
               </div>
               <p className="text-[10px] text-slate-400 mt-1">7 days service center replacement/repair</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Flipkart Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t flex h-16 shadow-2xl">
         <button className="flex-1 flex items-center justify-center font-bold text-slate-800 bg-white border-r">
            ADD TO CART
         </button>
         <button className="flex-1 flex items-center justify-center font-bold text-white bg-[#ff9f00]">
            BUY NOW
         </button>
      </div>
    </div>
  );
}
