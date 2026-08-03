import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDynamicDeliveryDate(productId: string | number) {
  let hash = 0;
  const idStr = String(productId);
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const offset = Math.abs(hash % 5) + 1; // 1, 2, 3, 4, or 5
  
  const d = new Date();
  d.setDate(d.getDate() + offset); // Add offset days
  
  const dateNum = d.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[d.getMonth()];
  
  let suffix = '';
  if (dateNum === 1 || dateNum === 21 || dateNum === 31) {
    suffix = 'st';
  } else if (dateNum === 2 || dateNum === 22) {
    suffix = 'nd';
  } else if (dateNum === 3 || dateNum === 23) {
    suffix = ''; // 3 Aug
  } else {
    suffix = 'th'; // 4th, 5th, 6th, 7th Aug
  }
  
  return `${dateNum}${suffix} ${monthName}`;
}

