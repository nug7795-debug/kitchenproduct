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
    <div className="flex items-center gap-1 shrink-0 select-none">
      <span className="bg-[#ffece2] text-[#fb641b] text-[13px] font-extrabold px-2 py-0.5 rounded-[4px] min-w-[24px] text-center">{minutesStr}</span>
      <span className="text-[12px] font-bold text-slate-450">:</span>
      <span className="bg-[#ffece2] text-[#fb641b] text-[13px] font-extrabold px-2 py-0.5 rounded-[4px] min-w-[24px] text-center">{secondsStr}</span>
    </div>
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
    '/uploads/lapalop1.webp',
    '/uploads/lapalop2.webp',
    '/uploads/lapalop3.webp'
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="bg-gradient-to-b from-[#e8f4fd] to-white text-[#212121] px-2 pt-3 pb-1 select-none border-b border-slate-100">
        <div className="grid grid-cols-6 gap-1">
          {[
            { name: 'For You', icon: ForYouIcon },
            { name: 'Fashion', icon: FashionIcon },
            { name: 'Mobiles', icon: MobilesIcon },
            { name: 'Electronics', icon: ElectronicsIcon },
            { name: 'Beauty', icon: BeautyIcon },
            { name: 'Home', icon: HomeIcon }
          ].map((cat) => (
            <div key={cat.name} className="flex flex-col items-center justify-between text-center">
              <div className="flex flex-col items-center justify-center text-[#212121]">
                <cat.icon className="w-[30px] h-[30px] mb-1.5" />
                <span className="text-[11.5px] font-semibold leading-tight">{cat.name}</span>
              </div>
              <div 
                style={{ 
                  height: '3px', 
                  backgroundColor: cat.name === 'For You' ? '#000000' : 'transparent', 
                  width: '32px', 
                  marginTop: '6px', 
                  borderRadius: '2px' 
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Deals of the Day Timer Row (Styled like a green ticket) */}
      <div className="bg-white py-2 px-2.5 select-none">
        <div className="relative bg-[#f0fff7] border-[1.5px] border-[#02be98] rounded-[8px] py-2 px-2.5 flex items-center justify-between overflow-visible shadow-[0_2px_8px_rgba(2,190,152,0.15)]">
          {/* Ticket Cutouts */}
          <div className="absolute -left-[6.5px] top-1/2 -translate-y-1/2 w-[12px] h-[20px] bg-white border-[1.5px] border-[#02be98] rounded-r-full border-l-0 z-10" />
          <div className="absolute -right-[6.5px] top-1/2 -translate-y-1/2 w-[12px] h-[20px] bg-white border-[1.5px] border-[#02be98] rounded-l-full border-r-0 z-10" />

          {/* Left: SALE IS LIVE */}
          <div className="flex items-center gap-1.5 shimmer-sale-banner px-1 py-0.5 rounded ml-1 shrink-0 whitespace-nowrap">
            {/* Blinking Red Dot */}
            <span className="w-2 h-2 rounded-full bg-[#d11243] animate-pulse shrink-0" />
            <span className="text-[13.5px] font-extrabold text-[#d11243] uppercase tracking-wider whitespace-nowrap">SALE IS LIVE</span>
          </div>

          {/* Right: Gift Icon + Offer Ends in + Timer */}
          <div className="flex items-center gap-1.5 mr-1 shrink-0">
            {/* Gift Icon */}
            <GiftIcon className="w-[28px] h-[28px] shrink-0" />
            
            <span className="text-[12.5px] font-bold text-[#111111] whitespace-nowrap">Offer Ends in</span>
            
            {/* Countdown Timer */}
            <LiveSaleTimer />
          </div>
        </div>
      </div>

      <div className="bg-[#f1f3f6] pb-20">
        {/* Recommended for You Section Header */}
        <div className="bg-white w-full py-3.5 px-4 flex items-center justify-between select-none">
          <h2 className="text-[16px] font-extrabold text-[#111111] tracking-tight">Recommended for You</h2>
          <ChevronRight className="h-5 w-5 text-black" strokeWidth={2.5} />
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
    </div>
  );
}
