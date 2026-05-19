import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { paymentService } from '@/lib/payment-service';

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
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

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

    // 5. Generate appropriate response based on selected active payment method
    let upiUrl = '';
    if (activeMethod !== 'razorpay') {
      upiUrl = paymentService.generateUpiIntent(orderId, amount, transactionId, merchantUpiId, storeName);
    }

    return NextResponse.json({
      success: true,
      transactionId,
      upiUrl,
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
