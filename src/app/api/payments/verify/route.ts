import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { paymentService } from '@/lib/payment-service';

export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
  try {
    const { transactionId, utr } = await request.json();

    if (!transactionId || !utr) {
      return NextResponse.json({ error: 'Transaction ID and UTR are required' }, { status: 400 });
    }

    // 1. Get payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    if (payment.status === 'success' || payment.status === 'processing') {
      return NextResponse.json({ error: 'Payment already submitted or verified' }, { status: 400 });
    }

    // 1.1 Check for Duplicate UTR
    const { data: duplicateUtr } = await supabaseAdmin
      .from('payments')
      .select('id')
      .contains('raw_response', { utr: utr })
      .single();

    if (duplicateUtr) {
      return NextResponse.json({ error: 'This UTR has already been used.' }, { status: 400 });
    }

    // 2. Submit UTR
    await paymentService.submitUtr(transactionId, utr);

    // 3. Update Payment record to success (Automatic instant verification)
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({ 
        status: 'success',
        raw_response: { utr: utr } 
      })
      .eq('transaction_id', transactionId);

    if (updateError) throw updateError;

    // 4. Update order status to paid
    if (payment.order_id) {
      const { error: orderError } = await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', payment.order_id);

      if (orderError) console.error('Error updating order status:', orderError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
