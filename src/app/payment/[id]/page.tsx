'use client';

// Force Cache Bust: 2026-08-07T02:14:30.000Z
import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Share2, Loader2, Lock, Gift, Banknote, HelpCircle, Smile, CreditCard, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const o = {
  PHONEPE: 1,
  PAYTM: 2,
  QR: 3
};

const GiftIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Purple Bow */}
    <path d="M12 6.5C11 4.5 8 4 7 5.5C6 7 8 9 12 9.5C12 9.5 12 9.5 12 6.5Z" fill="#b83df2" />
    <path d="M12 6.5C13 4.5 16 4 17 5.5C18 7 16 9 12 9.5C12 9.5 12 9.5 12 6.5Z" fill="#b83df2" />
    {/* Gift Box Lid (Orange) */}
    <rect x="5" y="9.5" width="14" height="2.5" rx="0.5" fill="#ffa200" />
    {/* Gift Box Body (Orange) */}
    <path d="M6 12H18V18.5C18 19.3 17.3 20 16.5 20H7.5C6.7 20 6 19.3 6 18.5V12Z" fill="#ffa200" />
    {/* Vertical Ribbon (Yellow) */}
    <rect x="11" y="9.5" width="2" height="10.5" fill="#ffd000" />
    {/* Horizontal Ribbon (Yellow) */}
    <rect x="5" y="10" width="14" height="1.5" fill="#ffd000" />
  </svg>
);

const GiftCardIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="12" y1="10" x2="12" y2="19" />
    <path d="M12 10c0-1.5-1-2.5-2.5-2.5S7 8.5 7 10h5z" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 10c0-1.5 1-2.5 2.5-2.5S17 8.5 17 10h-5z" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

const EmiIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="15" y1="13" x2="9" y2="19" />
    <circle cx="10" cy="14" r="1.2" fill="currentColor" />
    <circle cx="14" cy="18" r="1.2" fill="currentColor" />
  </svg>
);

const d = (state: string) => ({
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 700,
  background: state === "done" || state === "active" ? "#2874F0" : "#fff",
  color: state === "done" || state === "active" ? "#fff" : "#888",
  border: state === "pending" ? "2px solid #ddd" : "none"
});

const c = (state: string) => ({
  fontSize: 11,
  marginTop: 6,
  color: state === "active" ? "#222" : state === "done" ? "#2874F0" : "#888",
  fontWeight: state === "active" || state === "done" ? 600 : 500,
  textAlign: "center" as const
});

const h = (isActive: boolean) => ({
  border: isActive ? "2px solid #9f2089" : "1px solid #ddd",
  borderRadius: 12,
  padding: 0,
  margin: "12px 0",
  background: isActive ? "#fdf3fc" : "#fff",
  minHeight: 76,
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.15s"
});

const pStyle = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  width: "100%",
  padding: "16px 20px",
  cursor: "pointer",
  margin: 0
};

const fStyle = {
  fontSize: 16,
  fontWeight: 600,
  color: "#222"
};

function PhonePeBrandLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-1.5 select-none shrink-0">
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <circle cx="32" cy="32" r="32" fill="#5F259F" />
        <path d="M45.7 26.34c0-1.18-.97-2.16-2.16-2.16h-3.99l-9.13-10.46c-.83-1-2.16-1.33-3.49-1l-3.16 1c-.5.17-.66.83-.33 1.16l9.96 9.46H18.42c-.5 0-.83.33-.83.83v1.66c0 1.18.97 2.16 2.16 2.16h2.32v7.97c0 5.97 3.16 9.46 8.46 9.46 1.66 0 2.99-.17 4.65-.83v5.31c0 1.5 1.16 2.66 2.66 2.66h2.32c.5 0 1-.5 1-1v-23.74h3.82c.5 0 .83-.33.83-.83zM35.07 39.62c-1 .5-2.32.66-3.32.66-2.66 0-3.99-1.33-3.99-4.31v-7.97h7.31v11.62z" fill="#fff" />
      </svg>
      <span className="text-[18px] font-black text-[#5F259F] tracking-tight font-sans">PhonePe</span>
    </div>
  );
}

function PaytmBrandLogo() {
  return (
    <div className="flex items-center select-none font-sans" style={{ fontStyle: 'italic' }}>
      <span className="text-[17px] font-black text-[#0F2F5F] tracking-tighter">pay</span>
      <span className="text-[17px] font-black text-[#00BAF2] tracking-tighter">tm</span>
    </div>
  );
}

function UpiBrandLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none font-sans font-black italic">
      <span className="text-[16px] text-[#0F2F5F] tracking-tighter">UPI</span>
      <div className="flex flex-col gap-[2px] shrink-0" style={{ marginTop: 2 }}>
        <div className="w-[10px] h-[3px] bg-[#FF9933] transform skew-x-[-20deg]" />
        <div className="w-[12px] h-[2.5px] bg-[#8B8B8B] transform skew-x-[-20deg]" />
        <div className="w-[8px] h-[2.5px] bg-[#138808] transform skew-x-[-20deg]" />
      </div>
    </div>
  );
}

// Hand holding phone scan icon for Scan To Pay option
function ScanToPayIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M14 46 C14 39, 17 35, 23 35 L25 35 L25 43" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <rect x="25" y="10" width="22" height="42" rx="4" fill="#fff" stroke="#334155" strokeWidth="2.5" />
      <rect x="28" y="14" width="16" height="30" rx="1.5" fill="#f8fafc" />
      <line x1="30" y1="29" x2="42" y2="29" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="32" y="19" width="8" height="7" stroke="#475569" strokeWidth="1.2" />
      <path d="M20 40 L27 34" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 44 L25 38" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M23 49 L26 44" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Authentic Products Icon (Starburst with ORIGINAL ribbon)
function AuthenticBadgeIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M18 2 L21 5 L25 4 L26 8 L30 9 L29 13 L32 16 L30 19 L31 23 L27 24 L26 28 L22 28 L19 31 L16 29 L12 30 L11 26 L7 25 L8 21 L5 18 L7 15 L6 11 L10 10 L11 6 L15 6 Z" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="18" cy="17" r="10" fill="none" stroke="#2563EB" strokeWidth="1.5" />
      <rect x="5" y="14" width="26" height="6" rx="1" fill="#2563EB" />
      <text x="18" y="19" fill="#fff" fontSize="5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.2">ORIGINAL</text>
    </svg>
  );
}

