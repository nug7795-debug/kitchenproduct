'use client';

import * as React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const BANNERS = [
  '/banner_freedom_site.jpg',
  '/banner2.jpg',
  '/banner3.jpg',
  '/banner4.jpg',
  '/banner5.jpg'
];

const CATEGORIES = [
  { name: 'Mobiles', img: '/cat_mobiles.jpg' },
  { name: 'Electronics', img: '/cat_electronics.jpg' },
  { name: 'Appliances', img: '/cat_appliances.png' },
  { name: 'Furniture', img: '/cat_furniture.jpg' },
  { name: 'Grocery', img: '/cat_grocery.png' }
];

export const HeroHeader = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Auto-play banner slide show every 3 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('homeList') || document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white pb-0 select-none font-sans max-w-[520px] mx-auto">
      {/* 100% Exact Downloaded Original Top Header Image from goats-sale.com */}
      <div className="w-full bg-white select-none cursor-pointer" onClick={scrollToProducts}>
        <img 
          src="/upor5.webp" 
          alt="Flipkart Header" 
          loading="eager"
          decoding="async"
          // @ts-ignore
          fetchpriority="high"
          className="w-full h-auto block select-none pointer-events-none"
        />
      </div>

      {/* Hero Banner Carousel (Slide Show) matching goats-sale.com */}
      <div className="fk-banner-carousel max-w-[520px] mx-auto mt-2 px-2.5">
        <div className="relative w-full rounded-[10px] overflow-hidden shadow-[0_8px_22px_rgba(0,0,0,0.10)] bg-white aspect-[960/460]">
          {/* Banner Images */}
          {BANNERS.map((bannerUrl, index) => (
            <div
              key={bannerUrl}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={bannerUrl}
                alt={`Banner ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                // @ts-ignore
                fetchpriority={index === 0 ? "high" : "low"}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          ))}

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/35 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/35 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === i
                    ? 'w-5 h-1.5 bg-white shadow-sm'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 5 Categories Grid matching goats-sale.com categories-container */}
      <div className="categories-container pt-1 px-1 pb-1.5 bg-white mt-1">
        <div className="categories-grid grid grid-cols-5 gap-1">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={scrollToProducts}
              className="category-item flex flex-col items-center justify-center text-center cursor-pointer group select-none"
            >
              <img
                src={cat.img}
                alt={cat.name}
                loading="eager"
                decoding="async"
                className="w-[42px] h-[42px] mb-1.5 object-contain"
              />
              <span className="category-label text-[12px] font-medium text-[#333333] text-center leading-[1.2]">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
