import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { paymentService } from '@/lib/payment-service';

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

    // 4. Generate UPI Payment Details
    const upiUrl = paymentService.generateUpiIntent(orderId, amount, transactionId);

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
