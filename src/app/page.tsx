'use client';

import * as React from 'react';
import Link from 'next/link';
import { BannerSlider } from '../components/home/BannerSlider';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { ArrowRight, ChevronRight, Smartphone, Monitor } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { applyDynamicBadges } from '../lib/badge-helper';

const GiftIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Purple Bow */}
    <path d="M12 6.5C11 4.5 8 4 7 5.5C6 7 8 9 12 9.5C12 9.5 12 9.5 12 6.5Z" fill="#b83df2" />
    <path d="M12 6.5C13 4.5 16 4 17 5.5C18 7 16 9 12 9.5C12 9.5 12 9.5 12 6.5Z" fill="#b83df2" />
    {/* Gift Box Lid (Orange) */}
    <rect x="5" y="9.5" width="14" height="2.5" rx="0.5" fill="#ffa200" />
    {/* Gift Box Body (Orange) */}
    <path d="M6 12H18V18.5C18 19.3 17.3 20 16.5 20H7.5C6.7 20 6 19.3 6 18.5V12Z" fill="#ffa200" />
    {/* Vertical Ribbon (Yellow) */}
    <rect x="11" y="9.5" width="2" height="10.5" fill="#ffd000" />
    {/* Horizontal Ribbon (Yellow) */}
    <rect x="5" y="10" width="14" height="1.5" fill="#ffd000" />
  </svg>
);

const ForYouIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const FashionIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.6" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 22H9a2 2 0 0 1-2-2v-5l-4-2.5V7l4 1.5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4.5l4-1.5v5.5L17 15v5a2 2 0 0 1-2 2z" />
  </svg>
);

const MobilesIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.6" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
  </svg>
);

const ElectronicsIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.6" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="13" rx="2" ry="2" />
    <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2.2" />
    <line x1="12" y1="17" x2="12" y2="17" strokeWidth="2.5" />
  </svg>
);

const BeautyIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.6" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="8" y="11" width="8" height="11" rx="1" />
    <rect x="9.5" y="7" width="5" height="4" />
    <path d="M9.5 7l1.5-5h2l1.5 5" />
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.6" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M8 2h8l2 8H6z" />
    <line x1="12" y1="10" x2="12" y2="20" />
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
);