// Secure Payments Icon (Shield with Rupee ₹)
function SecureShieldIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M18 5 C24 5, 29 7, 29 7 C29 7, 29 18, 26 23 C23 28, 18 31, 18 31 C18 31, 13 28, 10 23 C7 18, 7 7, 7 7 C7 7, 12 5, 18 5 Z" fill="none" stroke="#0F2F5F" strokeWidth="2" strokeLinejoin="round" />
      <text x="18" y="21.5" fill="#0F2F5F" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">₹</text>
      <path d="M21 11 L23 13 L27 9" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Easy Returns Icon (Box with circular arrow)
function EasyReturnsIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M18 10 L8 14 L18 18 L28 14 Z" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 14 V24 L18 28 V18 Z" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M18 18 V28 L28 24 V14 Z" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M25 7 C28 10, 28 15, 25 18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 7 C14 10, 14 15, 17 18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 5 L16 7 L19 9" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Visa Card Logo
function VisaLogo() {
  return (
    <span className="text-[16px] font-black italic tracking-tighter text-[#1A1F71] font-sans">
      VISA
    </span>
  );
}

// Mastercard Logo
function MastercardLogo() {
  return (
    <div className="flex items-center -space-x-1.5 shrink-0">
      <div className="w-[14px] h-[14px] rounded-full bg-[#EB001B]" />
      <div className="w-[14px] h-[14px] rounded-full bg-[#F79E1B] opacity-90" />
    </div>
  );
}

// RuPay Card Logo
function RupayLogo() {
  return (
    <div className="flex items-center gap-[1px] font-sans italic font-extrabold tracking-tighter text-xs">
      <span className="text-[#0A58A3] text-[13px]">RuPay</span>
      <span className="text-[#F15A24] text-[10px] tracking-tight">▶</span>
    </div>
  );
}

// PCI DSS Compliant Badge
function PciDssBadge() {
  return (
    <div className="flex items-center gap-1 border border-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded text-[8px] font-black text-emerald-700 leading-none">
      <span className="text-emerald-500 font-bold">✔</span> PCI DSS
    </div>
  );
}

// Razorpay Logo
function RazorpayLogo() {
  return (
    <div className="flex items-center gap-1 text-[#0c2e68] font-sans font-black italic text-xs">
      <span className="text-[#0c2e68] text-[13px]">Razorpay</span>
    </div>
  );
}

// Trust Badge icons
function ReturnIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M18 5L7 10L18 15L29 10L18 5Z" fill="#E5C199" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10V21L18 26V15L7 10Z" fill="#C59B73" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 15V26L29 21V10L18 15Z" fill="#B3865B" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 26.5C7 26.5 11 29.5 18 29.5C25 29.5 29 26.5 29 26.5" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10.5 23.5L6.5 26.5L10.5 29.5" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefundIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M18 5C24.5 5 29.5 9 31 15" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M27.5 15H31V11.5" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 31C11.5 31 6.5 27 5 21" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 21H5V24.5" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="18" r="8" fill="#FBBF24" stroke="#333" strokeWidth="1.5" />
      <path d="M16 15H20M16 17H19.5C20.5 17 20.5 19 19.5 19H16M16 19L19.5 22.5" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function GenuineIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M18 9L9 13L18 17L27 13L18 9Z" fill="#E5C199" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 13V23L18 27V17L9 13Z" fill="#C59B73" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 17V27L27 23V13L18 17Z" fill="#B3865B" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="23.5" cy="11.5" r="6" fill="#2563EB" stroke="#fff" strokeWidth="1.2" />
      <path d="M21.5 11.5L23 13L25.5 10" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M4 9H21V23H4V9Z" fill="#EF4444" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M21 13H27L31 17V23H21V13Z" fill="#F97316" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 15H26L28 18H23V15Z" fill="#E0F2FE" stroke="#333" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="9" cy="24" r="3.5" fill="#1F2937" stroke="#333" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="3.5" fill="#1F2937" stroke="#333" strokeWidth="1.5" />
      <rect x="6.5" y="12" width="11" height="6.5" rx="1" fill="#22C55E" />
      <text x="8" y="17.2" fill="#fff" fontSize="5.5" fontWeight="900" fontFamily="sans-serif">FREE</text>
    </svg>
  );
}

function PhonePeIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="14" fill="#5F259F" />
      <path d="M45.7 26.34c0-1.18-.97-2.16-2.16-2.16h-3.99l-9.13-10.46c-.83-1-2.16-1.33-3.49-1l-3.16 1c-.5.17-.66.83-.33 1.16l9.96 9.46H18.42c-.5 0-.83.33-.83.83v1.66c0 1.18.97 2.16 2.16 2.16h2.32v7.97c0 5.97 3.16 9.46 8.46 9.46 1.66 0 2.99-.17 4.65-.83v5.31c0 1.5 1.16 2.66 2.66 2.66h2.32c.5 0 1-.5 1-1v-23.74h3.82c.5 0 .83-.33.83-.83zM35.07 39.62c-1 .5-2.32.66-3.32.66-2.66 0-3.99-1.33-3.99-4.31v-7.97h7.31v11.62z" fill="#fff" />
    </svg>
  );
}

function QrIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qr-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1a1a" />
          <stop offset="1" stopColor="#444" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="22" height="22" rx="4" fill="none" stroke="url(#qr-grad)" strokeWidth="3" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="url(#qr-grad)" />
      <rect x="36" y="6" width="22" height="22" rx="4" fill="none" stroke="url(#qr-grad)" strokeWidth="3" />
      <rect x="43" y="13" width="8" height="8" rx="2" fill="url(#qr-grad)" />
      <rect x="6" y="36" width="22" height="22" rx="4" fill="none" stroke="url(#qr-grad)" strokeWidth="3" />
      <rect x="13" y="43" width="8" height="8" rx="2" fill="url(#qr-grad)" />
      <rect x="36" y="36" width="8" height="8" rx="1.5" fill="url(#qr-grad)" />
      <rect x="50" y="36" width="8" height="8" rx="1.5" fill="url(#qr-grad)" />
      <rect x="36" y="50" width="8" height="8" rx="1.5" fill="url(#qr-grad)" />
      <rect x="50" y="50" width="8" height="8" rx="1.5" fill="url(#qr-grad)" />
      <rect x="43" y="43" width="8" height="8" rx="1.5" fill="url(#qr-grad)" />
    </svg>
  );
}




function getUrlParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const sp = new URLSearchParams(window.location.search);
    return sp.get(key);
  } catch {
    return null;
  }
}

function getRouteIdFromUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    const path = window.location.pathname;
    const parts = path.split('/payment/');
    if (parts.length > 1) {
      return decodeURIComponent(parts[1].split('?')[0]);
    }
  } catch {}
  return '';
}

function PaymentPageContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<string>(() => getRouteIdFromUrl());

  useEffect(() => {
    if (params) {
      Promise.resolve(params).then((p) => {
        if (p?.id) setParamsId(p.id);
      }).catch(() => {});
    }
  }, [params]);

  // Parsing route params safely
  const { selling, mrp } = (() => {
    try {
      const rawId = paramsId || getRouteIdFromUrl();
      if (!rawId) return { selling: 0, mrp: 0 };
      const t = rawId.split(".");
      const s = parseInt((t[0] || '0').replace(/[^0-9]/g, ''), 10) || 0;
      const m = parseInt((t[1] || '0').replace(/[^0-9]/g, ''), 10) || s;
      return { selling: s, mrp: m };
    } catch {
      return { selling: 0, mrp: 0 };
    }
  })();

  const [user, setUser] = useState<any>({});
  const [cartData, setCartData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = JSON.parse(localStorage.getItem("data") || "{}");
        const items = JSON.parse(localStorage.getItem("cart_items") || localStorage.getItem("cart") || "[]");
        let name = storedData?.name;
        let image = storedData?.image || storedData?.imageUrl;
        let id = storedData?.productId || storedData?.id;

        if (Array.isArray(items) && items.length > 0) {
          if (!name) name = items[0].name;
          if (!image) image = items[0].imageUrl || items[0].image || items[0].image_url;
          if (!id) id = items[0].productId || items[0].id;
        }

        return {
          ...storedData,
          name: name || storedData?.name || '',
          image: image || storedData?.image || '',
          imageUrl: image || storedData?.imageUrl || '',
          id: id || storedData?.id || ''
        };
      } catch (e) {}
    }
    return {};
  });
  const [selectedMethod, setSelectedMethod] = useState(o.PHONEPE);
  const [expandedSection, setExpandedSection] = useState<'upi' | 'card' | 'emi' | null>('upi');
  
  const [txnid, setTxnid] = useState("");
  const [paytmIntent, setPaytmIntent] = useState("");
  const [phonepeIntent, setPhonepeIntent] = useState("");
  const [gpayIntent, setGpayIntent] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [upiUrl, setUpiUrl] = useState("");

  const [activePayScreen, setActivePayScreen] = useState<'select' | 'phonepe' | 'paytm'>('select');
  const [upiId, setUpiId] = useState('paytm.s27z8uz@pty');
  const [merchantName, setMerchantName] = useState('Jambucha Alpesh Kanjibhai');

  const getInitials = (name: string) => {
    if (!name) return "JA";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const amountToWords = (amount: number): string => {
    const words = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    if (amount === 0) return "Zero Only";
    
    let str = "";
    if (amount >= 100000) {
      str += amountToWords(Math.floor(amount / 100000)) + " Lakh ";
      amount %= 100000;
    }
    if (amount >= 1000) {
      str += amountToWords(Math.floor(amount / 1000)) + " Thousand ";
      amount %= 1000;
    }
    if (amount >= 100) {
      str += words[Math.floor(amount / 100)] + " Hundred ";
      amount %= 100;
    }
    if (amount > 0) {
      if (str !== "") str += "and ";
      if (amount < 20) {
        str += words[amount];
      } else {
        str += tens[Math.floor(amount / 10)];
        if (amount % 10 > 0) {
          str += " " + words[amount % 10];
        }
      }
    }
    return str.trim() + " Only";
  };
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeVerificationApp, setActiveVerificationApp] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAlternativeMethod, setShowAlternativeMethod] = useState(false);
  
  const [countdown, setCountdown] = useState(15 * 60);
  const pollingRef = useRef(false);
  const initiatingRef = useRef(false);

  // Sync state with dynamic local storage on mount and fetch exact product image from Supabase if missing
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
      const parsedData = JSON.parse(localStorage.getItem("data") || "{}");
      setCartData(parsedData);

      const fetchExactImageFromDb = async () => {
        let nameToSearch = parsedData?.name;
        let idToSearch = parsedData?.productId || parsedData?.id;

        try {
          const items = JSON.parse(localStorage.getItem("cart_items") || localStorage.getItem("cart") || "[]");
          if (Array.isArray(items) && items.length > 0) {
            if (!nameToSearch) nameToSearch = items[0].name;
            if (!idToSearch) idToSearch = items[0].productId || items[0].id;
            const itemImg = items[0].imageUrl || items[0].image || items[0].image_url;
            if (itemImg) {
              setCartData((prev: any) => ({ ...prev, image: itemImg, imageUrl: itemImg }));
            }
          }
        } catch {}

        if (idToSearch || nameToSearch) {
          try {
            const supabase = (await import('@/lib/supabase')).supabase;
            let query = supabase.from('products').select('*, product_images(image_url)');
            
            const isUuid = typeof idToSearch === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idToSearch);
            
            if (isUuid) {
              query = query.eq('id', idToSearch);
            } else if (nameToSearch) {
              const keywords = nameToSearch.split(' ').filter((w: string) => w.length > 1).slice(0, 2).join(' ');
              query = query.ilike('name', `%${keywords || nameToSearch}%`);
            } else {
              query = query.limit(1);
            }

            const { data: prod } = await query.limit(1).maybeSingle();
            if (prod) {
              const exactImg = prod.image || prod.image_url || prod.product_images?.[0]?.image_url || (Array.isArray(prod.images) ? prod.images[0] : '') || '';
              if (exactImg) {
                setCartData((prev: any) => ({
                  ...prev,
                  name: prod.name || prev.name,
                  image: exactImg,
                  imageUrl: exactImg
                }));
              }
            }
          } catch (err) {
            console.error('Failed to fetch exact product image from Supabase:', err);
          }
        }
      };

      fetchExactImageFromDb();
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, []);

  // Shared countdown timer
  useEffect(() => {
    const getOrSetLiveSaleTime = () => {
      const stored = localStorage.getItem('shared_offer_ends_at');
      const now = Date.now();

      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          return { endsAt, remaining };
        }
      }

      // Generate new 15 minute duration if none exists or has expired
      const endsAt = now + 15 * 60 * 1000;
      localStorage.setItem('shared_offer_ends_at', endsAt.toString());
      return { endsAt, remaining: 15 * 60 };
    };

    const init = getOrSetLiveSaleTime();
    setCountdown(init.remaining);

    const timer = setInterval(() => {
      const now = Date.now();
      const stored = localStorage.getItem('shared_offer_ends_at');
      if (stored) {
        const endsAt = parseInt(stored, 10);
        const remaining = Math.floor((endsAt - now) / 1000);
        if (remaining > 0) {
          setCountdown(remaining);
        } else {
          // Reset to 15 minutes if expired
          const newEndsAt = now + 15 * 60 * 1000;
          localStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
          setCountdown(15 * 60);
        }
      } else {
        const newEndsAt = now + 15 * 60 * 1000;
        localStorage.setItem('shared_offer_ends_at', newEndsAt.toString());
        setCountdown(15 * 60);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initiate Payment Intent
  useEffect(() => {
    if (isLoaded || errorMessage || !selling || selling <= 0 || initiatingRef.current) return;

    // Check if query parameters already carry txnid to avoid creating multiple draft orders
    const queryTxnId = getUrlParam('txnid');
    if (queryTxnId) {
      initiatingRef.current = true;
      setTxnid(queryTxnId);
      // Fetch intents using existing txnid or configure dynamically
      const setupExistingIntents = async () => {
        try {
          const res = await fetch('/api/initiate-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: selling,
              productinfo: cartData?.name || "Order",
              firstname: user?.firstname || "",
              email: user?.email || "",
              phone: user?.phone || "",
              txnid: queryTxnId,
              orderId: getUrlParam('orderId')
            })
          });
          const t = await res.json();
          if (t.success) {
            setPaytmIntent(t.paytmIntent);
            setPhonepeIntent(t.phonepeIntent);
            setGpayIntent(t.gpayIntent);
            setQrCodeUrl(t.qrCodeUrl);
            setUpiUrl(t.upiUrl);
            if (t.upiId) setUpiId(t.upiId);
            if (t.merchantName) setMerchantName(t.merchantName);
            setIsLoaded(true);
          } else {
            setErrorMessage(t.error || "Could not initiate payment details");
            initiatingRef.current = false;
          }
        } catch (e: any) {
          setErrorMessage(e.message || "Network connection error");
          initiatingRef.current = false;
        }
      };
      setupExistingIntents();
      return;
    }

    const initiateTransaction = async () => {
      initiatingRef.current = true;
      try {
        const res = await fetch("/api/initiate-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: selling,
            productinfo: cartData?.name || "Order",
            firstname: user?.firstname || user?.username || user?.name || "",
            email: user?.email || "",
            phone: user?.phone || user?.mobile || ""
          })
        });
        const t = await res.json();
        if (!t.success) {
          setErrorMessage(t.error || "Could not initiate payment");
          initiatingRef.current = false;
          return;
        }
        setTxnid(t.txnid);
        setPaytmIntent(t.paytmIntent);
        setPhonepeIntent(t.phonepeIntent);
        setGpayIntent(t.gpayIntent);
        setQrCodeUrl(t.qrCodeUrl);
        setUpiUrl(t.upiUrl);
        if (t.upiId) setUpiId(t.upiId);
        if (t.merchantName) setMerchantName(t.merchantName);
        setIsLoaded(true);
      } catch (err: any) {
        setErrorMessage(err.message || "Network error");
        initiatingRef.current = false;
      }
    };
    initiateTransaction();
  }, [selling, user, cartData, isLoaded, errorMessage]);

  // Real-time Automated Verification Polling loop (every 1 second)
  useEffect(() => {
    if (!txnid || !isLoaded) return;

    let isActive = true;
    const pollVerification = async () => {
      while (isActive && !pollingRef.current) {
        try {
          const res = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ txnid })
          });
          const r = await res.json();
          
          if (!isActive || pollingRef.current) return;

          if (r.status === "success") {
            pollingRef.current = true;
            router.replace(`/PaymentConfirmation?transactionId=${txnid}&amount=${selling}&status=done&utr=${r.utr || ""}`);
            return;
          }
          if (r.status === "failure") {
            pollingRef.current = true;
            router.replace(`/PaymentFailed?transactionId=${txnid}&amount=${selling}&amount1=${mrp}&status=Failed`);
            return;
          }
        } catch (e) {
          // Silent retry after delay on network failure
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    };

    pollVerification();

    return () => {
      isActive = false;
    };
  }, [txnid, isLoaded, router, selling, mrp]);

  // Show cancellation switch after 60s of attempting to pay
  useEffect(() => {
    if (!activeVerificationApp) {
      setShowAlternativeMethod(false);
      return;
    }
    setShowAlternativeMethod(false);
    const timeout = setTimeout(() => setShowAlternativeMethod(true), 60000);
    return () => clearTimeout(timeout);
  }, [activeVerificationApp]);

  // Back state prevention and PopState Payment Guard
  useEffect(() => {
    if (activePayScreen === 'select' && !activeVerificationApp && !showQrModal) return;
    try {
      window.history.pushState({ paymentGuard: true }, "");
    } catch (e) {}

    const handlePopState = () => {
      if (showQrModal) {
        setShowQrModal(false);
      } else if (activePayScreen !== 'select') {
        setActivePayScreen('select');
        setActiveVerificationApp(null);
      } else {
        setActiveVerificationApp(null);
      }
      try {
        window.history.pushState({ paymentGuard: true }, "");
      } catch (e) {}
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activePayScreen, activeVerificationApp, showQrModal]);

  // Direct app launch utility
  const launchIntent = useCallback((intentUrl: string) => {
    if (!intentUrl) return;
    const a = document.createElement("a");
    a.href = intentUrl;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const handleAppPay = useCallback((app: string) => {
    let intent = "";
    if (app === "phonepe") {
      intent = phonepeIntent || `phonepe://pay?ver=01&mode=19&pa=${upiId || 'paytm.s27z8uz@pty'}&pn=Paying_to_Flipkart&tr=${txnid}&cu=INR&mc=7446&qrMedium=04&tn=Paying_to_Flipkart&am=${selling}`;
    } else if (app === "paytm") {
      intent = paytmIntent || `paytmmp://cash_wallet?pa=${upiId || 'paytm.s27z8uz@pty'}&pn=Paying_to_Flipkart&mc=3526&tr=${txnid}&am=${selling}&cu=INR&tn=Recharge&url=&mode=02&purpose=00&orgid=37567`;
    } else if (app === "gpay") {
      intent = gpayIntent || `tez://upi/pay?pa=${upiId || 'paytm.s27z8uz@pty'}&pn=Paying_to_Flipkart&mc=3526&tr=${txnid}&am=${selling}&cu=INR&tn=Recharge`;
    } else {
      intent = upiUrl || `upi://pay?pa=${upiId || 'paytm.s27z8uz@pty'}&pn=Paying_to_Flipkart&am=${selling}&cu=INR`;
    }

    if (intent) {
      setActiveVerificationApp(app);
      
      // Register payment processing immediately when UPI app opens
      if (txnid) {
        fetch('/api/payments/open-upi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txnid, app })
        }).catch(err => console.error('Failed to register upi application open:', err));
      }

      setTimeout(() => launchIntent(intent), 50);
    }
  }, [phonepeIntent, paytmIntent, gpayIntent, upiUrl, upiId, selling, launchIntent, txnid]);

  const handleOpenAgain = useCallback(() => {
    if (!activeVerificationApp) return;
    const intent = activeVerificationApp === "phonepe" ? phonepeIntent : paytmIntent;
    launchIntent(intent);
  }, [activeVerificationApp, phonepeIntent, paytmIntent, launchIntent]);

  const handleCancelIntent = useCallback(() => setActiveVerificationApp(null), []);

  const handleDownloadQr = useCallback(async () => {
    if (!qrCodeUrl) return;
    try {
      const res = await fetch(qrCodeUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payment-qr-${txnid}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed:", e);
    }
  }, [qrCodeUrl, txnid]);

  const handleShareQr = useCallback(async () => {
    if (!qrCodeUrl) return;
    try {
      const res = await fetch(qrCodeUrl);
      const blob = await res.blob();
      const file = new File([blob], `payment-qr-${txnid}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "UPI Payment QR",
          text: `Scan and pay ₹${selling} securely`
        });
      } else {
        handleDownloadQr();
      }
    } catch (e) {
      handleDownloadQr();
    }
  }, [qrCodeUrl, txnid, selling, handleDownloadQr]);

  const formatTimerValue = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}sec`;
  };

  const formattedQrTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-red-200 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Initialization Error</h2>
          <p className="text-sm text-slate-600 mb-6">{errorMessage}</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-[#2874F0] text-white py-3 rounded-xl font-bold text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Exact Product Image Resolution matching Order Summary / Home Page item
  const getProductImage = () => {
    const isValidImg = (url?: string) => {
      if (!url || typeof url !== 'string') return false;
      const clean = url.trim();
      if (!clean) return false;
      if (clean.includes('via.placeholder.com') || clean.includes('placeholder.png') || clean.includes('truck.webp')) return false;
      return true;
    };

    // 1. Direct check from cartData state (set from localStorage 'data')
    let img = cartData?.image || cartData?.imageUrl || cartData?.product?.image;
    if (isValidImg(img)) return img!;

    if (typeof window !== 'undefined') {
      // 2. Check localStorage 'data' directly
      try {
        const stored = JSON.parse(localStorage.getItem('data') || '{}');
        const sImg = stored?.image || stored?.imageUrl;
        if (isValidImg(sImg)) return sImg!;
      } catch {}

      // 3. Check localStorage 'cart_items' or 'cart'
      try {
        const items = JSON.parse(localStorage.getItem('cart_items') || localStorage.getItem('cart') || '[]');
        if (Array.isArray(items) && items.length > 0) {
          const item = items[0];
          const itemImg = item?.imageUrl || item?.image || item?.image_url || item?.product?.image || (Array.isArray(item?.images) ? item?.images[0] : '') || (Array.isArray(item?.product_images) ? item?.product_images[0]?.image_url : '');
          if (isValidImg(itemImg)) return itemImg!;
        }
      } catch {}

      // 4. Search exact match by Name or ID in cached_homepage_products
      try {
        const cached = JSON.parse(localStorage.getItem('cached_homepage_products') || '[]');
        if (Array.isArray(cached) && cached.length > 0) {
          const currentName = (cartData?.name || '').toLowerCase().trim();
          const currentId = cartData?.productId || cartData?.id;

          const matched = cached.find((p: any) => {
            if (currentId && String(p.id) === String(currentId)) return true;
            if (currentName && p.name && p.name.toLowerCase().trim() === currentName) return true;
            if (currentName && p.name && (p.name.toLowerCase().includes(currentName) || currentName.includes(p.name.toLowerCase()))) return true;
            return false;
          });

          if (matched) {
            const mImg = matched.image || matched.imageUrl || matched.image_url || matched.product_images?.[0]?.image_url || (Array.isArray(matched.images) ? matched.images[0] : '');
            if (isValidImg(mImg)) return mImg!;
          }
        }
      } catch {}
    }

    // Default category fallback if image URL is 404 or relative path
    const prodNameLower = (cartData?.name || '').toLowerCase();
    const isMobile = (
      prodNameLower.includes('realme') ||
      prodNameLower.includes('poco') ||
      prodNameLower.includes('iqoo') ||
      prodNameLower.includes('samsung') ||
      prodNameLower.includes('iphone') ||
      prodNameLower.includes('vivo') ||
      prodNameLower.includes('oppo') ||
      prodNameLower.includes('oneplus') ||
      prodNameLower.includes('redmi') ||
      prodNameLower.includes('xiaomi') ||
      prodNameLower.includes('mobile') ||
      prodNameLower.includes('phone') ||
      prodNameLower.includes('5g') ||
      prodNameLower.includes('gb')
    );

    if (isMobile) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80";
    }

    return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80";
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans pb-8">
      {/* Dynamic keyframe styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin-custom {
          animation: spin 1s linear infinite;
        }
        @keyframes text-shimmer-right-to-left {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .shimmer-text-rtl {
          background: linear-gradient(
            270deg,
            #15803d 0%,
            #15803d 25%,
            #bbf7d0 40%,
            #ffffff 50%,
            #bbf7d0 60%,
            #15803d 75%,
            #15803d 100%
          );
          background-size: 200% 100%;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          display: inline-block;
          animation: text-shimmer-right-to-left 1.6s linear infinite;
        }
      `}} />

      {/* Header */}
      <div className="container-fluid py-2 bg-white border-b border-[#eaeaf2] sticky top-0 z-40 select-none">
        <div className="flex items-center justify-between px-4 py-2 max-w-lg mx-auto">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2.2]" />
            </button>
            <h1 className="text-[17px] font-black text-slate-900 ml-2 font-sans tracking-tight">Payments</h1>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
            <Lock className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-[11px] font-bold tracking-tight text-slate-700 font-sans uppercase">100% SECURE</span>
          </div>
        </div>
      </div>

      {/* Checkout Progress Stepper Bar (Exact Flipkart Copy) */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 select-none">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex flex-col items-center w-20">
            <div style={d("done")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span style={c("done")}>Address</span>
          </div>
          
          <div style={{ flex: 1, height: 2, background: "#2874F0", marginTop: 13 }} />

          <div className="flex flex-col items-center w-28">
            <div style={d("done")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span style={c("done")}>Order Summary</span>
          </div>

          <div style={{ flex: 1, height: 2, background: "#2874F0", marginTop: 13 }} />

          <div className="flex flex-col items-center w-20">
            <div style={d("active")}>3</div>
            <span style={c("active")}>Payment</span>
          </div>
        </div>
      </div>

      {/* Top Product Summary Card */}
      <div className="max-w-md mx-auto mt-3 px-4">
        <div className="bg-[#f0f5fe] rounded-2xl p-4 border border-[#dce8fb] shadow-xs select-none">
          {/* Top Row: Thumbnail + Product Name + Prices */}
          <div className="flex items-start gap-3">
            <div className="w-[54px] h-[54px] rounded-xl bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src={getProductImage()} 
                alt={cartData?.name || "Product"} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const prodNameLower = (cartData?.name || '').toLowerCase();
                  const isMobile = (
                    prodNameLower.includes('realme') ||
                    prodNameLower.includes('poco') ||
                    prodNameLower.includes('iqoo') ||
                    prodNameLower.includes('samsung') ||
                    prodNameLower.includes('iphone') ||
                    prodNameLower.includes('vivo') ||
                    prodNameLower.includes('oppo') ||
                    prodNameLower.includes('oneplus') ||
                    prodNameLower.includes('redmi') ||
                    prodNameLower.includes('xiaomi') ||
                    prodNameLower.includes('mobile') ||
                    prodNameLower.includes('phone') ||
                    prodNameLower.includes('5g') ||
                    prodNameLower.includes('gb')
                  );
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = isMobile 
                    ? "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80"
                    : "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[13.5px] font-bold text-[#111827] leading-snug truncate">
                {cartData?.name || "Samsung Galaxy S21 FE 5G"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[16px] font-black text-[#2874f0]">₹{selling}</span>
                {mrp > selling && (
                  <span className="text-[12.5px] font-semibold text-slate-400 line-through">₹{mrp}</span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#dce8fb] my-3" />

          {/* Bottom Row: Total Amount dropdown & Price */}
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-1 text-[#2874f0] font-bold text-[14px]">
              <span>Total Amount</span>
              <ChevronUp className="w-4 h-4 text-[#2874f0]" />
            </button>
            <span className="text-[16px] font-black text-[#111827]">₹{selling}</span>
          </div>
        </div>
      </div>

      {/* 95% CASHBACK Right-To-Left Text Shimmer Green Banner */}
      <div className="max-w-md mx-auto my-1.5 px-2 select-none">
        <div className="bg-[#f1faf3] border border-[#d2f0d6] py-2.5 px-4 flex items-center justify-between rounded-lg shadow-xs">
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-tight shimmer-text-rtl">UPTO 95% CASHBACK</span>
            <span className="text-slate-700 text-[11px] font-bold mt-0.5">Claim now with payment offers</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-white/80 px-2 py-1 rounded-md border border-slate-200">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-3.5 w-7 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-3.5 w-6 object-contain" />
            <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-1 rounded-sm border border-slate-250">+4</span>
          </div>
        </div>
      </div>

      {/* Selection Body */}
      <div className="max-w-md mx-auto mt-1 px-2">
        {/* UPI Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-8 border border-slate-350 rounded flex items-center justify-center text-[10px] font-black text-slate-800 bg-white tracking-tighter shrink-0 select-none">
            UPI
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-[#111827]">UPI</span>
            <span className="text-slate-500 text-[12px] font-medium">Pay by any UPI app</span>
          </div>
        </div>

        {/* Unified Payment Options List Container (Zero Empty Gaps) */}
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden mb-4">
          
          {/* 1. PhonePe Row */}
          <div
            onClick={() => setSelectedMethod(o.PHONEPE)}
            className={`w-full p-3.5 flex flex-col cursor-pointer select-none transition-all ${
              selectedMethod === o.PHONEPE ? 'bg-[#f4f8ff]' : 'bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              {/* Left Side: Radio Circle + Name */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  selectedMethod === o.PHONEPE ? "border-[#2874f0] bg-[#2874f0]" : "border-slate-400 bg-white"
                }`}>
                  {selectedMethod === o.PHONEPE && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#111827]">PhonePe</span>
                  <span className="bg-[#dcfce7] text-[#15803d] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tight">
                    Fastest
                  </span>
                </div>
              </div>

              {/* Right Side: App Logo Icon */}
              <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                <PhonePeIcon size={28} />
              </div>
            </div>

            {/* Yellow Pay Button Underneath */}
            {selectedMethod === o.PHONEPE && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAppPay('phonepe');
                }}
                className="w-full mt-3 py-2.5 px-4 rounded-lg font-bold text-[14.5px] text-[#000000] bg-[#ffc200] hover:bg-[#ffb700] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center cursor-pointer border border-[#e5ad00]"
              >
                Pay ₹{selling.toLocaleString('en-IN')}
              </button>
            )}
          </div>

          {/* 2. Paytm Row */}
          <div
            onClick={() => setSelectedMethod(o.PAYTM)}
            className={`w-full p-3.5 flex flex-col cursor-pointer select-none transition-all ${
              selectedMethod === o.PAYTM ? 'bg-[#f4f8ff]' : 'bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              {/* Left Side: Radio Circle + Name */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  selectedMethod === o.PAYTM ? "border-[#2874f0] bg-[#2874f0]" : "border-slate-400 bg-white"
                }`}>
                  {selectedMethod === o.PAYTM && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[15px] font-bold text-[#111827]">Paytm</span>
              </div>

              {/* Right Side: App Logo Icon */}
              <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 p-0.5">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" 
                  alt="Paytm" 
                  className="h-full w-full object-contain" 
                />
              </div>
            </div>

            {/* Yellow Pay Button Underneath */}
            {selectedMethod === o.PAYTM && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAppPay('paytm');
                }}
                className="w-full mt-3 py-2.5 px-4 rounded-lg font-bold text-[14.5px] text-[#000000] bg-[#ffc200] hover:bg-[#ffb700] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center cursor-pointer border border-[#e5ad00]"
              >
                Pay ₹{selling.toLocaleString('en-IN')}
              </button>
            )}
          </div>

          {/* 3. Google Pay Row */}
          <div
            onClick={() => setSelectedMethod('gpay')}
            className={`w-full p-3.5 flex flex-col cursor-pointer select-none transition-all ${
              selectedMethod === 'gpay' ? 'bg-[#f4f8ff]' : 'bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              {/* Left Side: Radio Circle + Name */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  selectedMethod === 'gpay' ? "border-[#2874f0] bg-[#2874f0]" : "border-slate-400 bg-white"
                }`}>
                  {selectedMethod === 'gpay' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[15px] font-bold text-[#111827]">Google Pay</span>
              </div>

              {/* Right Side: App Logo Icon */}
              <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 p-0.5">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_%28GPay%29_Logo.svg" 
                  alt="Google Pay" 
                  className="h-full w-full object-contain" 
                />
              </div>
            </div>

            {/* Yellow Pay Button Underneath */}
            {selectedMethod === 'gpay' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAppPay('gpay');
                }}
                className="w-full mt-3 py-2.5 px-4 rounded-lg font-bold text-[14.5px] text-[#000000] bg-[#ffc200] hover:bg-[#ffb700] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center cursor-pointer border border-[#e5ad00]"
              >
                Pay ₹{selling.toLocaleString('en-IN')}
              </button>
            )}
          </div>

          {/* 4. Scan QR Code Row */}
          <div
            onClick={() => setSelectedMethod(o.QR)}
            className={`w-full p-3.5 flex flex-col cursor-pointer select-none transition-all ${
              selectedMethod === o.QR ? 'bg-[#f4f8ff]' : 'bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              {/* Left Side: Radio Circle + Name */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  selectedMethod === o.QR ? "border-[#2874f0] bg-[#2874f0]" : "border-slate-400 bg-white"
                }`}>
                  {selectedMethod === o.QR && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[15px] font-bold text-[#111827]">Scan QR Code</span>
              </div>

              {/* Right Side: App Logo Icon */}
              <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
                <ScanToPayIcon size={18} />
              </div>
            </div>

            {/* Yellow Pay Button Underneath */}
            {selectedMethod === o.QR && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQrModal(true);
                  if (txnid) {
                    fetch('/api/payments/open-upi', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ txnid, app: 'qr' })
                    }).catch(err => console.error('Failed to register upi QR open:', err));
                  }
                }}
                className="w-full mt-3 py-2.5 px-4 rounded-lg font-bold text-[14.5px] text-[#000000] bg-[#ffc200] hover:bg-[#ffb700] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center cursor-pointer border border-[#e5ad00]"
              >
                Pay ₹{selling.toLocaleString('en-IN')}
              </button>
            )}
          </div>

          {/* 4. Have a Flipkart Gift Card? Row */}
          <div className="w-full bg-white py-3.5 px-4 flex items-center justify-between select-none cursor-pointer hover:bg-slate-50">
            <div className="flex items-center gap-3.5">
              <GiftCardIcon className="h-5 w-7 text-[#111111] shrink-0" />
              <span className="text-[14.5px] font-bold text-[#111111] font-sans">Have a Flpkart Gift Card?</span>
            </div>
            <span className="text-[13.5px] font-extrabold text-[#2874f0] select-none hover:text-[#2874f0]/80">Add</span>
          </div>

          {/* 5. EMI (Unavailable) Row */}
          <div className="w-full bg-white py-3.5 px-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-3.5">
              <EmiIcon className="h-5 w-7 text-slate-400 shrink-0" />
              <span className="text-[14.5px] font-bold text-slate-400 font-sans">EMI</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 select-none">
              <span>Unavailable</span>
              <HelpCircle className="h-4 w-4 text-slate-400" strokeWidth={2} />
            </div>
          </div>

          {/* 6. Cash on Delivery (Unavailable) Row */}
          <div className="w-full bg-white py-3.5 px-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-3.5">
              <Banknote className="h-5 w-7 text-slate-400 shrink-0" strokeWidth={1.8} />
              <span className="text-[14.5px] font-bold text-slate-400 font-sans">Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 select-none">
              <span>Unavailable</span>
              <HelpCircle className="h-4 w-4 text-slate-400" strokeWidth={2} />
            </div>
          </div>

        </div>

        {/* Pricing Summary Breakdown Box - FULL BLEED */}
        <div className="bg-white border-t border-b border-slate-200 py-3.5 px-5 mb-0">
          <h3 className="text-[16px] font-bold text-[#111111] pb-2 border-b border-slate-200 mb-2.5">Price Details</h3>
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-sm text-slate-800 font-semibold">
              <span>Price (1 item)</span>
              <span>₹ {mrp || selling}</span>
            </div>

            {mrp > selling && (
              <div className="flex items-center justify-between text-sm text-[#388e3c] font-semibold">
                <span>Discount</span>
                <span>- ₹ {mrp - selling}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-slate-800 font-semibold">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[16px] font-bold text-[#111111]">
              <span>Amount Payable</span>
              <span>₹ {selling}</span>
            </div>

            {mrp > selling && (
              <div className="border-t border-dashed border-slate-200 pt-3 text-[13px] font-bold text-[#388e3c]">
                You will save ₹ {mrp - selling} on this order
              </div>
            )}
          </div>
        </div>
      </div>





      {/* Polling / App Intent Verification Modal Overlay (Hidden) */}
      {false && activePayScreen === 'select' && activeVerificationApp && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1050, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 360, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ position: "relative", width: 76, height: 76, margin: "0 auto 12px" }}>
              <div style={{ position: "absolute", inset: 0, border: "4px solid #eee", borderRadius: "50%" }} />
              <div 
                className="animate-spin-custom" 
                style={{ 
                  position: "absolute", 
                  inset: 0, 
                  border: "4px solid transparent", 
                  borderTopColor: activeVerificationApp === "phonepe" ? "#5f259f" : "#002970", 
                  borderRadius: "50%" 
                }} 
              />
              <div style={{ position: "absolute", inset: 8, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee", overflow: "hidden" }}>
                {activeVerificationApp === "phonepe" ? (
                  <PhonePeIcon size={44} />
                ) : (
                  <PaytmIcon />
                )}
              </div>
            </div>

            <h4 style={{ margin: "8px 0 4px", fontWeight: 700, fontSize: 16, color: "#111" }}>Verifying your payment</h4>
            <p style={{ margin: 0, color: "#666", fontSize: 13, lineHeight: 1.5 }}>
              Complete the ₹{selling} payment in <strong>{activeVerificationApp === "phonepe" ? "PhonePe" : "Paytm"}</strong>. We’ll auto-confirm in a few seconds.
            </p>

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button 
                onClick={handleOpenAgain} 
                className="btn" 
                style={{ flex: 1, background: activeVerificationApp === "phonepe" ? "#5f259f" : "#002970", color: "#fff", fontWeight: 600, padding: "12px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13 }}
              >
                Open {activeVerificationApp === "phonepe" ? "PhonePe" : "Paytm"} again
              </button>
            </div>

            {showAlternativeMethod ? (
              <button 
                onClick={handleCancelIntent} 
                style={{ marginTop: 14, background: "none", border: "none", color: "#9f2089", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline", padding: 4 }}
              >
                I didn’t pay — choose another method
              </button>
            ) : (
              <p style={{ margin: "14px 0 0", fontSize: 12, color: "#666", lineHeight: 1.4 }}>
                Please keep this screen open while we verify with your bank.
                <br />
                <span style={{ color: "#aaa", fontSize: 11 }}>Already paid? Confirmation arrives in a few seconds.</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Scannable Payment QR Modal Overlay */}
      {showQrModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1050, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, maxWidth: 360, width: "100%", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <button 
              onClick={() => setShowQrModal(false)} 
              aria-label="Close" 
              style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f1f1f1", color: "#444", fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              &times;
            </button>
            
            <h4 style={{ margin: "0 0 4px", fontWeight: 700, textAlign: "center", fontSize: 16, color: "#111" }}>Scan QR to Pay</h4>
            <p style={{ margin: 0, color: "#666", fontSize: 13, textAlign: "center" }}>
              Amount: <strong>₹ {selling}</strong>
            </p>

            <div style={{ margin: "16px auto", background: "#fff", padding: 12, borderRadius: 12, border: "1px solid #eee", display: "flex", justifyContent: "center" }}>
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Payment QR" style={{ width: 220, height: 220, display: "block" }} />
              ) : (
                <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                  <Loader2 className="animate-spin h-8 w-8 text-[#2874F0]" />
                </div>
              )}
            </div>

            <div style={{ textAlign: "center", margin: "0 0 12px" }}>
              <span style={{ display: "inline-block", color: "#666", fontSize: 12 }}>QR expires in </span>
              <span style={{ display: "inline-block", fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: countdown < 60 ? "#d32f2f" : "#222", marginLeft: 4 }}>
                {formattedQrTimer(countdown)}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={handleDownloadQr} 
                style={{ flex: 1, background: "#f5f5f5", border: "1px solid #ddd", color: "#333", fontWeight: 600, padding: "10px 0", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13 }}
              >
                <Download className="h-4 w-4" /> Download
              </button>
              
              <button 
                onClick={handleShareQr} 
                style={{ flex: 1, background: "#f5f5f5", border: "1px solid #ddd", color: "#333", fontWeight: 600, padding: "10px 0", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13 }}
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>

            <p style={{ margin: "12px 0 0", fontSize: 11, color: "#888", textAlign: "center", lineHeight: 1.4 }}>
              Scan with any UPI app — GPay, PhonePe, Paytm, BHIM. Auto-confirms after payment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-sm w-full flex flex-col items-center justify-center">
          <div style={{ position: "relative", width: 48, height: 48, margin: "0 auto 12px" }}>
            <div style={{ position: "absolute", inset: 0, border: "4px solid #eee", borderRadius: "50%" }} />
            <div 
              style={{ 
                position: "absolute", 
                inset: 0, 
                border: "4px solid transparent", 
                borderTopColor: "#2874F0", 
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} 
            />
          </div>
          <p className="text-sm text-slate-500 font-bold">Securely loading payment options...</p>
        </div>
      </div>
    }>
      <PaymentPageContent params={params} />
    </Suspense>
  );
}
