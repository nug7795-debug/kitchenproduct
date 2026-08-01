'use client';

import { use, useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function PaytmIcon() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, background: '#002970', borderRadius: 10 }}>
      <span style={{ color: '#00baf2', fontWeight: 900, fontSize: 13, fontFamily: 'sans-serif', letterSpacing: -0.5 }}>pay</span>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: 13, fontFamily: 'sans-serif', letterSpacing: -0.5 }}>tm</span>
    </div>
  );
}

function PaymentPageContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parsing route params
  const { selling, mrp } = (() => {
    if (!resolvedParams.id) return { selling: 0, mrp: 0 };
    const t = String(resolvedParams.id).split(".");
    return {
      selling: Number(t[0]) || 0,
      mrp: Number(t[1]) || 0
    };
  })();

  const [user, setUser] = useState<any>({});
  const [cartData, setCartData] = useState<any>({});
  const [selectedMethod, setSelectedMethod] = useState(o.PHONEPE);
  const [expandedSection, setExpandedSection] = useState<'upi' | 'card' | 'emi' | null>('upi');
  
  const [txnid, setTxnid] = useState("");
  const [paytmIntent, setPaytmIntent] = useState("");
  const [phonepeIntent, setPhonepeIntent] = useState("");
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

  // Sync state with dynamic local storage on mount
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
      setCartData(JSON.parse(localStorage.getItem("data") || "{}"));
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
    const queryTxnId = searchParams.get('txnid');
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
              productinfo: cartData.name || "Order",
              firstname: user.firstname || "",
              email: user.email || "",
              phone: user.phone || "",
              txnid: queryTxnId,
              orderId: searchParams.get('orderId')
            })
          });
          const t = await res.json();
          if (t.success) {
            setPaytmIntent(t.paytmIntent);
            setPhonepeIntent(t.phonepeIntent);
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
            productinfo: cartData.name || "Order",
            firstname: user.firstname || user.username || user.name || "",
            email: user.email || "",
            phone: user.phone || user.mobile || ""
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
  }, [selling, user, cartData, isLoaded, errorMessage, searchParams]);

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
    const intent = app === "phonepe" ? phonepeIntent : paytmIntent;
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
  }, [phonepeIntent, paytmIntent, launchIntent, txnid]);

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



  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans pb-20">
      {/* Dynamic keyframe styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin-custom {
          animation: spin 1s linear infinite;
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-150%) skewX(-25deg); }
          50% { transform: translateX(250%) skewX(-25deg); }
          100% { transform: translateX(250%) skewX(-25deg); }
        }
        .shimmer-banner {
          position: relative;
          overflow: hidden;
        }
        .shimmer-banner::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 60px;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer-slide 2.5s infinite ease-in-out;
        }
      `}} />

      {/* Header */}
      <div className="container-fluid py-2 bg-white border-b border-[#eaeaf2] sticky top-0 z-40 select-none">
        <div className="flex items-center justify-between px-4 py-2 max-w-lg mx-auto">
          <div className="flex items-center">
            <button onClick={() => router.push("/")} className="mr-4 active:scale-95 transition-transform">
              <ArrowLeft className="h-6 w-6 text-black" />
            </button>
            <h1 className="text-lg font-black text-[#111111] tracking-tight">Payments</h1>
          </div>
          <div className="flex items-center gap-1 border border-slate-200 bg-slate-50 rounded-md px-2.5 py-1 text-[11px] font-black text-slate-700 uppercase tracking-tight shadow-3xs">
            <Lock className="h-3.5 w-3.5 text-slate-600" strokeWidth={2.5} />
            <span>100% Secure</span>
          </div>
        </div>
      </div>

      {/* Checkout Steps Stepper */}
      <div className="bg-white py-4 px-4 border-b border-[#eaeaf2]">
        <div className="flex items-start justify-between max-w-md mx-auto relative">
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

      {/* Countdown Offer Timer Banner styled like a green ticket - MOVED ABOVE 20% CASHBACK */}
      <div className="w-full bg-white py-2.5 border-b border-[#eaeaf2] select-none flex justify-center">
        <div className="relative bg-[#f0fff7] border-[1.5px] border-[#02be98] rounded-[8px] py-1.5 px-4 flex items-center justify-center gap-3 overflow-visible shadow-[0_2px_8px_rgba(2,190,152,0.15)] max-w-max">
          {/* Ticket Cutouts */}
          <div className="absolute -left-[6.5px] top-1/2 -translate-y-1/2 w-[12px] h-[20px] bg-white border-[1.5px] border-[#02be98] rounded-r-full border-l-0 z-10" />
          <div className="absolute -right-[6.5px] top-1/2 -translate-y-1/2 w-[12px] h-[20px] bg-white border-[1.5px] border-[#02be98] rounded-l-full border-r-0 z-10" />

          {/* Left: Gift Icon + Offer Ends In */}
          <div className="flex items-center gap-2 shrink-0">
            <GiftIcon className="w-[28px] h-[28px] shrink-0" />
            <span className="text-[14px] font-bold text-[#111111] whitespace-nowrap">Offer ends in</span>
          </div>

          {/* Right: Timer Countdown */}
          <div className="flex items-center gap-1 shrink-0 select-none">
            <span className="bg-[#ffece2] text-[#fb641b] text-[13.5px] font-extrabold px-2 py-0.5 rounded-[4px] min-w-[24px] text-center">
              {String(Math.floor(countdown / 60)).padStart(2, "0")}
            </span>
            <span className="text-[12px] font-bold text-slate-600">:</span>
            <span className="bg-[#ffece2] text-[#fb641b] text-[13.5px] font-extrabold px-2 py-0.5 rounded-[4px] min-w-[24px] text-center">
              {String(countdown % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* PhonePe Cashback Banner - Integrated flush below the Stepper to prevent empty space gaps */}
      {/* Flipkart Payment Offers Green Banner */}
      <div className="max-w-md mx-auto bg-[#f1faf3] border-b border-slate-150 py-3 px-5 flex items-center justify-between select-none shimmer-banner">
        <div className="flex flex-col">
          <span className="text-[#388e3c] text-sm font-black uppercase tracking-tight">20% Cashback</span>
          <span className="text-slate-700 text-[11px] font-bold mt-0.5">Claim now with payment offers</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 bg-white/75 px-2 py-1 rounded-md border border-slate-200/50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-3 w-7 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-3.5 w-6 object-contain" />
          <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-1 rounded-sm border border-slate-250">+4</span>
        </div>
      </div>

      {/* Selection Body */}
      <div className="max-w-md mx-auto mt-0">

        {/* Payment Methods - FULL BLEED edge-to-edge stacked layout */}
        <div className="space-y-0 mb-0 border-t border-slate-200">
          
          {/* 1. UPI Header Accordion Row */}
          <div
            onClick={() => setExpandedSection(expandedSection === 'upi' ? null : 'upi')}
            className={`w-full bg-white py-3.5 px-5 border-b border-slate-200 transition-all flex items-center justify-between cursor-pointer ${
              expandedSection === 'upi' ? 'bg-slate-50/50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="h-6 w-8 border border-slate-350 rounded flex items-center justify-center text-[10px] font-black text-slate-800 bg-slate-50 tracking-tighter shrink-0 mt-0.5 select-none">
                UPI
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#111111] font-sans leading-tight">UPI</span>
                <span className="text-slate-600 text-xs font-semibold mt-0.5">Pay by any UPI app</span>
                <span className="text-[#388e3c] text-[11px] font-bold mt-1">Get upto ₹80 cashback • Hurry, offer ends soon!</span>
              </div>
            </div>
            {expandedSection === 'upi' ? (
              <ChevronUp className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
            )}
          </div>

          {/* UPI Sub-Options Drawer */}
          {expandedSection === 'upi' && (
            <div className="bg-slate-50/30 border-b border-slate-200 transition-all">
              {/* PhonePe */}
              <div
                onClick={() => setSelectedMethod(o.PHONEPE)}
                className="w-full py-3.5 px-6 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selectedMethod === o.PHONEPE ? "border-[#2874F0]" : "border-slate-300"
                  }`}>
                    {selectedMethod === o.PHONEPE && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2874F0]" />
                    )}
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" 
                      alt="PhonePe" 
                      className="h-7 w-7 object-contain" 
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">PhonePe</span>
                </div>
              </div>

              {/* Paytm */}
              <div
                onClick={() => setSelectedMethod(o.PAYTM)}
                className="w-full py-3.5 px-6 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selectedMethod === o.PAYTM ? "border-[#2874F0]" : "border-slate-300"
                  }`}>
                    {selectedMethod === o.PAYTM && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2874F0]" />
                    )}
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" 
                      alt="Paytm" 
                      className="h-6 w-6 object-contain" 
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Paytm</span>
                </div>
              </div>

              {/* Scan To Pay */}
              <div
                onClick={() => setSelectedMethod(o.QR)}
                className="w-full py-3.5 px-6 flex items-center justify-between cursor-pointer hover:bg-slate-100/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selectedMethod === o.QR ? "border-[#2874F0]" : "border-slate-300"
                  }`}>
                    {selectedMethod === o.QR && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2874F0]" />
                    )}
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center shrink-0">
                    <ScanToPayIcon size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Scan To Pay / UPI QR</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Credit / Debit / ATM Card Accordion Row */}
          <div
            className="w-full bg-white py-3.5 px-5 border-b border-slate-200 transition-all flex items-center justify-between select-none"
          >
            <div className="flex items-start gap-4">
              <CreditCard className="h-5 w-8 text-slate-700 shrink-0 mt-0.5" strokeWidth={1.8} />
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#111111] font-sans leading-tight">Credit / Debit / ATM Card</span>
                <span className="text-slate-600 text-xs font-semibold mt-0.5">Add and secure cards as per RBI guidelines</span>
                <span className="text-[#388e3c] text-[11px] font-bold mt-1">Get upto 20% cashback • Hurry, offer ends soon!</span>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
          </div>

          {/* Card Details Entry Drawer */}
          {expandedSection === 'card' && (
            <div className="bg-slate-50/30 border-b border-slate-200 p-5 space-y-4">
              <div className="space-y-3">
                <input
                  type="tel"
                  maxLength={19}
                  placeholder="Enter Card Number"
                  className="w-full bg-white border border-slate-250 rounded-xl py-3.5 px-4 text-xs font-bold text-slate-800 outline-none focus:border-[#2874f0] transition-all"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="tel"
                    maxLength={5}
                    placeholder="MM/YY"
                    className="w-full bg-white border border-slate-250 rounded-xl py-3.5 px-4 text-xs font-bold text-slate-800 outline-none focus:border-[#2874f0] transition-all text-center"
                  />
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="CVV"
                    className="w-full bg-white border border-slate-250 rounded-xl py-3.5 px-4 text-xs font-bold text-slate-800 outline-none focus:border-[#2874f0] transition-all text-center"
                  />
                </div>
              </div>
              
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  defaultChecked
                  id="secure-card-chk"
                  className="mt-1 cursor-pointer accent-[#2874F0]"
                />
                <label htmlFor="secure-card-chk" className="text-[11px] text-slate-700 font-bold leading-normal cursor-pointer select-none">
                  Secure this card as per RBI guidelines for faster future checkout.
                </label>
              </div>

              <button
                type="button"
                onClick={() => alert("Card payments are not enabled for this test order. Please select UPI or Scan To Pay.")}
                className="w-full bg-[#ff9f00] hover:bg-[#ff9f00]/90 text-white font-black text-xs uppercase py-3.5 rounded-xl shadow-2xs active:scale-[0.98] transition-all"
              >
                Pay ₹ {selling}
              </button>
            </div>
          )}

          {/* 3. Have a Flpkart Gift Card? Row */}
          {/* 3. Have a Flpkart Gift Card? Row */}
          <div className="w-full bg-white py-4.5 px-5 border-b border-slate-200 flex items-center justify-between select-none cursor-pointer">
            <div className="flex items-center gap-4">
              <GiftCardIcon className="h-5 w-8 text-[#111111] shrink-0" />
              <span className="text-[15px] font-bold text-[#111111] font-sans">Have a Flpkart Gift Card?</span>
            </div>
            <span className="text-[14px] font-extrabold text-[#2874f0] select-none hover:text-[#2874f0]/80">Add</span>
          </div>

          {/* 4. EMI (Unavailable) Row */}
          <div className="w-full bg-white py-4.5 px-5 border-b border-slate-200 flex items-center justify-between select-none">
            <div className="flex items-center gap-4">
              <EmiIcon className="h-5 w-8 text-slate-400 shrink-0" />
              <span className="text-[15px] font-bold text-slate-400 font-sans">EMI</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 select-none">
              <span>Unavailable</span>
              <HelpCircle className="h-4 w-4 text-slate-400" strokeWidth={2} />
            </div>
          </div>

          {/* 5. Cash on Delivery (Unavailable) Row */}
          <div className="w-full bg-white py-4.5 px-5 border-b border-slate-200 flex items-center justify-between select-none">
            <div className="flex items-center gap-4">
              <Banknote className="h-5 w-8 text-slate-400 shrink-0" strokeWidth={1.8} />
              <span className="text-[15px] font-bold text-slate-400 font-sans">Cash on Delivery</span>
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

      {/* Sticky Yellow/Orange Flipkart Continue Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#eaeaf2] shadow-lg py-3 px-4 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            {mrp > selling && (
              <span className="line-through text-slate-600 text-xs font-semibold">₹ {mrp}</span>
            )}
            <span className="text-[#212121] text-xl font-black">₹ {selling}</span>
          </div>
          <button 
            onClick={() => {
              if (isLoaded) {
                if (selectedMethod === o.QR) {
                  setShowQrModal(true);
                  if (txnid) {
                    fetch('/api/payments/open-upi', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ txnid, app: 'qr' })
                    }).catch(err => console.error('Failed to register upi QR open:', err));
                  }
                } else if (selectedMethod === o.PHONEPE) {
                  handleAppPay('phonepe');
                } else if (selectedMethod === o.PAYTM) {
                  handleAppPay('paytm');
                }
              }
            }}
            disabled={!isLoaded}
            className={`px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-md ${
              isLoaded 
                ? "bg-gradient-to-r from-[#ffc200] to-[#ffa200] text-slate-900 active:scale-[0.98]" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isLoaded ? "CONTINUE" : "LOADING..."}
          </button>
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
