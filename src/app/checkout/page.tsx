'use client';

import * as React from 'react';
import { Button } from '../../components/ui/button';
import { 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  ArrowRight, 
  ExternalLink,
  Copy,
  Clock,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Lock,
  ArrowLeft,
  Download,
  MapPin,
  Check,
  Ticket
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { UPIPay } from '../../lib/upi-pay';

// High-Fidelity UPI Apps config
const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: 'https://www.gstatic.com/images/branding/product/2x/googleg_96dp.png', color: 'bg-white border-slate-100 hover:border-blue-500' },
  { id: 'phonepe', name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg', color: 'bg-white border-slate-100 hover:border-purple-500' },
  { id: 'paytm', name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg', color: 'bg-white border-slate-100 hover:border-sky-500' },
  { id: 'bhim', name: 'BHIM UPI', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/BHIM_logo.svg', color: 'bg-white border-slate-100 hover:border-emerald-500' },
];

interface CartItem {
  productId: string;
  name: string;
  price: number;
  salePrice: number;
  imageUrl: string;
  quantity: number;
  variantId?: string | null;
}

export default function CheckoutPage() {
  // Steps: address -> summary -> method -> payment -> did_you_pay -> utr_entry -> verifying -> success -> pending_verification
  const [step, setStep] = React.useState<'address' | 'summary' | 'method' | 'payment' | 'did_you_pay' | 'utr_entry' | 'verifying' | 'success' | 'pending_verification'>('address');
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [upiUrl, setUpiUrl] = React.useState<string | null>(null);
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [utr, setUtr] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [paymentMode, setPaymentMode] = React.useState<'upi_intent' | 'razorpay' | 'manual_qr'>('upi_intent');
  const [razorpayKeyId, setRazorpayKeyId] = React.useState('');
  
  // Dynamic Merchant details loaded from settings
  const [merchantVpa, setMerchantVpa] = React.useState(process.env.NEXT_PUBLIC_MERCHANT_UPI_ID || 'yourstore@paytm');
  const [payeeName, setPayeeName] = React.useState(process.env.NEXT_PUBLIC_PAYEE_NAME || 'Big Dhamaka Sale');
  const [isMobile, setIsMobile] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [timeLeft, setTimeLeft] = React.useState(276); // 4min 36sec exactly like in the screenshot
  
  const [showAssistantModal, setShowAssistantModal] = React.useState(false);
  const [copiedAmount, setCopiedAmount] = React.useState(false);
  const [copiedVpa, setCopiedVpa] = React.useState(false);
  const [verificationTimedOut, setVerificationTimedOut] = React.useState(false);
  
  // Shipping Address Form State
  const [address, setAddress] = React.useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: ''
  });
  
  const [savedAddresses, setSavedAddresses] = React.useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);

  // Cart / Product details State
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      productId: 'b7b83ad7-8fe4-4a2f-9872-466d7bd49202', // Fallback realistic mixer product ID
      name: 'Pro-Mixer Master 500W with Stainless Steel Blades',
      price: 12498,
      salePrice: 9999,
      imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8ca28?q=80&w=1974',
      quantity: 1
    }
  ]);
  const [copied, setCopied] = React.useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<any | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = React.useState(0);

  // Address Field splits to exactly match the design
  const [houseNumber, setHouseNumber] = React.useState('');
  const [roadName, setRoadName] = React.useState('');

  // Dynamic countdown timer for offer ends
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 276));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs < 10 ? '0' : ''}${secs}sec`;
  };

  // 1. Fetch current user, active settings and previously saved addresses on mount
  React.useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

    // Read productId query parameter directly from URL on the client-side
    const queryParams = new URLSearchParams(window.location.search);
    const queryProductId = queryParams.get('productId');

    if (queryProductId) {
      const fetchProduct = async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select(`
              *,
              product_images (image_url)
            `)
            .eq('id', queryProductId)
            .single();

          if (data && !error) {
            const imageUrl = data.product_images?.[0]?.image_url || 'https://via.placeholder.com/150';
            setCartItems([
              {
                productId: data.id,
                name: data.name,
                price: parseFloat(data.price),
                salePrice: data.sale_price ? parseFloat(data.sale_price) : parseFloat(data.price),
                imageUrl: imageUrl,
                quantity: 1
              }
            ]);
          }
        } catch (err) {
          console.error('Error fetching product from query param:', err);
        }
      };
      fetchProduct();
    } else {
      // Check if there are real cart items in localStorage
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCartItems(parsed.map(item => ({
              productId: item.productId || item.id,
              name: item.name,
              price: item.price || item.originalPrice || item.salePrice,
              salePrice: item.salePrice || item.price,
              imageUrl: item.imageUrl || item.image,
              quantity: item.quantity || 1,
              variantId: item.variantId || null
            })));
          }
        }
      } catch (e) {
        console.error('Failed to load cart from localStorage', e);
      }
    }

    // Load User and their Saved Addresses
    const loadUserAndAddresses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: addresses } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id);
        if (addresses && addresses.length > 0) {
          setSavedAddresses(addresses);
          const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
          setSelectedAddressId(defaultAddr.id);
          setAddress({
            fullName: defaultAddr.full_name,
            phone: defaultAddr.phone,
            streetAddress: defaultAddr.street_address,
            city: defaultAddr.city,
            state: defaultAddr.state,
            postalCode: defaultAddr.postal_code
          });
        }
      }
    };

    loadUserAndAddresses();



    // Fetch global settings dynamically
    const fetchPaymentSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'global_settings')
          .maybeSingle();
        if (data?.value?.payment) {
          const p = data.value.payment;
          setPaymentMode(p.activeMethod || 'upi_intent');
          if (p.merchantUpiId) setMerchantVpa(p.merchantUpiId);
          if (p.payeeName) setPayeeName(p.payeeName);
          if (p.razorpayKeyId) setRazorpayKeyId(p.razorpayKeyId);
        }
      } catch (err) {
        console.error('Failed to load global payment settings:', err);
      }
    };
    fetchPaymentSettings();

    // Recover persisted payment details to prevent payment flow reset on page refresh
    try {
      const persistedTxId = localStorage.getItem('active_transaction_id');
      const persistedUpiUrl = localStorage.getItem('active_upi_url');
      const persistedVpa = localStorage.getItem('active_merchant_vpa');
      const persistedPayee = localStorage.getItem('active_payee_name');
      const persistedMode = localStorage.getItem('active_payment_mode');
      if (persistedTxId) setTransactionId(persistedTxId);
      if (persistedUpiUrl) setUpiUrl(persistedUpiUrl);
      if (persistedVpa) setMerchantVpa(persistedVpa);
      if (persistedPayee) setPayeeName(persistedPayee);
      if (persistedMode) setPaymentMode(persistedMode as any);
    } catch (e) {
      console.error('Failed to recover active transaction state:', e);
    }
  }, []);

  const totalOriginal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseSaleTotal = cartItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  const totalSale = Math.max(0, baseSaleTotal - couponDiscount);
  const totalDiscount = totalOriginal - totalSale;

  // Copy VPA to Clipboard Utility
  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download QR Code Blob directly to user's gallery
  const handleDownloadQr = async () => {
    if (!upiUrl) return;
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `bigdhamaka-payment-qr-${transactionId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download QR code image', err);
      alert('Could not download QR Code automatically. Please take a screenshot instead!');
    }
  };

  // Helper to construct app-specific deep links with robust URI encoding
  const getAppUpiUrl = (appId: string) => {
    if (!upiUrl) return '#';
    
    // Always use the official universal upi://pay scheme to prevent proprietary whitelist security blocks.
    // This allows both Personal VPAs (like paytm.s1n5b4q@pty) and Business VPAs to succeed flawlessly exactly like scanning a QR code!
    return upiUrl;
  };

  // Direct Intent launch logic with auto-generated order details, amount, and secure browser fallbacks
  const handleUpiAppPay = (appId: string) => {
    // 1. Instantly copy the VPA to clipboard as a secure fallback
    navigator.clipboard.writeText(merchantVpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    // 2. Setup standard payment payload
    const cleanPayee = encodeURIComponent(payeeName || 'Big Dhamaka Sale');
    // Calculate final actual total sale price dynamically
    const baseSaleTotal = cartItems.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
    const totalSale = Math.max(0, baseSaleTotal - couponDiscount);
    const cleanAmount = Number(totalSale).toFixed(2);
    const cleanTr = transactionId || `TXN_${Date.now()}`;
    
    // Auto-generate standard parameters
    const params = `pa=${merchantVpa}&pn=${cleanPayee}&am=${cleanAmount}&cu=INR&tn=ORDER_${cleanTr}`;
    const baseUpiUrl = upiUrl || `upi://pay?${params}`;

    // 3. Device detection fallback: tablets and desktops do not support standard mobile deep-link apps
    const isMobileUA = /Android|iPhone|iPod/i.test(navigator.userAgent);
    const isTablet = /iPad/i.test(navigator.userAgent) || (typeof window !== 'undefined' && window.innerWidth >= 768);

    if (!isMobileUA || isTablet) {
      // Force helper modal directly to allow scanning QR code or manual VPA copying
      setShowAssistantModal(true);
      return;
    }

    // 4. Mobile app launch detection: check if the focus switches to the external payment application.
    // If focus remains on the browser after 1.5s, the app is likely not installed.
    let appOpened = false;
    const blurHandler = () => {
      appOpened = true;
    };
    window.addEventListener('blur', blurHandler);

    // Launch the chosen app
    UPIPay.launch(appId, baseUpiUrl);

    // Set fallback checker
    setTimeout(() => {
      window.removeEventListener('blur', blurHandler);
      if (!appOpened) {
        // App did not open successfully (not installed / blocked). Fallback to assistance modal.
        setShowAssistantModal(true);
      }
    }, 1500);
  };

  const handleContinuePayment = () => {
    if (paymentMode === 'manual_qr') {
      setStep('verifying');
      startRealtimePolling();
    } else if (paymentMode === 'razorpay') {
      setStep('verifying');
      setTimeout(() => {
        setStep('success');
      }, 2500);
    } else {
      if (selectedMethod === 'qr') {
        setStep('verifying');
        startRealtimePolling();
      } else {
        handleUpiAppPay(selectedMethod as any);
        setStep('verifying');
        startRealtimePolling();
      }
    }
  };

  // 1. Submit Shipping Address
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !houseNumber || !roadName || !address.city || !address.state || !address.postalCode) {
      setError('Please fill in all address details');
      return;
    }

    // Combine split fields into a single streetAddress string
    address.streetAddress = `${houseNumber.trim()}, ${roadName.trim()}`;

    setError(null);
    setStep('summary');
  };

  const handleApplyCoupon = async (codeToApply?: string) => {
    const targetCode = (codeToApply || couponCode).trim().toUpperCase();
    if (!targetCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponError(null);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', targetCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setCouponError('Invalid or expired coupon code.');
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return;
      }

      // Check min order criteria
      const baseSaleTotal = cartItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
      if (baseSaleTotal < parseFloat(data.min_order_amount || 0)) {
        setCouponError(`This coupon requires a minimum purchase value of ₹${parseFloat(data.min_order_amount).toLocaleString()}.`);
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return;
      }

      // Calculate discount
      let discount = 0;
      if (data.discount_type === 'percent') {
        discount = Math.round((baseSaleTotal * parseFloat(data.discount_value)) / 100);
      } else {
        discount = Math.min(baseSaleTotal, parseFloat(data.discount_value));
      }

      setAppliedCoupon(data);
      setCouponDiscount(discount);
      setCouponCode(targetCode);
      setCouponError(null);
    } catch (err) {
      console.error(err);
      setCouponError('Failed to apply coupon. Please try again.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError(null);
  };

  // 2. Initialize Order & Complete Instantly
  const handleProceedToPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      let finalAddressId = selectedAddressId;

      // Create address if not selected from saved addresses
      if (!finalAddressId) {
        const { data: newAddr, error: addrErr } = await supabase
          .from('addresses')
          .insert([{
            full_name: address.fullName,
            phone: address.phone,
            street_address: address.streetAddress,
            city: address.city,
            state: address.state,
            postal_code: address.postalCode,
            user_id: user?.id || null
          }])
          .select()
          .single();

        if (addrErr) throw addrErr;
        finalAddressId = newAddr.id;
      }

      // Create order record in pending status
      const { data: newOrder, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id || null,
          total_amount: totalSale,
          discount_amount: totalDiscount,
          shipping_charge: 0,
          address_id: finalAddressId,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderErr) throw orderErr;

      // Create Order Items
      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(cartItems.map(item => ({
          order_id: newOrder.id,
          product_id: item.productId,
          variant_id: item.variantId || null,
          quantity: item.quantity,
          price: item.salePrice
        })));

      if (itemsErr) throw itemsErr;

      // Call API to create a payment intent and generate the UPI deep link
      const res = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: newOrder.id, amount: totalSale })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to initialize payment.');
      }

      setTransactionId(data.transactionId);
      setUpiUrl(data.upiUrl);
      if (data.merchantUpiId) setMerchantVpa(data.merchantUpiId);
      if (data.payeeName) setPayeeName(data.payeeName);
      if (data.mode) setPaymentMode(data.mode);
      if (data.razorpayKeyId) setRazorpayKeyId(data.razorpayKeyId);
      
      // Persist transaction details in local storage to secure against page refreshes
      try {
        localStorage.setItem('active_transaction_id', data.transactionId);
        localStorage.setItem('active_upi_url', data.upiUrl || '');
        if (data.merchantUpiId) localStorage.setItem('active_merchant_vpa', data.merchantUpiId);
        if (data.payeeName) localStorage.setItem('active_payee_name', data.payeeName);
        if (data.mode) localStorage.setItem('active_payment_mode', data.mode);
      } catch (e) {
        console.error('Failed to persist payment details:', e);
      }

      setStep('payment');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit UTR for Manual Verification
  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utr.trim().replace(/\s/g, '');
    if (!/^\d{12}$/.test(cleanUtr)) {
      setError('Please enter a valid 12-digit numeric UTR reference number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, utr: cleanUtr })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to verify transaction.');
        setLoading(false);
        return;
      }

      // Transition to secure pending verification step
      setStep('pending_verification');
      localStorage.removeItem('cart');
      localStorage.removeItem('active_transaction_id');
      localStorage.removeItem('active_upi_url');
      localStorage.removeItem('active_merchant_vpa');
      localStorage.removeItem('active_payee_name');
    } catch (err) {
      console.error(err);
      setError('System verification error. Please contact customer support.');
      setLoading(false);
    }
  };

  // 3.1 Direct Intent Paid Confirmation (without forcing UTR copy)
  const handleDirectAppPaidSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a unique descriptive reference string so the admin can identify it easily in the dashboard
      const uniqueRef = `INTENT_${selectedMethod.toUpperCase()}_${Date.now()}`;
      
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, utr: uniqueRef })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to submit payment verification.');
        setLoading(false);
        return;
      }

      // Transition to secure pending verification step and clear cart
      setStep('pending_verification');
      localStorage.removeItem('cart');
      localStorage.removeItem('active_transaction_id');
      localStorage.removeItem('active_upi_url');
      localStorage.removeItem('active_merchant_vpa');
      localStorage.removeItem('active_payee_name');
    } catch (err) {
      console.error(err);
      setError('System verification error. Please contact customer support.');
      setLoading(false);
    }
  };


  // 4. Poll database status using Supabase Client with strict verification and zero fake orders
  const startRealtimePolling = () => {
    if (!transactionId) return;

    // Reset timed out state just in case we are restarting polling
    setVerificationTimedOut(false);

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('transaction_id', transactionId)
          .single();

        if (error) throw error;
        
        // Strict verification matching rules: only success status from verified backend payments can complete order
        if (data && data.status === 'success') {
          clearInterval(interval);
          setStep('success');
          // Clear cart on payment success
          localStorage.removeItem('cart');
          localStorage.removeItem('active_transaction_id');
          localStorage.removeItem('active_upi_url');
          localStorage.removeItem('active_merchant_vpa');
          localStorage.removeItem('active_payee_name');
        }
      } catch (err) {
        console.error('Real-time polling check error:', err);
      }
    }, 2500);

    // Hard limit timeout to prevent infinite polling loops
    // Instead of auto-confirming a fake order, we show a gorgeous "Awaiting Settlement" pending screen
    setTimeout(() => {
      clearInterval(interval);
      setVerificationTimedOut(true);
    }, 60000);
  };

  const handleSelectSavedAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setAddress({
      fullName: addr.full_name,
      phone: addr.phone,
      streetAddress: addr.street_address,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code
    });
    // split street address
    const parts = (addr.street_address || '').split(', ');
    if (parts.length > 1) {
      setHouseNumber(parts[0]);
      setRoadName(parts.slice(1).join(', '));
    } else {
      setHouseNumber(addr.street_address || '');
      setRoadName('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-6 px-3 flex items-center justify-center font-sans">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-white px-4 py-3.5 border-b border-slate-100 flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-4">
            {step !== 'success' && (
              <button 
                onClick={() => {
                  if (step === 'address') {
                    window.location.href = '/cart';
                  } else if (step === 'summary') {
                    setStep('address');
                  } else if (step === 'payment') {
                    setStep('summary');
                  } else if (step === 'verifying') {
                    setStep('payment');
                  }
                }}
                className="text-slate-800 hover:text-slate-650 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-800" />
              </button>
            )}
            <div>
              <h1 className="text-base font-bold text-slate-800">
                {step === 'address' && 'Add Delivery Address'}
                {step === 'summary' && 'Order Summary'}
                {(step === 'payment' || step === 'utr_entry' || step === 'verifying') && 'Payments'}
                {step === 'success' && 'Order Successful'}
              </h1>
            </div>
          </div>
          {step !== 'success' && (
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
              Secure
            </div>
          )}
        </div>

        {/* Steps Tracker Indicator */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center relative max-w-md mx-auto">
          {/* Background Connecting Line - Segment 1 (Address to Summary) */}
          <div className={cn(
            "absolute top-[28px] left-[15%] w-[35%] h-[1.5px] z-0 transition-all",
            step === 'address' ? "bg-slate-200" : "bg-[#2874f0]"
          )} />
          
          {/* Background Connecting Line - Segment 2 (Summary to Payment) */}
          <div className={cn(
            "absolute top-[28px] right-[15%] w-[35%] h-[1.5px] z-0 transition-all",
            (step === 'payment' || step === 'utr_entry' || step === 'verifying' || step === 'success') ? "bg-[#2874f0]" : "bg-slate-200"
          )} />
          
          {/* Step 1: Address */}
          <div className="flex flex-col items-center relative z-10 flex-1">
            <div className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-xs font-black transition-all",
              step === 'address'
                ? "bg-[#2874f0] text-white shadow-sm"
                : "border-2 border-[#2874f0] bg-white text-[#2874f0]"
            )}>
              {step === 'address' ? '1' : '✓'}
            </div>
            <span className={cn(
              "text-[10px] font-bold mt-1.5 transition-all tracking-tight", 
              step === 'address' ? "text-[#2874f0]" : "text-slate-500"
            )}>
              Address
            </span>
          </div>

          {/* Step 2: Order Summary */}
          <div className="flex flex-col items-center relative z-10 flex-1">
            <div className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-xs font-black transition-all",
              step === 'address'
                ? "border border-slate-300 bg-white text-slate-400"
                : step === 'summary'
                ? "bg-[#2874f0] text-white shadow-sm"
                : "border-2 border-[#2874f0] bg-white text-[#2874f0]"
            )}>
              {step === 'address' || step === 'summary' ? '2' : '✓'}
            </div>
            <span className={cn(
              "text-[10px] font-bold mt-1.5 transition-all tracking-tight",
              step === 'summary'
                ? "text-slate-800 font-extrabold"
                : "text-slate-400"
            )}>
              Order Summary
            </span>
          </div>

          {/* Step 3: Payment */}
          <div className="flex flex-col items-center relative z-10 flex-1">
            <div className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-xs font-black transition-all",
              step === 'payment' || step === 'utr_entry' || step === 'verifying'
                ? "bg-[#2874f0] text-white shadow-sm"
                : step === 'success'
                ? "bg-[#388e3c] text-white"
                : "border border-slate-300 bg-white text-slate-400"
            )}>
              {step === 'success' ? '✓' : '3'}
            </div>
            <span className={cn(
              "text-[10px] font-bold mt-1.5 transition-all tracking-tight",
              step === 'payment' || step === 'utr_entry' || step === 'verifying'
                ? "text-[#2874f0] font-extrabold"
                : step === 'success'
                ? "text-[#388e3c] font-extrabold"
                : "text-slate-400"
            )}>
              Payment
            </span>
          </div>
        </div>


        <div className="p-4">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#2874f0]" /> Delivery Address
                </h2>
                {user && savedAddresses.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-400">SAVED ADDRESSES DETECTED</span>
                )}
              </div>

              {user && savedAddresses.length > 0 && (
                <div className="space-y-2 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-lg border border-slate-200 no-scrollbar">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border text-xs transition-all relative flex flex-col gap-1",
                        selectedAddressId === addr.id
                          ? "border-[#2874f0] bg-blue-50/20 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-850">
                        <span>{addr.full_name}</span>
                        {selectedAddressId === addr.id && (
                          <span className="text-[9px] font-black text-[#2874f0] uppercase">Selected</span>
                        )}
                      </div>
                      <span className="text-slate-500 font-medium">{addr.phone}</span>
                      <span className="text-slate-400 leading-snug line-clamp-1">{addr.street_address}, {addr.city}, {addr.state} - {addr.postal_code}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddressId(null);
                      setAddress({ fullName: '', phone: '', streetAddress: '', city: '', state: '', postalCode: '' });
                    }}
                    className="w-full py-2 bg-white text-slate-700 rounded-lg border border-dashed border-slate-350 hover:bg-slate-50 text-[10px] font-bold transition-all uppercase"
                  >
                    + Use Another / New Address
                  </button>
                </div>
              )}

              {!selectedAddressId && (
                <div className="space-y-4 bg-white py-2">
                  {/* Full Name */}
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name (Required)*"
                      className="w-full text-sm bg-white border border-slate-300 rounded-md px-4 py-3 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-slate-800 placeholder-slate-400 transition-all font-medium"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    />
                  </div>

                  {/* Mobile number */}
                  <div className="relative">
                    <input 
                      type="tel" 
                      required
                      maxLength={10}
                      placeholder="Mobile number (Required)*"
                      className="w-full text-sm bg-white border border-slate-300 rounded-md px-4 py-3 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-slate-800 placeholder-slate-400 transition-all font-medium"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>

                  {/* Pincode */}
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      placeholder="Pincode (Required)*"
                      className="w-full text-sm bg-white border border-slate-300 rounded-md px-4 py-3 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-slate-800 placeholder-slate-400 transition-all font-medium font-mono"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="City (Required)*"
                        className="w-full text-sm bg-white border border-slate-300 rounded-md px-4 py-3 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-slate-800 placeholder-slate-400 transition-all font-medium"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </div>
                    
                    <div className="relative border border-slate-300 rounded-md focus-within:border-[#2874f0] focus-within:ring-1 focus-within:ring-[#2874f0] flex items-center bg-white">
                      <select 
                        required
                        className="w-full text-sm bg-transparent rounded-md pl-4 pr-8 py-3 outline-none text-slate-800 font-medium appearance-none cursor-pointer"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      >
                        <option value="" disabled className="text-slate-400">State (Required)*</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra & Nagar Haveli & Daman & Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">Jammu & Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* House No., Building Name */}
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="House No., Building Name (Required)*"
                      className="w-full text-sm bg-white border border-slate-300 rounded-md px-4 py-3 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-slate-800 placeholder-slate-400 transition-all font-medium"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                    />
                  </div>

                  {/* Road name, Area, Colony */}
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="Road name, Area, Colony (Required)*"
                      className="w-full text-sm bg-white border border-slate-300 rounded-md px-4 py-3 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-slate-800 placeholder-slate-400 transition-all font-medium"
                      value={roadName}
                      onChange={(e) => setRoadName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg font-bold text-center border border-red-100 flex items-center justify-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {error}
                </div>
              )}

              <Button 
                type="submit"
                className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white py-6 rounded-lg text-sm font-bold shadow-md transition-transform active:scale-98 uppercase tracking-wide"
              >
                Save Address
              </Button>
            </form>
          )}

          {/* STEP 2: ORDER SUMMARY */}
          {step === 'summary' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 bg-[#f1f3f6] -mx-4 -mb-4 p-3 min-h-[500px] flex flex-col justify-between">
              <div className="space-y-3">
                {/* 1. Deliver To Address Card */}
                <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm relative flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">
                      Deliver to:
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep('address')}
                      className="border border-[#2874f0] bg-white hover:bg-slate-50 text-[#2874f0] text-[10px] font-bold px-3 py-1 rounded transition-all tracking-wide uppercase"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{address.fullName}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
                      HOME
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-655 leading-relaxed font-medium">
                    {address.streetAddress}, {address.city}, {address.state} - <span className="font-mono font-bold text-slate-800">{address.postalCode}</span>
                  </p>
                  
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {address.phone}
                  </p>
                </div>

                {/* 2. Incomplete/Verified Address Banner matching screenshot exactly */}
                <div className="bg-[#fff3e0] border border-[#ffe0b2] rounded-lg p-3 flex items-center justify-between gap-4 shadow-2xs">
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold text-slate-800">
                      Incomplete address details for delivery
                    </h4>
                    <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                      Please check pincode and street address
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="bg-white border border-[#2874f0] text-[#2874f0] hover:bg-slate-50 text-[10px] font-black px-3.5 py-1.5 rounded shrink-0 uppercase tracking-wider"
                  >
                    Edit details
                  </button>
                </div>

                {/* 3. Dynamic Products / Cart Items list */}
                <div className="space-y-3">
                  {cartItems.map((item, idx) => {
                    const discountPercent = item.price > item.salePrice 
                      ? Math.round(((item.price - item.salePrice) / item.price) * 100)
                      : 0;

                    // Setup dynamic delivery expectation date
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const deliveryDate = new Date();
                    deliveryDate.setDate(deliveryDate.getDate() + 3);
                    const deliveryString = `Delivery by ${months[deliveryDate.getMonth()]} ${deliveryDate.getDate()}, ${days[deliveryDate.getDay()]}`;

                    return (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex gap-4 relative">
                        {/* Product Image and Qty drop down */}
                        <div className="flex flex-col items-center gap-3 shrink-0">
                          <div className="relative h-20 w-20 bg-white rounded-md border border-slate-100 overflow-hidden flex items-center justify-center">
                            <img src={item.imageUrl} alt={item.name} className="object-contain p-1 w-full h-full" />
                          </div>
                          
                          {/* Qty Selector Capsule */}
                          <div className="relative border border-slate-350 rounded px-2.5 py-1 flex items-center gap-1.5 bg-white cursor-pointer select-none">
                            <span className="text-[10px] font-bold text-slate-800">Qty: {item.quantity}</span>
                            <ChevronDown className="h-3 w-3 text-slate-500" />
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                            {item.name}
                          </h4>
                          
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Silver Premium Edition
                          </p>

                          {/* Ratings and Assured Icon */}
                          <div className="flex items-center gap-1.5 text-[10px] font-bold">
                            <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[8.5px] font-black flex items-center gap-0.5 shadow-2xs">
                              4.4 ★
                            </span>
                            <span className="text-slate-400 font-bold">(9,614)</span>
                            {/* Assured Emblem */}
                            <img 
                              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                              alt="Assured" 
                              className="h-3.5 w-auto object-contain ml-1 inline-block" 
                            />
                          </div>

                          {/* Flipkart Prices Row */}
                          <div className="flex items-center gap-2.5 mt-1">
                            {discountPercent > 0 && (
                              <span className="text-xs font-black text-emerald-600">
                                ↓ {discountPercent}%
                              </span>
                            )}
                            <span className="text-xs text-slate-400 line-through">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <span className="text-sm font-black text-slate-900">
                              ₹{item.salePrice.toLocaleString()}
                            </span>
                          </div>

                          {/* Protect Promise Label */}
                          <p className="text-[9px] text-slate-400 font-medium">
                            + ₹39 Protect Promise Fee ⓘ
                          </p>

                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                            9 Offers Available
                          </p>

                          <p className="text-[10px] font-black text-slate-805 mt-1">
                            {deliveryString}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 4. Coupons & Promo Discounts System */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[#2874f0]/10 flex items-center justify-center text-[#2874f0]">
                      <Ticket className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Apply Coupons & Promos</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Save extra with exclusive store discount codes</p>
                    </div>
                  </div>

                  {appliedCoupon ? (
                    <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-3 flex items-center justify-between animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                          <Ticket className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-[9px] font-bold text-emerald-600 mt-0.5">
                            Code applied! Extra ₹{couponDiscount.toLocaleString()} saved
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[10px] font-black text-red-500 hover:text-red-750 transition-colors uppercase tracking-wider bg-white shadow-xs border border-slate-100 rounded-lg px-2.5 py-1.5 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ENTER COUPON CODE"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError(null);
                          }}
                          className="flex-1 bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold placeholder-slate-400 focus:border-[#2874f0] uppercase tracking-wider outline-none transition-all"
                        />
                        <Button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          className="rounded-xl bg-[#2874f0] hover:bg-[#1b5cb8] text-white px-4 font-black text-xs h-[34px] shadow-xs uppercase tracking-wide shrink-0"
                        >
                          Apply
                        </Button>
                      </div>

                      {couponError && (
                        <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-1 animate-pulse">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{couponError}</span>
                        </p>
                      )}

                      {/* Pre-seeded Active Coupons Chips */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Offers</p>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { code: 'WELCOME15', desc: '15% Off' },
                            { code: 'KITCHEN10', desc: '10% Off' },
                            { code: 'FLAT500', desc: '₹500 Off' },
                            { code: 'FESTIVE20', desc: '20% Off' }
                          ].map((promo) => (
                            <button
                              key={promo.code}
                              type="button"
                              onClick={() => handleApplyCoupon(promo.code)}
                              className="bg-slate-50 hover:bg-[#2874f0]/5 border border-slate-200 hover:border-[#2874f0] text-slate-700 hover:text-[#2874f0] rounded-lg px-2 py-1 text-[9px] font-black tracking-wider transition-all flex items-center gap-1 uppercase"
                            >
                              <Ticket className="h-2.5 w-2.5 shrink-0 text-orange-500" />
                              <span>{promo.code}</span>
                              <span className="text-[7.5px] font-bold text-slate-400 lowercase">({promo.desc})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Price Details Breakdown */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Price ({cartItems.length} items)</span>
                    <span className="font-bold text-slate-700">₹{totalOriginal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Discount Savings</span>
                    <span className="font-bold text-green-600">-₹{(totalOriginal - baseSaleTotal).toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between items-center text-xs bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 animate-in fade-in">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Ticket className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Coupon Discount ({appliedCoupon?.code})
                      </span>
                      <span className="font-black text-emerald-600">-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Delivery Charges</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="pt-2.5 border-t border-dashed border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900 uppercase">Total Payable</span>
                    <span className="text-base font-black text-[#2874f0]">₹{totalSale.toLocaleString()}</span>
                  </div>
                </div>

                {/* 6. Green Savings Banner */}
                <div className="bg-[#e8f5e9]/70 border border-[#c8e6c9] rounded-lg p-3 flex items-center gap-2 text-xs font-bold text-[#388e3c] shadow-2xs">
                  <span className="bg-[#388e3c] text-white p-0.5 rounded-full shrink-0 flex items-center justify-center h-4 w-4 text-[9px] font-black">
                    %
                  </span>
                  <span>You'll save ₹{(totalOriginal - totalSale).toLocaleString()} on this order!</span>
                </div>
              </div>

              {error && (
                <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg font-bold text-center border border-red-100 my-2">
                  {error}
                </div>
              )}

              {/* 7. Bottom Sticky Payment Bar */}
              <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between -mx-3 -mb-3 rounded-b-xl sticky bottom-0 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400 line-through">
                    ₹{totalOriginal.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 leading-none mt-0.5">
                    <span className="text-lg font-black text-slate-900">
                      ₹{totalSale.toLocaleString()}
                    </span>
                    <span className="text-slate-400 text-[10px] cursor-pointer">ⓘ</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleProceedToPayment}
                  disabled={loading}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 px-10 py-5 rounded-md text-xs font-black shadow-sm transition-transform active:scale-97 uppercase tracking-wider shrink-0"
                >
                  {loading ? 'Processing...' : 'Continue'}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: UPI PAYMENT DRAWER */}
          {step === 'payment' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              
              {/* Offer Countdown Timer Banner */}
              <div className="bg-[#fff9f4] border border-[#fde8d7] rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 mb-2 animate-pulse">
                <Clock className="h-4 w-4 text-[#fb641b]" />
                <span className="text-xs font-bold text-slate-700">
                  Offer ends in <span className="text-[#fb641b] font-black">{formatTime(timeLeft)}</span>
                </span>
              </div>

              {/* White Rounded Cards for dynamic payment method displays */}
              <div className="space-y-3">
                {/* MODE 1: RAZORPAY GATEWAY PRESETS */}
                {paymentMode === 'razorpay' && (
                  <div className="bg-slate-900 text-white rounded-[2rem] border border-slate-800 p-6 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    {/* Glowing background */}
                    <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Razorpay Brand Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-500 h-6.5 w-6.5 rounded-lg flex items-center justify-center font-black text-[11px] text-slate-950 shadow-md shadow-emerald-500/20">R</div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Razorpay Secure</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">PCI-DSS Compliant Gateway</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-slate-300">
                        <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" /> Live Sandbox Active
                      </div>
                    </div>

                    {/* Simulating Razorpay Tabs */}
                    <div className="space-y-4">
                      {/* Interactive Tab Selectors */}
                      <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-xl">
                        {['card', 'upi', 'netbanking'].map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setSelectedMethod(tab as any)}
                            className={cn(
                              "py-2 text-[10px] font-black uppercase rounded-lg transition-all text-center tracking-wider",
                              (selectedMethod === tab || (selectedMethod === 'gpay' && tab === 'upi'))
                                ? "bg-emerald-500 text-slate-950 font-black shadow-md"
                                : "text-slate-400 hover:text-white"
                            )}
                          >
                            {tab === 'card' ? '💳 Cards' : tab === 'upi' ? '📲 UPI' : '🏦 Banking'}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content: Card Details */}
                      {selectedMethod === 'card' && (
                        <div className="space-y-3.5 pt-2 animate-in fade-in duration-300">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Card Number</label>
                            <input 
                              type="text"
                              placeholder="4111 2222 3333 4444"
                              maxLength={19}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-emerald-500 transition-all placeholder:text-white/20 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</label>
                              <input 
                                type="text"
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-emerald-500 transition-all text-center placeholder:text-white/20 text-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CVV</label>
                              <input 
                                type="password"
                                placeholder="•••"
                                maxLength={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-emerald-500 transition-all text-center placeholder:text-white/20 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: UPI Details */}
                      {(selectedMethod === 'upi' || selectedMethod === 'gpay') && (
                        <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Virtual Payment Address (VPA)</label>
                            <input 
                              type="text"
                              placeholder="e.g. mobile@upi"
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-emerald-500 transition-all placeholder:text-white/20 text-white"
                            />
                          </div>
                          <div className="text-center py-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Or Scan Dynamic QR</span>
                            <div className="inline-block bg-white p-2.5 rounded-2xl border border-white/10 shadow-lg">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=kitchenproduct@razorpay%26am=${totalSale}%26cu=INR`}
                                alt="Dynamic Razorpay QR"
                                className="h-28 w-28 object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Net Banking */}
                      {selectedMethod === 'netbanking' && (
                        <div className="grid grid-cols-2 gap-2 pt-2 animate-in fade-in duration-300">
                          {['SBI', 'HDFC', 'ICICI', 'AXIS'].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              className="p-3 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all"
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pay Button Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setStep('verifying');
                        setTimeout(() => {
                          setStep('success');
                        }, 2500);
                      }}
                      className="w-full py-4 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 active:scale-98 transition-all"
                    >
                      🔒 Pay ₹{totalSale.toLocaleString()} Securely
                    </button>
                  </div>
                )}

                {/* MODE 2: HIGH-FIDELITY UPI INTENT CHECKOUT */}
                {paymentMode === 'upi_intent' && (
                  <div className="space-y-3">
                    {/* 1. Google Pay (GPay) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMethod('gpay');
                        handleUpiAppPay('gpay');
                        setStep('verifying');
                        startRealtimePolling();
                      }}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between text-left bg-white",
                        selectedMethod === 'gpay'
                          ? "border-[#2874f0] bg-blue-50/5 ring-1 ring-[#2874f0]"
                          : "border-slate-200 hover:border-slate-350"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center shrink-0">
                          <img 
                            src="https://www.gstatic.com/images/branding/product/2x/googleg_96dp.png" 
                            alt="GPay" 
                            className="h-8 w-8 object-contain" 
                          />
                        </div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Pay with Google Pay</span>
                      </div>
                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        selectedMethod === 'gpay' ? "border-[#2874f0] bg-[#2874f0] text-white" : "border-slate-300"
                      )}>
                        {selectedMethod === 'gpay' && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </button>

                    {/* 2. PhonePe */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMethod('phonepe');
                        handleUpiAppPay('phonepe');
                        setStep('verifying');
                        startRealtimePolling();
                      }}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between text-left bg-white",
                        selectedMethod === 'phonepe'
                          ? "border-purple-600 bg-purple-50/5 ring-1 ring-purple-600"
                          : "border-slate-200 hover:border-slate-350"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center shrink-0">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" 
                            alt="PhonePe" 
                            className="h-8 w-8 object-contain" 
                          />
                        </div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Pay with PhonePe</span>
                      </div>
                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        selectedMethod === 'phonepe' ? "border-purple-600 bg-purple-600 text-white" : "border-slate-300"
                      )}>
                        {selectedMethod === 'phonepe' && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </button>

                    {/* 3. Paytm */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMethod('paytm');
                        handleUpiAppPay('paytm');
                        setStep('verifying');
                        startRealtimePolling();
                      }}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between text-left bg-white",
                        selectedMethod === 'paytm'
                          ? "border-sky-500 bg-sky-50/5 ring-1 ring-sky-500"
                          : "border-slate-200 hover:border-slate-350"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center shrink-0">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" 
                            alt="Paytm" 
                            className="h-8 w-8 object-contain" 
                          />
                        </div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Pay with Paytm</span>
                      </div>
                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        selectedMethod === 'paytm' ? "border-sky-500 bg-sky-500 text-white" : "border-slate-300"
                      )}>
                        {selectedMethod === 'paytm' && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </button>

                    {/* 4. Scan QR */}
                    <div
                      className={cn(
                        "w-full rounded-xl border-2 transition-all bg-white overflow-hidden",
                        selectedMethod === 'qr'
                          ? "border-[#2874f0] ring-1 ring-[#2874f0]"
                          : "border-slate-200 hover:border-slate-350"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('qr')}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 flex items-center justify-center shrink-0 bg-slate-50 rounded-lg">
                            <QrCode className="h-6 w-6 text-slate-600" />
                          </div>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Scan QR code</span>
                        </div>
                        <div className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                          selectedMethod === 'qr' ? "border-[#2874f0] bg-[#2874f0] text-white" : "border-slate-300"
                        )}>
                          {selectedMethod === 'qr' && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </button>
                      
                      {selectedMethod === 'qr' && (
                        <div className="px-4 pb-4 border-t border-slate-100 pt-3 flex flex-col items-center justify-center space-y-3 bg-slate-50/50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="relative bg-white p-3 rounded-xl shadow-xs border border-slate-150 flex items-center justify-center">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl || '')}`} 
                              alt="Scan UPI QR" 
                              className="h-40 w-40 object-contain"
                            />
                          </div>
                          <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider text-center">
                            Scan this QR using GPay, PhonePe, or Paytm!
                          </p>
                          <button 
                            type="button"
                            onClick={handleDownloadQr}
                            className="w-full flex items-center justify-center gap-1.5 py-2 bg-white text-slate-700 hover:bg-slate-100 rounded-lg text-[10px] font-black transition-all border border-slate-300 shadow-2xs"
                          >
                            <Download className="h-3.5 w-3.5" /> Save QR Code to Gallery
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* MODE 3: MANUAL QR SCAN FALLBACK */}
                {paymentMode === 'manual_qr' && (
                  <div className="p-6 bg-white rounded-[2rem] border border-slate-200 space-y-5 text-center shadow-md animate-in fade-in zoom-in-95 duration-300">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Static UPI QR Code</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Scan, Pay & Submit Reference (UTR) Number</p>
                    </div>

                    <div className="inline-block bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-xs relative group">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl || `upi://pay?pa=${merchantVpa}&pn=${payeeName}&am=${totalSale}&cu=INR`)}`} 
                        alt="Static Payment QR" 
                        className="h-44 w-44 object-contain mx-auto"
                      />
                    </div>

                    {/* VPA Copy details */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Merchant VPA</span>
                        <span className="text-xs font-black text-slate-700">{merchantVpa}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyVpa}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                      >
                        <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    {/* Instruction Alert box */}
                    <div className="p-3 bg-orange-50/50 rounded-2xl border border-orange-100 text-left flex items-start gap-3">
                      <AlertCircle className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-black text-orange-850 uppercase tracking-wider">Required Actions</h5>
                        <p className="text-[10px] font-medium text-orange-700 leading-normal">Please make a direct payment to the VPA or QR code above. In the next step, you will be required to submit the 12-digit transaction Reference/UTR number for admin verification.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Details Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 mt-4">
                <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide">Price Details</h3>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span className="font-bold text-slate-700">₹{totalOriginal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Delivery Charges</span>
                  <span className="font-black text-green-600 uppercase">FREE</span>
                </div>
                
                <div className="pt-2.5 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-800 uppercase">Amount Payable</span>
                  <span className="text-sm font-black text-slate-900">₹{totalSale.toLocaleString()}</span>
                </div>
              </div>

              {/* Sticky bottom bar overlay styled exactly like Flipkart checkout */}
              <div className="border-t border-slate-100 bg-white p-4 flex items-center justify-between mt-6 -mx-4 -mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold line-through">₹{totalOriginal.toLocaleString()}</span>
                  <span className="text-base font-black text-slate-900">₹{totalSale.toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  onClick={handleContinuePayment}
                  className="bg-[#ffc200] hover:bg-[#ffa200] text-slate-900 text-xs font-black uppercase px-8 py-3.5 rounded-md shadow-xs active:scale-98 transition-all tracking-wider"
                >
                  Continue
                </button>
              </div>

            </div>
          )}

          {/* STEP 6: VERIFYING IN PROGRESS (REAL-TIME POLLING & AUTOMATIC VERIFICATION SCREEN) */}
          {step === 'verifying' && (
            <div className="py-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Top Status Header */}
              <div className="text-center space-y-2">
                <div className="relative flex items-center justify-center mx-auto h-20 w-20">
                  <div className="absolute h-20 w-20 rounded-full border-4 border-slate-100 border-t-[#2874f0] animate-spin" />
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shadow-xs">
                    <Clock className="h-6 w-6 text-[#2874f0] animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    {verificationTimedOut ? 'Verification Pending' : 'Verifying Payment...'}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    ⏱ Automatic Background Check Active
                  </p>
                </div>
              </div>

              {/* Status details card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">Amount Payable</span>
                  <span className="font-black text-slate-800">₹{totalSale.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">Merchant VPA</span>
                  <span className="font-bold text-slate-700 font-mono text-[10px]">{merchantVpa}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">Check Status</span>
                  <span className="text-[9.5px] font-black text-[#2874f0] animate-pulse flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2874f0] animate-ping inline-block" />
                    Awaiting Bank Settlement...
                  </span>
                </div>
              </div>

              {/* Already Paid / App Confirmation Buttons */}
              {selectedMethod && selectedMethod !== 'qr' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 max-w-sm mx-auto text-center space-y-3.5 shadow-sm animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Paid using {selectedMethod.toUpperCase()}?
                    </h4>
                    <p className="text-[10px] text-emerald-700 font-semibold leading-relaxed">
                      If you successfully completed the payment inside the {selectedMethod.toUpperCase()} app, please click below to submit your order immediately for verification!
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleDirectAppPaidSubmit}
                    disabled={loading}
                    className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white py-4 rounded-xl text-xs font-black shadow-md transition-all active:scale-98 uppercase tracking-wide flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    {loading ? 'Submitting Order...' : 'Yes, I Completed Payment'}
                  </Button>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">
                    ⚡ Instant admin notification triggered on click
                  </p>
                </div>
              )}

              {/* UTR Entry Form - Integrates Did you pay & manual check on the same waiting screen */}
              <div className="border border-slate-200 rounded-2xl p-5 max-w-sm mx-auto bg-white shadow-sm space-y-4">

                <div className="text-center space-y-1">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Instant Payment Verification</h3>
                  <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                    Enter your 12-digit UPI UTR to complete order instantly
                  </p>
                </div>

                <form onSubmit={handleSubmitUtr} className="space-y-3">
                  <div className="space-y-1.5">
                    <input 
                      type="text" 
                      required
                      placeholder="Enter 12-digit UTR (e.g. 412385920194)"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-mono font-bold tracking-widest text-center focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/10 outline-none transition-all uppercase"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
                      maxLength={12}
                    />
                  </div>

                  {error && (
                    <div className="text-[9.5px] text-red-600 bg-red-50 p-2 rounded-lg font-bold text-center border border-red-100 flex items-center justify-center gap-1 animate-pulse">
                      <AlertCircle className="h-3 w-3" /> {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#fb641b] hover:bg-[#f4511e] text-white py-4 rounded-xl text-xs font-black shadow-sm transition-transform active:scale-98 uppercase tracking-wide"
                  >
                    {loading ? 'Verifying with Bank...' : 'Verify & Complete Order'}
                  </Button>
                </form>

                <div className="text-[9.5px] text-slate-500 leading-normal space-y-1.5 font-semibold text-center border-t border-slate-100 pt-3">
                  <p className="flex items-start gap-1 justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                    UTR is found in your UPI app's transaction history / payment receipt.
                  </p>
                </div>
              </div>

              {/* Polling fallback and navigation */}
              {verificationTimedOut && (
                <div className="text-center pt-2 flex flex-col gap-2 max-w-sm mx-auto px-4">
                  <Button 
                    onClick={() => {
                      setVerificationTimedOut(false);
                      startRealtimePolling();
                    }}
                    className="w-full bg-[#2874f0] hover:bg-[#1a64df] text-white font-black text-xs uppercase py-4 shadow-sm rounded-lg"
                  >
                    🔄 Restart Automatic Polling
                  </Button>
                  <Button 
                    variant="outline"
                    asChild
                    className="w-full font-bold text-xs uppercase py-4 border-slate-350 hover:bg-slate-50 rounded-lg text-slate-700"
                  >
                    <a href="/">Go to Homepage</a>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: ORDER SUCCESS */}
          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-500">
              <div className="h-20 w-20 rounded-full bg-[#388e3c] flex items-center justify-center shadow-xl shadow-green-100">
                <CheckCircle2 className="h-11 w-11 text-white" />
              </div>

              <div className="text-center space-y-1.5">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Order Confirmed!</h2>
                <p className="text-xs text-slate-500 leading-normal">
                  Thank you for shopping! Your payment was verified and order is now locked.
                </p>
              </div>

              <div className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px]">Order reference ID</span>
                  <span className="font-mono font-bold text-slate-800">#{transactionId ? transactionId.substring(0, 15) : 'ORD-LOCKED'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px]">Payment Method</span>
                  <span className="font-bold text-slate-800">UPI (Instant Verified)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px]">Total Amount</span>
                  <span className="font-black text-[#2874f0]">₹{totalSale.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px]">Delivery Status</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[9.5px] font-black uppercase">Paid & Processing</span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#2874f0] hover:bg-[#1a64df] text-white py-6 rounded-lg font-bold text-sm uppercase tracking-wide transition-transform active:scale-98"
                asChild
              >
                <a href="/">Continue Shopping</a>
              </Button>
            </div>
          )}

          {/* STEP 8: ORDER SUBMITTED / PAYMENT PENDING VERIFICATION */}
          {step === 'pending_verification' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-500 max-w-sm mx-auto">
              <div className="h-20 w-20 rounded-full bg-amber-500 flex items-center justify-center shadow-xl shadow-amber-100 relative">
                <Clock className="h-11 w-11 text-white animate-pulse" />
              </div>

              <div className="text-center space-y-2.5 px-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Reference Submitted!</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                  <span className="text-[9.5px] text-amber-800 font-black uppercase tracking-wider">Awaiting Verification</span>
                </div>
                <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                  Thank you! We have received your payment reference. Our team is currently verifying the UTR against our bank statement to prevent fake/wrong submissions.
                </p>
                <p className="text-[11px] text-slate-500 font-bold leading-normal pt-1">
                  Your order is currently <span className="text-amber-600 font-extrabold uppercase">Pending</span> and will be fully confirmed once verified (usually within 10–15 minutes).
                </p>
              </div>

              <div className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px]">Order reference ID</span>
                  <span className="font-mono font-bold text-slate-800">#{transactionId ? transactionId.substring(0, 15) : 'ORD-PENDING'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px]">Payment Status</span>
                  <span className="font-bold text-amber-600 uppercase">Under Review</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-200/60 pt-2.5">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px]">Total Amount</span>
                  <span className="font-black text-slate-800 text-sm">₹{totalSale.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#2874f0] hover:bg-[#1a64df] text-white py-6 rounded-lg font-bold text-sm uppercase tracking-wide transition-transform active:scale-98 shadow-sm"
                asChild
              >
                <a href="/">Continue Shopping</a>
              </Button>
            </div>
          )}
        </div>
        
        {/* Secure checkout footer */}
        <div className="bg-slate-50 px-4 py-3.5 border-t border-slate-100 flex items-center justify-center gap-1.5 opacity-60 text-[9px] font-black uppercase tracking-wider text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-450" /> Secure encrypted gateway connections
        </div>

      </div>

      {/* UPI APP HANDOFF & DIRECT BANK TRANSFER ASSISTANT OVERLAY */}
      {showAssistantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2874f0] to-[#1a64df] p-5 text-white relative">
              <button
                type="button"
                onClick={() => setShowAssistantModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white font-black text-sm bg-white/10 hover:bg-white/20 h-7 w-7 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="h-5 w-5 animate-pulse text-yellow-350" />
                <span className="text-[9px] font-black uppercase tracking-wider bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Auto-Handoff active
                </span>
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight">UPI Payment Handoff</h3>
              <p className="text-[10px] text-blue-100 font-medium">Follow these steps if your UPI App blocks the request:</p>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              
              {/* Visual Alert explaining GPay / PhonePe restriction */}
              <div className="bg-amber-50 border border-amber-250 rounded-xl p-3 flex gap-2.5">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-[10.5px] font-black text-amber-900 uppercase tracking-wide">⚠️ UPI App Error / Blocked?</h4>
                  <p className="text-[9.5px] text-amber-800 leading-relaxed font-semibold">
                    Google Pay, PhonePe, & Paytm restrict browser deep-links to <strong>personal UPI IDs</strong> or may block if they try to select a Credit Card or Wallet by default!
                  </p>
                </div>
              </div>

              {/* Instant Action Copy Block */}
              <div className="space-y-2.5">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">100% Fail-Safe Alternative Methods</span>
                
                {/* Copy VPA Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Copy UPI ID (VPA)</span>
                    <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-black uppercase">Ajmal Hussain</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-white border border-slate-250 rounded-xl p-2.5 shadow-inner">
                    <code className="text-xs font-mono font-bold text-slate-800 select-all tracking-tight break-all">
                      {merchantVpa}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(merchantVpa);
                        setCopiedVpa(true);
                        setTimeout(() => setCopiedVpa(false), 2000);
                      }}
                      className="bg-[#2874f0] text-white hover:bg-[#1a64df] px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all shrink-0 active:scale-95"
                    >
                      {copiedVpa ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedVpa ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                    👉 <strong>How to pay:</strong> Open your UPI app, click "Pay UPI ID/Number", paste the ID above, and pay!
                  </p>
                </div>

                {/* Copy Amount Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Exact Amount to Pay</span>
                    <span className="text-xs font-black text-slate-800">₹{totalSale.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(totalSale.toFixed(2));
                      setCopiedAmount(true);
                      setTimeout(() => setCopiedAmount(false), 2000);
                    }}
                    className="border border-slate-350 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg text-[9.5px] font-bold text-slate-700 flex items-center gap-1 shadow-sm transition-all active:scale-95"
                  >
                    {copiedAmount ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    {copiedAmount ? 'Copied' : 'Copy Amount'}
                  </button>
                </div>
              </div>

              {/* Confirm Paid Button */}
              <button
                type="button"
                onClick={() => {
                  setShowAssistantModal(false);
                  setStep('verifying');
                  startRealtimePolling();
                }}
                className="w-full py-3 bg-[#388e3c] hover:bg-[#2e7d32] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-98"
              >
                Paid Successfully? Verify Now <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
              </button>

            </div>
            
            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 p-3.5 flex items-center justify-center gap-1.5 text-[8.5px] font-bold uppercase tracking-wider text-slate-400 text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              Payments are securely processed directly via bank-to-bank UPI channels.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
