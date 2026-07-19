import * as React from 'react';

interface AsuredBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AsuredBadge = ({ className, size = 'md' }: AsuredBadgeProps) => {
  const height = size === 'sm' ? 'h-[14px]' : size === 'lg' ? 'h-[19px]' : 'h-[16px]';
  const circleSize = size === 'sm' ? 'w-3.5 h-3.5 text-[8px]' : size === 'lg' ? 'w-4.5 h-4.5 text-[10px]' : 'w-4 h-4 text-[9px]';
  const textSize = size === 'sm' ? 'text-[8.5px]' : size === 'lg' ? 'text-[10.5px]' : 'text-[9.5px]';
  
  return (
    <span className={`inline-flex items-center gap-0.5 select-none align-middle border border-[#2874f0]/15 bg-[#2874f0]/5 rounded-[3px] px-1 py-0.5 ${height} ${className || ''}`}>
      {/* Blue circle with yellow slanted F */}
      <span className={`${circleSize} rounded-full bg-[#2874f0] flex items-center justify-center text-[#ffe500] font-black italic shrink-0 leading-none`}>
        f
      </span>
      <span className={`text-[#2874f0] ${textSize} font-black italic tracking-tight font-sans leading-none uppercase pr-0.5`}>
        Asured
      </span>
    </span>
  );
};
