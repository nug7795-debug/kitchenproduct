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
    <span className="text-[#f47b20] font-black">
      {minutes}min {secondsStr}sec
    </span>
  );
};



export default function Home() {
  const [products, setProducts] = React.useState<any[]>([
    {
      id: "bd7bfe1f-d383-4fc9-a1d4-597dc315f6c5",
      name: "Maharaja Whiteline Odacios Plus Juicer Mixer Grinder",
      price: 4900,
      sale_price: 139,
      categories: { name: "Kitchen", slug: "kitchen" },
      product_images: [
        {
          image_url: "https://scjbackzybmoapkupfbi.supabase.co/storage/v1/object/public/kitchenproduct/products/1779433573286-8iculop.webp",
          is_featured: true
        }
      ]
    },
    {
      id: "e7fd205d-0c50-4b28-b161-6fe5668e591d",
      name: "Premier Non Stick Cookware Combo Pack HG 545",
      price: 2765,
      sale_price: 153,
      categories: { name: "Kitchen", slug: "kitchen" },
      product_images: [
        {
          image_url: "https://scjbackzybmoapkupfbi.supabase.co/storage/v1/object/public/kitchenproduct/products/1779433043959-r3mxj56.webp",
          is_featured: true
        }
      ]
    },
    {
      id: "mock-p3",
      name: "Prestige Magic Glass Top 2 Burner Gas Stove",
      price: 3995,
      sale_price: 1999,
      categories: { name: "Gas Stoves", slug: "gas-stoves" },
      product_images: [
        {
          image_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=300",
          is_featured: true
        }
      ]
    },
    {
      id: "mock-p4",
      name: "Pigeon Stovekraft Cruise 1800W Induction Cooktop",
      price: 3195,
      sale_price: 1449,
      categories: { name: "Inductions", slug: "inductions" },
      product_images: [
        {
          image_url: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=300",
          is_featured: true
        }
      ]
    }
  ]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            sale_price,
            is_active,
            average_rating,
            total_ratings,
            categories (name, slug),
            product_images (image_url, is_featured)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (active && data && data.length > 0) {
          setProducts(data);
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
      <section className="bg-[#f1f3f6] w-full pt-1 pb-0.5">
        <BannerSlider />
      </section>

      {/* Live Sale Timer Section (Full-width edge-to-edge matching endsale reference) */}
      <section className="w-full bg-white py-4 px-4 text-center flex flex-col items-center justify-center border-b-8 border-[#f1f3f6] mb-1">
        <div className="text-[19px] font-bold text-[#424242] flex items-center justify-center gap-1.5 leading-none">
          <span>Live Sale :</span>
          <LiveSaleTimer />
        </div>
        
        <div className="text-[12px] text-[#388e3c] font-semibold mt-2.5 flex items-center justify-center gap-1.5 leading-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#388e3c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#388e3c]"></span>
          </span>
          <span>14,352 People watching this sale</span>
        </div>
      </section>


      <section className="bg-white pt-5 pb-3 px-4 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Suggested For You</h2>
        <div className="bg-black rounded-full p-1.5 shadow-sm active:scale-90 transition-transform">
          <ArrowRight className="h-4 w-4 text-white stroke-[2.5px]" />
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

      {/* Bottom Padding for Nav */}
      <div className="h-24" />
    </div>
  );
}
