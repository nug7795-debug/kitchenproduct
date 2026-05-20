'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BannerSlider } from '../components/home/BannerSlider';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CountdownTimer = () => {
  // Start at 10 minutes (600 seconds)
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

export default function Home() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (name, slug),
            product_images (image_url, is_featured)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
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
      {/* SASA LELE Sale Countdown Banner */}
      <section className="bg-[#2874f0] w-full pt-2 pb-3 px-3 flex items-center justify-between relative overflow-hidden">
        {/* SASA LELE Graphic (CSS representation) */}
        <div className="flex flex-col font-black transform -rotate-6 z-10">
          <div className="bg-[#fbde3b] text-black px-1 leading-none text-[18px] tracking-tighter border-b-2 border-r-2 border-yellow-600 shadow-sm">SASA</div>
          <div className="bg-[#fbde3b] text-black px-1 leading-none text-[22px] tracking-tighter border-b-2 border-r-2 border-yellow-600 shadow-sm ml-1">LELE</div>
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-col items-center justify-center z-10 mt-1">
          <span className="text-white text-[12px] font-semibold mb-1">Sale ends in</span>
          <div className="flex items-center gap-1">
            <CountdownTimer />
          </div>
        </div>

        {/* Cool Guy Image / Graphic */}
        <div className="relative w-16 h-20 z-10">
          <Image 
            src="/hrithik.jpg" 
            alt="Sale" 
            fill 
            className="object-cover rounded-lg border border-white/20 shadow-md" 
          />
        </div>
        
        {/* Background Decorative Circles */}
        <div className="absolute top-0 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl transform -translate-x-1/2" />
      </section>

      {/* Main Banner Slider */}
      <section className="bg-[#f1f3f6] pt-2 px-2">
        <BannerSlider />
      </section>

      {/* "Still looking for these?" Section Hidden as per request
      <section className="bg-[#2874f0] pb-6 pt-4 px-3 mt-1 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }} />
        
        <h2 className="text-white text-[17px] font-bold tracking-tight mb-4 px-1 relative z-10">Still looking for these?</h2>
        <div className="flex overflow-x-auto gap-3 no-scrollbar relative z-10">
          {[
            { name: 'Plain Cases &...', image: 'https://images.unsplash.com/photo-1541560052-5e137f229371?q=80&w=300&auto=format&fit=crop' },
            { name: 'Pressure Coo...', image: 'https://images.unsplash.com/photo-1584900129033-b2da7863fb72?q=80&w=300&auto=format&fit=crop' },
            { name: 'Choppers & S...', image: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?q=80&w=300&auto=format&fit=crop' },
            { name: 'Wooden Spoo...', image: 'https://images.unsplash.com/photo-1590515151528-9d414a682121?q=80&w=300&auto=format&fit=crop' }
          ].map((item, i) => (
            <Link key={i} href="#" className="min-w-[110px] w-[110px] bg-white rounded-[12px] flex flex-col overflow-hidden pb-1 shadow-sm active:scale-95 transition-transform shrink-0">
              <div className="relative aspect-square w-full bg-[#f8f9fa] flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" referrerPolicy="no-referrer" crossOrigin="anonymous" />
              </div>
              <div className="flex flex-col text-center mt-1 px-1 h-6 justify-center">
                <p className="text-[12px] text-slate-700 font-medium line-clamp-1">{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      */}

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
