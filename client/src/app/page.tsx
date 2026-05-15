'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BannerSlider } from '../components/home/BannerSlider';
import { CategoriesBar } from '../components/home/CategoriesBar';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { ArrowRight, Zap, ShieldCheck, Truck, Loader2, ChevronRight } from 'lucide-react';
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
      {/* Horizontal Categories Bar */}
      <CategoriesBar />

      {/* Main Banner Slider */}
      <section className="bg-white">
        <BannerSlider />
      </section>

      {/* "Still looking for these?" Section */}
      <section className="mt-2 bg-white py-4 px-4 shadow-sm border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-900 text-[15px] font-black tracking-tight">Still looking for these?</h2>
          <div className="bg-[#2874f0] rounded-full p-1.5 shadow-sm active:scale-90 transition-transform">
            <ChevronRight className="h-3 w-3 text-white stroke-[3px]" />
          </div>
        </div>
        <div className="flex overflow-x-auto gap-3 no-scrollbar pb-1">
          {(products.length > 0 ? products : Array(3).fill({})).slice(0, 4).map((product, i) => {
            const imageUrl = product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80';
            const name = product.name || 'Sample Product';
            return (
              <Link key={product.id || i} href={product.id ? `/product/${product.id}` : '#'} className="min-w-[120px] bg-white rounded-xl flex flex-col gap-1 active:scale-95 transition-transform">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 p-2">
                  <Image src={imageUrl} alt={name} fill className="object-contain" unoptimized />
                </div>
                <div className="flex flex-col text-center mt-1">
                  <p className="text-[10px] font-bold text-slate-800 line-clamp-1 px-1">{name}</p>
                  <p className="text-[12px] font-black text-[#388e3c]">₹{product.sale_price || product.price || '999'}</p>
                </div>
              </Link>
            );
          })}
        </div>
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

      {/* Best of Electronics */}
      <section className="mt-2 bg-white py-5">
        <div className="px-4 flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Best of Deals</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Premium Selection</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-[10px] font-black border-[#2874f0] text-[#2874f0] hover:bg-[#2874f0] hover:text-white transition-all shadow-sm">
            VIEW ALL
          </Button>
        </div>
        <div className="flex overflow-x-auto gap-3 no-scrollbar px-4 pb-4">
          {products.map((product) => {
            const imageUrl = product.product_images?.[0]?.image_url || 'https://via.placeholder.com/200';
            return (
              <Link key={product.id} href={`/product/${product.id}`} className="min-w-[140px] flex flex-col gap-2 border border-slate-100 rounded-2xl p-3 bg-white hover:shadow-lg transition-all active:scale-95">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 p-2">
                  <Image src={imageUrl} alt={product.name} fill className="object-contain" />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-black text-slate-800 line-clamp-1">{product.name}</p>
                  <p className="text-[10px] text-green-600 font-black uppercase mt-1">From ₹{product.sale_price || product.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="mt-2 bg-white px-3 py-6">
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Recommended for You</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Based on your activity</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full text-[10px] h-8 font-black border-slate-200 text-[#2874f0] shadow-sm">
            VIEW ALL
          </Button>
        </div>
        
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

      {/* Bottom Padding for Nav */}
      <div className="h-24" />
    </div>
  );
}
