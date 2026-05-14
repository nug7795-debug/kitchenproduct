'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);

  // Mock data - in real app, fetch from API
  const product = {
    id: id,
    name: 'Pro-Mixer Master 500W',
    price: 12999,
    salePrice: 9999,
    description: 'The Pro-Mixer Master is designed for high-performance mixing. With a 500W motor and stainless steel blades, it handles everything from smoothies to tough dough with ease.',
    images: [
      'https://images.unsplash.com/photo-1594385208974-2e75f9d8ca28?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop'
    ],
    features: ['500W High Torque Motor', 'Stainless Steel Blades', 'Variable Speed Control', 'Dishwasher Safe Parts'],
    rating: 4.8,
    reviews: 124
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-white">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all",
                  selectedImage === i ? "border-orange-500" : "border-transparent"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-orange-500">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-primary">₹{product.salePrice}</span>
            <span className="text-lg text-muted-foreground line-through">₹{product.price}</span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600">
              {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-full">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-slate-50 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-slate-50 transition-colors"
                >
                  +
                </button>
              </div>
              <Button size="lg" className="flex-1 rounded-full bg-orange-500 hover:bg-orange-600">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            <Button size="lg" variant="outline" className="w-full rounded-full" asChild>
              <Link href="/checkout">Buy It Now</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="bg-slate-100 p-2 rounded-full"><ShieldCheck className="h-4 w-4" /></div>
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="bg-slate-100 p-2 rounded-full"><Truck className="h-4 w-4" /></div>
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="bg-slate-100 p-2 rounded-full"><RotateCcw className="h-4 w-4" /></div>
              <span>7 Days Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
