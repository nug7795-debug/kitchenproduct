'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BannerSlider } from '../components/home/BannerSlider';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Then fetch images for these products
        const productIds = productsData?.map(p => p.id) || [];
        const { data: imagesData } = await supabase
          .from('product_images')
          .select('*')
          .in('product_id', productIds);

        // Map images to products
        const productsWithImages = productsData?.map(product => ({
          ...product,
          product_images: imagesData?.filter(img => img.product_id === product.id) || []
        })) || [];

        setProducts(productsWithImages);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
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
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col bg-[#f1f3f6] min-h-screen">
      {/* Main Banner Slider */}
      <section className="bg-white">
        <BannerSlider />
      </section>

      {/* "Still looking for these?" Section */}
      <section className="bg-[#2874f0] pb-6 pt-4 px-3 mt-1">
        <h2 className="text-white text-[17px] font-bold tracking-tight mb-4 px-1">Still looking for these?</h2>
        <div className="flex overflow-x-auto gap-3 no-scrollbar">
          {(products.length > 0 ? products : Array(4).fill({})).slice(0, 5).map((product, i) => {
            const imageUrl = product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80';
            const name = product.name || 'Office Supplies';
            return (
              <Link key={product.id || i} href={product.id ? `/product/${product.id}` : '#'} className="min-w-[110px] w-[110px] bg-white rounded-[12px] flex flex-col overflow-hidden pb-1 shadow-sm active:scale-95 transition-transform shrink-0">
                <div className="relative aspect-square w-full bg-white p-1">
                  <Image src={imageUrl} alt={name} fill className="object-contain rounded-t-[10px]" unoptimized />
                </div>
                <div className="flex flex-col text-center mt-1 px-1 h-6 justify-center">
                  <p className="text-[12px] text-slate-600 line-clamp-1">{name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Suggested For You Header */}
      <section className="bg-white pt-5 pb-3 px-4 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Suggested For You</h2>
        <div className="bg-black rounded-full p-1.5 shadow-sm active:scale-90 transition-transform">
          <ArrowRight className="h-4 w-4 text-white stroke-[2.5px]" />
        </div>
      </section>

      {/* Suggested For You Grid */}
      <section className="bg-white px-3 pb-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-50 animate-pulse border border-slate-100" />
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

      {/* Sponsored/Brand Banners */}
      <section className="mt-2 bg-white p-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm">
             <Image src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=2070" alt="Sponsor" fill className="object-cover" />
             <div className="absolute top-2 right-2 bg-black/40 text-[7px] text-white px-2 py-0.5 rounded-full font-black tracking-widest backdrop-blur-sm">AD</div>
          </div>
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm">
             <Image src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070" alt="Sponsor" fill className="object-cover" />
             <div className="absolute top-2 right-2 bg-black/40 text-[7px] text-white px-2 py-0.5 rounded-full font-black tracking-widest backdrop-blur-sm">AD</div>
          </div>
        </div>
      </section>

      {/* Bottom Padding for Nav */}
      <div className="h-24" />
    </div>
  );
}
