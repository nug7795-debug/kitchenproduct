import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { paymentService } from '@/lib/payment-service';
import { UnifiedUPIPayment } from 'unified-upi-payment';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { orderId, amount } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Order ID and amount are required' }, { status: 400 });
    }

    // 1. Verify order exists
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Generate a unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Create a pending payment record
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([
        {
          order_id: orderId,
          transaction_id: transactionId,
          amount: amount,
          status: 'pending',
          method: 'UPI'
        }
      ]);

    if (paymentError) throw paymentError;

    // 4. Load payment configuration dynamically from settings table
    const { data: settingsRecord } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'global_settings')
      .maybeSingle();

    const paymentSettings = settingsRecord?.value?.payment || {};
    const activeMethod = paymentSettings.activeMethod || 'upi_intent';
    const merchantUpiId = paymentSettings.merchantUpiId || process.env.UPI_ID || process.env.MERCHANT_UPI_ID || 'yourbusiness@okaxis';
    const storeName = paymentSettings.payeeName || process.env.STORE_NAME || 'KitchenProduct Premium';
    const razorpayKeyId = paymentSettings.razorpayKeyId || '';
    const razorpayKeySecret = paymentSettings.razorpayKeySecret || '';

    // 5. Generate appropriate response based on selected active payment method using unified-upi-payment
    let upiUrl = '';
    let qrCodeBase64 = '';

    if (activeMethod === 'razorpay') {
      try {
        const payment = new UnifiedUPIPayment({
          provider: 'razorpay',
          credentials: {
            keyId: razorpayKeyId || 'rzp_test_mockkeyid',
            keySecret: razorpayKeySecret || 'mockkeysecret'
          },
          environment: 'sandbox'
        });

        const upiOrder = await payment.createOrder({
          amount: Number(amount),
          currency: 'INR'
        });

        // Razorpay will handle it via client-side checkout modal
      } catch (err) {
        console.error('Failed to create Razorpay unified order, falling back to direct UPI:', err);
      }
    }

    // If activeMethod is upi_intent or manual_qr, or if razorpay is not configured/errored, use unified googlepay direct UPI provider
    if (!upiUrl) {
      try {
        const payment = new UnifiedUPIPayment({
          provider: 'googlepay',
          credentials: {
            merchantName: storeName,
            merchantUPI: merchantUpiId
          }
        });

        const upiOrder = await payment.createOrder({
          amount: Number(amount),
          description: `ORDER_${transactionId}`
        });

        const rawUpiUrl = upiOrder.upiUrl || '';
        if (rawUpiUrl) {
          try {
            const parts = rawUpiUrl.split('?');
            if (parts.length >= 2) {
              const queryParams = new URLSearchParams(parts[1]);
              const pa = queryParams.get('pa') || merchantUpiId;
              const pn = queryParams.get('pn') || storeName;
              const am = queryParams.get('am') || amount.toString();
              const cu = queryParams.get('cu') || 'INR';
              const tr = queryParams.get('tr') || transactionId;
              const tn = queryParams.get('tn') || `Order ${orderId}`;
              upiUrl = `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${Number(am).toFixed(2)}&cu=${cu}&tr=${tr}&tn=${encodeURIComponent(tn)}`;
            } else {
              upiUrl = rawUpiUrl;
            }
          } catch (e) {
            upiUrl = rawUpiUrl;
          }
        }
        qrCodeBase64 = upiOrder.qrCode || '';
      } catch (err) {
        console.error('Failed to create unified googlepay order, falling back to legacy link generator:', err);
        upiUrl = paymentService.generateUpiIntent(orderId, amount, transactionId, merchantUpiId, storeName);
      }
    }

    return NextResponse.json({
      success: true,
      transactionId,
      upiUrl,
      qrCode: qrCodeBase64,
      mode: activeMethod,
      razorpayKeyId,
      message: 'Payment intent created successfully.',
      merchantUpiId,
      payeeName: storeName
    });
  } catch (error: any) {
    console.error('Payment Intent Error:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
