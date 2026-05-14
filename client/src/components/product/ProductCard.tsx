import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '../ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
  rating?: number;
}

export const ProductCard = ({ id, name, price, salePrice, imageUrl, category, rating = 4.5 }: ProductCardProps) => {
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg">
      {discount > 0 && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
          {discount}% OFF
        </div>
      )}
      <Link href={`/product/${id}`} className="block overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={imageUrl || '/placeholder.png'}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{category}</p>
        <Link href={`/product/${id}`} className="block">
          <h3 className="line-clamp-1 font-semibold text-sm group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-1 text-orange-400">
          <Star className="h-3 w-3 fill-current" />
          <span className="text-xs font-medium text-muted-foreground">{rating}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            {salePrice ? (
              <>
                <span className="text-lg font-bold text-primary">₹{salePrice}</span>
                <span className="text-xs text-muted-foreground line-through">₹{price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">₹{price}</span>
            )}
          </div>
          <Button size="icon" variant="secondary" className="rounded-full hover:bg-primary hover:text-white transition-all">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
