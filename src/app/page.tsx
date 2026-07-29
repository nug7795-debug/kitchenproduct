'use client';

import * as React from 'react';
import Link from 'next/link';
import { BannerSlider } from '../components/home/BannerSlider';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { ArrowRight, ChevronRight, Smartphone, Monitor } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LiveSaleTimer = ({ className = "text-[#2874f0] font-bold text-[15px]" }: { className?: string }) => {
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
    <span className={className}>
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
          const shuffled = shuffleArray(data);
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
      <div className="w-full bg-white pt-2.5 pb-1.5 px-3">
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
      <div className="bg-white px-2 py-3.5 select-none border-b border-slate-100">
        <div className="grid grid-cols-5 gap-1">
          {[
            { name: 'Mobiles', img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/86a19de055a5ae2c.jpg' },
            { name: 'Electronics', img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/9af2825c1882cb09.jpg' },
            { name: 'Appliances', img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/cba3261ad6af85cf.png' },
            { name: 'Furniture', img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/15d49cf205683c05.jpg' },
            { name: 'Grocery', img: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/987e8204a510854d-copy.png', fallback: 'https://rukminim2.flixcart.com/fk-p-flap/106/106/image/987e8204a510854d.png' }
          ].map((cat) => (
            <div key={cat.name} className="flex flex-col items-center justify-center text-center">
              <img src={cat.fallback || cat.img} alt={cat.name} className="w-[42px] h-[42px] object-contain mb-1.5" />
              <span className="text-[12px] font-semibold text-slate-700 leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deals of the Day Timer Row */}
      <div className="bg-white py-3.5 px-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 shimmer-sale-banner px-1.5 py-0.5 rounded">
          {/* Blinking Red Dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#d11243] animate-pulse" />
          <span className="text-[14px] font-extrabold text-[#d11243] uppercase tracking-wider">SALE IS LIVE</span>
        </div>
        <div className="flex items-center">
          <span className="text-[13px] font-semibold text-slate-500 mr-2">Ends in</span>
          <div className="bg-slate-100 px-2.5 py-1 rounded-[6px] flex items-center justify-center">
            <LiveSaleTimer className="text-[13px] font-extrabold text-black" />
          </div>
        </div>
      </div>

      <div className="bg-[#f1f3f6] pb-6">
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
