'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, ArrowLeft, Star, ChevronRight, MapPin, Tag, ShieldCheck, ThumbsUp, ThumbsDown, X, Upload, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { cn } from "../../../lib/utils";
import { supabase } from '../../../lib/supabase';


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
}

const SimilarProducts = ({ currentProductId, categoryId, categoryName }: SimilarProductsProps) => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!categoryId) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (name, slug),
            product_images (image_url, is_featured)
          `)
          .eq('category_id', categoryId)
          .neq('id', currentProductId)
          .eq('is_active', true)
          .limit(8);

        if (error) throw error;

        if (data) {
          const formatted = data.map((item: any) => ({
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
  }, [categoryId, currentProductId, categoryName]);

  if (loading) {
    return (
      <div className="w-full bg-[#f1f3f6] py-4 px-2">
        <h3 className="text-[15px] font-extrabold text-slate-900 mb-3 px-2 select-none">Similar Products</h3>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-slate-100 rounded-xl p-2.5 bg-white shadow-sm flex flex-col animate-pulse">
              <div className="w-full aspect-square bg-slate-100 rounded-lg mb-2" />
              <div className="h-3.5 bg-slate-100 rounded w-5/6 mb-1" />
              <div className="h-3.5 bg-slate-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/3 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="w-full bg-[#f1f3f6] py-4">
      <h3 className="text-[16px] font-extrabold text-slate-900 mb-3 px-4 select-none">Similar Products</h3>
      <div className="grid grid-cols-2 gap-2 px-2">
        {products.map((item) => {
          const displayPrice = parseFloat(item.price) || 0;
          const displaySalePrice = parseFloat(item.sale_price) || displayPrice;
          const discount = displaySalePrice < displayPrice ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) : 0;
          const rating = parseFloat(item.average_rating) || 4.2;

          return (
            <button
              key={item.id}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                router.push(`/product/${item.id}`);
              }}
              className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col text-left active:scale-[0.98] transition-transform duration-100 border border-slate-100"
            >
              {/* Product Image */}
              <div className="w-full aspect-square relative rounded-lg overflow-hidden mb-2 bg-white flex items-center justify-center">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="object-contain w-full h-full p-1"
                  loading="lazy"
                />
              </div>

              {/* Product Title */}
              <span className="text-[12px] font-bold text-slate-800 line-clamp-2 h-[34px] leading-tight mb-1 select-none overflow-hidden">
                {item.name}
              </span>

              {/* Ratings and Reviews */}
              <div className="flex items-center gap-1 mb-1 select-none">
                <span className="bg-green-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 leading-none">
                  {rating} <Star className="h-2 w-2 fill-current" />
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  ({(item.total_ratings || Math.floor(rating * 10 + 50)).toLocaleString()})
                </span>
              </div>

              {/* Price section */}
              <div className="mt-auto pt-1 select-none">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-[14px] font-black text-slate-900">
                    ₹{parseInt(displaySalePrice.toString()).toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <span className="text-[10px] text-slate-400 line-through font-medium">
                      ₹{parseInt(displayPrice.toString()).toLocaleString()}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <span className="text-[11px] text-green-600 font-extrabold block mt-0.5 leading-none">
                    {discount}% off
                  </span>
                )}
              </div>

              {/* Assured Badge */}
              <div className="mt-1.5 flex items-center h-[14px] select-none justify-between w-full">
                <img 
                  src="/salec.png" 
                  alt="Assured" 
                  className="h-[14px] w-auto shrink-0 select-none object-contain"
                  style={{ width: "60px" }}
                />
                <span className="text-[10px] text-slate-400 font-medium">Free delivery</span>
              </div>
            </button>
          );
        })}
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

const getMockReviews = (productName: string, totalReviews: number): MockReview[] => {
  const lower = (productName || '').toLowerCase();
  
  let type: 'luggage' | 'stove' | 'mixer' | 'cooker' | 'general' = 'general';
  let defaultImageUrl = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300';
  
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
  const reviewsCount = Math.max(totalReviews || 12, 12);
  const list: MockReview[] = [];

  for (let i = 0; i < reviewsCount; i++) {
    const seedStr = `${productName}-${i}`;
    const rng = createRandom(seedStr);
    
    const nameIdx = Math.floor(rng() * INDIAN_NAMES.length);
    const reviewerName = INDIAN_NAMES[nameIdx];
    
    const cityIdx = Math.floor(rng() * CITIES.length);
    const location = `Certified Buyer, ${CITIES[cityIdx]}`;
    
    const rating = rng() > 0.3 ? 5 : 4;
    const titleList = rating === 5 ? TITLES_5 : TITLES_4;
    const titleIdx = Math.floor(rng() * titleList.length);
    const title = titleList[titleIdx];
    
    const commentIdx = Math.floor(rng() * comments.length);
    const comment = comments[commentIdx];
    
    const likes = Math.round(rng() * 40 + 2);
    const dislikes = Math.round(rng() * 4);
    
    const daysAgo = Math.floor(rng() * 60 + 1);
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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isInCart, setIsInCart] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [showFullTitle, setShowFullTitle] = React.useState(false);
  
  // Custom Timer for product-data2 countdown timer
  const [timeLeft, setTimeLeft] = React.useState(15 * 60);

  React.useEffect(() => {
    const getOrSetOfferEndTime = () => {
      const stored = sessionStorage.getItem('shared_offer_ends_at');
      const now = Date.now();
      
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          return { endsAt, remaining };
        }
      }
      
      const endsAt = now + 15 * 60 * 1000;
      sessionStorage.setItem('shared_offer_ends_at', endsAt.toString());
      return { endsAt, remaining: 15 * 60 };
    };

    const init = getOrSetOfferEndTime();
    setTimeLeft(init.remaining);

    const timer = setInterval(() => {
      const now = Date.now();
      const stored = sessionStorage.getItem('shared_offer_ends_at');
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          const newEndsAt = now + 15 * 60 * 1000;
          sessionStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
          setTimeLeft(15 * 60);
        }
      } else {
        const newEndsAt = now + 15 * 60 * 1000;
        sessionStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
        setTimeLeft(15 * 60);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes}min ${seconds.toString().padStart(2, '0')}sec`;

  
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
      const filePath = `reviews/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kitchenproduct')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kitchenproduct')
        .getPublicUrl(filePath);

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

      setProduct(prev => ({
        ...prev,
        total_reviews: updatedTotalReviews,
        total_ratings: updatedTotalRatings,
        average_rating: updatedAverageRating,
        star_distribution: distribution
      }));

      await supabase
        .from('products')
        .update({
          total_reviews: updatedTotalReviews,
          total_ratings: updatedTotalRatings,
          average_rating: updatedAverageRating,
          star_distribution: distribution
        })
        .eq('id', id);

    } catch (err: any) {
      console.error(err);
      alert('Error submitting review: ' + err.message);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
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

  const handleAddToCart = () => {
    if (isInCart) {
      router.push('/cart');
      return;
    }

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
    setIsInCart(true);
    router.push('/cart');
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
    <div className="flex flex-col bg-[#f1f3f6] min-h-screen pb-[60px] items-center">
      <div className="w-full max-w-[460px] bg-white min-h-screen flex flex-col shadow-md relative">
        {/* Top Header strictly matching Flipkart mobile web style */}
        <div className="flex items-center justify-between px-3 py-2.5 sticky top-0 bg-[#2874f0] z-50 shadow-sm text-white select-none">
           <div className="flex items-center gap-3">
             <Link href="/">
               <ArrowLeft className="h-6 w-6 text-white stroke-[2.5px]" />
             </Link>
             <span className="text-[17px] font-bold text-white tracking-wide">Flipkart</span>
           </div>
           <div className="flex items-center gap-4">
              <Search className="h-5 w-5 text-white" />
              <button 
                onClick={handleShare}
                aria-label="Share product"
                className="active:scale-90 transition-transform h-8 w-8 flex items-center justify-center rounded-full text-white hover:bg-blue-600/40"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11.1z" />
                </svg>
              </button>
              <Link href="/cart" className="relative flex items-center justify-center h-8 w-8">
                <ShoppingCart className="h-5 w-5 text-white" />
                {cartCount > 0 && (
                  <span className="header-cart bg-red-600 text-white text-[9px] font-extrabold px-1 rounded-full absolute -top-0.5 -right-1 min-w-[15px] h-[15px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
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
              <div className="product-title">{product.name}</div>
              
              {/* Star ratings & Assured Row */}
              <div className="flex items-center gap-1.5 mt-2 select-none flex-wrap">
                <span className="bg-green-600 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 leading-none">
                  {product.average_rating || 4.2} <Star className="h-2.5 w-2.5 fill-current" />
                </span>
                <span className="text-[12px] text-slate-500 font-bold">
                  {(product.total_ratings || 1428).toLocaleString()} Ratings & {(product.total_reviews || 234).toLocaleString()} Reviews
                </span>
                <img 
                  src="https://akkskitchensalee.vercel.app/img/pry-3.png" 
                  alt="Assured" 
                  className="h-[14px] w-auto ml-1.5 shrink-0"
                />
              </div>

              <div className="p-pricedet">
                {discount > 0 && <span className="discount">{discount}% off</span>}
                {discount > 0 && <span className="mrp">₹{Math.round(displayPrice).toLocaleString('en-IN')}</span>}
                <span className="price">₹{Math.round(displaySalePrice).toLocaleString('en-IN')}</span>
              </div>
              
              {/* Express Delivery Truck & Tag Line */}
              <div className="flex items-center gap-1 pt-2.5 pb-0.5 leading-none select-none text-left border-t border-slate-100/60 mt-2">
                <DeliveryTruckIcon />
                <span className="text-[10px] font-black italic text-slate-800 tracking-tight">EXPRESS</span>
                <span className="text-[10px] font-medium text-slate-500 ml-0.5">2 day delivery</span>
              </div>
            </div>

            {/* product-data2 block */}
            <div className="product-data2">
              <h4 className="offer-time">
                Offer ends in <span>{timeStr}</span>
              </h4>
            </div>

            {/* product-data3 block: Spacer / guarantee image (Matches reference site exactly) */}
            <div className="product-data3 border-b border-slate-100">
              <img 
                src="https://akkskitchensalee.vercel.app/img/pro.png" 
                alt="Feature guarantee" 
                className="w-full object-contain"
              />
            </div>

            {/* product-data4 block: Trust Badges flat row (Matches reference site exactly) */}
            <div className="product-data4 flex justify-between w-full select-none bg-white py-[15px] px-0 border-b-8 border-[#f1f3f6]">
              <div className="pry-1 flex-1">
                <img src="https://akkskitchensalee.vercel.app/img/pry-1.png" alt="7 days replacement" />
                <h5>7 days Replacement</h5>
              </div>
              <div className="pry-1 flex-1">
                <img src="https://akkskitchensalee.vercel.app/img/pry-2.png" alt="No cash on delivery" />
                <h5>No Cash On Delivery</h5>
              </div>
              <div className="pry-3 flex-1">
                <img src="https://akkskitchensalee.vercel.app/img/pry-3.png" alt="Plus F-Assured" />
                <h5 style={{ paddingTop: "10px" }}>Plus(F-Assured)</h5>
              </div>
            </div>

            {/* Vertically stacked product images (Matches reference site exactly) */}
            <div className="flex flex-col gap-2.5 my-2.5 w-full bg-white select-none">
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
                   const combined = [...reviewsList, ...getMockReviews(product.name, product.total_reviews)];
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
                              <span className="location">, {review.location ? review.location.replace('Certified Buyer, ', '') : 'Kolkata'}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              {review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '2 days ago'}
                            </span>
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
                    All {(product.total_reviews || 2).toLocaleString()} reviews
                    <ChevronRight className="h-4 w-4" />
                 </button>
            </div>

            {/* Similar Products */}
            <SimilarProducts 
              currentProductId={product.id} 
              categoryId={product.category_id} 
              categoryName={product.categoryName} 
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (akkskitchensalee.vercel.app style) */}
      <div className="footer-btn z-[100]">
         <button 
           onClick={handleAddToCart}
           className="b-btn text-[#333] bg-white"
         >
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
                const combined = [...reviewsList, ...getMockReviews(product.name, product.total_reviews)];
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
                          <ShieldCheck className="h-3.5 w-3.5 text-green-600 fill-green-50" /> {review.location || 'Certified Buyer'}
                        </span>
                        <span>•</span>
                        <span>{review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '2 days ago'}</span>
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
                const combined = [...reviewsList, ...getMockReviews(product.name, product.total_reviews)];
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
