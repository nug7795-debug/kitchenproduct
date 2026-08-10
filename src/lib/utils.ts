import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDynamicDeliveryDate(productId?: string | number) {
  let hash = 0;
  const idStr = String(productId || '1');
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const offset = 2; // deterministic 2 days offset for exact consistency
  
  const d = new Date();
  d.setDate(d.getDate() + offset);
  
  const dateNum = d.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = monthNames[d.getMonth()];
  const dayName = dayNames[d.getDay()];
  
  return `${dateNum} ${monthName}, ${dayName}`;
}

