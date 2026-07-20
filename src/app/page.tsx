'use client';

import * as React from 'react';
import Link from 'next/link';
import { BannerSlider } from '../components/home/BannerSlider';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LiveSaleTimer = () => {
  const [timeLeft, setTimeLeft] = React.useState(15 * 60);

  React.useEffect(() => {
    const getOrSetLiveSaleTime = () => {
      const stored = sessionStorage.getItem('shared_offer_ends_at');
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
      sessionStorage.setItem('shared_offer_ends_at', endsAt.toString());
      return { endsAt, remaining: 15 * 60 };
    };

    const init = getOrSetLiveSaleTime();
    setTimeLeft(init.remaining);

    const timer = setInterval(() => {
      const now = Date.now();
      const stored = sessionStorage.getItem('shared_offer_ends_at');
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          // Reset to 15 minutes if expired
          const newEndsAt = now + 15 * 60 * 1000;
          sessionStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
          setTimeLeft(15 * 60);
        }
      } else {
        const newEndsAt = now + 15 * 60 * 1000;
        sessionStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
        setTimeLeft(15 * 60);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <span className="text-[#2874f0] font-bold text-[15px]">
      {minutes}:{secondsStr}
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

    const filterKitchenHomeProducts = (items: any[]) => {
      const whitelist = [
        'cookware', 'cook', 'kitchen', 'pan', 'pot', 'grinder', 'mixer', 'stove', 'induction', 'casserole',
        'kettle', 'gas', 'dinner set', 'dinner-set', 'tawa', 'juicer', 'knife', 'knives', 'cutting board', 
        'rice cooker', 'appliances', 'home products', 'combo set', 'cooking', 'soup pot', 
        'pressure cooker', 'lunch box', 'utensil', 'chopper', 'peeler', 'bottle', 'flask', 'thermosteel', 
        'cooktop', 'fry pan', 'kadai', 'griddle', 'nonstick', 'non-stick', 'spoon', 'fork', 'crockery', 'plates',
        'saucepan', 'kadhai', 'grate', 'chimney', 'blender', 'toaster'
      ];
      return items.filter((item: any) => {
        const name = (item.name || '').toLowerCase();
        return whitelist.some(kw => name.includes(kw));
      });
    };

    // Load from cache first for instant rendering on slow networks
    try {
      const cached = localStorage.getItem('cached_homepage_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(filterKitchenHomeProducts(parsed));
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
          const filtered = filterKitchenHomeProducts(data);
          const shuffled = shuffleArray(filtered);
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
      {/* Main Banner Slider */}
      <section className="bg-[#f1f3f6] w-full">
        <BannerSlider />
      </section>

      {/* Deals of the Day Timer Row */}
      <section className="w-full bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between select-none">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[16px] font-extrabold text-[#2874f0] tracking-tight leading-none">
            Deals of the Day
          </h2>
          <div className="flex items-center text-slate-800 text-[14px] font-extrabold leading-none gap-1.5">
            <svg 
              stroke="currentColor" 
              fill="currentColor" 
              strokeWidth="0" 
              viewBox="0 0 512 512" 
              className="w-[18px] h-[18px] text-[#2874f0]" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M403.1 108.9c-81.2-81.2-212.9-81.2-294.2 0-81.3 81.2-81.2 212.9 0 294.2 81.2 81.2 212.9 81.2 294.2 0 81.2-81.2 81.2-213 0-294.2zm-16.5 53.2c7.6-4.4 17.5-1.8 21.9 5.9 4.4 7.6 1.8 17.5-5.9 21.9-7.6 4.4-17.5 1.8-21.9-5.9-4.4-7.6-1.8-17.5 5.9-21.9zM80 256c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16-16-7.2-16-16zm45.4 93.9c-7.6 4.4-17.5 1.8-21.9-5.9-4.4-7.6-1.8-17.5 5.9-21.9 7.6-4.4 17.5-1.8 21.9 5.9 4.4 7.6 1.8 17.5-5.9 21.9zm5.9-165.9c-4.4 7.6-14.2 10.3-21.9 5.9-7.6-4.4-10.3-14.2-5.9-21.9 4.4-7.6 14.2-10.3 21.9-5.9 7.7 4.4 10.3 14.3 5.9 21.9zm36.7-80.4c7.6-4.4 17.5-1.8 21.9 5.9 4.4 7.6 1.8 17.5-5.9 21.9s-17.5 1.8-21.9-5.9c-4.4-7.7-1.7-17.5 5.9-21.9zm-7.8 110.7l15.6-26.6 95.2 56.9V384h-31V260.6l-79.8-46.3zm29.7 188.3c-4.4 7.6-14.2 10.3-21.9 5.9s-10.3-14.2-5.9-21.9c4.4-7.6 14.2-10.3 21.9-5.9 7.6 4.4 10.3 14.2 5.9 21.9zM256 432c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0-320c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm88 296.4c-7.6 4.4-17.5 1.8-21.9-5.9-4.4-7.6-1.8-17.5 5.9-21.9 7.6-4.4 17.5-1.8 21.9 5.9 4.4 7.7 1.7 17.5-5.9 21.9zm5.9-283c-4.4 7.6-14.2 10.3-21.9 5.9s-10.3-14.2-5.9-21.9c4.4-7.6 14.2-10.3 21.9-5.9s10.3 14.3 5.9 21.9zM408.4 344c-4.4 7.6-14.2 10.3-21.9 5.9-7.6-4.4-10.3-14.2-5.9-21.9 4.4-7.6 14.2-10.3 21.9-5.9 7.7 4.4 10.3 14.3 5.9 21.9zm7.6-72c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z" />
            </svg>
            <LiveSaleTimer />
          </div>
        </div>
        <div>
          <button className="text-[12px] font-black text-[#d32f2f] bg-white border border-[#e57373]/30 px-3.5 py-1.5 rounded-sm shadow-xs uppercase tracking-wider select-none pointer-events-none">
            SALE IS LIVE
          </button>
        </div>
      </section>

      {/* Suggested For You Section Header */}
      <section className="bg-white w-full pt-4 pb-2 px-4 flex items-center justify-between select-none">
        <h2 className="text-[17px] font-extrabold text-[#111111] tracking-tight">Suggested For You</h2>
        <div className="bg-black rounded-full p-1.5 flex items-center justify-center cursor-pointer hover:bg-slate-900 active:scale-95 transition-all">
          <ArrowRight className="h-4 w-4 text-white" strokeWidth={3} />
        </div>
      </section>

      <section className="bg-white px-3 pb-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] sm:aspect-[2/3] bg-slate-50 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
