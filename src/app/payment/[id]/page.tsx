'use client';

import { use, useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Share2, Loader2 } from 'lucide-react';

const o = {
  PHONEPE: 1,
  PAYTM: 2,
  QR: 3
};

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
  
  const [txnid, setTxnid] = useState("");
  const [paytmIntent, setPaytmIntent] = useState("");
  const [phonepeIntent, setPhonepeIntent] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [upiUrl, setUpiUrl] = useState("");
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeVerificationApp, setActiveVerificationApp] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAlternativeMethod, setShowAlternativeMethod] = useState(false);
  
  const [countdown, setCountdown] = useState(300);
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

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
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
    if (!activeVerificationApp && !showQrModal) return;
    try {
      window.history.pushState({ paymentGuard: true }, "");
    } catch (e) {}

    const handlePopState = () => {
      try {
        window.history.pushState({ paymentGuard: true }, "");
      } catch (e) {}
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeVerificationApp, showQrModal]);

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
      setTimeout(() => launchIntent(intent), 50);
    }
  }, [phonepeIntent, paytmIntent, launchIntent]);

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
    <div className="min-h-screen bg-[#f1f3f6] font-sans pb-28">
      {/* Dynamic keyframe styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin-custom {
          animation: spin 1s linear infinite;
        }
      `}} />

      {/* Header */}
      <div className="container-fluid py-2 bg-white border-b border-[#eaeaf2] sticky top-0 z-40">
        <div className="flex items-center px-4 py-2 max-w-lg mx-auto">
          <button onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="h-6 w-6 text-black" />
          </button>
          <h1 className="text-lg font-bold text-black">Payments</h1>
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

      {/* Selection Body */}
      <div className="max-w-md mx-auto px-3 mt-3">
        {/* PhonePe 20% Cashback Banner */}
        <div className="relative w-full bg-[#5f259f] rounded-xl flex items-center justify-between min-h-[88px] overflow-hidden border border-slate-100 mb-3 select-none shadow-sm">
          {/* Left white section with S-curve styling */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-white flex items-center pl-4 pr-12 z-10" 
            style={{ 
              width: '45%', 
              clipPath: 'path("M0 0 L110 0 C 145 25, 75 63, 110 88 L0 88 Z")' 
            }}
          >
            <div className="flex items-center gap-1.5">
              <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="32" cy="32" r="32" fill="#5F259F" />
                <path d="M45.7 26.34c0-1.18-.97-2.16-2.16-2.16h-3.99l-9.13-10.46c-.83-1-2.16-1.33-3.49-1l-3.16 1c-.5.17-.66.83-.33 1.16l9.96 9.46H18.42c-.5 0-.83.33-.83.83v1.66c0 1.18.97 2.16 2.16 2.16h2.32v7.97c0 5.97 3.16 9.46 8.46 9.46 1.66 0 2.99-.17 4.65-.83v5.31c0 1.5 1.16 2.66 2.66 2.66h2.32c.5 0 1-.5 1-1v-23.74h3.82c.5 0 .83-.33.83-.83zM35.07 39.62c-1 .5-2.32.66-3.32.66-2.66 0-3.99-1.33-3.99-4.31v-7.97h7.31v11.62z" fill="#fff" />
              </svg>
              <span className="text-[17px] font-black text-[#5f259f] tracking-tight font-sans">PhonePe</span>
            </div>
          </div>
          {/* Right purple section with cashback promotion details */}
          <div className="w-full flex justify-end items-center py-2.5 pl-[42%] pr-3.5 z-0 text-right">
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-black text-[#ffc200] tracking-wide uppercase">
                GET <span className="text-white text-base">20% CASHBACK</span>
              </span>
              <span className="text-[11px] font-extrabold text-white leading-tight mt-0.5 font-sans">
                when you pay with PhonePe UPI
              </span>
              <span className="text-[7px] text-white/50 mt-1 font-sans">*Condition Apply</span>
            </div>
          </div>
        </div>

        {/* Countdown Offer Timer Banner */}
        <div className="bg-[#fff9f4] border border-[#fbeee6] rounded-xl px-4 py-3 mb-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#fb641b]/10 flex items-center justify-center text-[#fb641b]">
            <span className="font-extrabold text-lg">⏳</span>
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#fb641b]">
              Offer ends in <span className="font-mono text-base">{formatTimerValue(countdown)}</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">Complete payment immediately to lock special discounted price!</p>
          </div>
        </div>

        {/* Payment Methods Wrapper Box */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 mb-3">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide border-b pb-2 mb-3">
            Select Payment Method
          </h2>

          {/* PhonePe Card */}
          <div 
            onClick={() => setSelectedMethod(o.PHONEPE)}
            style={h(selectedMethod === o.PHONEPE)}
          >
            <label style={pStyle}>
              <PhonePeIcon size={42} />
              <span style={fStyle}>Pay with PhonePe</span>
            </label>
          </div>

          {/* Paytm Card */}
          <div 
            onClick={() => setSelectedMethod(o.PAYTM)}
            style={h(selectedMethod === o.PAYTM)}
          >
            <label style={pStyle}>
              <PaytmIcon />
              <span style={fStyle} className="ml-1">Pay with Paytm</span>
            </label>
          </div>

          {/* Scan QR Card */}
          <div 
            onClick={() => setSelectedMethod(o.QR)}
            style={h(selectedMethod === o.QR)}
          >
            <label style={pStyle}>
              <QrIcon size={42} />
              <span style={fStyle}>Scan QR</span>
            </label>
          </div>
        </div>

        {/* Pricing Summary Breakdown Box */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-150 p-4 mb-4">
          <h3 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Price Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
              <span>Price (1 item)</span>
              <span className="line-through text-slate-400">₹ {mrp || selling}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
              <span>Delivery Charges</span>
              <span className="text-success-650 text-green-600 font-bold">FREE</span>
            </div>
            <div className="flex items-center justify-between text-base font-black text-slate-800 pt-3 border-t border-dashed">
              <span>Amount Payable</span>
              <span>₹ {selling}</span>
            </div>
          </div>
        </div>

        {/* Trust Badges and Secure Payment logos */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 mb-6">
          {/* 4 Trust Badges Row */}
          <div className="flex items-start justify-between text-center mb-4">
            <div className="flex flex-col items-center flex-1 min-w-[65px]">
              <ReturnIcon />
              <span className="text-[9.5px] font-black text-slate-700 leading-tight mt-1.5 font-sans">7 Day Return</span>
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200 self-center shrink-0" />

            <div className="flex flex-col items-center flex-1 min-w-[65px]">
              <RefundIcon />
              <span className="text-[9.5px] font-black text-slate-700 leading-tight mt-1.5 font-sans">7 Day Refunds</span>
            </div>

            <div className="h-10 w-[1px] bg-slate-200 self-center shrink-0" />

            <div className="flex flex-col items-center flex-1 min-w-[65px]">
              <GenuineIcon />
              <span className="text-[9.5px] font-black text-slate-700 leading-tight mt-1.5 font-sans">Genuine Products</span>
            </div>

            <div className="h-10 w-[1px] bg-slate-200 self-center shrink-0" />

            <div className="flex flex-col items-center flex-1 min-w-[65px]">
              <TruckIcon />
              <span className="text-[9.5px] font-black text-slate-700 leading-tight mt-1.5 font-sans">Delivery in 2 Days</span>
            </div>
          </div>

          {/* Double-headed arrow line */}
          <div className="relative flex items-center justify-center my-4 px-1">
            <div className="w-full h-[1.5px] bg-slate-300 relative">
              {/* Left arrow head */}
              <div className="absolute left-0 top-[-3.5px] w-[8px] h-[8px] border-l-2 border-b-2 border-slate-400 rotate-[45deg]" />
              {/* Right arrow head */}
              <div className="absolute right-0 top-[-3.5px] w-[8px] h-[8px] border-r-2 border-t-2 border-slate-400 rotate-[45deg]" />
            </div>
          </div>

          {/* Secure Payment By text */}
          <div className="text-center text-[11px] font-black text-slate-700 tracking-wide uppercase mb-3.5 font-sans">
            Secure Payment By
          </div>

          {/* Secure Logos Row */}
          <div className="flex items-center justify-center gap-5 select-none">
            <PhonePeBrandLogo size={18} />
            <span className="text-slate-300 font-light">|</span>
            <PaytmBrandLogo />
            <span className="text-slate-300 font-light">|</span>
            <UpiBrandLogo />
          </div>
        </div>
      </div>

      {/* Sticky Yellow/Orange Flipkart Continue Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#eaeaf2] shadow-lg py-3 px-4 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            {mrp > selling && (
              <span className="line-through text-slate-400 text-xs font-semibold">₹ {mrp}</span>
            )}
            <span className="text-[#212121] text-xl font-black">₹ {selling}</span>
          </div>
          <button 
            onClick={() => {
              if (isLoaded) {
                if (selectedMethod === o.QR) {
                  setShowQrModal(true);
                } else {
                  handleAppPay(selectedMethod === o.PHONEPE ? "phonepe" : "paytm");
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

      {/* Polling / App Intent Verification Modal Overlay */}
      {activeVerificationApp && (
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
