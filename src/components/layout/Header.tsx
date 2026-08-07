'use client';

import * as React from 'react';

export const Header = () => {
  return (
    <header className="w-full bg-white select-none">
      <div className="max-w-[520px] mx-auto p-0 leading-none bg-white">
        <img 
          src="/header_top_site.jpg" 
          alt="Flipkart Header" 
          className="w-full h-auto block"
        />
      </div>
    </header>
  );
};