const LiveSaleTimer = () => {
  const [timeLeft, setTimeLeft] = React.useState(15 * 60);

  React.useEffect(() => {
    const getOrSetLiveSaleTime = () => {
      const stored = localStorage.getItem('shared_offer_ends_at');
      const now = Date.now();

      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          return { endsAt, remaining };
        }
      }

      // Generate new 15 minute duration if none exists or has expired
      const endsAt = now + 15 * 60 * 1000;
      localStorage.setItem('shared_offer_ends_at', endsAt.toString());
      return { endsAt, remaining: 15 * 60 };
    };

    const init = getOrSetLiveSaleTime();
    setTimeLeft(init.remaining);

    const timer = setInterval(() => {
      const now = Date.now();
      const stored = localStorage.getItem('shared_offer_ends_at');
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          // Reset to 15 minutes if expired
          const newEndsAt = now + 15 * 60 * 1000;
          localStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
          setTimeLeft(15 * 60);
        }
      } else {
        const newEndsAt = now + 15 * 60 * 1000;
        localStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
        setTimeLeft(15 * 60);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

  return (
    <span className="text-[#fb641b] text-[13.5px] font-black tracking-tight select-none">
      {minutesStr}:{secondsStr}
    </span>
  );
};



const shuffleArray = (array: any[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function Home() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const banners = [
    '/banners/new1.jpg',
    '/banners/new2.webp',
    '/banners/new3.webp',
    '/banners/new4.webp'
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  React.useEffect(() => {
    const migrateMockDbToSupabase = async () => {
      try {
        const localProductsRaw = localStorage.getItem('mock_db_products');
        const localCategoriesRaw = localStorage.getItem('mock_db_categories');
        const localImagesRaw = localStorage.getItem('mock_db_product_images');
        const localVariantsRaw = localStorage.getItem('mock_db_product_variants');
        const localSettingsRaw = localStorage.getItem('mock_db_settings');

        if (!localProductsRaw && !localCategoriesRaw) {
          return;
        }

        console.log('Found local mock database data! Migrating to Supabase cloud...');

        if (localCategoriesRaw) {
          const categories = JSON.parse(localCategoriesRaw);
          if (categories.length > 0) {
            const cleanCategories = categories.map(({ products: _, ...c }: any) => c);
            await supabase.from('categories').upsert(cleanCategories, { onConflict: 'id' });
          }
        }

        if (localProductsRaw) {
          const productsData = JSON.parse(localProductsRaw);
          if (productsData.length > 0) {
            const cleanProducts = productsData.map(({ categories: _, product_images: _1, product_variants: _2, ...p }: any) => p);
            await supabase.from('products').upsert(cleanProducts, { onConflict: 'id' });
          }
        }

        if (localImagesRaw) {
          const images = JSON.parse(localImagesRaw);
          if (images.length > 0) {
            await supabase.from('product_images').upsert(images, { onConflict: 'id' });
          }
        }

        if (localVariantsRaw) {
          const variants = JSON.parse(localVariantsRaw);
          if (variants.length > 0) {
            await supabase.from('product_variants').upsert(variants, { onConflict: 'id' });
          }
        }

        if (localSettingsRaw) {
          const settings = JSON.parse(localSettingsRaw);
          if (settings.length > 0) {
            await supabase.from('settings').upsert(settings, { onConflict: 'key' });
          }
        }

        console.log('Migration to Supabase cloud completed successfully!');

        localStorage.removeItem('mock_db_products');
        localStorage.removeItem('mock_db_categories');
        localStorage.removeItem('mock_db_product_images');
        localStorage.removeItem('mock_db_product_variants');
        localStorage.removeItem('mock_db_settings');

        window.location.reload();
      } catch (err) {
        console.error('Error during Supabase migration:', err);
      }
    };

    migrateMockDbToSupabase();
  }, []);

  React.useEffect(() => {
    let active = true;

    // Load from cache first for instant rendering on slow networks
    try {
      const cached = localStorage.getItem('cached_homepage_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setLoading(false);
        }
      }
    } catch (e) {
      console.error('Failed to load products from cache:', e);
    }

    const fetchData = async () => {
      try {
        // Fetch global settings for badges configuration
        const settingsRes = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'global_settings')
          .maybeSingle();

        const badgesConfig = settingsRes.data?.value?.badges || {
          enableDynamicBadges: true,
          trendingCount: 15,
          newArrivalCount: 5,
          bestSellerCount: 5
        };

        let response = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            sale_price,
            is_active,
            is_limited_time_deal,
            is_trending,
            is_new_arrival,
            is_best_seller,
            categories (name, slug),
            product_images (image_url, is_featured)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        let data = response.data;
        let error = response.error;

        if (error) {
          // Fallback if columns do not exist
          if (error.message?.includes('is_limited_time_deal') || error.message?.includes('is_trending') || error.message?.includes('column')) {
            console.warn('Columns is_limited_time_deal/is_trending not found, retrying fallback select...');
            const fallbackResponse = await supabase
              .from('products')
              .select(`
                id,
                name,
                price,
                sale_price,
                is_active,
                is_new_arrival,
                is_best_seller,
                categories (name, slug),
                product_images (image_url, is_featured)
              `)
              .eq('is_active', true)
              .order('created_at', { ascending: false });
            data = fallbackResponse.data;
            error = fallbackResponse.error;
          }
        }

        if (error) throw error;
        if (active && data) {
          const processed = applyDynamicBadges(data, badgesConfig);
          const shuffled = shuffleArray(processed);
          setProducts(shuffled);
          // Update cache
          localStorage.setItem('cached_homepage_products', JSON.stringify(shuffled));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Subscribe to realtime changes for all relevant tables
    const channel = supabase
      .channel('store-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_images' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchData())
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col bg-[#f1f3f6] min-h-screen">
      {/* Banner Area (Sliding Banners with rounded corners) */}
      <div className="w-full bg-[#e8f4fd] pt-2.5 pb-1.5 px-3">
        <div className="relative w-full overflow-hidden rounded-xl aspect-[1200/533] select-none">
          <div 
            className="flex w-full h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {banners.map((src, index) => (
              <div key={src} className="w-full h-full flex-shrink-0 relative">
                <img 
                  src={src} 
                  alt={`Banner ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <div className="bg-[#f0f5ff] text-[#212121] px-2 pt-3 pb-1 select-none border-b border-[#dce8fa]">
        <div className="grid grid-cols-6 gap-1">
          {[
            { name: 'For You', icon: ForYouIcon },
            { name: 'Fashion', icon: FashionIcon },
            { name: 'Mobiles', icon: MobilesIcon },
            { name: 'Electronics', icon: ElectronicsIcon },
            { name: 'Beauty', icon: BeautyIcon },
            { name: 'Home', icon: HomeIcon }
          ].map((cat) => (
            <div key={cat.name} className="flex flex-col items-center justify-between text-center cursor-pointer">
              <div className="flex flex-col items-center justify-center text-[#212121]">
                <div className="w-[42px] h-[42px] rounded-full bg-white border border-[#d0e1f9] flex items-center justify-center mb-1 shadow-xs">
                  <cat.icon className="w-[24px] h-[24px] text-[#212121]" />
                </div>
                <span className="text-[11px] font-bold leading-tight text-[#212121]">{cat.name}</span>
              </div>
              <div 
                style={{ 
                  height: '3px', 
                  backgroundColor: cat.name === 'For You' ? '#2874f0' : 'transparent', 
                  width: '32px', 
                  marginTop: '4px', 
                  borderRadius: '2px' 
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Deals of the Day Timer Row (Styled like goats-sale.com) */}
      <div className="bg-white py-2.5 px-4 select-none border-b border-slate-100/50 flex items-center justify-between w-full">
        {/* Left Side: Green Dot, SALE LIVE, Ends in, Timer */}
        <div className="flex items-center gap-1.5">
          {/* Pulsing Green Dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#00c853] shrink-0 animate-pulse" />
          <span className="text-[13.5px] font-black text-[#007aff] tracking-tight uppercase">SALE LIVE</span>
          <span className="text-slate-350 text-[11px]">•</span>
          <span className="text-[12.5px] font-extrabold text-[#717478]">Ends in</span>
          <LiveSaleTimer />
        </div>

        {/* Right Side: Shop Now Button */}
        <button className="bg-[#007aff] text-white px-3.5 py-1.5 rounded-full text-[11.5px] font-black flex items-center gap-1 hover:bg-[#0062cc] transition-colors shadow-xs tracking-tight shrink-0 select-none">
          Shop Now
          <svg className="w-2.5 h-2.5 text-white stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="bg-[#f1f3f6] pb-0">
        <div className="bg-white w-full py-3.5 px-4 flex items-center justify-between select-none">
          <h2 className="text-[17px] font-extrabold text-[#111111] tracking-tight">Don't Miss These!</h2>
          <button className="w-9 h-9 bg-[#007aff] rounded-full flex items-center justify-center hover:bg-[#0062cc] transition-colors text-white text-xs font-bold shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-[1px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] sm:aspect-[2/3] bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-[1px]">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Flipkart-style Footer */}
      <div className="w-full bg-white border-t border-slate-100 mt-1">
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-0 border-b border-slate-100">
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 border-r border-b border-slate-100 active:bg-slate-50">
            <span className="w-9 h-9 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="2" fill="#f4a43a"/>
                <path d="M8 7V5a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="7" y="11" width="4" height="3" rx="0.5" fill="#fff" opacity="0.8"/>
              </svg>
            </span>
            <span className="text-[13px] font-bold text-[#212121]">Become a Seller</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 active:bg-slate-50">
            <span className="w-9 h-9 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#f4a43a" stroke="#e07b00" strokeWidth="1"/>
              </svg>
            </span>
            <span className="text-[13px] font-bold text-[#212121]">Advertise</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 border-r border-slate-100 active:bg-slate-50">
            <span className="w-9 h-9 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="10" width="20" height="11" rx="2" fill="#f4a43a"/>
                <path d="M8 10V8a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 2v6" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="2" fill="#fff" opacity="0.85"/>
              </svg>
            </span>
            <span className="text-[13px] font-bold text-[#212121]">Gift Cards</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 active:bg-slate-50">
            <span className="w-9 h-9 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#f4a43a"/>
                <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2.5-2.5 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="0.8" fill="#fff"/>
              </svg>
            </span>
            <span className="text-[13px] font-bold text-[#212121]">Help Center</span>
          </a>
        </div>

        {/* Copyright Bar */}
        <div className="bg-[#2874f0] py-3 text-center">
          <span className="text-white font-bold text-[13px]">© 2007-2025 </span><span className="text-white font-bold text-[13px] opacity-90">flipkat.com</span>
        </div>

        {/* Payment Icons - Auto Marquee */}
        <style>{`
          @keyframes marquee-rtl {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .payment-marquee:hover .payment-track { animation-play-state: paused; }
          .payment-track { animation: marquee-rtl 14s linear infinite; }
        `}</style>
        <div className="bg-white py-2.5 overflow-hidden payment-marquee">
          <div className="payment-track flex items-center gap-2" style={{width:'max-content'}}>
            {/* --- Set 1 --- */}
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 50 16" height="9" width="28"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1a1f71">VISA</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 38 24" height="13" width="20"><circle cx="13" cy="12" r="9" fill="#eb001b"/><circle cx="25" cy="12" r="9" fill="#f79e1b"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#ff5f00"/></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 38 24" height="13" width="20"><circle cx="13" cy="12" r="9" fill="#0099df"/><circle cx="25" cy="12" r="9" fill="#e31837"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#6c2c91"/></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-[#016fd0] shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 44 14" height="8" width="26"><text x="0" y="11" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">AMEX</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 32 22" height="13" width="20"><circle cx="16" cy="11" r="9" fill="none" stroke="#1a1f71" strokeWidth="1.5"/><circle cx="11" cy="11" r="6" fill="#1a1f71" opacity="0.5"/><circle cx="21" cy="11" r="6" fill="#1a1f71" opacity="0.5"/></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 54 16" height="9" width="30"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#1a6b3c">Ru</text><text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#f47920">Pay</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'20px'}}>
              <svg viewBox="0 0 20 14" height="11" width="14"><rect x="1" y="3" width="18" height="10" rx="1.5" fill="none" stroke="#555" strokeWidth="1.2"/><line x1="1" y1="6" x2="19" y2="6" stroke="#555" strokeWidth="1.2"/><rect x="3" y="8" width="5" height="2" rx="0.5" fill="#555"/></svg>
              <span className="text-[7px] font-bold text-slate-500">NET</span>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'20px'}}>
              <svg viewBox="0 0 16 16" height="11" width="11"><circle cx="8" cy="8" r="7" fill="#4caf50" opacity="0.15"/><text x="4" y="12" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#388e3c">₹</text></svg>
              <span className="text-[7px] font-bold text-slate-500">COD</span>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <span className="text-[8px] font-black text-slate-500">EMI</span>
            </span>
            {/* --- Set 2 (duplicate for seamless loop) --- */}
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 50 16" height="9" width="28"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1a1f71">VISA</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 38 24" height="13" width="20"><circle cx="13" cy="12" r="9" fill="#eb001b"/><circle cx="25" cy="12" r="9" fill="#f79e1b"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#ff5f00"/></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 38 24" height="13" width="20"><circle cx="13" cy="12" r="9" fill="#0099df"/><circle cx="25" cy="12" r="9" fill="#e31837"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#6c2c91"/></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-[#016fd0] shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 44 14" height="8" width="26"><text x="0" y="11" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">AMEX</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 32 22" height="13" width="20"><circle cx="16" cy="11" r="9" fill="none" stroke="#1a1f71" strokeWidth="1.5"/><circle cx="11" cy="11" r="6" fill="#1a1f71" opacity="0.5"/><circle cx="21" cy="11" r="6" fill="#1a1f71" opacity="0.5"/></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <svg viewBox="0 0 54 16" height="9" width="30"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#1a6b3c">Ru</text><text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#f47920">Pay</text></svg>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'20px'}}>
              <svg viewBox="0 0 20 14" height="11" width="14"><rect x="1" y="3" width="18" height="10" rx="1.5" fill="none" stroke="#555" strokeWidth="1.2"/><line x1="1" y1="6" x2="19" y2="6" stroke="#555" strokeWidth="1.2"/><rect x="3" y="8" width="5" height="2" rx="0.5" fill="#555"/></svg>
              <span className="text-[7px] font-bold text-slate-500">NET</span>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'20px'}}>
              <svg viewBox="0 0 16 16" height="11" width="11"><circle cx="8" cy="8" r="7" fill="#4caf50" opacity="0.15"/><text x="4" y="12" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#388e3c">₹</text></svg>
              <span className="text-[7px] font-bold text-slate-500">COD</span>
            </span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'20px'}}>
              <span className="text-[8px] font-black text-slate-500">EMI</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
