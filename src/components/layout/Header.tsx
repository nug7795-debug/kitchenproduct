'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-[#ffa35d] select-none shadow-sm">
      <div className="relative w-full aspect-[446/168]">
        {/* Real cropped header image */}
        <img 
          src="/header_real.png" 
          alt="Flipkart Header" 
          className="w-full h-full object-cover block"
        />

        {/* Search input overlay over the search input box in the image */}
        <form 
          onSubmit={handleSearch} 
          className="absolute flex items-center bg-transparent"
          style={{ left: '16%', top: '56%', width: '56%', height: '36%' }}
        >
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder=""
            className="w-full h-full bg-transparent text-[13px] text-slate-800 outline-none font-medium px-2"
          />
        </form>
      </div>
    </header>
  );
};
