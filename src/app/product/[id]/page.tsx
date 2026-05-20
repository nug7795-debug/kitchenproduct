'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, ArrowLeft, Star, ChevronRight, MapPin, Tag, ShieldCheck, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from "../../../lib/utils";
import { supabase } from '../../../lib/supabase';


const AssuredBadgeBig = () => (
  <img 
    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
    alt="fAssured" 
    className="h-[21px] w-auto shrink-0 select-none align-middle inline-block ml-3" 
  />
);

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = React.useState(10 * 60); 

  React.useEffect(() => {
    const getRemainingSeconds = () => {
      const now = new Date();
      const currentSeconds = now.getMinutes() * 60 + now.getSeconds();
      return 600 - (currentSeconds % 600);
    };

    setTimeLeft(getRemainingSeconds());

    const timer = setInterval(() => {
      setTimeLeft(getRemainingSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-1.5 font-black text-white select-none">
      <div className="flex flex-col items-center justify-center bg-[#f44336] rounded-[6px] w-[38px] h-[40px] shadow-sm leading-none">
        <span className="text-[16px]">{minutes.toString().padStart(2, '0')}</span>
        <span className="text-[9px] font-semibold mt-0.5">Min</span>
      </div>
      <span className="text-[16px] -mt-1 opacity-80">:</span>
      <div className="flex flex-col items-center justify-center bg-[#f44336] rounded-[6px] w-[38px] h-[40px] shadow-sm leading-none">
        <span className="text-[16px]">{seconds.toString().padStart(2, '0')}</span>
        <span className="text-[9px] font-semibold mt-0.5">Sec</span>
      </div>
    </div>
  );
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isInCart, setIsInCart] = React.useState(false);
  const [showFullTitle, setShowFullTitle] = React.useState(false);

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

  React.useEffect(() => {
    fetchProduct();

    // Check if current item is already in localStorage cart
    const cached = localStorage.getItem('cart_items');
    if (cached) {
      try {
        const cartList = JSON.parse(cached);
        setIsInCart(cartList.some((item: any) => item.id === id));
      } catch (e) {
        console.error(e);
      }
    }

    // Subscribe to realtime changes for this product
    const channel = supabase
      .channel('product-detail-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `id=eq.${id}` }, () => {
        fetchProduct();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleAddToCart = () => {
    if (isInCart) {
      router.push('/cart');
      return;
    }

    const cached = localStorage.getItem('cart_items');
    let cartList: any[] = [];
    if (cached) {
      try {
        cartList = JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price || product.sale_price || 9999,
      salePrice: product.sale_price || 9999,
      imageUrl: product.images[0] || 'https://via.placeholder.com/200',
      quantity: 1,
      seller: 'KitchenPro Retail'
    };

    const updatedList = [...cartList.filter((item: any) => item.id !== product.id), newItem];
    localStorage.setItem('cart_items', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('storage'));
    setIsInCart(true);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f1f3f6]">
        <div className="h-10 w-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return <div className="p-10 text-center bg-[#f1f3f6] min-h-screen">Product not found</div>;

  const displayPrice = product.price || 0;
  const displaySalePrice = product.sale_price || displayPrice;
  const discount = displaySalePrice < displayPrice ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) : 0;

  return (
    <div className="flex flex-col bg-[#f1f3f6] min-h-screen pb-[60px]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2.5 sticky top-0 bg-white z-50 shadow-sm md:hidden">
         <div className="flex items-center gap-3">
           <Link href="/"><ArrowLeft className="h-6 w-6 text-slate-700" /></Link>
           <Image src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" alt="Flipkart" width={75} height={20} className="h-5 w-auto object-contain" />
         </div>
         <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-slate-700" />
            <ShoppingCart className="h-5 w-5 text-slate-700" />
         </div>
      </div>

      <div className="md:container md:mx-auto md:px-4 md:py-8 bg-white md:bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 bg-white md:p-6 md:rounded-xl md:shadow-sm">
          
          {/* Image Section */}
          <div className="relative bg-white pt-2 pb-6 flex flex-col items-center border-b border-slate-100 md:border-none">
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
              <Heart className="h-5 w-5 text-slate-400" />
            </button>
            <div className="relative aspect-square w-full max-w-[400px] overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
            {/* Pagination Dots */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4">
                 {product.images.map((_: any, i: number) => (
                   <div key={i} className={cn("rounded-full", selectedImage === i ? "w-2 h-2 bg-[#2874f0]" : "w-1.5 h-1.5 bg-slate-300")} />
                 ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="bg-white">
            <div className="p-4 space-y-1">
              {/* Brand Name */}
              <div className="text-[14px] font-black text-slate-900 tracking-wide uppercase">
                {product.brand || (product.name ? product.name.split(' ')[0] : 'Kitchen Pro')}
              </div>
              {/* Product Title with ...more */}
              <h1 className="text-[13px] font-medium text-slate-500 md:text-[15px] leading-snug">
                {showFullTitle || product.name.length <= 60 ? (
                  <>
                    {product.name}
                    {product.name.length > 60 && (
                      <button 
                        onClick={() => setShowFullTitle(false)} 
                        className="text-[#2874f0] font-bold ml-1 hover:underline text-[13px]"
                      >
                        less
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {product.name.slice(0, 60)}...
                    <button 
                      onClick={() => setShowFullTitle(true)} 
                      className="text-[#2874f0] font-bold ml-0.5 hover:underline text-[13px]"
                    >
                      more
                    </button>
                  </>
                )}
              </h1>
              
              <div className="flex items-center pt-1 select-none flex-wrap gap-y-1">
                <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-0.5 rounded-[4px] text-[12px] font-bold shrink-0">
                   4.5 <span className="text-[10px] font-bold">★</span>
                </div>
                <span className="text-[13px] text-slate-500 font-medium ml-2 shrink-0">1,428 ratings and 234 reviews</span>
                <AssuredBadgeBig />
              </div>

              <div className="flex items-end gap-2 pt-2">
                <span className="text-[28px] font-semibold text-slate-900 leading-none">₹{displaySalePrice.toLocaleString()}</span>
                {displaySalePrice < displayPrice && (
                  <>
                    <span className="text-[14px] text-slate-500 line-through mb-1">₹{displayPrice.toLocaleString()}</span>
                    <span className="text-[14px] font-bold text-green-600 mb-1">{discount}% off</span>
                  </>
                )}
              </div>
              <div className="text-[12px] text-slate-500 font-medium pt-1">Free delivery</div>
            </div>

            {/* Gap in mobile view */}
            <div className="h-2 bg-[#f1f3f6] w-full md:hidden" />

            {/* Available Offers Section */}
            <div className="p-4 bg-white">
               <h3 className="text-[15px] font-semibold text-slate-900 mb-3">Available Offers</h3>
               <div className="space-y-3">
                  {[
                    { type: 'Bank Offer', desc: '5% Unlimited Cashback on Flipkart Axis Bank Credit Card', link: 'T&C' },
                    { type: 'Bank Offer', desc: '10% off on SBI Credit Card, up to ₹1750 on orders of ₹5000 and above', link: 'T&C' },
                    { type: 'Special Price', desc: 'Get extra 15% off (price inclusive of cashback/coupon)', link: 'T&C' },
                    { type: 'Partner Offer', desc: 'Sign up for Flipkart Pay Later and get Flipkart Gift Card worth up to ₹500', link: 'Know More' }
                  ].map((offer, i) => (
                    <div key={i} className="flex gap-2 items-start">
                       <Image src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/offer_94e7c4.png" alt="Offer" width={16} height={16} className="mt-0.5 shrink-0" />
                       <p className="text-[13px] text-slate-800 leading-[1.4]">
                         <span className="font-semibold">{offer.type}</span> {offer.desc} <span className="text-[#2874f0] font-semibold cursor-pointer">{offer.link}</span>
                       </p>
                    </div>
                  ))}
               </div>
            </div>
            {/* Gap in mobile view */}
            <div className="h-2 bg-[#f1f3f6] w-full md:hidden" />

            {/* Services */}
            <div className="p-4 bg-white flex items-center justify-between">
               <div className="flex flex-col items-center gap-1">
                 <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center">
                   <ShieldCheck className="h-5 w-5 text-[#2874f0]" />
                 </div>
                 <span className="text-[10px] text-slate-700 text-center w-16 leading-tight">1 Year<br/>Warranty</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                 </div>
                 <span className="text-[10px] text-slate-700 text-center w-16 leading-tight">7 Days<br/>Replacement</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center">
                   <span className="font-bold text-[#2874f0] text-sm">₹</span>
                 </div>
                 <span className="text-[10px] text-slate-700 text-center w-16 leading-tight">Cash on<br/>Delivery</span>
               </div>
            </div>

            {/* Gap in mobile view */}
            <div className="h-2 bg-[#f1f3f6] w-full md:hidden" />

            {/* Description / Highlights */}
            <div className="p-4 bg-white">
               <h3 className="text-[15px] font-semibold text-slate-900 mb-3">Highlights</h3>
               <ul className="space-y-2 mb-4">
                  {["Premium Build Quality", "Ergonomic Design", "Easy to Clean", "Energy Efficient", "1 Year Warranty"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px] text-slate-700">
                       <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                       {item}
                    </li>
                  ))}
               </ul>
               <h3 className="text-[15px] font-semibold text-slate-900 mb-2">Description</h3>
               <p className="text-[13px] text-slate-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Gap in mobile view */}
            <div className="h-2 bg-[#f1f3f6] w-full md:hidden" />

            {/* Ratings & Reviews Section */}
            <div className="p-4 bg-white">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[16px] font-semibold text-slate-900">Ratings & Reviews</h3>
                 <button className="bg-white border border-slate-200 shadow-sm text-slate-700 px-4 py-2 rounded font-medium text-[13px]">Rate Product</button>
               </div>
               
               <div className="flex items-center gap-6 mb-6">
                 <div className="flex flex-col items-center justify-center">
                   <div className="text-[32px] font-normal text-slate-800 flex items-center gap-1">4.5<Star className="h-6 w-6 fill-current text-slate-800" /></div>
                   <div className="text-[12px] text-slate-500 text-center leading-tight mt-1">1,428 Ratings &<br/>234 Reviews</div>
                 </div>
                 <div className="flex-1 space-y-1">
                   {[5,4,3,2,1].map((star) => (
                     <div key={star} className="flex items-center gap-2">
                       <span className="text-[11px] font-bold text-slate-800 w-2">{star}</span>
                       <Star className="h-2.5 w-2.5 fill-current text-slate-400" />
                       <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className={cn("h-full rounded-full", star >= 4 ? "bg-green-600" : star === 3 ? "bg-green-500" : star === 2 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${star * 18}%` }} />
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Sample Review */}
               <div className="border-t border-slate-100 pt-4 pb-2">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                     5 <Star className="h-2 w-2 fill-current" />
                   </div>
                   <span className="text-[13px] font-semibold text-slate-800">Simply awesome</span>
                 </div>
                 <p className="text-[13px] text-slate-700 mb-2">Excellent product. The build quality is very good and the delivery was fast. Highly recommended.</p>
                 <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
                    <div className="h-16 w-16 relative rounded overflow-hidden border border-slate-200 shrink-0">
                      <Image src="https://images.unsplash.com/photo-1584900129033-b2da7863fb72?q=80&w=200" alt="Review Image" fill className="object-cover" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                     <span>Ansarul</span>
                     <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-slate-400" /> Certified Buyer, Kolkata</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1 text-[11px] text-slate-500"><ThumbsUp className="h-3 w-3" /> 24</div>
                     <div className="flex items-center gap-1 text-[11px] text-slate-500"><ThumbsDown className="h-3 w-3" /> 2</div>
                   </div>
                 </div>
               </div>
               
               <button className="w-full text-left py-3 border-t border-slate-100 text-[#2874f0] font-semibold text-[14px] flex items-center justify-between">
                 All 234 reviews
                 <ChevronRight className="h-4 w-4" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Flipkart Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] flex h-[60px] shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
         <button 
           onClick={handleAddToCart}
           className="flex-1 flex items-center justify-center text-[15px] font-bold text-[#333] bg-white border-t border-slate-100 hover:bg-slate-50 transition-colors uppercase"
         >
            {isInCart ? 'Go to Cart' : 'Add to Cart'}
         </button>
         <Link href={`/checkout?productId=${product.id}`} className="flex-1 flex items-center justify-center text-[15px] font-bold text-white bg-[#fb641b] hover:bg-[#f4511e] transition-colors uppercase">
            BUY NOW
         </Link>
      </div>
    </div>
  );
}
