'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, ArrowLeft, Star, ChevronRight, MapPin, Tag, ShieldCheck, ThumbsUp, ThumbsDown, X, Upload, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const ProductOfferBox = () => {
  const [timeLeft, setTimeLeft] = React.useState(10 * 60);

  React.useEffect(() => {
    const getOrSetOfferEndTime = () => {
      const stored = sessionStorage.getItem('offer_ends_at');
      const now = Date.now();
      
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          return { endsAt, remaining };
        }
      }
      
      // Generate new 10 minute duration if none exists or has expired
      const endsAt = now + 10 * 60 * 1000;
      sessionStorage.setItem('offer_ends_at', endsAt.toString());
      return { endsAt, remaining: 10 * 60 };
    };

    const init = getOrSetOfferEndTime();
    setTimeLeft(init.remaining);

    const timer = setInterval(() => {
      const now = Date.now();
      const stored = sessionStorage.getItem('offer_ends_at');
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          const newEndsAt = now + 10 * 60 * 1000;
          sessionStorage.setItem('offer_ends_at', newEndsAt.toString());
          setTimeLeft(10 * 60);
        }
      } else {
        const newEndsAt = now + 10 * 60 * 1000;
        sessionStorage.setItem('offer_ends_at', newEndsAt.toString());
        setTimeLeft(10 * 60);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="border border-slate-200 rounded-xl bg-white my-4 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.05)] text-slate-900 select-none">
      {/* 1. Countdown Row */}
      <div className="py-2.5 text-center text-[15px] font-bold border-b border-slate-100 bg-[#fafafa]">
        Offer ends in <span className="text-[#f15a24] font-extrabold ml-1">{timeStr}</span>
      </div>

      {/* 2. Flipkart Pay Later Promo Row */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 relative min-h-[70px]">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-1.5">
          <svg width="28" height="22" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 select-none">
            {/* Basket in yellow */}
            <path d="M10 5h18l-2 9H12L10 5z" fill="#f9e03d" />
            <path d="M13 5v9M17 5v9M21 5v9M25 5v9" stroke="#5fa61f" strokeWidth="1.2" />
            {/* Handle/Frame in blue */}
            <path d="M4 2h4l4 14h14l3-9" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Wheels */}
            <circle cx="13" cy="21" r="2.5" fill="#2874f0" />
            <circle cx="23" cy="21" r="2.5" fill="#2874f0" />
          </svg>
          <div className="flex flex-col">
            <span className="text-[#2874f0] font-black italic text-[11px] leading-none tracking-tight">Flipkart</span>
            <span className="text-[#2874f0] font-black italic text-[11px] leading-none tracking-tight mt-0.5">Pay Later</span>
          </div>
        </div>

        {/* Right Side: Text & CTA */}
        <div className="flex-1 pl-4 flex flex-col justify-center">
          <div className="text-[11px] font-black text-slate-800 leading-tight">
            Credit Up to ₹1 Lakh*
          </div>
          <div className="text-[9.5px] text-slate-500 font-bold leading-tight mt-0.5">
            Shop Now & Pay Next Month or in EMIs
          </div>
          <div className="text-[10px] font-black text-[#2874f0] hover:underline cursor-pointer mt-1 flex items-center gap-0.5">
            Activate Now <span className="font-sans font-bold text-[8px]">&gt;</span>
          </div>
        </div>

        {/* Terms & Conditions light watermark */}
        <span className="text-[7px] text-slate-400 font-semibold absolute bottom-1 right-2 select-none uppercase tracking-wider">
          *T&C Apply
        </span>
      </div>

      {/* 3. Trust Grid Row */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 py-3.5 bg-white">
        {/* Replacement */}
        <div className="flex flex-col items-center justify-center text-center px-1">
          <div className="h-10 w-10 flex items-center justify-center mb-1">
            <svg width="34" height="34" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 select-none">
              <circle cx="22" cy="22" r="20" fill="#f19e1f" />
              <path d="M15 22a7 7 0 0 1 11.5-5.4M29 22a7 7 0 0 1-11.5 5.4" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M22 13.5h5v5M22 30.5h-5v-5" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-slate-800 leading-tight">
            7 days
          </span>
          <span className="text-[9px] font-semibold text-slate-500 leading-tight">
            Replacement
          </span>
        </div>

        {/* No COD */}
        <div className="flex flex-col items-center justify-center text-center px-1">
          <div className="h-10 w-10 flex items-center justify-center mb-1">
            <svg width="34" height="34" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 select-none">
              <rect x="15" y="11" width="20" height="12" rx="1" transform="rotate(12 15 11)" fill="#c5c5c5" stroke="#909090" strokeWidth="1.5" />
              <rect x="10" y="15" width="20" height="12" rx="1" fill="#e0e0e0" stroke="#a0a0a0" strokeWidth="1.5" />
              <text x="17" y="24" fill="#606060" fontSize="9" fontWeight="extrabold" fontFamily="sans-serif">₹</text>
            </svg>
          </div>
          <span className="text-[10px] font-bold text-slate-800 leading-tight">
            No Cash On
          </span>
          <span className="text-[9px] font-semibold text-slate-500 leading-tight">
            Delivery
          </span>
        </div>

        {/* Plus F-Assured */}
        <div className="flex flex-col items-center justify-center text-center px-1">
          <div className="h-10 w-10 flex items-center justify-center mb-1 scale-95">
            <div className="flex items-center gap-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#ffc200" />
              </svg>
              <div className="flex flex-col items-start leading-none -space-y-0.5 select-none">
                <span className="text-[#ffc200] font-black italic text-[11px] tracking-tighter">Plus</span>
                <span className="text-[#2874f0] font-black italic text-[9px] tracking-tighter">F-ASSURED</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#2874f0] leading-tight">
            Plus
          </span>
          <span className="text-[9px] font-semibold text-slate-500 leading-tight">
            (F-Assured)
          </span>
        </div>
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
  
  // Swipe Handlers (Supports both Touch swipe and Mouse drag swipe!)
  const swipeStartX = React.useRef<number | null>(null);
  const isDragging = React.useRef<boolean>(false);

  const handleSwipeStart = (clientX: number) => {
    swipeStartX.current = clientX;
    isDragging.current = true;
  };

  const handleSwipeEnd = (clientX: number) => {
    if (swipeStartX.current === null || !product || !product.images || product.images.length <= 1) return;
    const diffX = swipeStartX.current - clientX; // positive = swiped left, negative = swiped right
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left -> Next image
        setSelectedImage((prev) => (prev + 1) % product.images.length);
      } else {
        // Swipe right -> Prev image
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
      }
    }
    swipeStartX.current = null;
    isDragging.current = false;
  };

  // Auto Slider Effect
  React.useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product, selectedImage]);

  // Share Handler
  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  
  // Review modals & list state
  const [showRateModal, setShowRateModal] = React.useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = React.useState(false);
  const [reviewsList, setReviewsList] = React.useState<any[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(15);
  const [reviewForm, setReviewForm] = React.useState({
    rating: 5,
    title: '',
    comment: '',
    reviewerName: '',
    location: '',
    imageUrl: '',
    uploadingImage: false
  });

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (data) {
        setReviewsList(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleLike = async (reviewId: string, isLike: boolean) => {
    try {
      // Optimistic update
      setReviewsList(prev => prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            likes: isLike ? (r.likes || 0) + 1 : r.likes,
            dislikes: !isLike ? (r.dislikes || 0) + 1 : r.dislikes
          };
        }
        return r;
      }));

      const reviewToUpdate = reviewsList.find(r => r.id === reviewId);
      if (reviewToUpdate) {
        await supabase
          .from('reviews')
          .update({
            likes: isLike ? (reviewToUpdate.likes || 0) + 1 : reviewToUpdate.likes,
            dislikes: !isLike ? (reviewToUpdate.dislikes || 0) + 1 : (reviewToUpdate.dislikes || 0)
          })
          .eq('id', reviewId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setReviewForm(prev => ({ ...prev, uploadingImage: true }));
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `reviews/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kitchenproduct')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kitchenproduct')
        .getPublicUrl(filePath);

      setReviewForm(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (error: any) {
      console.error('Review image upload error:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setReviewForm(prev => ({ ...prev, uploadingImage: false }));
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.reviewerName) {
      alert('Please enter your name.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: id,
          reviewer_name: reviewForm.reviewerName,
          rating: reviewForm.rating,
          title: reviewForm.title || 'Excellent product',
          comment: reviewForm.comment,
          location: reviewForm.location ? `Certified Buyer, ${reviewForm.location}` : 'Certified Buyer',
          image_url: reviewForm.imageUrl || null,
          is_approved: true, // Auto-approve so it shows instantly
          likes: 0,
          dislikes: 0
        });

      if (error) throw error;

      alert('Thank you for rating this product!');
      setShowRateModal(false);
      
      setReviewForm({
        rating: 5,
        title: '',
        comment: '',
        reviewerName: '',
        location: '',
        imageUrl: '',
        uploadingImage: false
      });

      fetchReviews();

      const updatedTotalReviews = (product.total_reviews || 0) + 1;
      const updatedTotalRatings = (product.total_ratings || 0) + 1;
      const currentSum = (product.average_rating || 4.5) * (product.total_ratings || 1);
      const updatedAverageRating = parseFloat(((currentSum + reviewForm.rating) / updatedTotalRatings).toFixed(1));

      const distribution = { ...(product.star_distribution || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 }) };
      const ratingStr = reviewForm.rating.toString();
      distribution[ratingStr] = (parseInt(distribution[ratingStr] || '0') + 1).toString();

      setProduct(prev => ({
        ...prev,
        total_reviews: updatedTotalReviews,
        total_ratings: updatedTotalRatings,
        average_rating: updatedAverageRating,
        star_distribution: distribution
      }));

      await supabase
        .from('products')
        .update({
          total_reviews: updatedTotalReviews,
          total_ratings: updatedTotalRatings,
          average_rating: updatedAverageRating,
          star_distribution: distribution
        })
        .eq('id', id);

    } catch (err: any) {
      console.error(err);
      alert('Error submitting review: ' + err.message);
    }
  };

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
    fetchReviews();

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
            <button 
              onClick={handleShare}
              aria-label="Share product"
              className="active:scale-90 transition-transform h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700 fill-current">
                <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11.1z" />
              </svg>
            </button>
            <ShoppingCart className="h-5 w-5 text-slate-700" />
         </div>
      </div>

      <div className="md:container md:mx-auto md:px-4 md:py-8 bg-white md:bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 bg-white md:p-6 md:rounded-xl md:shadow-sm">
          
          {/* Image Section */}
          <div className="relative bg-white pt-2 pb-6 flex flex-col items-center border-b border-slate-100 md:border-none w-full">
            {/* Wishlist Button (Top-Right) */}
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
              <Heart className="h-5 w-5 text-slate-400" />
            </button>

            {/* Share Button (Top-Right stacked vertically, just like the Flipkart app layout!) */}
            <button 
              onClick={handleShare}
              aria-label="Share product"
              className="absolute top-16 right-4 z-10 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md active:scale-90 transition-transform hover:bg-slate-50 border border-slate-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500 fill-current">
                <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11.1z" />
              </svg>
            </button>

            {/* Swipable Carousel container */}
            <div 
              onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleSwipeEnd(e.changedTouches[0].clientX)}
              onMouseDown={(e) => handleSwipeStart(e.clientX)}
              onMouseUp={(e) => handleSwipeEnd(e.clientX)}
              onMouseLeave={(e) => {
                if (isDragging.current) {
                  handleSwipeEnd(e.clientX);
                }
              }}
              className="relative aspect-square w-full max-w-[400px] overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0.8, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0.8, x: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-4 pointer-events-none"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
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
                   {product.average_rating || 4.5} <span className="text-[10px] font-bold">★</span>
                </div>
                <span className="text-[13px] text-slate-500 font-medium ml-2 shrink-0">{(product.total_ratings || 1428).toLocaleString()} ratings and {(product.total_reviews || 234).toLocaleString()} reviews</span>
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
              <ProductOfferBox />
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
                    <div key={i} className="flex gap-2.5 items-start">
                       <svg 
                         viewBox="0 0 24 24" 
                         className="h-[16px] w-[16px] text-[#388e3c] fill-current shrink-0 mt-0.5" 
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                         <circle cx="7" cy="7" r="1.5" fill="white" />
                       </svg>
                       <p className="text-[13px] text-slate-800 leading-[1.4]">
                         <span className="font-semibold">{offer.type}</span> {offer.desc} <span className="text-[#2874f0] font-semibold cursor-pointer">{offer.link}</span>
                       </p>
                    </div>
                  ))}
               </div>
            </div>
            {/* Gap in mobile view */}
            <div className="h-2 bg-[#f1f3f6] w-full md:hidden" />

            {/* Services (Disabled to prevent duplicate trust section content) */}
            {/*
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
            */}

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
                 <button 
                   onClick={() => setShowRateModal(true)}
                   className="bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 text-slate-700 px-4 py-2 rounded font-medium text-[13px] transition-all"
                 >
                   Rate Product
                 </button>
               </div>
               
               <div className="flex items-center gap-6 mb-6">
                 <div className="flex flex-col items-center justify-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 shrink-0">
                   <div className="text-[32px] font-bold text-slate-900 flex items-center gap-1">
                     {product.average_rating || 4.5}
                     <Star className="h-6 w-6 fill-current text-yellow-500" />
                   </div>
                   <div className="text-[11px] text-slate-500 text-center leading-tight mt-1">
                     {(product.total_ratings || 1428).toLocaleString()} Ratings &<br/>{(product.total_reviews || 234).toLocaleString()} Reviews
                   </div>
                 </div>
                 <div className="flex-1 space-y-1">
                   {[5,4,3,2,1].map((star) => {
                     const distribution = product.star_distribution || { "5": 980, "4": 320, "3": 98, "2": 20, "1": 10 };
                     const count = parseInt(distribution[star.toString()] || '0');
                     const total = Object.values(distribution).reduce((a: any, b: any) => parseInt(a || 0) + parseInt(b || 0), 0) as number;
                     const percentage = total > 0 ? (count / total) * 100 : 0;
                     return (
                       <div key={star} className="flex items-center gap-2">
                         <span className="text-[11px] font-bold text-slate-700 w-2">{star}</span>
                         <Star className="h-2.5 w-2.5 fill-current text-slate-400" />
                         <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                             className={cn(
                               "h-full rounded-full transition-all duration-500", 
                               star >= 4 ? "bg-green-600" : star === 3 ? "bg-green-500" : star === 2 ? "bg-yellow-500" : "bg-red-500"
                             )} 
                             style={{ width: `${percentage}%` }} 
                           />
                         </div>
                         <span className="text-[10px] text-slate-400 font-bold w-10 text-right">{count.toLocaleString()}</span>
                       </div>
                     );
                   })}
                 </div>
               </div>

               {/* Sample/Dynamic Reviews List (Short version for details page) */}
               <div className="space-y-4">
                 {(reviewsList.length > 0 ? reviewsList : [
                   {
                     id: 'default-1',
                     rating: 5,
                     title: 'Simply awesome',
                     comment: 'Excellent product. The build quality is very good and the delivery was fast. Highly recommended.',
                     reviewer_name: 'Ansarul',
                     location: 'Certified Buyer, Kolkata',
                     likes: 24,
                     dislikes: 2,
                     image_url: 'https://images.unsplash.com/photo-1584900129033-b2da7863fb72?q=80&w=200',
                     created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                   },
                   {
                     id: 'default-2',
                     rating: 4,
                     title: 'Very Good',
                     comment: 'Great addition to my kitchen. Very durable and efficient.',
                     reviewer_name: 'Soriful',
                     location: 'Certified Buyer, Mumbai',
                     likes: 12,
                     dislikes: 1,
                     image_url: null,
                     created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                   }
                 ]).slice(0, 3).map((review) => (
                   <div key={review.id} className="border-t border-slate-100 pt-4 pb-2">
                     <div className="flex items-center gap-2 mb-1.5">
                       <div className={cn(
                         "flex items-center gap-0.5 text-white px-1.5 py-0.5 rounded text-[10px] font-bold",
                         review.rating >= 4 ? "bg-green-600" : review.rating === 3 ? "bg-green-500" : review.rating === 2 ? "bg-yellow-500" : "bg-red-500"
                       )}>
                         {review.rating} <Star className="h-2 w-2 fill-current" />
                       </div>
                       <span className="text-[13px] font-bold text-slate-800">{review.title}</span>
                     </div>
                     <p className="text-[13px] text-slate-700 mb-2 leading-relaxed">{review.comment}</p>
                     
                     {review.image_url && (
                       <div className="flex items-center gap-2 mb-3">
                          <div className="h-16 w-16 relative rounded overflow-hidden border border-slate-200 shrink-0">
                            <img src={review.image_url} alt="Review Image" className="w-full h-full object-cover" />
                          </div>
                       </div>
                     )}

                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                         <span className="font-bold text-slate-700">{review.reviewer_name}</span>
                         <span className="flex items-center gap-1 text-slate-400">
                           <ShieldCheck className="h-3 w-3 text-green-600 fill-green-50" /> {review.location || 'Certified Buyer'}
                         </span>
                         <span className="text-slate-300">•</span>
                         <span>{review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '2 days ago'}</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <button 
                           onClick={() => handleLike(review.id, true)}
                           className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                         >
                           <ThumbsUp className="h-3 w-3" /> {review.likes || 0}
                         </button>
                         <button 
                           onClick={() => handleLike(review.id, false)}
                           className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                         >
                           <ThumbsDown className="h-3 w-3" /> {review.dislikes || 0}
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
               
                <button 
                  onClick={() => {
                    setVisibleCount(15);
                    setShowAllReviewsModal(true);
                  }}
                  className="w-full text-left py-3 border-t border-slate-100 text-[#2874f0] font-bold text-[14px] flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors mt-2"
                >
                  All {(reviewsList.length > 0 ? reviewsList : [1, 2]).length} reviews
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

      {/* Rate Product Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowRateModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Feedback Form</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rate this Product</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Share your experience to help other buyers</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-5">
              {/* Star Rating Select */}
              <div className="flex flex-col items-center justify-center space-y-2 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Star Rating</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star 
                        className={cn(
                          "h-8 w-8 transition-colors", 
                          reviewForm.rating >= star 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-slate-300 hover:text-yellow-300"
                        )} 
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {reviewForm.rating === 5 ? 'Simply awesome ★★★★★' :
                   reviewForm.rating === 4 ? 'Very Good ★★★★☆' :
                   reviewForm.rating === 3 ? 'Good ★★★☆☆' :
                   reviewForm.rating === 2 ? 'Fair ★★☆☆☆' : 'Poor ★☆☆☆☆'}
                </span>
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text"
                    required
                    value={reviewForm.reviewerName}
                    onChange={e => setReviewForm(prev => ({ ...prev, reviewerName: e.target.value }))}
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Your Location (City)</label>
                  <input 
                    type="text"
                    value={reviewForm.location}
                    onChange={e => setReviewForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Review Title</label>
                <input 
                  type="text"
                  value={reviewForm.title}
                  onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Detailed Comment</label>
                <textarea 
                  rows={3}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:border-orange-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Review Image Upload */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Add Photo (Optional)</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600 transition-colors">
                    <Upload className="h-4 w-4 text-slate-400" />
                    <span>{reviewForm.uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleReviewImageUpload}
                      disabled={reviewForm.uploadingImage}
                      className="hidden" 
                    />
                  </label>
                  {reviewForm.imageUrl && (
                    <div className="h-10 w-10 relative rounded-lg border border-slate-200 overflow-hidden shrink-0">
                      <img src={reviewForm.imageUrl} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={reviewForm.uploadingImage}
                className="w-full h-11 rounded-full font-black text-white bg-slate-900 hover:bg-slate-800 tracking-tight uppercase shadow-lg shadow-slate-200 mt-2 transition-all active:scale-[0.99]"
              >
                Submit Review
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* All Reviews Modal */}
      {showAllReviewsModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Verified Customer Reviews</h3>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Showing all approved user feedback ({(reviewsList.length > 0 ? reviewsList : [1, 2]).length})</p>
              </div>
              <button 
                onClick={() => setShowAllReviewsModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(reviewsList.length > 0 ? reviewsList : [
                {
                  id: 'default-1',
                  rating: 5,
                  title: 'Simply awesome',
                  comment: 'Excellent product. The build quality is very good and the delivery was fast. Highly recommended.',
                  reviewer_name: 'Ansarul',
                  location: 'Certified Buyer, Kolkata',
                  likes: 24,
                  dislikes: 2,
                  image_url: 'https://images.unsplash.com/photo-1584900129033-b2da7863fb72?q=80&w=200',
                  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                  id: 'default-2',
                  rating: 4,
                  title: 'Very Good',
                  comment: 'Great addition to my kitchen. Very durable and efficient.',
                  reviewer_name: 'Soriful',
                  location: 'Certified Buyer, Mumbai',
                  likes: 12,
                  dislikes: 1,
                  image_url: null,
                  created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                }
              ]).slice(0, visibleCount).map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-6 last:border-none last:pb-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex items-center gap-0.5 text-white px-1.5 py-0.5 rounded text-[10px] font-bold",
                      review.rating >= 4 ? "bg-green-600" : review.rating === 3 ? "bg-green-500" : review.rating === 2 ? "bg-yellow-500" : "bg-red-500"
                    )}>
                      {review.rating} <Star className="h-2 w-2 fill-current" />
                    </div>
                    <span className="text-sm font-black text-slate-800">{review.title}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{review.comment}</p>

                  {review.image_url && (
                    <div className="flex items-center gap-2">
                      <a href={review.image_url} target="_blank" rel="noreferrer" className="h-24 w-24 relative rounded-xl border border-slate-200 overflow-hidden shrink-0 block hover:opacity-90 transition-opacity">
                        <img src={review.image_url} alt="Review Image" className="w-full h-full object-cover" />
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2 text-slate-400 font-semibold">
                      <span className="font-black text-slate-700">{review.reviewer_name}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-600 fill-green-50" /> {review.location || 'Certified Buyer'}
                      </span>
                      <span>•</span>
                      <span>{review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '2 days ago'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleLike(review.id, true)}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors font-bold"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> {review.likes || 0}
                      </button>
                      <button 
                        onClick={() => handleLike(review.id, false)}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors font-bold"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" /> {review.dislikes || 0}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {visibleCount < (reviewsList.length > 0 ? reviewsList.length : 2) && (
                <div className="flex justify-center pt-2 pb-6">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 15)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 font-black text-xs text-[#2874f0] uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flipkart Verified Feedback System</span>
              <Button 
                onClick={() => {
                  setShowAllReviewsModal(false);
                  setShowRateModal(true);
                }}
                className="h-9 px-5 rounded-full font-bold bg-[#2874f0] text-white hover:bg-blue-600 text-xs shadow-md shadow-blue-100"
              >
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
