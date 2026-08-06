'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, ArrowLeft, Star, ChevronRight, MapPin, Tag, ShieldCheck, ThumbsUp, ThumbsDown, X, Upload, Share2, Wrench, CircleSlash, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { cn, getDynamicDeliveryDate } from "../../../lib/utils";
import { supabase } from '../../../lib/supabase';
import { ProductCard } from '../../../components/product/ProductCard';
import { applyDynamicBadges } from '../../../lib/badge-helper';

const formatReviewDate = (dateStr: string) => {
  if (!dateStr) return 'Today';
  const d = new Date(dateStr);
  const now = new Date();
  const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = nowDate.getTime() - dDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
};


const AssuredBadgeBig = () => (
  <img 
    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
    alt="fAssured" 
    className="h-[21px] w-auto shrink-0 select-none align-middle inline-block ml-3" 
  />
);

// Slanted WOW! bank offer badge
const WowIcon = () => (
  <svg 
    viewBox="0 0 38 16" 
    className="h-[19px] w-auto shrink-0 select-none align-middle inline-block mr-1.5" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M 3 1 L 35 1 C 36.5 1, 37 1.5, 37 3 L 37 11 C 37 12.5, 36.5 13, 35 13 L 9 13 L 5 15.5 L 6.5 13 L 3 13 C 1.5 13, 1 12.5, 1 11 L 1 3 C 1 1.5, 1.5 1, 3 1 Z" 
      fill="#FFFFFF" 
      stroke="#1c54d4" 
      strokeWidth="1.1" 
      strokeLinejoin="round"
    />
    <text 
      x="19" 
      y="10.2" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="8.5" 
      fontWeight="900" 
      fontStyle="italic" 
      fill="#1c54d4" 
      textAnchor="middle"
      letterSpacing="-0.1"
    >
      WOW!
    </text>
  </svg>
);

// Delivery truck icon SVG matching Flipkart
const DeliveryTruckIcon = () => (
  <svg 
    viewBox="0 0 16 12" 
    className="h-[12px] w-auto shrink-0 text-slate-800 align-middle inline-block mr-1" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="1" y1="3" x2="4" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="0" y1="5.5" x2="3" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="1" y1="8" x2="4" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="4.5" y="2" width="7" height="6" rx="0.5" fill="currentColor" />
    <path d="M 11.5 4 L 14 4 L 15 6 L 15 8 L 11.5 8 Z" fill="currentColor" />
    <path d="M 12 4.6 L 13.6 4.6 L 14.2 5.8 L 12 5.8 Z" fill="#FFFFFF" />
    <circle cx="6.5" cy="8.8" r="1.3" fill="currentColor" stroke="#FFFFFF" strokeWidth="0.5" />
    <circle cx="12.5" cy="8.8" r="1.3" fill="currentColor" stroke="#FFFFFF" strokeWidth="0.5" />
  </svg>
);



interface SimilarProductsProps {
  currentProductId: string;
  categoryId: string;
  categoryName?: string;
  currentProductName?: string;
}

