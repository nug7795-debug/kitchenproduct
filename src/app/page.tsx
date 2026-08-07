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

const MobilePedestalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
    {/* Pedestal Base */}
    <rect x="6" y="44" width="52" height="14" rx="7" fill="url(#pedestal_grad)" />
    <path d="M10 44L14 38H50L54 44H10Z" fill="#e67e22" opacity="0.6" />
    {/* Phones */}
    <rect x="22" y="10" width="20" height="34" rx="3" fill="#1e1e24" stroke="#4a4e69" strokeWidth="1.5" />
    <rect x="24" y="13" width="16" height="27" rx="1.5" fill="url(#screen_purple)" />
    <circle cx="32" cy="11.5" r="1" fill="#6c5ce7" />
    <rect x="14" y="15" width="16" height="30" rx="3" fill="#2d3436" stroke="#636e72" strokeWidth="1.5" />
    <rect x="16" y="18" width="12" height="23" rx="1.5" fill="url(#screen_blue)" />
    <circle cx="22" cy="16.5" r="1" fill="#0984e3" />
    <defs>
      <linearGradient id="pedestal_grad" x1="6" y1="44" x2="58" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f39c12" />
        <stop offset="1" stopColor="#d35400" />
      </linearGradient>
      <linearGradient id="screen_purple" x1="24" y1="13" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a29bfe" />
        <stop offset="1" stopColor="#6c5ce7" />
      </linearGradient>
      <linearGradient id="screen_blue" x1="16" y1="18" x2="28" y2="41" gradientUnits="userSpaceOnUse">
        <stop stopColor="#74b9ff" />
        <stop offset="1" stopColor="#0984e3" />
      </linearGradient>
    </defs>
  </svg>
);

const ElectronicsPedestalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
    {/* Pedestal Base */}
    <rect x="6" y="44" width="52" height="14" rx="7" fill="url(#pedestal_grad_el)" />
    <path d="M10 44L14 38H50L54 44H10Z" fill="#e67e22" opacity="0.6" />
    {/* Laptop */}
    <rect x="22" y="20" width="24" height="17" rx="2" fill="#2d3436" stroke="#636e72" />
    <rect x="24" y="22" width="20" height="13" fill="#74b9ff" />
    <path d="M18 37H50L48 40H20L18 37Z" fill="#b2bec3" />
    {/* Red Headphones */}
    <path d="M16 28C16 18 22 12 32 12C42 12 48 18 48 28" stroke="#d63031" strokeWidth="4" strokeLinecap="round" />
    <rect x="12" y="26" width="6" height="10" rx="3" fill="#d63031" />
    <rect x="46" y="26" width="6" height="10" rx="3" fill="#d63031" />
    <defs>
      <linearGradient id="pedestal_grad_el" x1="6" y1="44" x2="58" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f39c12" />
        <stop offset="1" stopColor="#d35400" />
      </linearGradient>
    </defs>
  </svg>
);

const AppliancesPedestalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
    {/* Pedestal Base */}
    <rect x="6" y="44" width="52" height="14" rx="7" fill="url(#pedestal_grad_ap)" />
    <path d="M10 44L14 38H50L54 44H10Z" fill="#e67e22" opacity="0.6" />
    {/* Tower AC / Appliance */}
    <rect x="18" y="8" width="15" height="36" rx="3" fill="#dfe6e9" stroke="#b2bec3" strokeWidth="1.5" />
    <line x1="21" y1="14" x2="30" y2="14" stroke="#636e72" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="21" y1="18" x2="30" y2="18" stroke="#636e72" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="21" y1="22" x2="30" y2="22" stroke="#636e72" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="25.5" cy="38" r="2" fill="#0984e3" />
    {/* Gift Box / Card */}
    <rect x="35" y="22" width="17" height="22" rx="2" fill="url(#card_grad_ap)" />
    <path d="M35 29H52" stroke="#fdcb6e" strokeWidth="2" />
    <path d="M43.5 22V44" stroke="#fdcb6e" strokeWidth="2" />
    <defs>
      <linearGradient id="pedestal_grad_ap" x1="6" y1="44" x2="58" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f39c12" />
        <stop offset="1" stopColor="#d35400" />
      </linearGradient>
      <linearGradient id="card_grad_ap" x1="35" y1="22" x2="52" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6c5ce7" />
        <stop offset="1" stopColor="#a29bfe" />
      </linearGradient>
    </defs>
  </svg>
);

const FurniturePedestalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
    {/* Pedestal Base */}
    <rect x="6" y="44" width="52" height="14" rx="7" fill="url(#pedestal_grad_fn)" />
    <path d="M10 44L14 38H50L54 44H10Z" fill="#e67e22" opacity="0.6" />
    {/* Yellow Armchair */}
    <rect x="19" y="14" width="26" height="20" rx="4" fill="#fdcb6e" stroke="#e67e22" strokeWidth="1.5" />
    <rect x="14" y="22" width="9" height="15" rx="3" fill="#ffeaa7" stroke="#e67e22" strokeWidth="1.5" />
    <rect x="41" y="22" width="9" height="15" rx="3" fill="#ffeaa7" stroke="#e67e22" strokeWidth="1.5" />
    <rect x="19" y="29" width="26" height="10" rx="3" fill="#f39c12" />
    {/* Chair Legs */}
    <line x1="21" y1="39" x2="19" y2="45" stroke="#d35400" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="43" y1="39" x2="45" y2="45" stroke="#d35400" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="pedestal_grad_fn" x1="6" y1="44" x2="58" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f39c12" />
        <stop offset="1" stopColor="#d35400" />
      </linearGradient>
    </defs>
  </svg>
);

const GroceryPedestalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
    {/* Pedestal Base */}
    <rect x="6" y="44" width="52" height="14" rx="7" fill="url(#pedestal_grad_gr)" />
    <path d="M10 44L14 38H50L54 44H10Z" fill="#e67e22" opacity="0.6" />
    {/* Green Grocery Pouch */}
    <rect x="16" y="14" width="15" height="28" rx="2" fill="#2ecc71" stroke="#27ae60" strokeWidth="1.5" />
    <circle cx="23.5" cy="22" r="3.5" fill="#fff" opacity="0.85" />
    {/* Blue Grocery Box */}
    <rect x="31" y="10" width="17" height="32" rx="2" fill="#0984e3" stroke="#74b9ff" strokeWidth="1.5" />
    <rect x="34" y="16" width="11" height="14" fill="#ffeaa7" rx="1" />
    <defs>
      <linearGradient id="pedestal_grad_gr" x1="6" y1="44" x2="58" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f39c12" />
        <stop offset="1" stopColor="#d35400" />
      </linearGradient>
    </defs>
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
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 3H8l-2 3v4h3v11h10V10h3V6l-2-3z" />
    <path d="M9 3a3 3 0 0 0 6 0" fill="#ffd600" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const MobilesIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="2" width="12" height="20" rx="2" />
    <rect x="8" y="5" width="8" height="11" fill="#ffd600" opacity="0.85" stroke="none" />
    <line x1="12" y1="19" x2="12.01" y2="19" strokeWidth="2.5" />
  </svg>
);

const ElectronicsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <rect x="5" y="6" width="14" height="8" fill="#ffd600" opacity="0.85" stroke="none" />
    <path d="M1 18h22v2H1z" fill="#ffd600" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const BeautyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="11" width="10" height="11" rx="1" />
    <path d="M9 11V7h6v4" />
    <path d="M10 7L12 2h2l-2 5" fill="#ffd600" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3h8l2 7H6l2-7z" fill="#ffd600" stroke="currentColor" strokeWidth="1.6" />
    <line x1="12" y1="10" x2="12" y2="19" />
    <path d="M8 19h8" strokeWidth="2" />
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
      {/* 1. Line Categories Row (6 Tabs) */}
      <div className="bg-gradient-to-b from-[#ffd7b0] to-[#fff3e8] text-[#212121] px-1 pt-2 pb-1.5 select-none border-b border-orange-100">
        <div className="grid grid-cols-6 gap-1">
          {[
            { name: 'For You', icon: ForYouIcon },
            { name: 'Fashion', icon: FashionIcon },
            { name: 'Mobiles', icon: MobilesIcon },
            { name: 'Electronics', icon: ElectronicsIcon },
            { name: 'Beauty', icon: BeautyIcon },
            { name: 'Home', icon: HomeIcon }
          ].map((cat) => {
            const isForYou = cat.name === 'For You';
            return (
              <div key={cat.name} className="flex flex-col items-center justify-between text-center cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-[40px] h-[40px] flex items-center justify-center mb-1 ${isForYou ? 'bg-black/5 rounded-xl border border-black/10' : ''}`}>
                    <cat.icon className="w-[24px] h-[24px] text-[#212121]" />
                  </div>
                  <span className={`text-[11px] leading-tight text-[#212121] ${isForYou ? 'font-bold' : 'font-medium'}`}>{cat.name}</span>
                </div>
                <div 
                  style={{ 
                    height: '3px', 
                    backgroundColor: isForYou ? '#111111' : 'transparent', 
                    width: '32px', 
                    marginTop: '4px', 
                    borderRadius: '2px' 
                  }} 
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Middle Promo Banner 1 (Freedom Sale Starts 8th Aug) */}
      <div className="w-full bg-[#fff3e8] px-3 py-2">
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#fff5eb] via-[#ffe8d6] to-[#ffd4b2] border border-orange-200/60 p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1 z-10 max-w-[68%]">
            <div className="inline-flex items-center gap-1 bg-[#1e40af] text-white font-black text-[10px] px-2 py-0.5 rounded-r-full -ml-3.5 uppercase tracking-wider shadow-2xs">
              <span>FREEDOM</span> <span className="text-amber-300">SALE</span>
            </div>
            <h3 className="text-[16px] font-black text-[#c0392b] tracking-tight leading-tight mt-0.5">
              STARTS ON <span className="text-[#111]">8th AUG</span>
            </h3>
            <p className="text-[10px] font-bold text-slate-700 leading-tight">
              24 Hrs Early Access for Plus, BLACK & Flipkart Credit Card members
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 z-10">
            <div className="w-11 h-11 rounded-full bg-amber-400/20 flex items-center justify-center">
              <span className="text-xl">🎡</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-sm font-black text-xs">
              →
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Promo Banner 2 (Salute Worthy Deals) */}
      <div className="w-full bg-[#fff3e8] px-3 pb-2">
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#70b0e0] via-[#5b9bd5] to-[#4682b4] border border-sky-300/60 p-3.5 flex flex-col justify-between shadow-sm min-h-[160px]">
          {/* Top Row */}
          <div className="flex items-start justify-between w-full z-10">
            <div className="bg-[#1e40af] text-white p-1.5 rounded-lg text-center leading-none shadow-sm">
              <div className="text-[9px] font-black tracking-wider uppercase text-amber-300">FREEDOM SALE</div>
              <div className="text-[8px] font-bold text-slate-100 mt-0.5">STARTS 8th AUG</div>
              <div className="text-[7px] font-semibold text-amber-200 mt-0.5">Early Access: 7th AUG</div>
            </div>
            <div className="bg-black/40 backdrop-blur-xs text-white text-[8px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <span>Powered by</span>
              <span className="font-black text-white">intel CORE</span>
              <span>|</span>
              <span className="font-black text-amber-300">boltt</span>
            </div>
          </div>

          {/* Center 3D Text */}
          <div className="text-center my-1.5 z-10">
            <h2 className="text-[24px] font-black text-white tracking-tight uppercase italic leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ textShadow: '2px 2px 0px #1e3a8a, -2px -2px 0px #1e3a8a' }}>
              SALUTE<br />WORTHY DEALS
            </h2>
            <div className="inline-block bg-white text-[#2874f0] font-extrabold text-[10.5px] px-3 py-0.5 rounded-full shadow-md mt-1">
              Wishlist now
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bg-white rounded-lg p-1.5 flex items-center justify-between z-10 shadow-sm mt-1">
            <div className="flex items-center gap-1.5">
              <div className="bg-[#00a8cc] text-white text-[8.5px] font-black px-1.5 py-0.5 rounded">
                SBI card
              </div>
              <div className="text-[9.5px] font-extrabold text-slate-900 leading-tight">
                10% Instant Discount*
              </div>
            </div>
            <div className="text-[7.5px] font-semibold text-slate-500">
              with SBI Credit Card (also valid on EMI Trxns.)
            </div>
          </div>
        </div>
      </div>

      {/* 4. 3D Pedestal Category Icons Row (5 Items: Mobiles, Electronics, Appliances, Furniture, Grocery) */}
      <div className="bg-white text-[#212121] px-1 py-2.5 select-none border-b border-slate-150">
        <div className="grid grid-cols-5 gap-1">
          {[
            { name: 'Mobiles', icon: MobilePedestalIcon },
            { name: 'Electronics', icon: ElectronicsPedestalIcon },
            { name: 'Appliances', icon: AppliancesPedestalIcon },
            { name: 'Furniture', icon: FurniturePedestalIcon },
            { name: 'Grocery', icon: GroceryPedestalIcon }
          ].map((cat) => (
            <div 
              key={cat.name} 
              onClick={() => {
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform py-1"
            >
              <div className="w-[48px] h-[48px] flex items-center justify-center mb-1">
                <cat.icon />
              </div>
              <span className="text-[12px] font-medium leading-tight text-[#212121]">{cat.name}</span>
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

      {/* Flipkart-style Footer (Compact - No Empty White Spacing) */}
      <div className="w-full bg-white border-t border-slate-100 mt-1">
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-0 border-b border-slate-100">
          <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 border-r border-b border-slate-100 active:bg-slate-50">
            <span className="w-6 h-6 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="2" fill="#f4a43a"/>
                <path d="M8 7V5a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="7" y="11" width="4" height="3" rx="0.5" fill="#fff" opacity="0.8"/>
              </svg>
            </span>
            <span className="text-[12px] font-bold text-[#212121]">Become a Seller</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 border-b border-slate-100 active:bg-slate-50">
            <span className="w-6 h-6 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#f4a43a" stroke="#e07b00" strokeWidth="1"/>
              </svg>
            </span>
            <span className="text-[12px] font-bold text-[#212121]">Advertise</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 border-r border-slate-100 active:bg-slate-50">
            <span className="w-6 h-6 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="10" width="20" height="11" rx="2" fill="#f4a43a"/>
                <path d="M8 10V8a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 2v6" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="2" fill="#fff" opacity="0.85"/>
              </svg>
            </span>
            <span className="text-[12px] font-bold text-[#212121]">Gift Cards</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 active:bg-slate-50">
            <span className="w-6 h-6 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#f4a43a"/>
                <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2.5-2.5 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="0.8" fill="#fff"/>
              </svg>
            </span>
            <span className="text-[12px] font-bold text-[#212121]">Help Center</span>
          </a>
        </div>

        {/* Copyright Bar */}
        <div className="bg-[#2874f0] py-2 text-center">
          <span className="text-white font-bold text-[12px]">© 2007-2025 </span><span className="text-white font-bold text-[12px] opacity-90">flipkat.com</span>
        </div>

        {/* Payment Icons - Auto Marquee */}
        <style>{`
          @keyframes marquee-rtl { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .payment-track { animation: marquee-rtl 14s linear infinite; }
        `}</style>
        <div className="bg-white py-1.5 overflow-hidden">
          <div className="payment-track flex items-center gap-2" style={{width:'max-content'}}>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 50 16" height="8" width="24"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1a1f71">VISA</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 38 24" height="11" width="18"><circle cx="13" cy="12" r="9" fill="#eb001b"/><circle cx="25" cy="12" r="9" fill="#f79e1b"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#ff5f00"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 38 24" height="11" width="18"><circle cx="13" cy="12" r="9" fill="#0099df"/><circle cx="25" cy="12" r="9" fill="#e31837"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#6c2c91"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-[#016fd0] shrink-0" style={{height:'18px'}}><svg viewBox="0 0 44 14" height="7" width="22"><text x="0" y="11" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">AMEX</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 32 22" height="11" width="18"><circle cx="16" cy="11" r="9" fill="none" stroke="#1a1f71" strokeWidth="1.5"/><circle cx="11" cy="11" r="6" fill="#1a1f71" opacity="0.5"/><circle cx="21" cy="11" r="6" fill="#1a1f71" opacity="0.5"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 54 16" height="8" width="26"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#1a6b3c">Ru</text><text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#f47920">Pay</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'18px'}}><svg viewBox="0 0 20 14" height="9" width="12"><rect x="1" y="3" width="18" height="10" rx="1.5" fill="none" stroke="#555" strokeWidth="1.2"/><line x1="1" y1="6" x2="19" y2="6" stroke="#555" strokeWidth="1.2"/><rect x="3" y="8" width="5" height="2" rx="0.5" fill="#555"/></svg><span className="text-[7px] font-bold text-slate-500">NET</span></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'18px'}}><svg viewBox="0 0 16 16" height="9" width="9"><circle cx="8" cy="8" r="7" fill="#4caf50" opacity="0.15"/><text x="4" y="12" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#388e3c">₹</text></svg><span className="text-[7px] font-bold text-slate-500">COD</span></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'18px'}}><span className="text-[8px] font-black text-slate-500">EMI</span></span>
            {/* Duplicate for seamless loop */}
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 50 16" height="8" width="24"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1a1f71">VISA</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 38 24" height="11" width="18"><circle cx="13" cy="12" r="9" fill="#eb001b"/><circle cx="25" cy="12" r="9" fill="#f79e1b"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#ff5f00"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 38 24" height="11" width="18"><circle cx="13" cy="12" r="9" fill="#0099df"/><circle cx="25" cy="12" r="9" fill="#e31837"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#6c2c91"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-[#016fd0] shrink-0" style={{height:'18px'}}><svg viewBox="0 0 44 14" height="7" width="22"><text x="0" y="11" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">AMEX</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 32 22" height="11" width="18"><circle cx="16" cy="11" r="9" fill="none" stroke="#1a1f71" strokeWidth="1.5"/><circle cx="11" cy="11" r="6" fill="#1a1f71" opacity="0.5"/><circle cx="21" cy="11" r="6" fill="#1a1f71" opacity="0.5"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'18px'}}><svg viewBox="0 0 54 16" height="8" width="26"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#1a6b3c">Ru</text><text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#f47920">Pay</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'18px'}}><svg viewBox="0 0 20 14" height="9" width="12"><rect x="1" y="3" width="18" height="10" rx="1.5" fill="none" stroke="#555" strokeWidth="1.2"/><line x1="1" y1="6" x2="19" y2="6" stroke="#555" strokeWidth="1.2"/><rect x="3" y="8" width="5" height="2" rx="0.5" fill="#555"/></svg><span className="text-[7px] font-bold text-slate-500">NET</span></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'18px'}}><svg viewBox="0 0 16 16" height="9" width="9"><circle cx="8" cy="8" r="7" fill="#4caf50" opacity="0.15"/><text x="4" y="12" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#388e3c">₹</text></svg><span className="text-[7px] font-bold text-slate-500">COD</span></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0" style={{height:'18px'}}><span className="text-[8px] font-black text-slate-500">EMI</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
