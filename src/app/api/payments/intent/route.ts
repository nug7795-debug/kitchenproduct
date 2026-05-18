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

    let merchantUpiId = process.env.MERCHANT_UPI_ID || 'bigdhamaka@paytm';
    let payeeName = 'Big Dhamaka Sale';
    let mccCode = '5722';

    try {
      const { data: globalSettings } = await supabaseAdmin
        .from('settings')
        .select('*')
        .eq('key', 'global_settings')
        .maybeSingle();

      if (globalSettings?.value?.payment) {
        const paymentConfig = globalSettings.value.payment;
        if (paymentConfig.merchantUpiId) {
          merchantUpiId = paymentConfig.merchantUpiId;
        }
        if (paymentConfig.payeeName) {
          payeeName = paymentConfig.payeeName;
        }
        if (paymentConfig.mccCode) {
          mccCode = paymentConfig.mccCode;
        }
      }
    } catch (settingsError) {
      console.error('Failed to load dynamic merchant configurations:', settingsError);
    }

    // 5. Generate UPI Payment Details with loaded configurations
    const upiUrl = paymentService.generateUpiIntent(orderId, amount, transactionId, merchantUpiId, payeeName, mccCode);

    return NextResponse.json({
      success: true,
      transactionId,
      upiUrl,
      mode: 'manual_upi',
      message: 'Payment intent created successfully.'
    });
  } catch (error: any) {
    console.error('Payment Intent Error:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
