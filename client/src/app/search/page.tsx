'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Search, Mic, Camera, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProductCard } from '../../components/product/ProductCard';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  
  const [searchInput, setSearchInput] = React.useState(query);
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchResults = async (q: string) => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          image_url,
          is_featured
        )
      `)
      .ilike('name', `%${q}%`)
      .eq('is_active', true);

    if (data) setResults(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchResults(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      {/* Search Header */}
      <div className="bg-white sticky top-0 z-50 border-b flex items-center gap-2 px-2 py-2">
        <button onClick={() => router.back()} className="p-2">
          <ChevronLeft className="h-6 w-6 text-slate-600" />
        </button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            autoFocus
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for Products, Brands and More"
            className="w-full bg-[#f0f5ff] h-11 pl-4 pr-10 rounded-lg text-sm font-medium outline-none border border-transparent focus:border-blue-500"
          />
          {searchInput && (
            <button 
              type="button" 
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </form>
        <div className="flex gap-1">
            <button className="p-2"><Mic className="h-5 w-5 text-slate-500" /></button>
            <button className="p-2"><Camera className="h-5 w-5 text-slate-500" /></button>
        </div>
      </div>

      {/* Results Content */}
      <div className="p-2">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-slate-200 border-t-[#2874f0] rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Searching Flipkart...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query ? (
          <div className="py-20 flex flex-col items-center gap-4 text-center px-8">
             <div className="bg-white p-6 rounded-full shadow-sm">
                <Search className="h-12 w-12 text-slate-200" />
             </div>
             <div>
                <h3 className="font-bold text-slate-800">No results found</h3>
                <p className="text-xs text-slate-500 mt-1">We couldn't find any matches for "{query}". Try different keywords.</p>
             </div>
             <Button variant="outline" className="rounded-full mt-4" onClick={() => router.push('/')}>
                Go to Homepage
             </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 mt-2 shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trending Searches</h3>
             <div className="space-y-4">
                {['Mixer Grinder', 'Induction Cooktop', 'Dinner Sets', 'Kitchen Tools'].map(term => (
                   <button 
                    key={term}
                    onClick={() => {
                        setSearchInput(term);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="w-full flex items-center gap-3 text-sm text-slate-600 font-medium hover:text-blue-600"
                   >
                      <Search className="h-4 w-4 opacity-30" />
                      {term}
                   </button>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-[#2874f0] rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </React.Suspense>
  );
}
