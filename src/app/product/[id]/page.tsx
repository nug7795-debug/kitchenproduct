'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, ArrowLeft, Star, ChevronRight, ChevronDown, ChevronUp, MapPin, Tag, ShieldCheck, ThumbsUp, ThumbsDown, X, Upload, Share2, Wrench, CircleSlash, Truck } from 'lucide-react';
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
    src="/fa_user_badge.png" 
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

// Delivery truck icon SVG matching Flpkart
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
          const sameCategory = formatted.filter((p: any) => categoryId && p.category_id === categoryId);
          const otherCategory = formatted.filter((p: any) => !categoryId || p.category_id !== categoryId);
          setProducts([...sameCategory, ...otherCategory]);
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
      <div className="w-full bg-white pb-3 pt-1">
        <div className="bg-white w-full py-2.5 px-3.5 select-none border-b border-[#f1f3f6]">
          <h3 className="text-[16px] font-extrabold text-[#111111] tracking-tight">Similar Products</h3>
        </div>
        <div className="flex flex-row overflow-x-auto gap-2.5 px-3.5 pt-2.5 pb-2 no-scrollbar">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[160px] min-w-[160px] h-[280px] bg-slate-100 animate-pulse rounded-lg shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="w-full bg-white pb-2 pt-1 select-none">
      <div className="bg-white w-full py-2.5 px-3.5 select-none flex items-center justify-between border-b border-[#f1f3f6]">
        <h3 className="text-[16px] font-extrabold text-[#111111] tracking-tight">Similar Products</h3>
      </div>
      <div 
        className="flex flex-row overflow-x-auto gap-2.5 px-3.5 pt-2.5 pb-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((item) => (
          <div key={item.id} className="w-[160px] min-w-[160px] max-w-[160px] shrink-0 snap-start flex flex-col">
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
    <div className="w-full bg-[#f1f3f6] pb-2">
      <div className="bg-white w-full py-3.5 px-4 select-none">
        <h2 className="text-[16px] font-extrabold text-[#111111] tracking-tight">More products for you</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2 bg-[#f1f3f6]">
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
  
  let type: 'mobile' | 'electronics' | 'beauty' | 'luggage' | 'stove' | 'mixer' | 'cooker' | 'general' = 'general';
  let defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300';
  
  if (
    lower.includes('phone') || 
    lower.includes('mobile') || 
    lower.includes('5g') || 
    lower.includes('realme') || 
    lower.includes('poco') || 
    lower.includes('iqoo') || 
    lower.includes('samsung') || 
    lower.includes('iphone') || 
    lower.includes('apple') || 
    lower.includes('vivo') || 
    lower.includes('oppo') || 
    lower.includes('oneplus') || 
    lower.includes('redmi') || 
    lower.includes('xiaomi') || 
    lower.includes('android') || 
    lower.includes('smartphone')
  ) {
    type = 'mobile';
    defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300';
  } else if (
    lower.includes('lakme') || 
    lower.includes('cream') || 
    lower.includes('lotion') || 
    lower.includes('serum') || 
    lower.includes('face') || 
    lower.includes('skin') || 
    lower.includes('beauty') || 
    lower.includes('oil') || 
    lower.includes('shampoo') || 
    lower.includes('gel') || 
    lower.includes('glow') || 
    lower.includes('whitening') || 
    lower.includes('makeup') ||
    lower.includes('lipstick') ||
    lower.includes('kajal') ||
    lower.includes('eyeliner') ||
    lower.includes('mascara') ||
    lower.includes('foundation') ||
    lower.includes('luminance')
  ) {
    type = 'beauty';
    defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300';
  } else if (
    lower.includes('watch') || 
    lower.includes('headphone') || 
    lower.includes('earbud') || 
    lower.includes('speaker') || 
    lower.includes('tv') || 
    lower.includes('laptop') || 
    lower.includes('tablet') || 
    lower.includes('pad') || 
    lower.includes('charger')
  ) {
    type = 'electronics';
    defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300';
  } else if (lower.includes('luggage') || lower.includes('trolley') || lower.includes('bag')) {
    type = 'luggage';
    defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1565026057447-bc90a3dca487?auto=format&fit=crop&q=80&w=300';
  } else if (lower.includes('stove') || lower.includes('burner') || lower.includes('hob')) {
    type = 'stove';
    defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=300';
  } else if (lower.includes('mixer') || lower.includes('grinder') || lower.includes('blade')) {
    type = 'mixer';
    defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=300';
  } else if (lower.includes('cooker') || lower.includes('aluminium')) {
    type = 'cooker';
    defaultImageUrl = productImageUrl || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=300';
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

  const shortName = (productName || 'Product').split(' ').slice(0, 4).join(' ').trim();

  const REVIEWERS = {
    en: [
      { name: 'Vikram Singh', city: 'Mumbai' },
      { name: 'Priya Sharma', city: 'New Delhi' },
      { name: 'Sneha Reddy', city: 'Hyderabad' },
      { name: 'Amit Verma', city: 'Bangalore' },
      { name: 'Kunal Kapoor', city: 'Pune' },
      { name: 'Aditi Goel', city: 'Chandigarh' },
      { name: 'Meera Nair', city: 'Kochi' },
      { name: 'Sanjay Dutt', city: 'Jaipur' },
      { name: 'Pooja Hegde', city: 'Indore' }
    ],
    hi: [
      { name: 'राजेश कुमार', city: 'लखनऊ' },
      { name: 'अमित सिंह', city: 'वाराणसी' },
      { name: 'मनोज यादव', city: 'पटना' },
      { name: 'विकास शर्मा', city: 'कानपुर' },
      { name: 'दीपक वर्मा', city: 'भोपाल' },
      { name: 'पूजा गुप्ता', city: 'आगरा' },
      { name: 'रोहित मिश्रा', city: 'प्रयागराज' },
      { name: 'सुरेश रैना', city: 'मेरठ' },
      { name: 'सुनीता राव', city: 'नागपुर' }
    ],
    bn: [
      { name: 'দেবাশীষ মুখার্জী', city: 'কলকাতা' },
      { name: 'তন্ময় ঘোষ', city: 'হাওড়া' },
      { name: 'শুভশ্রী দাস', city: 'শিলিগুড়ি' },
      { name: 'অনন্যা সেন', city: 'দুর্গাপুর' },
      { name: 'বরুণ চক্রবর্তী', city: 'আসানসোল' },
      { name: 'সৌরভ গাঙ্গুলী', city: 'কলকাতা' },
      { name: 'অর্পিতা রায়', city: 'বর্ধমান' },
      { name: 'স্বপন বণিক', city: 'মালদা' },
      { name: 'প্রিয়াঙ্কা দত্ত', city: 'কলকাতা' }
    ],
    as: [
      { name: 'ঋতুৰাজ বৰঠাকুৰ', city: 'গুৱাহাটী' },
      { name: 'মানস প্ৰতিম', city: 'ডিব্ৰুগড়' },
      { name: 'দীপঙ্কৰ শইকীয়া', city: 'যোৰহাট' },
      { name: 'বৰুণ কলিতা', city: 'শিলচৰ' },
      { name: 'নবনীতা বৰুৱা', city: 'তেজপুৰ' },
      { name: 'হিমন্ত শৰ্মা', city: 'গুৱাহাটী' },
      { name: 'ভৱেন দাস', city: 'নগাঁও' },
      { name: 'জোনালী গগৈ', city: 'তিনিচুকীয়া' },
      { name: 'জ্যোতি প্ৰসাদ', city: 'বঙাইগাঁও' }
    ]
  };

  const TITLES = {
    en: {
      5: ['Simply awesome', 'Mind-blowing purchase', 'Terrific purchase', 'Highly recommended', 'Delightful', 'Just wow', 'Fabulous!', 'Must buy!'],
      4: ['Very Good', 'Good choice', 'Value-for-money', 'Perfect purchase!', 'Nice product', 'Decent purchase', 'Satisfied customer']
    },
    hi: {
      5: ['बहुत बढ़िया', 'शानदार प्रोडक्ट', 'पैसा वसूल', 'लाजवाब खरीदारी', 'एकदम मस्त', 'बहुत पसंद आया'],
      4: ['अच्छा प्रोडक्ट है', 'बढ़िया खरीदारी', 'सही दाम में सही चीज', 'काफी अच्छा है']
    },
    bn: {
      5: ['দারুণ প্রোডাক্ট', 'অসাধারণ জিনিস', 'খুব ভালো লেগেছে', 'পয়সা উশুল', 'একদম সেরা'],
      4: ['ভালো প্রোডাক্ট', 'মোটামুটি ভালো', 'পছন্দ হয়েছে', 'ভালো জিনিস']
    },
    as: {
      5: ['বহুত ভাল লাগিল', 'ধুনীয়া প্ৰডাক্ট', 'সঁচাকৈয়ে ভাল বস্তু', 'অসম্ভৱ ভাল', 'পইচা উচুল'],
      4: ['ভাল প্ৰডাক্ট', 'ভাল লাগিল', 'সঠিক বস্তু', 'সন্তোষজনক']
    }
  };

  const CATEGORY_COMMENTS: Record<string, Record<'en' | 'hi' | 'bn' | 'as', string[]>> = {
    mobile: {
      en: [
        `Mindblowing smartphone! The camera quality on ${shortName} and its 120Hz display are unbelievable. Flpkart delivered in 1 day!`,
        `Best phone in this price segment! Battery of ${shortName} easily lasts 1.5+ days with heavy 5G usage. 100% genuine product.`,
        `Camera quality on ${shortName} is next level, portrait mode photos look professional. Very sleek flagship feel in hand.`,
        `Got my ${shortName} delivered in less than 24 hours by Flpkart! Brand new sealed box pack. Absolutely loving it!`
      ],
      hi: [
        `बहुत ही शानदार फोन है! ${shortName} का कैमरा और बैटरी बैकअप बहुत ही जबरदस्त है। 1 दिन में डिलीवरी मिल गई।`,
        `इस बजट में सबसे बेस्ट स्मार्टफोन है। ${shortName} की डिस्प्ले और स्पीड बहुत स्मूथ है, बिल्कुल हैंग नहीं होता।`,
        `पैसा वसूल प्रोडक्ट! ${shortName} का लुक एकदम प्रीमियम है और चार्जिंग भी बहुत फास्ट होती है।`,
        `फ्लিপकार्ट की सर्विस बहुत अच्छी रही। फोन एकदम ओरिजिनल और सील पैक मिला। बहुत खुश हूँ!`
      ],
      bn: [
        `অসাধারণ ফোন! ${shortName}-এর ক্যামেরা কোয়ালিটি এবং ডিসপ্লে দারুণ। ব্যাটারি ব্যাকআপও খুব ভালো।`,
        `এই বাজেটে এর চেয়ে ভালো ফোন আর হয় না। ${shortName} খুব ফাস্ট কাজ করে, কোনো ল্যাগ নেই।`,
        `একদম আসল প্রোডাক্ট পেয়েছি। ফ্লিপকার্টের ডেলিভারি খুব দ্রুত ছিল। সবাইকে নেওয়ার পরামর্শ দেব।`,
        `দারুণ পারফরম্যান্স! ${shortName}-এর লুক একদম প্রিমিয়াম এবং চার্জিংও খুব দ্রুত হয়।`
      ],
      as: [
        `বহুত ভাল ফোন! ${shortName}-ৰ কেমেৰা আৰু বেটাৰী বেকআপ বহুত ধুনীয়া। সময়মতে ডেলিভাৰী পালোঁ।`,
        `এই দামত বহুত উৎকৃষ্ট স্মাৰ্টফোন। ${shortName} চলাবলৈ বহুত সহজ আৰু কোনো সমস্যা নাই।`,
        `সঁচাকৈয়ে পইচা উচুল বস্তু! ${shortName}-ৰ ডিচপ্লে আৰু স্পীড বহুত ফাষ্ট। মই বহুত সন্তুষ্ট।`,
        `ফ্লিপকাৰ্টৰ পৰা একদম অৰিজিনেল ছীল পেক পালোঁ। অসমলৈ বহুত সোনকালে আহি পালে।`
      ]
    },
    beauty: {
      en: [
        `Excellent product! The texture of ${shortName} is very light and absorbs quickly into the skin. Gives an instant natural glow!`,
        `100% original product from Flpkart! ${shortName} makes skin feel so soft and hydrated without being greasy. Highly recommend!`,
        `Using ${shortName} for the last two weeks, visible improvement in skin tone and radiance. Truly worth every rupee.`,
        `Super fast delivery! Original sealed pack received. ${shortName} smells wonderful and suits sensitive skin perfectly.`
      ],
      hi: [
        `बहुत ही असरदार प्रोडक्ट है! ${shortName} लगाने के बाद स्किन में बहुत अच्छा निखार और ग्लो आता है। बिल्कुल चिपचिपा नहीं है।`,
        `मेरी स्किन काफी ड्राई थी, लेकिन ${shortName} के इस्तेमाल से चेहरा बहुत सॉफ्ट और चमकदार हो गया। पैसा वसूल!`,
        `100% ओरिजिनल प्रोडक्ट मिला। खुशबू बहुत अच्छी है और पैकेजिंग भी बहुत सुरक्षित थी। जरूर खरीदें!`,
        `फ्लিপकार्ट से बहुत जल्दी डिलीवरी हुई। ${shortName} मेरी डेली स्किनकेयर के लिए सबसे बेस्ट साबित हुआ।`
      ],
      bn: [
        `দারুণ স্কিনকেয়ার প্রোডাক্ট! ${shortName} ব্যবহার করার পর ত্বক খুব নরম ও উজ্জ্বল লাগে। একদম তেলতেলে নয়।`,
        `অরিজিনাল প্রোডাক্ট পেয়েছি। ${shortName}-এর সুবাস খুব সুন্দর এবং নিয়মিত ব্যবহারে দারুণ ফল পাওয়া যায়।`,
        `খুবই ভালো ক্রিম। ত্বকে খুব দ্রুত মিশে যায় এবং সারাদিন মুখ ফ্রেশ রাখে। খুবই পছন্দ হয়েছে!`,
        `ফ্লিপকার্ট থেকে মাত্র ২ দিনে ডেলিভারি পেলাম। প্যাকেজিং খুব সুরক্ষিত ছিল। ধন্যবাদ!`
      ],
      as: [
        `বহুত ভাল প্ৰডাক্ট! ${shortName} ব্যৱহাৰ কৰি ছালখন বহুত নিমজ আৰু উজ্জ্বল হৈ পৰিছে। কোনো তেলতেলীয়া ভাব নাই।`,
        `১০০% অৰিজিনেল বস্তু পালোঁ। ${shortName}-ৰ সুবাস বহুত ভাল আৰু ছালৰ বাবে বহুত উপকাৰী।`,
        `মোৰ ছালখন বহুত শুকান আছিল, কিন্তু ${shortName} লগোৱাৰ পিছত বহুত ভাল অনুভৱ হৈছে। পইচা উচুল!`,
        `ফ্লিপকাৰ্টৰ ডেলিভাৰী বহুত ফাষ্ট আছিল। একদম ভাল পেকিংত পালোঁ। সকলোৱে লব পাৰে!`
      ]
    },
    electronics: {
      en: [
        `Crystal clear audio performance and superb bass response on ${shortName}. Battery backup easily lasts 30+ hours.`,
        `Build quality of ${shortName} is solid and premium. Connects instantly via Bluetooth with zero latency.`,
        `Flpkart delivery of ${shortName} was super fast. Brand new sealed pack delivered safely.`,
        `Very comfortable ergonomics on ${shortName}. Noise cancellation feature works like magic!`
      ],
      hi: [
        `बहुत ही बढ़िया साउंड क्वालिटी और जबरदस्त बेस है। ${shortName} की बैटरी लाइफ भी काफी लंबी चलती है।`,
        `बिल्ड क्वालिटी बहुत मजबूत है। ${shortName} तुरंत कनेक्ट हो जाता है और दिखने में बहुत प्रीमियम है।`,
        `पैसा वसूल गैजेट! इस कीमत में ${shortName} से बेहतर कोई दूसरा विकल्प नहीं है।`,
        `फ्लিপकार्ट की डिलीवरी बहुत तेज थी। सील पैक और ओरिजिनल प्रोडक्ट मिला।`
      ],
      bn: [
        `অসাধারণ সাউন্ড কোয়ালিটি এবং ব্যাটারি ব্যাকআপ! ${shortName} ব্যবহার করে দারুণ অভিজ্ঞতা হলো।`,
        `বিল্ড কোয়ালিটি খুবই মজবুত এবং প্রিমিয়াম। ${shortName}-এর ব্লুটুথ কানেক্টিভিটি খুব ফাস্ট।`,
        `কম দামে দারুণ জিনিস। একদম অরিজিনাল প্রোডাক্ট পেয়েছি, খুব ভালো লেগেছে।`,
        `ফ্লিপকার্ট ডেলিভারি খুব দ্রুত ছিল। নিখুঁত প্যাকেজিং ছিল।`
      ],
      as: [
        `বহুত ধুনীয়া চাউণ্ড আৰু বেটাৰী বেকআপ! ${shortName} ব্যৱহাৰ কৰি বহুত ভাল লাগিল।`,
        `বিল্ড কোৱালিটি বহুত মজবুত। ${shortName} লগে লগে সংযোগ হয় আৰু দেখাত বহুত সুন্দৰ।`,
        `এই দামত সঁচাকৈয়ে বহুত ভাল বস্তু। মই সকলোকে এইটো লবলৈ ক'ম।`,
        `সময়মতে সঠিক বস্তু পালোঁ। ফ্লিপকাৰ্টৰ সেৱা বহুত ভাল।`
      ]
    },
    stove: {
      en: [
        `Excellent gas stove ${shortName}. The brass burners are of high quality and flame is very even.`,
        `The body of ${shortName} is premium toughened glass finish. Very easy to clean and sturdy knobs.`,
        `Excellent value for money. Auto ignition on ${shortName} works flawlessly. Flame intensity is excellent.`
      ],
      hi: [
        `बहुत ही बढ़िया गैस चूल्हा है! ${shortName} का ग्लास बहुत मजबूत है और बर्नर से आंच बिल्कुल बराबर आती है।`,
        `सफाई करना बहुत आसान है और दिखने में किचन बहुत मॉडर्न लगता है। पैसा वसूल चूल्हा है।`,
        `बिल्कुल सुरक्षित और मजबूत। ${shortName} के नॉब्स बहुत स्मूथ हैं। बहुत खुश हूँ इस खरीदारी से।`
      ],
      bn: [
        `দারুণ গ্যাস স্টোভ! ${shortName}-এর গ্লাস খুব মজবুত এবং আগুন খুব সুন্দরভাবে জ্বলে।`,
        `পরিষ্কার করা খুব সহজ এবং রান্নাঘরে দেখতে খুব সুন্দর লাগে। দারুণ প্রোডাক্ট!`,
        `ফ্লিপকার্টের তরফ থেকে খুব দ্রুত ডেলিভারি পেয়েছি। একদম অক্ষত অবস্থায় পৌঁছেছে।`
      ],
      as: [
        `বহুত ভাল গেছ ষ্টোভ! ${shortName}-ৰ ব্ৰাছ বাৰ্নাৰবোৰ বহুত ভাল আৰু জুই খুব ধুনীয়াকৈ ওলায়।`,
        `চাফা কৰিবলৈ বহুত সহজ আৰু পাকঘৰত দেখাত বহুত ধুনীয়া লাগে। বহুত সন্তুষ্ট।`,
        `অসমত খুব সোনকালে ডেলিভাৰী পালোঁ। পেকিং বহুত সুৰক্ষিত আছিল।`
      ]
    },
    mixer: {
      en: [
        `Excellent mixer ${shortName}. The motor is very powerful and grinds dry spices in seconds.`,
        `Sturdy stainless steel jars on ${shortName} and very low noise operation. High speed grinding.`,
        `Amazing performance. Jars of ${shortName} are completely leak-proof and have secure locks.`
      ],
      hi: [
        `बहुत ही ताकतवर मोटर है! ${shortName} मसाले बहुत बारीक पीसता है और जार बिल्कुल लीक नहीं करते।`,
        `कम आवाज में बहुत तेज काम करता है। ${shortName} की क्वालिटी बहुत टिकाऊ और मजबूत है।`,
        `किचन के लिए बहुत जरूरी और उपयोगी प्रोडक्ट। पैसा वसूल मिक्सी है!`
      ],
      bn: [
        `খুব শক্তিশালী মোটর! ${shortName} খুব কম সময়ে মশলা মিহি করে পিষে দেয়।`,
        `জারগুলো খুব মজবুত স্টিলের এবং কোনো লিক নেই। ব্যবহারে দারুণ আরাম।`,
        `এই দামে সেরা মিক্সার গ্রাইন্ডার। ফ্লিপকার্টের সার্ভিস খুব ভালো ছিল।`
      ],
      as: [
        `বহুত শক্তিশালী মটৰ! ${shortName}-এ অতি কম সময়তে মচলা মিহিকৈ গুড়ি কৰে।`,
        `জাৰবোৰ বহুত মজবুত আৰু শব্দ বহুত কম কৰে। পাকঘৰৰ বাবে অতি প্ৰয়োজনীয়।`,
        `সঁচাকৈয়ে বহুত ভাল প্ৰডাক্ট। সময়মতে পালোঁ, ধন্যবাদ ফ্লিপকাৰ্ট!`
      ]
    },
    cooker: {
      en: [
        `Excellent cooker ${shortName}. The metal is thick and safety valve is high quality.`,
        `Great addition to my kitchen. Very durable and efficient pressure cooker ${shortName}.`,
        `Superb quality pressure cooker ${shortName}. Cooks rice and dal in minutes.`
      ],
      hi: [
        `बहुत ही मजबूत कुकर है! ${shortName} की सीटी बहुत सही काम करती है और खाना बहुत जल्दी पकता है।`,
        `मेटल काफी मोटा और टिकाऊ है। गैस और इंडक्शन दोनों पर आराम से चलता है।`,
        `रसोई के लिए बहुत बढ़िया चीज है। पूरी तरह से सेफ और पैसा वसूल!`
      ],
      bn: [
        `দারুণ প্রেসার কুকার! ${shortName}-এ রান্না খুব দ্রুত হয় এবং গ্যাস সাশ্রয় হয়।`,
        `খুবই শক্তপোক্ত মেটাল এবং সেফটি ভালভ খুব ভালো মানের। দারুণ লাগলো।`,
        `ফ্লিপকার্ট থেকে সঠিক সময়ে একদম অক্ষত অবস্থায় ডেলিভারি পেয়েছি।`
      ],
      as: [
        `বহুত ভাল কুকাৰ! ${shortName}-ত ৰন্ধা-বঢ়া বহুত সোনকালে হয় আৰু তেল-গেছ ৰাহি হয়।`,
        `মেটেলটো বহুত ডাঠ আৰু মজবুত। ৰন্ধাৰ বাবে অতি উপযোগী।`,
        `সময়মতে পাই বহুত ভাল লাগিল। কোৱালিটি এশ শতাংশ ভাল।`
      ]
    },
    luggage: {
      en: [
        `Excellent ${shortName}. The build quality is very good and the wheels are very smooth.`,
        `Great ${shortName}. Very lightweight but extremely strong. Used it for travel and it was very durable.`,
        `Loved the color and the dual spinner wheels of ${shortName} are silent and smooth.`
      ],
      hi: [
        `बहुत ही हल्का और मजबूत ट्रॉली बैग है! ${shortName} के पहिये बहुत स्मूथ हैं और लुक काफी स्टाइलिश है।`,
        `सफर के लिए एकदम परफेक्ट बैग है। लॉक सिस्टम बहुत अच्छे से काम करता है। पैसा वसूल!`,
        `काफी सारा सामान आराम से आ जाता है। Flpkart की डिलीवरी बहुत तेज थी।`
      ],
      bn: [
        `খুবই হালকা কিন্তু প্রচণ্ড মজবুত! ${shortName}-এর চাকাগুলো একদম স্মুথ ঘোরে।`,
        `ভ্রমণের জন্য দারুণ ব্যাগ। দেখতেও খুব ক্লাসি এবং প্রিমিয়াম লাগে।`,
        `প্যাকেজিং এবং ডেলিভারি দুটোই খুব চমৎকার ছিল। খুব খুশি হয়েছি।`
      ],
      as: [
        `বহুত মজবুত আৰু পাতল বেগ! ${shortName}-ৰ চকাকেইটা বহুত স্মুথলি ঘূৰে।`,
        `ভ্ৰমণৰ বাবে অতি উত্তম ট্ৰলী। লক চিষ্টেমটোও বহুত ভাল।`,
        `অসমলৈ খুব সোনকালে আহি পালে। কোৱালিটিত কোনো খুঁত নাই।`
      ]
    },
    general: {
      en: [
        `Excellent product! The build quality of ${shortName} is very good and the delivery was fast.`,
        `Great quality product ${shortName}. Very durable and highly efficient performance.`,
        `Loved the color and finishing quality of ${shortName}. Worth every rupee spent.`,
        `Flpkart assured delivery of ${shortName} was quick. Packaging was neat and safe.`
      ],
      hi: [
        `बहुत ही बढ़िया प्रोडक्ट है! ${shortName} की क्वालिटी A1 है और डिलीवरी भी समय पर हो गई।`,
        `पैसा वसूल चीज है! जैसा फोटो में दिखाया था, बिल्कुल वैसा ही मिला। बहुत खुश हूँ।`,
        `काफी मजबूत और टिकाऊ है। रोजमर्रा के इस्तेमाल के लिए सबसे बेस्ट ${shortName}!`,
        `फ्लিপकार्ट की पैकिंग बहुत अच्छी थी। प्रोडक्ट एकदम नया और ओरिजिनल है।`
      ],
      bn: [
        `দারুণ প্রোডাক্ট! ${shortName}-এর গুণমান খুবই ভালো আর প্যাকেজিংও দারুণ ছিল।`,
        `অসাধারণ জিনিস, এই দামে সেরা প্রোডাক্ট! ছবিতে যেমন দেখেছিলাম হুবহু সেরকম পেয়েছি।`,
        `খুবই কাজের জিনিস এবং খুব মজবুত। আমি সবাইকে কেনার পরামর্শ দেব।`,
        `ফ্লিপকার্ট খুব তাড়াতাড়ি ডেলিভারি করেছে। আমি খুবই সন্তুষ্ট!`
      ],
      as: [
        `বহুত ভাল প্ৰডাক্ট! ${shortName}-ৰ কোৱালিটি বহুত ধুনীয়া আৰু একদম সময়মতে পালোঁ।`,
        `সঁচাকৈয়ে পইচা উচুল বস্তু! ছবিত যেনেকুৱা দেখিছিলোঁ, একেবাৰে তেনেকুৱাই পালোঁ।`,
        `দৈনন্দিন ব্যৱহাৰৰ বাবে বহুত উপযোগী আৰু মজবুত বস্তু। বহুত সন্তুষ্ট হ'লোঁ।`,
        `অসমলৈ অতি সোনকালে ডেলিভাৰী দিয়া বাবে ফ্লিপকাৰ্টক বহুত ধন্যবাদ!`
      ]
    }
  };

  const commentsObj = CATEGORY_COMMENTS[type] || CATEGORY_COMMENTS.general;
  const reviewsCount = 32;
  const list: MockReview[] = [];
  const langs: Array<'en' | 'hi' | 'bn' | 'as'> = ['en', 'hi', 'bn', 'as'];

  for (let i = 0; i < reviewsCount; i++) {
    const lang = langs[i % 4];
    const seedStr = `${productName}-${i}`;
    const rng = createRandom(seedStr);
    
    const reviewersPool = REVIEWERS[lang];
    const reviewerObj = reviewersPool[i % reviewersPool.length];
    const reviewerName = reviewerObj.name;
    const location = lang === 'hi' 
      ? `सत्यापित खरीदार, ${reviewerObj.city}`
      : lang === 'bn'
      ? `যাচাইকৃত ক্রেতা, ${reviewerObj.city}`
      : lang === 'as'
      ? `প্ৰমাণিত ক্ৰেতা, ${reviewerObj.city}`
      : `Certified Buyer, ${reviewerObj.city}`;
    
    const rating = rng() > 0.35 ? 5 : 4;
    const titlePool = TITLES[lang][rating as 4 | 5];
    const title = titlePool[i % titlePool.length];
    
    const commentsPool = commentsObj[lang];
    const comment = commentsPool[i % commentsPool.length];
    
    const likes = Math.round(rng() * 40 + 2);
    const dislikes = Math.round(rng() * 4);
    
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


const isApparelProduct = (prod: any): boolean => {
  if (!prod) return false;
  const name = (prod.name || '').toLowerCase();
  const desc = (prod.description || '').toLowerCase();
  const cat = (prod.categoryName || prod.categories?.name || '').toLowerCase();

  // Exclude non-apparel items
  if (
    name.includes('bottle jacket') || 
    name.includes('thermosteel') || 
    name.includes('cooker') || 
    name.includes('cooktop') ||
    name.includes('stove') || 
    name.includes('mixer') || 
    name.includes('speaker') || 
    name.includes('fan') || 
    name.includes('kettle') ||
    name.includes('swing') ||
    name.includes('watch') ||
    name.includes('power bank') ||
    name.includes('cream') ||
    name.includes('luggage') ||
    name.includes('trolley') ||
    name.includes('chopper') ||
    name.includes('dinner set') ||
    name.includes('casserole') ||
    name.includes('earbuds') ||
    name.includes('trimmer') ||
    name.includes('projector') ||
    name.includes('headphone')
  ) {
    return false;
  }

  const apparelKeywords = [
    'jacket', 'dress', 'shirt', 'tshirt', 't-shirt', 'kurti', 'kurtis',
    'hoodie', 'sweater', 'coat', 'blazer', 'gown', 'jeans',
    'cloth', 'apparel', 'clothing', 'fashion', 'wear', 'saree', 'suit',
    'lehenga', 'pant', 'trouser', 'sherwani', 'dhoti', 'tracksuit'
  ];

  return apparelKeywords.some(k => name.includes(k) || cat.includes(k) || desc.includes(k)) ||
    /\btop\b/i.test(name) || /\btops\b/i.test(name);
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
  const [selectedSize, setSelectedSize] = React.useState<string>('M');
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(null);
  const [variants, setVariants] = React.useState<any[]>([]);
  const [showSizeChart, setShowSizeChart] = React.useState<boolean>(false);

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
  const timeStr = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

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
  const [visibleReviewsCount, setVisibleReviewsCount] = React.useState(4);
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

      
    // Fetch product variants for clothing sizes
    try {
      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id);
      if (variantsData && variantsData.length > 0) {
        setVariants(variantsData);
        const defaultVar = variantsData.find((v: any) => v.value === 'M') || variantsData[0];
        if (defaultVar) {
          setSelectedSize(defaultVar.value);
          setSelectedVariantId(defaultVar.id);
        }
      }
    } catch (e) {
      console.error('Error fetching variants:', e);
    }

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
            image: currentProd.image || currentProd.product_images?.[0]?.image_url || '',
            images: currentProd.product_images?.length > 0 
              ? currentProd.product_images.map((img: any) => img.image_url)
              : (currentProd.image ? [currentProd.image] : ['https://via.placeholder.com/600'])
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
        image: data.image || data.product_images?.[0]?.image_url || '',
        images: data.product_images?.length > 0 
          ? data.product_images.map((img: any) => img.image_url)
          : (data.image ? [data.image] : ['https://via.placeholder.com/600'])
      });
    }

    // Always fetch product variants for sizes
    try {
      const { data: vData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id);
      if (vData && vData.length > 0) {
        setVariants(vData);
        const defaultVar = vData.find((v: any) => v.value === 'M') || vData[0];
        if (defaultVar) {
          setSelectedSize(defaultVar.value);
          setSelectedVariantId(defaultVar.id);
        }
      }
    } catch (ve) {
      console.error('Error fetching variants in fetchProduct:', ve);
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

  const isApparel = isApparelProduct(product) || (variants && variants.length > 0 && variants.some((v: any) => v.name?.toLowerCase() === 'size'));

  const handleBuyNow = () => {
    try {
      const img = (Array.isArray(product?.images) && (product.images[selectedImage] || product.images[0])) || product?.image || product?.image_url || product?.imageUrl || product?.product_images?.[0]?.image_url || '';
      const chosenSize = isApparel ? (selectedSize || 'M') : undefined;
      const chosenVariantId = isApparel ? (selectedVariantId || variants.find((v: any) => v.value === chosenSize)?.id) : undefined;

      localStorage.setItem('data', JSON.stringify({
        name: product?.name,
        image: img,
        imageUrl: img,
        size: chosenSize
      }));
      if (chosenSize) {
        localStorage.setItem('selected_size', chosenSize);
      }
      if (chosenVariantId) {
        localStorage.setItem('selected_variant_id', chosenVariantId);
      }

      const sizeParam = chosenSize ? `&size=${encodeURIComponent(chosenSize)}` : '';
      const variantParam = chosenVariantId ? `&variantId=${encodeURIComponent(chosenVariantId)}` : '';
      router.push(`/checkout?productId=${product.id}${sizeParam}${variantParam}`);
    } catch (e) {
      router.push(`/checkout?productId=${product?.id}`);
    }
  };

  const handleAddToCart = () => {
    try {
      const img = (Array.isArray(product?.images) && (product.images[selectedImage] || product.images[0])) || product?.image || product?.image_url || product?.imageUrl || product?.product_images?.[0]?.image_url || '';
      const chosenSize = isApparel ? (selectedSize || 'M') : undefined;
      const chosenVariantId = isApparel ? (selectedVariantId || variants.find((v: any) => v.value === chosenSize)?.id) : undefined;

      localStorage.setItem('data', JSON.stringify({
        name: product?.name,
        image: img,
        imageUrl: img,
        size: chosenSize
      }));
      if (chosenSize) {
        localStorage.setItem('selected_size', chosenSize);
      }
      if (chosenVariantId) {
        localStorage.setItem('selected_variant_id', chosenVariantId);
      }

      // Add to cart_items in localStorage
      const existingCart = localStorage.getItem('cart_items');
      let cart = existingCart ? JSON.parse(existingCart) : [];
      if (!Array.isArray(cart)) cart = [];

      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.sale_price || product.price,
        imageUrl: img,
        image: img,
        quantity: 1,
        size: chosenSize,
        variantId: chosenVariantId
      };

      const existingIndex = cart.findIndex((it: any) => it.id === product.id && it.size === chosenSize);
      if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem('cart_items', JSON.stringify(cart));
      setIsInCart(true);
      setCartCount(cart.length);

      const sizeParam = chosenSize ? `&size=${encodeURIComponent(chosenSize)}` : '';
      const variantParam = chosenVariantId ? `&variantId=${encodeURIComponent(chosenVariantId)}` : '';
      router.push(`/checkout?productId=${product.id}${sizeParam}${variantParam}`);
    } catch (e) {
      router.push(`/checkout?productId=${product?.id}`);
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
    <div className={`flex flex-col bg-[#f1f3f6] min-h-screen ${isApparel ? 'pb-[115px]' : 'pb-[72px]'} items-center`}>
      <div className="w-full max-w-[460px] bg-white min-h-screen flex flex-col shadow-md relative">
        {/* Top Header strictly matching Flpkart mobile web style (White Navbar with Black Icons) */}
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
                 alt="Flpkart Logo" 
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
              
               {/* Shopping Cart Icon (Static / non-clickable) */}
               <div 
                 className="relative flex items-center justify-center h-8 w-8 select-none pointer-events-none cursor-default"
                 aria-label="Cart"
               >
                 <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M24 23H8.56185C8.32766 23 8.1009 22.9178 7.9211 22.7678C7.7413 22.6177 7.61987 22.4093 7.57797 22.1789L4.2402 3.82112C4.19831 3.5907 4.07688 3.3823 3.89708 3.23225C3.71728 3.08219 3.49052 3 3.25633 3H1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                   <path d="M9 28C10.3807 28 11.5 26.8807 11.5 25.5C11.5 24.1193 10.3807 23 9 23C7.61929 23 6.5 24.1193 6.5 25.5C6.5 26.8807 7.61929 28 9 28Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                   <path d="M24 28C25.3807 28 26.5 26.8807 26.5 25.5C26.5 24.1193 25.3807 23 24 23C22.6193 23 21.5 24.1193 21.5 25.5C21.5 26.8807 22.6193 28 24 28Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                   <path d="M5 8H26.8018C26.9483 8 27.0929 8.03218 27.2256 8.09425C27.3583 8.15633 27.4757 8.2468 27.5695 8.35925C27.6634 8.4717 27.7314 8.6034 27.7687 8.74504C27.8061 8.88667 27.8119 9.03478 27.7857 9.17889L26.1493 18.1789C26.1074 18.4093 25.986 18.6177 25.8062 18.7678C25.6264 18.9178 25.3996 19 25.1654 19H7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                 </svg>
               </div>
              
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

            {/* Share Button (Top-Right stacked vertically, just like the Flpkart app layout!) */}
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
            <div className="product-data1 bg-white pt-2">

              <div className="product-title text-[#212121]">
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
              
              {/* Assured Row */}
              <div className="flex items-center gap-1.5 mt-2 select-none flex-wrap">
                <img 
                  src="/fa_user_badge.png" 
                  alt="Assured" 
                  className="h-[18px] w-auto select-none align-middle inline-block" 
                />
              </div>

              <div className="p-pricedet">
                {discount > 0 && <span className="discount">{discount}% off</span>}
                {discount > 0 && <span className="mrp">₹{Math.round(displayPrice).toLocaleString('en-IN')}</span>}
                <span className="price">₹{Math.round(displaySalePrice).toLocaleString('en-IN')}</span>
              </div>

              {/* Packaging subtext */}
              <div className="mt-2 text-[13.5px] text-slate-800 leading-normal font-medium select-none">
                <div>+ <del className="text-slate-400">₹99</del> Secured Packaging Free</div>
              </div>
            </div>

            {/* Size Selector for Clothing / Dress / Jackets */}
            {isApparel && (
              <div id="size-selector-section" className="w-full bg-white mt-2 p-3.5 border border-slate-200 rounded-[6px] shadow-xs select-none">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#212121]">Select Size</span>
                    {selectedSize && (
                      <span className="text-[11.5px] font-black text-[#2874f0] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                        Size: {selectedSize}
                      </span>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowSizeChart(true)}
                    className="text-[12px] font-bold text-[#2874f0] flex items-center gap-1 cursor-pointer hover:underline bg-transparent border-none p-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M7 12v-3M12 12v-5M17 12v-3M2 7h20v10H2z"/></svg>
                    Size Chart
                  </button>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setSelectedSize(sz);
                          const variant = variants.find(v => v.value === sz);
                          if (variant) {
                            setSelectedVariantId(variant.id);
                          }
                        }}
                        className={cn(
                          "min-w-[48px] h-11 px-3.5 rounded-[4px] font-extrabold text-[13px] flex items-center justify-center transition-all cursor-pointer active:scale-95",
                          isSelected
                            ? "bg-[#2874f0] text-white border-2 border-[#2874f0] shadow-sm ring-2 ring-blue-200"
                            : "bg-white text-slate-800 border border-slate-300 hover:border-slate-500 hover:bg-slate-50"
                        )}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1. Delivery & Offer Countdown Box (Exact copy from goats-sale.com) */}
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
                  <p className="text-[13px] m-0 text-slate-600 font-medium">
                    Offer ends in <span className="font-bold text-[#c2185b] tabular-nums">{timeStr}</span>
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
            


            {/* 3. Instant EMI for you ! Card */}
            <div className="w-full bg-white select-none py-3 px-3.5 border-t border-b border-slate-200 mt-2">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex items-start gap-3.5 shadow-2xs">
                {/* Flpkart EMI HD Logo */}
                <img 
                  src="/uploads/flipkart_emi_logo_hd.png" 
                  alt="Flpkart EMI" 
                  className="w-9 h-9 object-contain rounded-md shrink-0 mt-0.5" 
                />
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-[14px] font-bold text-[#212121] leading-snug">
                    Instant EMI for you !
                  </h4>
                  <p className="text-[11.5px] font-medium text-[#878787] flex items-center gap-1.5 flex-wrap">
                    <span>No Cost EMI*</span>
                    <span className="text-slate-300">|</span>
                    <span>Unlock ₹1 lakh</span>
                  </p>
                  <span 
                    className="text-[12.5px] font-bold text-[#2874f0] inline-block pt-0.5 pointer-events-none cursor-default select-none"
                  >
                    Click here for Flpkart EMI
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Trust Badges */}
            <div className="w-full bg-white py-4.5 px-4 select-none border-b border-slate-100">
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

                {/* Flpkart Assured */}
                <div className="flex-1 flex flex-col items-center text-center cursor-pointer">
                  <img 
                    src="/uploads/trust_badge_assured.png" 
                    alt="Flpkart Assured" 
                    className="w-[38px] h-[38px] object-contain mb-2" 
                  />
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                    Flpkart <br/> Assured <span className="text-[8px] text-slate-400 font-black ml-0.5">❯</span>
                  </span>
                </div>
              </div>
            </div>

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

            {/* Similar Products Section (Moved above Product details in 1 horizontal sliding line) */}
            <SimilarProducts 
              currentProductId={product.id} 
              categoryId={product.category_id} 
              categoryName={product.categoryName} 
              currentProductName={product.name}
            />

            <div className="w-full h-2 bg-[#f1f3f6]" />

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


          </div>
        </div>
      </div>


      {/* Sticky Bottom Bar (Flpkart style matching user screenshots) */}
      {isApparel && (
        <div className="fixed bottom-[70px] left-0 right-0 z-[99] bg-[#f0f5ff] border-t border-[#d0e0ff] py-1.5 px-3 flex items-center justify-between text-xs max-w-[460px] mx-auto select-none shadow-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#388e3c]"></span>
            Selected Size: <span className="text-[#2874f0] font-black text-sm">{selectedSize}</span>
          </span>
          <button 
            type="button"
            onClick={() => {
              const el = document.getElementById('size-selector-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setShowSizeChart(true);
            }}
            className="text-[#2874f0] font-bold text-[11px] underline cursor-pointer bg-transparent border-none p-0"
          >
            Change Size
          </button>
        </div>
      )}

      <div className="footer-btn z-[100]">
         <button 
            type="button"
            onClick={handleAddToCart}
            className="b-btn bg-white font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
            style={{ color: '#2874f0', borderColor: '#2874f0', borderWidth: '1.2px' }}
         >
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 23H8.56185C8.32766 23 8.1009 22.9178 7.9211 22.7678C7.7413 22.6177 7.61987 22.4093 7.57797 22.1789L4.2402 3.82112C4.19831 3.5907 4.07688 3.3823 3.89708 3.23225C3.71728 3.08219 3.49052 3 3.25633 3H1" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M9 28C10.3807 28 11.5 26.8807 11.5 25.5C11.5 24.1193 10.3807 23 9 23C7.61929 23 6.5 24.1193 6.5 25.5C6.5 26.8807 7.61929 28 9 28Z" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M24 28C25.3807 28 26.5 26.8807 26.5 25.5C26.5 24.1193 25.3807 23 24 23C22.6193 23 21.5 24.1193 21.5 25.5C21.5 26.8807 22.6193 28 24 28Z" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M5 8H26.8018C26.9483 8 27.0929 8.03218 27.2256 8.09425C27.3583 8.15633 27.4757 8.2468 27.5695 8.35925C27.6634 8.4717 27.7314 8.6034 27.7687 8.74504C27.8061 8.88667 27.8119 9.03478 27.7857 9.17889L26.1493 18.1789C26.1074 18.4093 25.986 18.6177 25.8062 18.7678C25.6264 18.9178 25.3996 19 25.1654 19H7" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            Add to Cart
         </button>
         <button 
            type="button"
            onClick={handleBuyNow}
            className="b-btn text-black font-bold cursor-pointer active:scale-98 transition-transform flex items-center justify-center"
            style={{ backgroundColor: '#ffc200', border: 'none' }}
         >
            Buy Now
         </button>
      </div>

      {/* Flpkart-style Footer (Compact - No Empty White Spacing) */}
      <div className="w-full bg-white border-t border-slate-100 mt-1">
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-0 border-b border-slate-100">
          <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 border-r border-b border-slate-100 active:bg-slate-50">
            <span className="w-6 h-6 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="2" fill="#f4a43a"/>
                <path d="M8 7V5a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="7" y="11" width="4" height="3" rx="0.5" fill="#fff" opacity="0.8"/>
              </svg>
            </span>
            <span className="text-[12px] font-bold text-[#212121]">Become a Seller</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 border-b border-slate-100 active:bg-slate-50">
            <span className="w-6 h-6 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#f4a43a" stroke="#e07b00" strokeWidth="1"/>
              </svg>
            </span>
            <span className="text-[12px] font-bold text-[#212121]">Advertise</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 border-r border-slate-100 active:bg-slate-50">
            <span className="w-6 h-6 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="10" width="20" height="11" rx="2" fill="#f4a43a"/>
                <path d="M8 10V8a4 4 0 018 0v2" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 2v6" stroke="#e07b00" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="2" fill="#fff" opacity="0.85"/>
              </svg>
            </span>
            <span className="text-[12px] font-bold text-[#212121]">Gift Cards</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 active:bg-slate-50">
            <span className="w-6 h-6 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#f4a43a"/>
                <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2.5-2.5 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="0.8" fill="#fff"/>
              </svg>
            </span>
            <span className="text-[12px] font-bold text-[#212121]">Help Center</span>
          </a>
        </div>

        {/* Copyright Bar */}
        <div className="py-2.5 text-center text-[12px] text-slate-400 font-normal select-none">
          © 2008–2026 Flpkart.com — All Rights Reserved
        </div>

        {/* Payment Icons - Static and Compact (No auto slide) */}
        <div className="bg-white py-1 px-2 overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'15px'}}><svg viewBox="0 0 50 16" height="7" width="20"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1a1f71">VISA</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'15px'}}><svg viewBox="0 0 38 24" height="9" width="15"><circle cx="13" cy="12" r="9" fill="#eb001b"/><circle cx="25" cy="12" r="9" fill="#f79e1b"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#ff5f00"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'15px'}}><svg viewBox="0 0 38 24" height="9" width="15"><circle cx="13" cy="12" r="9" fill="#0099df"/><circle cx="25" cy="12" r="9" fill="#e31837"/><path d="M19 5.8a9 9 0 010 12.4A9 9 0 0119 5.8z" fill="#6c2c91"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-[#016fd0] shrink-0" style={{height:'15px'}}><svg viewBox="0 0 44 14" height="6" width="18"><text x="0" y="11" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">AMEX</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'15px'}}><svg viewBox="0 0 32 22" height="9" width="15"><circle cx="16" cy="11" r="9" fill="none" stroke="#1a1f71" strokeWidth="1.5"/><circle cx="11" cy="11" r="6" fill="#1a1f71" opacity="0.5"/><circle cx="21" cy="11" r="6" fill="#1a1f71" opacity="0.5"/></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'15px'}}><svg viewBox="0 0 54 16" height="7" width="22"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#1a6b3c">Ru</text><text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#f47920">Pay</text></svg></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'15px'}}><svg viewBox="0 0 20 14" height="7" width="10"><rect x="1" y="3" width="18" height="10" rx="1.5" fill="none" stroke="#555" strokeWidth="1.2"/><line x1="1" y1="6" x2="19" y2="6" stroke="#555" strokeWidth="1.2"/><rect x="3" y="8" width="5" height="2" rx="0.5" fill="#555"/></svg><span className="text-[6.5px] font-bold text-slate-500">NET</span></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0 gap-0.5" style={{height:'15px'}}><svg viewBox="0 0 16 16" height="7" width="7"><circle cx="8" cy="8" r="7" fill="#4caf50" opacity="0.15"/><text x="4" y="12" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#388e3c">₹</text></svg><span className="text-[6.5px] font-bold text-slate-500">COD</span></span>
            <span className="inline-flex items-center justify-center border border-slate-200 rounded px-1 py-0.5 bg-white shrink-0" style={{height:'15px'}}><span className="text-[7px] font-black text-slate-500">EMI</span></span>
          </div>
        </div>
      </div>




      

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-[420px] w-full p-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              type="button"
              onClick={() => setShowSizeChart(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer bg-transparent border-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M7 12v-3M12 12v-5M17 12v-3M2 7h20v10H2z"/></svg>
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">Standard Size Guide</h3>
                <p className="text-[11px] text-slate-500 font-medium">Garment measurements in inches & cm</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f1f3f6] text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest (in)</th>
                    <th className="py-2.5 px-3">Length (in)</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {[
                    { sz: 'S', chest: '38 in / 96 cm', len: '26 in' },
                    { sz: 'M', chest: '40 in / 102 cm', len: '27 in' },
                    { sz: 'L', chest: '42 in / 107 cm', len: '28 in' },
                    { sz: 'XL', chest: '44 in / 112 cm', len: '29 in' },
                    { sz: 'XXL', chest: '46 in / 117 cm', len: '30 in' },
                    { sz: 'XXXL', chest: '48 in / 122 cm', len: '31 in' },
                  ].map(row => (
                    <tr key={row.sz} className={selectedSize === row.sz ? 'bg-blue-50/60 font-bold' : ''}>
                      <td className="py-2 px-3 text-[#2874f0] font-black">{row.sz}</td>
                      <td className="py-2 px-3">{row.chest}</td>
                      <td className="py-2 px-3">{row.len}</td>
                      <td className="py-2 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSize(row.sz);
                            const variant = variants.find(v => v.value === row.sz);
                            if (variant) setSelectedVariantId(variant.id);
                            setShowSizeChart(false);
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer border-none ${
                            selectedSize === row.sz 
                              ? 'bg-[#2874f0] text-white' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {selectedSize === row.sz ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setShowSizeChart(false)}
              className="w-full py-2.5 bg-[#2874f0] text-white rounded-lg font-bold text-sm hover:bg-blue-600 cursor-pointer border-none"
            >
              Done (Size {selectedSize})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
