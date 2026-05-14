'use client';

import * as React from 'react';
import Image from 'next/image';
import { BannerSlider } from '@/components/home/BannerSlider';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const categories = [
  { name: 'Mobiles', icon: '📱', color: 'bg-blue-100 text-blue-600' },
  { name: 'Electronics', icon: '🔌', color: 'bg-purple-100 text-purple-600' },
  { name: 'Appliances', icon: '🍳', color: 'bg-orange-100 text-orange-600' },
  { name: 'Fashion', icon: '👕', color: 'bg-pink-100 text-pink-600' },
  { name: 'Grocery', icon: '🍎', color: 'bg-green-100 text-green-600' },
  { name: 'Beauty', icon: '💄', color: 'bg-rose-100 text-rose-600' }
];

export default function Home() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          sale_price,
          categories (name),
          product_images (image_url, is_featured)
        `)
        .eq('is_featured', true)
        .limit(8);

      if (data) {
        const transformed = data.map(p => ({
          id: p.id,
          name: p.name,
          category: (Array.isArray(p.categories) ? p.categories[0]?.name : (p.categories as any)?.name) || 'Kitchen',
          price: p.price,
          salePrice: p.sale_price,
          imageUrl: p.product_images?.find((img: any) => img.is_featured)?.image_url || 'https://via.placeholder.com/400'
        }));
        setProducts(transformed);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Banner Section */}
      <section className="container mx-auto px-4 pt-6">
        <BannerSlider />
      </section>

      {/* Category Icons Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110 ${cat.color} shadow-sm`}>
                {cat.icon}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold">Free Shipping</h4>
                <p className="text-sm text-muted-foreground">On all orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold">Secure Payment</h4>
                <p className="text-sm text-muted-foreground">Server-side verified UPI</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold">Fast Delivery</h4>
                <p className="text-sm text-muted-foreground">24-48 hours delivery time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Featured Products</h2>
            <p className="text-muted-foreground">Top picks for your modern kitchen</p>
          </div>
          <Button variant="outline" className="rounded-full group">
            View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-3xl bg-slate-100 animate-pulse" />
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No featured products found
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          )}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="container mx-auto px-4">
        <div className="overflow-hidden rounded-3xl bg-slate-900 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 p-8 md:p-16">
              <span className="inline-block rounded-full bg-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                Flash Sale
              </span>
              <h2 className="text-3xl font-bold md:text-5xl lg:text-6xl">Up to 60% OFF</h2>
              <p className="mt-6 text-lg text-gray-400">
                Don't miss out on our limited time offer for smart kitchen appliances.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white border-none px-8">
                  Shop Now
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-500">08:45:22</span>
                  <span className="text-sm text-gray-400">Left</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative w-full h-[300px] md:h-[500px]">
              <Image 
                src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=2070&auto=format&fit=crop"
                alt="Flash Sale"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