const SimilarProducts = ({ currentProductId, categoryId, categoryName, currentProductName = '' }: SimilarProductsProps) => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        // Fetch global settings
        const settingsRes = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'global_settings')
          .maybeSingle();

        const badgesConfig = settingsRes.data?.value?.badges || {
          enableDynamicBadges: true,
          trendingCount: 15,
          newArrivalCount: 5,
          bestSellerCount: 5
        };

        // Fetch all active products
        const response = await supabase
          .from('products')
          .select(`
            *,
            categories (name, slug),
            product_images (image_url, is_featured)
          `)
          .eq('is_active', true);

        if (response.data) {
          // Process all active products to calculate correct dynamic badges
          const processed = applyDynamicBadges(response.data, badgesConfig);
          // Filter out the current product
          const filtered = processed.filter((p: any) => p.id !== currentProductId);
          const formatted = filtered.map((item: any) => ({
            ...item,
            categoryName: item.categories?.name || categoryName || 'Kitchen',
            images: item.product_images?.length > 0 
              ? item.product_images.map((img: any) => img.image_url)
              : ['https://via.placeholder.com/600']
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error('Error fetching similar products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, currentProductId, categoryName, currentProductName]);

  if (loading) {
    return (
      <div className="w-full bg-[#f1f3f6] py-3.5">
        <div className="flex items-center justify-between px-4 mb-2 select-none">
          <h3 className="text-[15px] font-extrabold text-slate-900">Similar Products</h3>
          <div className="w-9 h-6.5 bg-slate-200 rounded-full animate-pulse shrink-0" />
        </div>
        <div className="flex flex-row overflow-x-auto gap-2 px-4 select-none no-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[155px] shrink-0 p-2.5 bg-white rounded-lg border border-slate-100/60 flex flex-col animate-pulse" style={{ height: '270px' }}>
              <div className="w-full h-[130px] bg-slate-100 rounded-md mb-2" />
              <div className="h-3 bg-slate-100 rounded w-5/6 mb-1.5" />
              <div className="h-3 bg-slate-100 rounded w-2/3 mb-2" />
              <div className="h-2.5 bg-slate-100 rounded w-1/3 mb-2" />
              <div className="h-3.5 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="w-full bg-[#f1f3f6] py-3.5">
      <div className="flex items-center justify-between px-4 mb-2 select-none">
        <h3 className="text-[15px] font-extrabold text-slate-900">Similar Products</h3>
        <button className="w-9 h-6.5 bg-[#212121] rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors text-white text-xs font-bold shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
      <div className="flex flex-row overflow-x-auto gap-2.5 px-4 pb-1.5 select-none no-scrollbar snap-x snap-mandatory scroll-smooth">
        {products.map((item) => (
          <div key={item.id} className="w-[155px] shrink-0 snap-start bg-white rounded-lg overflow-hidden border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col">
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

const MoreProductsForYou = ({ currentProductId }: { currentProductId: string }) => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const settingsRes = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'global_settings')
          .maybeSingle();
        const badgesConfig = settingsRes.data?.value?.badges || { enableDynamicBadges: true, trendingCount: 15, newArrivalCount: 5, bestSellerCount: 5 };

        const response = await supabase
          .from('products')
          .select('*, categories (name, slug), product_images (image_url, is_featured)')
          .eq('is_active', true);

        if (response.data) {
          const processed = applyDynamicBadges(response.data, badgesConfig);
          const filtered = processed.filter((p: any) => p.id !== currentProductId);
          setProducts(filtered.map((item: any) => ({
            ...item,
            categoryName: item.categories?.name || 'Kitchen',
            images: item.product_images?.length > 0 ? item.product_images.map((img: any) => img.image_url) : ['https://via.placeholder.com/600']
          })));
        }
      } catch (err) {
        console.error('Error fetching more products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentProductId]);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <div className="w-full bg-[#f1f3f6] pb-0">
      <div className="bg-white w-full py-3.5 px-4 select-none">
        <h2 className="text-[16px] font-extrabold text-[#111111] tracking-tight">More products for you</h2>
      </div>
      <div className="grid grid-cols-2 gap-[1px]">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};


interface MockReview {
  id: string;
  rating: number;
  title: string;
  comment: string;
  reviewer_name: string;
  location: string;
  likes: number;
  dislikes: number;
  image_url: string | null;
  created_at: string;
}

const getMockReviews = (productName: string, totalReviews: number, productImageUrl?: string): MockReview[] => {
  const lower = (productName || '').toLowerCase();
  
  let type: 'luggage' | 'stove' | 'mixer' | 'cooker' | 'general' = 'general';
  let defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300';
  
  if (lower.includes('luggage') || lower.includes('trolley') || lower.includes('bag')) {
    type = 'luggage';
    defaultImageUrl = 'https://images.unsplash.com/photo-1565026057447-bc90a3dca487?auto=format&fit=crop&q=80&w=300';
  } else if (lower.includes('stove') || lower.includes('burner') || lower.includes('hob')) {
    type = 'stove';
    defaultImageUrl = 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=300';
  } else if (lower.includes('mixer') || lower.includes('grinder') || lower.includes('blade')) {
    type = 'mixer';
    defaultImageUrl = 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=300';
  } else if (lower.includes('cooker') || lower.includes('aluminium')) {
    type = 'cooker';
    defaultImageUrl = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=300';
  }

  // Simple LCG pseudo-random generator seeded by a string
  const createRandom = (seedStr: string) => {
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) {
      h = (Math.imul(31, h) + seedStr.charCodeAt(i)) | 0;
    }
    return function() {
      h = Math.imul(1103515245, h) + 12345;
      h = h & 0x7fffffff;
      return h / 0x80000000;
    };
  };

  const INDIAN_NAMES = [
    'Ansarul', 'Soriful', 'Priya Sharma', 'Amit Verma', 'Sneha Reddy', 
    'Vikram Singh', 'Rohan Sen', 'Meera Nair', 'Kunal Kapoor', 'Aditi Goel', 
    'Divya Patel', 'Sanjay Dutt', 'Rajesh Kumar', 'Suresh Raina', 'Anita Desai', 
    'Deepak Sharma', 'Pooja Hegde', 'Alok Pandey', 'Sunita Rao', 'Kavita Devi',
    'Arvind Swamy', 'Rahul Dravid', 'Sachin T.', 'Neha Kakkar', 'Karan Johar',
    'Rohit Sharma', 'Virat Kohli', 'MS Dhoni', 'Shikhar D.', 'Hardik P.',
    'Jasprit B.', 'KL Rahul', 'Rishabh P.', 'Ravindra J.', 'Shreyas I.',
    'Yuzvendra C.', 'Bhuvneshwar K.', 'Mohammed S.', 'Umesh Y.', 'Ishant S.'
  ];

  const CITIES = [
    'Kolkata', 'Mumbai', 'Bangalore', 'New Delhi', 'Hyderabad', 
    'Jaipur', 'Pune', 'Chennai', 'Chandigarh', 'Lucknow', 
    'Ahmedabad', 'Patna', 'Bhopal', 'Indore', 'Kochi', 
    'Coimbatore', 'Nagpur', 'Surat', 'Vadodara', 'Guwahati',
    'Ranchi', 'Bhubaneswar', 'Dehradun', 'Shimla', 'Jammu',
    'Srinagar', 'Amritsar', 'Jalandhar', 'Ludhiana', 'Kanpur'
  ];

  const TITLES_5 = [
    'Simply awesome', 'Mind-blowing purchase', 'Terrific purchase', 'Highly recommended', 
    'Delightful', 'Just wow', 'Fabulous!', 'Must buy!', 'Classy product', 'Excellent', 'Superb'
  ];

  const TITLES_4 = [
    'Very Good', 'Good choice', 'Value-for-money', 'Perfect purchase!', 'Nice product', 
    'Great product', 'Pretty good', 'Decent purchase', 'Satisfied customer', 'Worth the money'
  ];

  const CATEGORY_COMMENTS = {
    luggage: [
      "Excellent luggage bags. The build quality is very good and the wheels are very smooth.",
      "Great luggage bags. Very lightweight but extremely strong. Used it for my travel and it was durable.",
      "Loved the color and the dual spinner wheels are very silent and smooth.",
      "Good trolley bags. The lock works fine. Size is perfect for family trips.",
      "Flipkart assured delivery was very quick. Nice premium compartments.",
      "Got it on sale. Absolute steal at this price. Durable material.",
      "Decent quality trolley. The handles are sturdy and pull smoothly.",
      "Super light weight and look very stylish. Got many compliments!",
      "Excellent wheel alignment. Doesn't tip over even when heavily packed.",
      "Beautiful finish and extremely premium look.",
      "Stitching and material is super strong. Locks are highly secure.",
      "Nice compact bags. Perfect for cabin and check-in luggage needs.",
      "Very sturdy and lightweight bags. Traveled twice and no scratches.",
      "Outstanding quality trolley set. The color matches the picture exactly. Highly satisfied.",
      "Strong zippers and smooth pull rod. Very comfortable during heavy travel."
    ],
    stove: [
      "Excellent gas stove. The brass burners are of high quality and flame is very even.",
      "The body is premium toughened glass finish. Very easy to clean and sturdy knobs.",
      "Excellent value for money. Auto ignition works flawlessly. Flame intensity is excellent.",
      "Stove is compact and fits perfectly in small kitchens. Burners are quite far apart.",
      "Beautiful stove. Double packing and fast delivery by Flipkart.",
      "Extremely elegant and looks very premium in our modular kitchen.",
      "Excellent build quality, glass is thick and strong. Stand is highly stable.",
      "Saves a lot of gas. High thermal efficiency and knobs operate very smoothly.",
      "Outstanding performance. Multiple burners allow cooking multiple items simultaneously.",
      "Spill-proof design is a lifesaver. Extremely easy to clean milk spills or oil stains.",
      "Very sturdy stove. Brass burners don't rust or block. Highly durable.",
      "Flipkart delivered this in less than 24 hours. Excellent stove.",
      "The flames are clean and blue. No soot formation on pans. Excellent purchase.",
      "Modern looks and very sturdy pan supports. Stays in place during cooking.",
      "Highly efficient and elegant. Glass top makes cleanup effortless."
    ],
    mixer: [
      "Excellent mixer. The motor is very powerful and grinds dry spices in seconds.",
      "Sturdy stainless steel jars and very low noise operation. High speed grinding.",
      "Amazing performance. Jars are completely leak-proof and have secure locks.",
      "Grinds spices really well. The suction feet keep the mixer stable during operation.",
      "Grinds wet and dry items perfectly. The chutney jar is excellent.",
      "Extremely durable. The motor does not heat up even during long usage.",
      "Grinds hard items like turmeric easily. Elegant looking mixer.",
      "Good value mixer. Stainless steel blades are of high quality and do not rust.",
      "Very easy to wash and operate. Speed controls are clicky and robust.",
      "Motor sound is smooth and powerful. Flipkart packing was strong.",
      "Excellent chutney jar. High speed whipping and grinding is effortless.",
      "Jars have ergonomic handles which makes pouring very easy. Premium design.",
      "Very compact and powerful mixer grinder. Jars are highly durable.",
      "Makes smooth purees and fine powders effortlessly. Best brand choice.",
      "Beautiful metallic body and very secure jar locking mechanism."
    ],
    cooker: [
      "Excellent cooker combo. The aluminium is thick and safety valve is high quality.",
      "Great addition to my kitchen. Very durable and efficient pressure cooker.",
      "Gaskets are high quality. Fits perfectly on both gas and induction cooktops.",
      "Very convenient sizes (2L, 3L, 5L) for daily household usage.",
      "Superb quality pressure cooker. Cooks rice and dal in minutes.",
      "Very sturdy metal and strong safety valves. Hard anodized finish.",
      "Excellent brand value and sturdy build. Heavy base prevents food from burning.",
      "Unbeatable price for a three-piece combo. Flipkart delivery was exceptionally fast.",
      "Whistle mechanism works very smoothly. Saves a lot of cooking time.",
      "Best cooker in this range. Handles are robust and firmly screwed.",
      "Looks beautiful on our kitchen shelf. Very easy to clean.",
      "Decent cookers. Double safety pressure lock works fine.",
      "Extremely heavy base ensures food cooks without sticking. Perfect combo.",
      "Fast cooking and very safe pressure valves. Clean design and easy handling.",
      "Perfect sizes for a small to medium family. Ideal for induction as well."
    ],
    general: [
      "Excellent product. The build quality is very good and the delivery was fast. Highly recommended.",
      "Great addition to my kitchen. Very durable and efficient.",
      "Loved the color and the quality. Worth every rupee.",
      "Good purchase. Highly recommended for daily use.",
      "Flipkart assured delivery was very quick. The packaging was neat.",
      "Got it on sale. Absolute steal at this price.",
      "Decent quality product. Highly recommended for any household.",
      "Super light weight and look very stylish. Extremely happy!",
      "Doesn't tip over even when heavily packed. Very stable.",
      "Beautiful finish and extremely premium look.",
      "Stitching and material is super strong. Very satisfied.",
      "Nice compact product. Strongly built.",
      "Absolutely love this. Very premium feel and performs excellently.",
      "One of the best products in this range. Safe to use and easy to clean.",
      "High thermal efficiency and handles operate smoothly.",
      "My family loved it. Super fast delivery and great value."
    ]
  };

  const comments = CATEGORY_COMMENTS[type];
  const reviewsCount = Math.max(totalReviews || 30, 30);
  const list: MockReview[] = [];

  for (let i = 0; i < reviewsCount; i++) {
    const seedStr = `${productName}-${i}`;
    const rng = createRandom(seedStr);
    
    // Vary names and cities using offset indices to ensure variety
    const nameIdx = (i + Math.floor(rng() * 15)) % INDIAN_NAMES.length;
    const reviewerName = INDIAN_NAMES[nameIdx];
    
    const cityIdx = (i + Math.floor(rng() * 15)) % CITIES.length;
    const location = `Certified Buyer, ${CITIES[cityIdx]}`;
    
    const rating = rng() > 0.35 ? 5 : 4;
    const titleList = rating === 5 ? TITLES_5 : TITLES_4;
    const titleIdx = Math.floor(rng() * titleList.length);
    const title = titleList[titleIdx];
    
    const commentIdx = Math.floor(rng() * comments.length);
    const comment = comments[commentIdx];
    
    const likes = Math.round(rng() * 40 + 2);
    const dislikes = Math.round(rng() * 4);
    
    // Set first few to Today/Yesterday specifically, and mix others
    let daysAgo = 0;
    if (i === 0 || i === 2 || i === 5 || i === 8) {
      daysAgo = 0; // Today
    } else if (i === 1 || i === 3 || i === 6 || i === 9) {
      daysAgo = 1; // Yesterday
    } else {
      daysAgo = Math.floor(rng() * 45 + 2); // 2 to 47 days ago
    }
    const created_at = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    const hasImage = i === 0 || (i % 7 === 3 && rng() > 0.5);
    const image_url = hasImage ? defaultImageUrl : null;

    list.push({
      id: `mock-review-${i}`,
      rating,
      title,
      comment,
      reviewer_name: reviewerName,
      location,
      likes,
      dislikes,
      image_url,
      created_at
    });
  }

  if (list.length > 0) {
    list[0].reviewer_name = 'Ansarul';
    list[0].location = 'Certified Buyer, Kolkata';
    list[0].rating = 5;
    list[0].title = 'Simply awesome';
    list[0].comment = type === 'luggage' 
      ? 'Excellent product. The build quality is very good and the delivery was fast. Highly recommended.'
      : type === 'stove'
      ? 'Excellent gas stove. The brass burners are of high quality and flame is very even. Highly recommended.'
      : type === 'mixer'
      ? 'Excellent mixer grinds dry spices in seconds. Jars are heavy duty. Highly recommended.'
      : 'Excellent product. The build quality is very good and the delivery was fast. Highly recommended.';
    list[0].image_url = defaultImageUrl;
  }
  if (list.length > 1) {
    list[1].reviewer_name = 'Soriful';
    list[1].location = 'Certified Buyer, Mumbai';
    list[1].rating = 4;
    list[1].title = 'Very Good';
    list[1].comment = type === 'luggage'
      ? 'Great luggage bags. Very lightweight but extremely strong. Used it for my travel to Mumbai.'
      : type === 'stove'
      ? 'Great gas stove with sleek glass top. Heat distribution is uniform and knobs are sturdy.'
      : type === 'mixer'
      ? 'Great addition to my kitchen. Very durable and efficient speed controller.'
      : 'Great addition to my kitchen. Very durable and efficient.';
    list[1].image_url = null;
  }

  return list;
};

const parseDescription = (desc: string) => {
  if (!desc) return { text: '', specs: [] };
  
  const cleanDesc = desc.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
  const lines = cleanDesc.split('\n');
  const specs: { key: string; value: string }[] = [];
  const textLines: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    const parts = trimmed.split(/\s{2,}|\t/);
    if (parts.length >= 2) {
      specs.push({
        key: parts[0].trim(),
        value: parts[1].trim()
      });
    } else if (trimmed.includes(':') && !trimmed.startsWith('http')) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIdx).trim();
      const value = trimmed.substring(colonIdx + 1).trim();
      if (key && value && key.length < 35) {
        specs.push({ key, value });
      } else {
        textLines.push(trimmed);
      }
    } else if (trimmed.toLowerCase() !== 'about this product') {
      textLines.push(trimmed);
    }
  });
  
  return {
    text: textLines.join('\n'),
    specs
  };
};

const getBaseOrderCount = (productId: string | number) => {
  const idStr = String(productId);
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  // deterministic number between 1500 and 4500
  return 1500 + (Math.abs(hash) % 3000);
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isInCart, setIsInCart] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [showFullTitle, setShowFullTitle] = React.useState(false);
  const [logoSrc, setLogoSrc] = React.useState('/uploads/fliplpogo.png');
  const [orderedCount, setOrderedCount] = React.useState(3300);

  React.useEffect(() => {
    if (id) {
      const storageKey = `order_count_${id}`;
      const baseCount = getBaseOrderCount(id);
      const stored = localStorage.getItem(storageKey);
      let currentCount = stored ? parseInt(stored, 10) : baseCount;
      // Increment on this visit
      currentCount += 1;
      localStorage.setItem(storageKey, currentCount.toString());
      setOrderedCount(currentCount);
    }
  }, [id]);

  React.useEffect(() => {
    setLogoSrc(`/uploads/fliplpogo.png?t=${Date.now()}`);
  }, []);
  
  // Header visibility scroll states
  const [showHeader, setShowHeader] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  
  // Custom Timer for product-data2 countdown timer
  const [timeLeft, setTimeLeft] = React.useState(15 * 60);

  React.useEffect(() => {
    const getOrSetOfferEndTime = () => {
      const stored = localStorage.getItem('shared_offer_ends_at');
      const now = Date.now();
      
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          return { endsAt, remaining };
        }
      }
      
      const endsAt = now + 15 * 60 * 1000;
      localStorage.setItem('shared_offer_ends_at', endsAt.toString());
      return { endsAt, remaining: 15 * 60 };
    };

    const init = getOrSetOfferEndTime();
    setTimeLeft(init.remaining);

    const timer = setInterval(() => {
      const now = Date.now();
      const stored = localStorage.getItem('shared_offer_ends_at');
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          const newEndsAt = now + 15 * 60 * 1000;
          localStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
          setTimeLeft(15 * 60);
        }
      } else {
        const newEndsAt = now + 15 * 60 * 1000;
        localStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
        setTimeLeft(15 * 60);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes}min ${seconds.toString().padStart(2, '0')}sec`;

  const getDeliveryDateStr = () => {
    if (!product) return '';
    return getDynamicDeliveryDate(product.id);
  };

  
  const getDynamicHighlights = () => {
    if (!product) return [];
    
    // 1. If we have parsed specs, use them as highlights (format as "Key: Value")!
    const { specs } = parseDescription(product.description || '');
    if (specs.length > 0) {
      // Return first 5 specs to avoid cluttering highlights
      return specs.slice(0, 5).map(s => `${s.key}: ${s.value}`);
    }
    
    // 2. Category-based or product name-based default highlights
    const lowerName = (product.name || '').toLowerCase();
    const catName = (product.categoryName || '').toLowerCase();
    
    if (lowerName.includes('luggage') || lowerName.includes('bag') || catName.includes('luggage') || catName.includes('bag')) {
      return [
        "Premium Travel Gear",
        "Smooth 360° Spinner Wheels",
        "Highly Durable Shell",
        "Secure Combination Lock",
        "Spacious Compartments"
      ];
    }
    
    if (lowerName.includes('stove') || lowerName.includes('burner') || catName.includes('stove') || catName.includes('burner') || catName.includes('hob')) {
      return [
        "High Thermal Efficiency",
        "Spill-Proof Glass Top",
        "Heavy Duty Pan Support",
        "Easy to Clean Surface",
        "Sturdy Brass Burners"
      ];
    }
    
    if (lowerName.includes('mixer') || lowerName.includes('grinder') || catName.includes('mixer') || catName.includes('grinder')) {
      return [
        "Powerful High-Speed Motor",
        "Stainless Steel Heavy Jars",
        "Leak-Proof Secure Lids",
        "Ergonomic Easy-Grip Handles",
        "Vibration-Free Suction Feet"
      ];
    }
    
    if (lowerName.includes('cooker') || catName.includes('cooker')) {
      return [
        "Premium Food Grade Metal",
        "Double Safety Valve System",
        "Heavy Induction & Gas Base",
        "Comfortable Cool-Touch Grips",
        "Fast & Efficient Cooking"
      ];
    }
    
    return [
      "Premium Build Quality",
      "Ergonomic Design",
      "Easy to Clean",
      "Modern Aesthetics",
      "1 Year Warranty"
    ];
  };
  
  // Swipe Handlers (Supports both Touch swipe and Mouse drag swipe!)
  const swipeStartX = React.useRef<number | null>(null);
  const isDragging = React.useRef<boolean>(false);

  const handleSwipeStart = (clientX: number) => {
    swipeStartX.current = clientX;
    isDragging.current = true;
  };

  const handleSwipeEnd = (clientX: number) => {
    if (swipeStartX.current === null || !product || !product.images || product.images.length <= 1) return;
    const diffX = swipeStartX.current - clientX; // positive = swiped left, negative = swiped right
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left -> Next image
        setSelectedImage((prev) => (prev + 1) % product.images.length);
      } else {
        // Swipe right -> Prev image
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
      }
    }
    swipeStartX.current = null;
    isDragging.current = false;
  };

  // Auto Slider Effect
  React.useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product, selectedImage]);

  // Share Handler
  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Download Image Handler
  const handleDownloadImage = async () => {
    if (!product || !product.images || product.images.length === 0) return;
    const imageUrl = product.images[selectedImage];
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = `${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_image_${selectedImage + 1}.jpg`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open image in a new tab if fetch fails due to CORS
      window.open(imageUrl, '_blank');
    }
  };

  // Long-press (click and hold) detection state
  const longPressTimer = React.useRef<any>(null);

  const startLongPress = React.useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    longPressTimer.current = setTimeout(() => {
      handleDownloadImage();
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 600);
  }, [product, selectedImage]);

  const cancelLongPress = React.useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);


  
  // Review modals & list state
  const [showRateModal, setShowRateModal] = React.useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = React.useState(false);
  const [reviewsList, setReviewsList] = React.useState<any[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(15);
  const [reviewForm, setReviewForm] = React.useState({
    rating: 5,
    title: '',
    comment: '',
    reviewerName: '',
    location: '',
    imageUrl: '',
    uploadingImage: false
  });

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (data) {
        setReviewsList(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleLike = async (reviewId: string, isLike: boolean) => {
    try {
      // Optimistic update
      setReviewsList(prev => prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            likes: isLike ? (r.likes || 0) + 1 : r.likes,
            dislikes: !isLike ? (r.dislikes || 0) + 1 : r.dislikes
          };
        }
        return r;
      }));

      const reviewToUpdate = reviewsList.find(r => r.id === reviewId);
      if (reviewToUpdate) {
        await supabase
          .from('reviews')
          .update({
            likes: isLike ? (reviewToUpdate.likes || 0) + 1 : reviewToUpdate.likes,
            dislikes: !isLike ? (reviewToUpdate.dislikes || 0) + 1 : (reviewToUpdate.dislikes || 0)
          })
          .eq('id', reviewId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setReviewForm(prev => ({ ...prev, uploadingImage: true }));
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', fileName);
      formData.append('bucket', 'kitchenproduct');
      formData.append('folder', 'reviews');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload image');
      }

      const publicUrl = uploadData.publicUrl;

      setReviewForm(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (error: any) {
      console.error('Review image upload error:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setReviewForm(prev => ({ ...prev, uploadingImage: false }));
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.reviewerName) {
      alert('Please enter your name.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: id,
          reviewer_name: reviewForm.reviewerName,
          rating: reviewForm.rating,
          title: reviewForm.title || 'Excellent product',
          comment: reviewForm.comment,
          location: reviewForm.location ? `Certified Buyer, ${reviewForm.location}` : 'Certified Buyer',
          image_url: reviewForm.imageUrl || null,
          is_approved: true, // Auto-approve so it shows instantly
          likes: 0,
          dislikes: 0
        });

      if (error) throw error;

      alert('Thank you for rating this product!');
      setShowRateModal(false);
      
      setReviewForm({
        rating: 5,
        title: '',
        comment: '',
        reviewerName: '',
        location: '',
        imageUrl: '',
        uploadingImage: false
      });

      fetchReviews();

      const updatedTotalReviews = (product.total_reviews || 0) + 1;
      const updatedTotalRatings = (product.total_ratings || 0) + 1;
      const currentSum = (product.average_rating || 4.5) * (product.total_ratings || 1);
      const updatedAverageRating = parseFloat(((currentSum + reviewForm.rating) / updatedTotalRatings).toFixed(1));

      const distribution = { ...(product.star_distribution || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 }) };
      const ratingStr = reviewForm.rating.toString();
      distribution[ratingStr] = (parseInt(distribution[ratingStr] || '0') + 1).toString();

      setProduct((prev: any) => ({
        ...prev,
        total_reviews: updatedTotalReviews,
        total_ratings: updatedTotalRatings,
        average_rating: updatedAverageRating,
        star_distribution: distribution
      }));

      // Skip database update as aggregates columns do not exist in database schema

    } catch (err: any) {
      console.error(err);
      alert('Error submitting review: ' + err.message);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Fetch global settings
      const settingsRes = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'global_settings')
        .maybeSingle();

      const badgesConfig = settingsRes.data?.value?.badges || {
        enableDynamicBadges: true,
        trendingCount: 15,
        newArrivalCount: 5,
        bestSellerCount: 5
      };

      // Fetch all active products to determine correct dynamic badges
      const { data: allProducts, error: allErr } = await supabase
        .from('products')
        .select(`
          *,
          categories (name, slug),
          product_images (image_url, is_featured)
        `)
        .eq('is_active', true);

      if (allProducts && !allErr) {
        const processed = applyDynamicBadges(allProducts, badgesConfig);
        const currentProd = processed.find((p: any) => p.id === id);
        if (currentProd) {
          setProduct({
            ...currentProd,
            categoryName: currentProd.categories?.name || 'Kitchen',
            images: currentProd.product_images?.length > 0 
              ? currentProd.product_images.map((img: any) => img.image_url)
              : ['https://via.placeholder.com/600']
          });
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error calculating dynamic badges in fetchProduct:', err);
    }

    // Fallback: If not found, fetch single product directly
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        product_images (image_url, is_featured)
      `)
      .eq('id', id)
      .single();

    if (data) {
      setProduct({
        ...data,
        categoryName: data.categories?.name || 'Kitchen',
        images: data.product_images?.length > 0 
          ? data.product_images.map((img: any) => img.image_url)
          : ['https://via.placeholder.com/600']
      });
    }
    setLoading(false);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
    fetchReviews();

    // Check if current item is already in localStorage cart
    const cached = localStorage.getItem('cart_items');
    if (cached) {
      try {
        const cartList = JSON.parse(cached);
        setIsInCart(cartList.some((item: any) => item.id === id));
        setCartCount(cartList.length);
      } catch (e) {
        console.error(e);
      }
    }

    // Subscribe to realtime changes for this product
    const channel = supabase
      .channel('product-detail-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `id=eq.${id}` }, () => {
        fetchProduct();
      })
      .subscribe();

    const handleStorageChange = () => {
      const cachedList = localStorage.getItem('cart_items');
      if (cachedList) {
        try {
          const parsed = JSON.parse(cachedList);
          setCartCount(parsed.length);
          setIsInCart(parsed.some((item: any) => item.id === id));
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
    };
  }, [id]);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleAddToCart = () => {
    if (!isInCart) {
      const cached = localStorage.getItem('cart_items');
      let cartList: any[] = [];
      if (cached) {
        try {
          cartList = JSON.parse(cached);
        } catch (e) {
          console.error(e);
        }
      }

      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price || product.sale_price || 9999,
        salePrice: product.sale_price || 9999,
        imageUrl: product.images[0] || 'https://via.placeholder.com/200',
        quantity: 1,
        seller: 'KitchenPro Retail'
      };

      const updatedList = [...cartList.filter((item: any) => item.id !== product.id), newItem];
      localStorage.setItem('cart_items', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('cart-updated'));
      setIsInCart(true);
      setCartCount(updatedList.length);
    } else {
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f1f3f6]">
        <div className="h-10 w-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return <div className="p-10 text-center bg-[#f1f3f6] min-h-screen">Product not found</div>;

  const displayPrice = product.price || 0;
  const displaySalePrice = product.sale_price || displayPrice;
  const discount = displaySalePrice < displayPrice ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) : 0;

  return (
    <div className="flex flex-col bg-[#f1f3f6] min-h-screen pb-[72px] items-center">
      <div className="w-full max-w-[460px] bg-white min-h-screen flex flex-col shadow-md relative">
        {/* Top Header strictly matching Flipkart mobile web style (White Navbar with Black Icons) */}
        <div className={`sticky top-0 z-50 flex items-center justify-between px-3.5 py-2 bg-white shadow-sm border-b border-slate-100 select-none h-[52px] w-full transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
           <div className="flex items-center gap-3">
             <button 
                onClick={() => {
                  if (window.history.length > 1) {
                    router.back();
                  } else {
                    router.push('/');
                  }
                }}
                aria-label="Go back"
                className="flex items-center justify-center p-1 cursor-pointer active:scale-95 transition-all rounded-full hover:bg-slate-100"
              >
                <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.556 7.847H1M7.45 1L1 7.877l6.45 6.817" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
             <Link href="/" className="flex-shrink-0">
               <img 
                 src={logoSrc} 
                 alt="Flipkart Logo" 
                 className="h-[30px] w-auto object-contain cursor-pointer"
               />
             </Link>
           </div>
           
           <div className="flex items-center gap-4">
              {/* Search Icon */}
              <div className="flex items-center justify-center p-1">
                <svg height="24" viewBox="0 0 32 32" width="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.0012 21.9999C18.8671 21.9999 22.0011 18.8659 22.0011 14.9999C22.0011 11.134 18.8671 8 15.0012 8C11.1352 8 8.00122 11.134 8.00122 14.9999C8.00122 18.8659 11.1352 21.9999 15.0012 21.9999Z" stroke="#111112" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M19.9524 19.95L24.0024 24" stroke="#111112" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              
              {/* Shopping Cart Icon with Badge */}
               <Link href="/cart" className="relative flex items-center justify-center h-8 w-8 cursor-pointer">
                 <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M24 23H8.56185C8.32766 23 8.1009 22.9178 7.9211 22.7678C7.7413 22.6177 7.61987 22.4093 7.57797 22.1789L4.2402 3.82112C4.19831 3.5907 4.07688 3.3823 3.89708 3.23225C3.71728 3.08219 3.49052 3 3.25633 3H1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                   <path d="M9 28C10.3807 28 11.5 26.8807 11.5 25.5C11.5 24.1193 10.3807 23 9 23C7.61929 23 6.5 24.1193 6.5 25.5C6.5 26.8807 7.61929 28 9 28Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                   <path d="M24 28C25.3807 28 26.5 26.8807 26.5 25.5C26.5 24.1193 25.3807 23 24 23C22.6193 23 21.5 24.1193 21.5 25.5C21.5 26.8807 22.6193 28 24 28Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                   <path d="M5 8H26.8018C26.9483 8 27.0929 8.03218 27.2256 8.09425C27.3583 8.15633 27.4757 8.2468 27.5695 8.35925C27.6634 8.4717 27.7314 8.6034 27.7687 8.74504C27.8061 8.88667 27.8119 9.03478 27.7857 9.17889L26.1493 18.1789C26.1074 18.4093 25.986 18.6177 25.8062 18.7678C25.6264 18.9178 25.3996 19 25.1654 19H7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                 </svg>
                 {cartCount > 0 && (
                   <span className="header-cart bg-red-600 text-white text-[9px] font-extrabold px-1 rounded-full absolute -top-0.5 -right-1 min-w-[15px] h-[15px] flex items-center justify-center">
                     {cartCount}
                   </span>
                 )}
               </Link>
              
              {/* Profile Icon */}
              <div className="flex items-center justify-center p-1">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.70068 9.56354C9.90982 9.56354 11.7007 7.77268 11.7007 5.56354C11.7007 3.3544 9.90982 1.56354 7.70068 1.56354C5.49154 1.56354 3.70068 3.3544 3.70068 5.56354C3.70068 7.77268 5.49154 9.56354 7.70068 9.56354Z" stroke="black" strokeWidth="1.2" strokeMiterlimit="10"></path>
                  <path d="M1.63818 13.0635C2.25252 11.9993 3.1362 11.1155 4.2004 10.501C5.26461 9.88649 6.47182 9.56299 7.70068 9.56299C8.28364 9.56299 8.86172 9.63579 9.42198 9.77792C9.78986 9.87125 10.1501 9.99447 10.4989 10.1466" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M14.5877 10.5123L10.7383 14.3618L8.8136 12.437" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
           </div>
        </div>

        <div className="w-full flex flex-col">
          
           {/* Image Section */}
           <div className="relative bg-white pt-2 pb-6 flex flex-col items-center border-b border-slate-100 w-full">
            {/* Wishlist Button (Top-Right) */}
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md active:scale-90 transition-transform border border-slate-100">
              <Heart className="h-5 w-5 text-slate-400" />
            </button>

            {/* Share Button (Top-Right stacked vertically, just like the Flipkart app layout!) */}
            <button 
              onClick={handleShare}
              aria-label="Share product"
              className="absolute top-16 right-4 z-10 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md active:scale-90 transition-transform hover:bg-slate-50 border border-slate-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500 fill-current">
                <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11.1z" />
              </svg>
            </button>

            {/* Swipable Carousel container with click-and-hold (long press) auto download */}
            <div 
              onTouchStart={(e) => {
                handleSwipeStart(e.touches[0].clientX);
                startLongPress();
              }}
              onTouchMove={() => {
                cancelLongPress();
              }}
              onTouchEnd={(e) => {
                handleSwipeEnd(e.changedTouches[0].clientX);
                cancelLongPress();
              }}
              onMouseDown={(e) => {
                handleSwipeStart(e.clientX);
                startLongPress();
              }}
              onMouseMove={() => {
                cancelLongPress();
              }}
              onMouseUp={(e) => {
                handleSwipeEnd(e.clientX);
                cancelLongPress();
              }}
              onMouseLeave={(e) => {
                cancelLongPress();
                if (isDragging.current) {
                  handleSwipeEnd(e.clientX);
                }
              }}
              className="relative aspect-square w-full max-w-[400px] overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
              title="Click and hold to download image"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0.8, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0.8, x: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-4 pointer-events-none"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Pagination Dots */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4">
                 {product.images.map((_: any, i: number) => (
                   <div key={i} className={cn("rounded-full", selectedImage === i ? "w-2 h-2 bg-[#2874f0]" : "w-1.5 h-1.5 bg-slate-300")} />
                 ))}
              </div>
            )}
           </div>

            {/* Product Info Section */}
            <div className="bg-white flex flex-col">
            {/* product-data1 block */}
            <div className="product-data1 bg-white">
              {/* Dynamic ordered trend banner (Inside product-data1 to prevent overlap and make text color sharp) */}
              <div className="w-full bg-white py-2.5 flex items-center justify-center gap-2.5 select-none border-t border-slate-200 mt-1 mb-2">
                <img height="28px" src="https://flipart-offers.com/bag/public/static/sold-trend.png" alt="Trend" className="h-7 w-auto shrink-0 object-contain" />
                <span className="text-[12.5px] text-[#212121] leading-none font-bold">
                  <b className="font-extrabold text-[#212121]">{orderedCount}</b> people ordered this in the last 30 days
                </span>
              </div>

              <div className="product-title text-[#007185]">
                {product.name.length > 55 && !showFullTitle ? (
                  <>
                    {product.name.substring(0, 52)}...
                    <button 
                      onClick={() => setShowFullTitle(true)}
                      className="text-[#2874f0] font-black text-[12px] cursor-pointer ml-1 select-none hover:underline focus:outline-none"
                    >
                      More
                    </button>
                  </>
                ) : (
                  <>
                    {product.name}
                    {product.name.length > 55 && showFullTitle && (
                      <button 
                        onClick={() => setShowFullTitle(false)}
                        className="text-[#2874f0] font-black text-[12px] cursor-pointer ml-1 select-none hover:underline focus:outline-none block mt-1"
                      >
                        Less
                      </button>
                    )}
                  </>
                )}
              </div>
              
              {/* Star ratings & Assured Row */}
              <div className="flex items-center gap-1.5 mt-2 select-none flex-wrap">
                <span className="bg-green-600 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 leading-none">
                  {product.average_rating || 4.2} <Star className="h-2.5 w-2.5 fill-current" />
                </span>
                <span className="text-[12px] text-slate-500 font-bold">
                  {(product.total_ratings || 1428).toLocaleString()} Ratings & {(product.total_reviews || 234).toLocaleString()} Reviews
                </span>
                <img 
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                  alt="Assured" 
                  className="h-[14px] w-auto ml-1.5 shrink-0 select-none align-middle inline-block"
                />
              </div>

              <div className="p-pricedet">
                {discount > 0 && <span className="discount">{discount}% off</span>}
                {discount > 0 && <span className="mrp">₹{Math.round(displayPrice).toLocaleString('en-IN')}</span>}
                <span className="price">₹{Math.round(displaySalePrice).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Offers Ends In Countdown Banner */}
            <div className="w-full bg-[#fff9f5] border-y border-[#ffe3d1] py-2.5 px-4 flex items-center justify-center select-none mt-2">
              <span className="text-[13.5px] font-black text-[#ff6f2e] tracking-tight flex items-center gap-1.5">
                Offers Ends In <span className="font-black bg-[#ff6f2e] text-white px-2 py-0.5 rounded-md text-[13px] tracking-wide tabular-nums">{timeStr}</span>
              </span>
            </div>

            {/* Replaced product-data2 countdown timer block with exact copies from goats-sale.com */}
            
            {/* 1. Delivery Banner */}
            <div className="bg-white border border-slate-200 rounded-[6px] mt-2 shadow-sm select-none">
              <div className="flex p-3 gap-3.5 items-center">
                <div>
                  <img src="https://i.ibb.co/cK2M2f5z/truck.webp" alt="Truck" style={{ width: '40px' }} className="shrink-0" />
                </div>
                <div>
                  <p className="text-[14px] m-0 text-slate-800 font-medium">
                    <span className="text-[15px] text-black font-bold">Express</span> <span className="text-green-600 font-semibold">Free</span> <del className="text-slate-400">₹40</del> Delivery
                  </p>
                  <p className="text-[13px] m-0.5 text-slate-800">
                    Delivery by <span className="font-bold text-[#212121]">{getDeliveryDateStr()}</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* 2. WOW Price Strip */}
            <div className="w-full bg-white mt-2 flex items-center p-3 select-none" style={{ fontFamily: 'Arial, sans-serif' }}>
              <img src="https://i.ibb.co/4MtgWPp/Wow-Deal300ppi.png" alt="Wow" style={{ height: '35px', marginRight: '15px' }} className="shrink-0" />
              <div>
                <div style={{ color: '#000', fontWeight: 'bold', fontSize: '17px', display: 'inline' }}>Get at </div>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(0,140,0)', marginLeft: '4px' }}>
                  <span>₹{Math.round(displaySalePrice).toLocaleString('en-IN')}</span>
                </span>
                <div style={{ color: '#878787', fontSize: '11px' }}>With UPI Payment & More</div>
              </div>
            </div>

            {/* 3. Trust Badges */}
            <div className="w-full bg-white mt-2 py-4.5 px-4 select-none border-y border-slate-100">
              <div className="flex items-center justify-between gap-2">
                {/* 10-Day Return */}
                <div className="flex-1 flex flex-col items-center text-center cursor-pointer">
                  <img 
                    src="/uploads/trust_badge_return.png" 
                    alt="10-Day Return" 
                    className="w-[38px] h-[38px] object-contain mb-2" 
                  />
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                    10-Day <br/> Return <span className="text-[8px] text-slate-400 font-black ml-0.5">❯</span>
                  </span>
                </div>

                {/* No cash on delivery */}
                <div className="flex-1 flex flex-col items-center text-center cursor-pointer">
                  <img 
                    src="/uploads/trust_badge_cod.png" 
                    alt="No cash on delivery" 
                    className="w-[38px] h-[38px] object-contain mb-2" 
                  />
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                    No cash <br/> on delivery <span className="text-[8px] text-slate-400 font-black ml-0.5">❯</span>
                  </span>
                </div>

                {/* Flipkart Assured */}
                <div className="flex-1 flex flex-col items-center text-center cursor-pointer">
                  <img 
                    src="/uploads/trust_badge_assured.png" 
                    alt="Flipkart Assured" 
                    className="w-[38px] h-[38px] object-contain mb-2" 
                  />
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                    Flipkart <br/> Assured <span className="text-[8px] text-slate-400 font-black ml-0.5">❯</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Warranty, Pay Later & Warehouse Block */}
            <div className="w-full bg-white select-none border-t border-[#e0e0e0] flex flex-col mt-2">
              
              {/* Warranty Row */}
              <div className="w-full py-3.5 px-4 flex items-center justify-center gap-2.5 border-b border-[#e0e0e0]">
                <img 
                  src="https://flipart-offers.com/bag/public/storage/uploads/JupXjzRqRcLo8ptSqkTFq2QrZaXIxWQma4U8VmXy.webp" 
                  alt="Warranty" 
                  className="h-7 w-auto shrink-0 object-contain" 
                />
                <span className="text-[13.5px] font-black text-slate-800 tracking-tight">1 Year Manufacturer Warranty</span>
              </div>

              {/* Flipkart Pay Later Row */}
              <div className="relative w-full p-4 pr-5 flex items-center justify-between border-b border-[#e0e0e0]">
                {/* Left Section: Logo & Icon */}
                <div className="flex items-center gap-2">
                  <svg className="w-11 h-9 shrink-0" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Motion lines */}
                    <line x1="4" y1="18" x2="10" y2="18" stroke="#1c54d4" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="2" y1="24" x2="8" y2="24" stroke="#ffc200" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="5" y1="30" x2="11" y2="30" stroke="#1c54d4" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Cart body */}
                    <path d="M12 12H16L20 34H46L50 18H21" stroke="#1c54d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Yellow basket fill */}
                    <rect x="21" y="18" width="24" height="11" rx="1" fill="#ffc200" stroke="#1c54d4" strokeWidth="2" strokeLinejoin="round" />
                    {/* Wheels */}
                    <circle cx="24" cy="40" r="3.5" fill="#1c54d4" />
                    <circle cx="42" cy="40" r="3.5" fill="#1c54d4" />
                  </svg>
                  
                  <div className="flex flex-col justify-center leading-none">
                    <span className="text-[12px] font-black text-slate-900 tracking-tight">Flipkart</span>
                    <span className="text-[12px] font-black text-[#1c54d4] tracking-tight mt-0.5">Pay Later</span>
                  </div>
                </div>

                {/* Right Section: Details & Action */}
                <div className="text-right flex flex-col items-end leading-tight pr-1">
                  <span className="text-[11px] font-black text-slate-800">Credit Up to ₹1 Lakh*</span>
                  <span className="text-[8.5px] font-extrabold text-slate-500 mt-0.5">Shop Now & Pay Next Month or in EMIs</span>
                  <div className="flex items-center gap-0.5 mt-1 cursor-pointer text-[#1c54d4] hover:underline">
                    <span className="text-[9.5px] font-black">Activate Now</span>
                    <span className="text-[7.5px] font-black">❯</span>
                  </div>
                </div>

                {/* T&C Apply */}
                <span className="absolute bottom-1 right-2 text-[5.5px] text-slate-400 font-extrabold tracking-tighter uppercase select-none">*T&C APPLY</span>
              </div>

              {/* Flipkart Warehouse Row */}
              <div className="w-full p-4 flex flex-col gap-3 border-b border-[#e0e0e0]">
                {/* Header Row */}
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
                      <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 20a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1" />
                        <path d="M2 3h20" />
                        <path d="M6 20V12h12v8" />
                        <path d="M10 12h4" />
                      </svg>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-black text-slate-800 leading-tight">Flipkart Warehouse</span>
                      <div className="flex items-center gap-1.5 mt-0.5 leading-none">
                        <div className="flex items-center gap-0.5 text-[#2874f0] text-[9.5px]">
                          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                        <span className="text-[10px] font-black text-[#2874f0] mt-0.5">4.9</span>
                        <span className="text-[10px] text-slate-350">•</span>
                        <span className="text-[10px] font-bold text-slate-500 mt-0.5">15 Years in Flipkart</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-slate-400 text-[11px] font-black">❯</span>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-100" />

                {/* Metrics Row */}
                <div className="flex items-center justify-between text-center">
                  <div className="flex-1 flex flex-col items-center border-r border-slate-100 last:border-0">
                    <span className="text-[13px] font-black text-slate-800">19cr+</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">Product Sold</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center border-r border-slate-100 last:border-0">
                    <span className="text-[13px] font-black text-slate-800">99%</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">Quality Score</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-[13px] font-black text-slate-800">98%</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">Speed Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Products (Moved above Product details) */}
            <SimilarProducts 
              currentProductId={product.id} 
              categoryId={product.category_id} 
              categoryName={product.categoryName} 
              currentProductName={product.name}
            />

            {/* Gray divider section block (gap) */}
            <div className="w-full h-2 bg-[#f1f3f6] mt-2" />

            {/* Highlights Section */}
            {product.highlights && product.highlights.trim() && (
              <>
                <div className="w-full bg-white px-4 pt-4 pb-3 select-none">
                  <h3 className="text-[15px] font-extrabold text-slate-900 mb-2">Highlights</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-slate-700">
                    {product.highlights.split('\n').map((line: string) => line.trim()).filter(Boolean).map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full h-2 bg-[#f1f3f6]" />
              </>
            )}

            <div className="w-full bg-white px-4 pt-4 select-none">
              <h3 className="text-[17px] font-black text-slate-900">Product details</h3>
            </div>

            {/* Vertically stacked product images (Matches reference site exactly) */}
            <div className="flex flex-col gap-2.5 mt-0 mb-2.5 w-full bg-white select-none">
              {product.images && product.images.map((imgUrl: string, idx: number) => (
                <img 
                  key={idx} 
                  src={imgUrl} 
                  alt={`Product image stack ${idx + 1}`} 
                  className="w-full object-contain" 
                  loading="lazy"
                />
              ))}
            </div>


            {/* Ratings & Reviews Section */}
            <div className="p-4 bg-white">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[16px] font-semibold text-slate-900">Ratings & Reviews</h3>
                 <button 
                   onClick={() => setShowRateModal(true)}
                   className="bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 text-slate-700 px-4 py-2 rounded font-medium text-[13px] transition-all"
                 >
                   Rate Product
                 </button>
               </div>
               
               <div className="flex items-center gap-6 mb-6">
                 <div className="flex flex-col items-center justify-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 shrink-0">
                   <div className="text-[32px] font-bold text-slate-900 flex items-center gap-1">
                     {product.average_rating || 4.5}
                     <Star className="h-6 w-6 fill-current text-yellow-500" />
                   </div>
                   <div className="text-[11px] text-slate-500 text-center leading-tight mt-1">
                     {(product.total_ratings || 1428).toLocaleString()} Ratings &<br/>{(product.total_reviews || 234).toLocaleString()} Reviews
                   </div>
                 </div>
                 <div className="flex-1 space-y-1">
                   {[5,4,3,2,1].map((star) => {
                     const distribution = product.star_distribution || { "5": 980, "4": 320, "3": 98, "2": 20, "1": 10 };
                     const count = parseInt(distribution[star.toString()] || '0');
                     const total = Object.values(distribution).reduce((a: any, b: any) => parseInt(a || 0) + parseInt(b || 0), 0) as number;
                     const percentage = total > 0 ? (count / total) * 100 : 0;
                     return (
                       <div key={star} className="flex items-center gap-2">
                         <span className="text-[11px] font-bold text-slate-700 w-2">{star}</span>
                         <Star className="h-2.5 w-2.5 fill-current text-slate-400" />
                         <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                             className={cn(
                               "h-full rounded-full transition-all duration-500", 
                               star >= 4 ? "bg-green-600" : star === 3 ? "bg-green-500" : star === 2 ? "bg-yellow-500" : "bg-red-500"
                             )} 
                             style={{ width: `${percentage}%` }} 
                           />
                         </div>
                         <span className="text-[10px] text-slate-400 font-bold w-10 text-right">{count.toLocaleString()}</span>
                       </div>
                     );
                   })}
                  </div>
                </div>
               {/* Sample/Dynamic Reviews List (Short version for details page) */}
               <div className="space-y-4">
                 {(() => {
                   const combined = [...reviewsList, ...getMockReviews(product.name, product.total_reviews, product.images[0])];
                   return combined.slice(0, 3).map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="rating">
                          <div className="star-box">
                            {review.rating} <span className="star">★</span>
                          </div>
                          <span style={{ fontWeight: '700', fontSize: '14px', color: '#333' }}>{review.title}</span>
                        </div>
                        
                        <p className="review-text">{review.comment}</p>
                        
                        {review.image_url && (
                          <div className="image-row">
                            <img src={review.image_url} alt="Review attachment" />
                          </div>
                        )}

                        <div className="buyer-info mt-2">
                          <div className="flex flex-col text-left">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="buyer-name">{review.reviewer_name}</span>
                              <span className="verified">
                                <span className="text-[#388e3c] font-black">✓</span> Certified Buyer
                              </span>

                              <span className="text-[10px] text-slate-400 mt-0.5">
                                {formatReviewDate(review.created_at)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Helpful Likes/Dislikes Votes */}
                          <div className="flex items-center gap-3 shrink-0">
                            <button 
                              onClick={() => handleLike(review.id, true)}
                              className="flex items-center gap-1 text-slate-400 hover:text-slate-700 active:scale-90 transition-all font-bold"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" /> 
                              <span className="text-[11px]">{review.likes || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleLike(review.id, false)}
                              className="flex items-center gap-1 text-slate-400 hover:text-slate-700 active:scale-90 transition-all font-bold"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" /> 
                              <span className="text-[11px]">{review.dislikes || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ));
                 })()}
               </div>
               
                            <button 
                    onClick={() => {
                      setVisibleCount(15);
                      setShowAllReviewsModal(true);
                    }}
                    className="w-full text-left py-3 border-t border-slate-100 text-[#2874f0] font-bold text-[14px] flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors mt-2"
                  >
                    All reviews
                    <ChevronRight className="h-4 w-4" />
                 </button>
            </div>


          </div>
        </div>
      </div>

      {/* More products for you - below All Reviews */}
      <MoreProductsForYou currentProductId={id} />

      {/* Sticky Bottom Bar (Flipkart style matching user screenshots) */}
      <div className="footer-btn z-[100]">
         <button 
           onClick={handleAddToCart}
           className="b-btn bg-white font-bold flex items-center justify-center gap-2"
           style={{ color: '#2874f0', borderColor: '#2874f0', borderWidth: '1.2px' }}
         >
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 23H8.56185C8.32766 23 8.1009 22.9178 7.9211 22.7678C7.7413 22.6177 7.61987 22.4093 7.57797 22.1789L4.2402 3.82112C4.19831 3.5907 4.07688 3.3823 3.89708 3.23225C3.71728 3.08219 3.49052 3 3.25633 3H1" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M9 28C10.3807 28 11.5 26.8807 11.5 25.5C11.5 24.1193 10.3807 23 9 23C7.61929 23 6.5 24.1193 6.5 25.5C6.5 26.8807 7.61929 28 9 28Z" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M24 28C25.3807 28 26.5 26.8807 26.5 25.5C26.5 24.1193 25.3807 23 24 23C22.6193 23 21.5 24.1193 21.5 25.5C21.5 26.8807 22.6193 28 24 28Z" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M5 8H26.8018C26.9483 8 27.0929 8.03218 27.2256 8.09425C27.3583 8.15633 27.4757 8.2468 27.5695 8.35925C27.6634 8.4717 27.7314 8.6034 27.7687 8.74504C27.8061 8.88667 27.8119 9.03478 27.7857 9.17889L26.1493 18.1789C26.1074 18.4093 25.986 18.6177 25.8062 18.7678C25.6264 18.9178 25.3996 19 25.1654 19H7" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            {isInCart ? 'Go to Cart' : 'Add to Cart'}
         </button>
         <Link 
           href={`/checkout?productId=${product.id}`} 
           className="b-btn text-black font-bold"
           style={{ backgroundColor: '#ffc200', border: 'none' }}
         >
            Buy Now
         </Link>
      </div>

      {/* Rate Product Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowRateModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Feedback Form</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rate this Product</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Share your experience to help other buyers</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-5">
              {/* Star Rating Select */}
              <div className="flex flex-col items-center justify-center space-y-2 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Star Rating</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star 
                        className={cn(
                          "h-8 w-8 transition-colors", 
                          reviewForm.rating >= star 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-slate-300 hover:text-yellow-300"
                        )} 
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {reviewForm.rating === 5 ? 'Simply awesome ★★★★★' :
                   reviewForm.rating === 4 ? 'Very Good ★★★★☆' :
                   reviewForm.rating === 3 ? 'Good ★★★☆☆' :
                   reviewForm.rating === 2 ? 'Fair ★★☆☆☆' : 'Poor ★☆☆☆☆'}
                </span>
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text"
                    required
                    value={reviewForm.reviewerName}
                    onChange={e => setReviewForm(prev => ({ ...prev, reviewerName: e.target.value }))}
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Your Location (City)</label>
                  <input 
                    type="text"
                    value={reviewForm.location}
                    onChange={e => setReviewForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Review Title</label>
                <input 
                  type="text"
                  value={reviewForm.title}
                  onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Detailed Comment</label>
                <textarea 
                  rows={3}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:border-orange-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Review Image Upload */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Add Photo (Optional)</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600 transition-colors">
                    <Upload className="h-4 w-4 text-slate-400" />
                    <span>{reviewForm.uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleReviewImageUpload}
                      disabled={reviewForm.uploadingImage}
                      className="hidden" 
                    />
                  </label>
                  {reviewForm.imageUrl && (
                    <div className="h-10 w-10 relative rounded-lg border border-slate-200 overflow-hidden shrink-0">
                      <img src={reviewForm.imageUrl} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={reviewForm.uploadingImage}
                className="w-full h-11 rounded-full font-black text-white bg-slate-900 hover:bg-slate-800 tracking-tight uppercase shadow-lg shadow-slate-200 mt-2 transition-all active:scale-[0.99]"
              >
                Submit Review
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Flipkart-style Footer */}
      <div className="w-full bg-white border-t border-slate-100 mt-1">
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-0 border-b border-slate-100">
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 border-r border-b border-slate-100 active:bg-slate-50">
            <span className="w-9 h-9 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="2" fill="#f4a43a"/>
                <path d="M8 7V5a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="7" y="11" width="4" height="3" rx="0.5" fill="#fff" opacity="0.8"/>
              </svg>
            </span>
            <span className="text-[13px] font-bold text-[#212121]">Become a Seller</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 active:bg-slate-50">
            <span className="w-9 h-9 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#f4a43a" stroke="#e07b00" strokeWidth="1"/>
              </svg>
            </span>
            <span className="text-[13px] font-bold text-[#212121]">Advertise</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 border-r border-slate-100 active:bg-slate-50">
            <span className="w-9 h-9 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="10" width="20" height="11" rx="2" fill="#f4a43a"/>
                <path d="M8 10V8a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 2v6" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="2" fill="#fff" opacity="0.85"/>
              </svg>
            </span>
            <span className="text-[13px] font-bold text-[#212121]">Gift Cards</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 active:bg-slate-50">
            <span className="w-9 h-9 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#f4a43a"/>
                <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2.5-2.5 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="0.8" fill="#fff"/>
              </svg>
            </span>
            <span className="text-[13px] font-bold text-[#212121]">Help Center</span>
          </a>
        </div>

        {/* Copyright Bar */}
        <div className="bg-[#2874f0] py-3 text-center">
          <span className="text-white font-bold text-[13px]">© 2007-2025</span>
        </div>

        {/* Payment Icons */}
        <div className="bg-white px-3 py-3 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-2 py-1 bg-white" style={{minWidth:'36px',height:'22px'}}>
            <svg viewBox="0 0 50 16" height="10" width="32"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1a1f71">VISA</text></svg>
          </span>
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-1 bg-white" style={{minWidth:'36px',height:'22px'}}>
            <svg viewBox="0 0 38 24" height="14" width="22">
              <circle cx="13" cy="12" r="9" fill="#eb001b"/>
              <circle cx="25" cy="12" r="9" fill="#f79e1b"/>
              <path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#ff5f00"/>
            </svg>
          </span>
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-1 bg-white" style={{minWidth:'36px',height:'22px'}}>
            <svg viewBox="0 0 38 24" height="14" width="22">
              <circle cx="13" cy="12" r="9" fill="#0099df"/>
              <circle cx="25" cy="12" r="9" fill="#e31837"/>
              <path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#6c2c91"/>
            </svg>
          </span>
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-1 bg-[#016fd0]" style={{minWidth:'36px',height:'22px'}}>
            <svg viewBox="0 0 44 14" height="9" width="28"><text x="0" y="11" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">AMEX</text></svg>
          </span>
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-1 bg-white" style={{minWidth:'36px',height:'22px'}}>
            <svg viewBox="0 0 32 22" height="14" width="22">
              <circle cx="16" cy="11" r="9" fill="none" stroke="#1a1f71" strokeWidth="1.5"/>
              <circle cx="11" cy="11" r="6" fill="#1a1f71" opacity="0.5"/>
              <circle cx="21" cy="11" r="6" fill="#1a1f71" opacity="0.5"/>
            </svg>
          </span>
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-1 bg-white" style={{minWidth:'40px',height:'22px'}}>
            <svg viewBox="0 0 54 16" height="10" width="34">
              <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#1a6b3c">Ru</text>
              <text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#f47920">Pay</text>
            </svg>
          </span>
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-1 bg-white" style={{height:'22px'}}>
            <svg viewBox="0 0 20 14" height="12" width="16">
              <rect x="1" y="3" width="18" height="10" rx="1.5" fill="none" stroke="#555" strokeWidth="1.2"/>
              <line x1="1" y1="6" x2="19" y2="6" stroke="#555" strokeWidth="1.2"/>
              <rect x="3" y="8" width="5" height="2" rx="0.5" fill="#555"/>
            </svg>
            <span className="text-[8px] font-bold text-slate-500 ml-0.5">NET</span>
          </span>
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-1 bg-white gap-0.5" style={{height:'22px'}}>
            <svg viewBox="0 0 16 16" height="12" width="12">
              <circle cx="8" cy="8" r="7" fill="#4caf50" opacity="0.15"/>
              <text x="4" y="12" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#388e3c">₹</text>
            </svg>
            <span className="text-[8px] font-bold text-slate-500">COD</span>
          </span>
          <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1.5 py-1 bg-white" style={{height:'22px'}}>
            <span className="text-[9px] font-black text-slate-500">EMI</span>
          </span>
        </div>
      </div>


      {/* All Reviews Modal */}
      {showAllReviewsModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Verified Customer Reviews</h3>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Showing all approved user feedback ({(product.total_reviews || 2).toLocaleString()})</p>
              </div>
              <button 
                onClick={() => setShowAllReviewsModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(() => {
                const combined = [...reviewsList, ...getMockReviews(product.name, product.total_reviews, product.images[0])];
                return combined.slice(0, visibleCount).map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-6 last:border-none last:pb-0 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex items-center gap-0.5 text-white px-1.5 py-0.5 rounded text-[10px] font-bold",
                        review.rating >= 4 ? "bg-green-600" : review.rating === 3 ? "bg-green-500" : review.rating === 2 ? "bg-yellow-500" : "bg-red-500"
                      )}>
                        {review.rating} <Star className="h-2 w-2 fill-current" />
                      </div>
                      <span className="text-sm font-black text-slate-800">{review.title}</span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{review.comment}</p>

                    {review.image_url && (
                      <div className="flex items-center gap-2">
                        <a href={review.image_url} target="_blank" rel="noreferrer" className="h-24 w-24 relative rounded-xl border border-slate-200 overflow-hidden shrink-0 block hover:opacity-90 transition-opacity">
                          <img src={review.image_url} alt="Review Image" className="w-full h-full object-cover" />
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2 text-slate-400 font-semibold">
                        <span className="font-black text-slate-700">{review.reviewer_name}</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <ShieldCheck className="h-3.5 w-3.5 text-green-600 fill-green-50" /> Certified Buyer
                        </span>
                        <span>•</span>
                        <span>{formatReviewDate(review.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleLike(review.id, true)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors font-bold"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" /> {review.likes || 0}
                        </button>
                        <button 
                          onClick={() => handleLike(review.id, false)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors font-bold"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" /> {review.dislikes || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                ));
              })()}

              {(() => {
                const combined = [...reviewsList, ...getMockReviews(product.name, product.total_reviews, product.images[0])];
                if (visibleCount < combined.length) {
                  return (
                    <div className="flex justify-center pt-2 pb-6">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 15)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 font-black text-xs text-[#2874f0] uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                      >
                        Load More Reviews
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flipkart Verified Feedback System</span>
              <Button 
                onClick={() => {
                  setShowAllReviewsModal(false);
                  setShowRateModal(true);
                }}
                className="h-9 px-5 rounded-full font-bold bg-[#2874f0] text-white hover:bg-blue-600 text-xs shadow-md shadow-blue-100"
              >
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
