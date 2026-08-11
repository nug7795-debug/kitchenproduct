'use client';

import * as React from 'react';
import Link from 'next/link';
import { BannerSlider } from '../components/home/BannerSlider';
import { HeroHeader } from '../components/home/HeroHeader';
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
    <span className="text-[#5f6368] font-normal">
      Ends in <b className="font-extrabold text-[#e65100]">{minutesStr}</b>:<b className="font-extrabold text-[#e65100]">{secondsStr}</b>
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

  // Load cached products immediately on mount for 0-second fast render on slow networks
  React.useEffect(() => {
    try {
      const cached = localStorage.getItem('fast_cached_homepage_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setLoading(false);
        }
      }
    } catch (e) {
      // Ignore cache errors
    }
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

    const fetchData = async () => {
      try {
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
          if (error.message?.includes('is_limited_time_deal') || error.message?.includes('is_trending') || error.message?.includes('column')) {
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
            data = (fallbackResponse.data || []).map((item: any) => ({
              ...item,
              is_limited_time_deal: false,
              is_trending: false
            }));
            error = fallbackResponse.error;
          }
        }

        if (error) throw error;
        if (active && data) {
          const processed = applyDynamicBadges(data, badgesConfig);
          const shuffled = shuffleArray(processed);
          setProducts(shuffled);
          try {
            localStorage.setItem('fast_cached_homepage_products', JSON.stringify(shuffled));
          } catch (e) {
            // Ignore storage quota
          }
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
      <HeroHeader />

      {/* Deal Bar matching deal-bar class */}
      <div className="w-full max-w-[520px] mx-auto mt-[4px] py-[9px] px-[14px] bg-white border-b border-[#f1f3f6] flex items-center justify-between gap-[12px] text-[13px] select-none" id="dealBar">
        <div className="flex items-center gap-[8px] whitespace-nowrap">
          <span className="w-[7px] h-[7px] rounded-full bg-[#00c853] shrink-0 animate-pulse shadow-[0_0_0_rgba(0,200,83,0.6)]" />
          <span className="font-bold text-[#1f3fb8]">SALE LIVE</span>
          <span className="text-[#9aa3b2]">•</span>
          <LiveSaleTimer />
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById('products-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="shrink-0 text-white font-bold text-[12px] py-[6px] px-[12px] rounded-[10px] bg-gradient-to-br from-[#2874f0] to-[#1f4bd8] shadow-[0_6px_14px_rgba(40,116,240,0.35)] active:scale-97 flex items-center gap-1 cursor-pointer"
        >
          Shop Now
          <ChevronRight className="w-3 h-3 text-white stroke-[3]" />
        </button>
      </div>

      <div className="bg-[#f1f3f6] pb-2" id="products-section">
        {loading ? (
          <div className="list grid grid-cols-2 gap-2 p-2 max-w-[520px] mx-auto w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="list grid grid-cols-2 gap-2 p-2 max-w-[520px] mx-auto w-full" id="homeList">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
