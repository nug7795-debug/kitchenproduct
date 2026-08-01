import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { txnid, app } = await request.json();

    if (!txnid) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // 1. Fetch the payment record to retrieve the associated order_id
    const { data: paymentRecord, error: fetchErr } = await supabaseAdmin
      .from('payments')
      .select('order_id')
      .eq('transaction_id', txnid)
      .maybeSingle();

    if (fetchErr) throw fetchErr;

    // 2. Update payment record to processing status since the user clicked to open the UPI app
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'processing',
        raw_response: { 
          utr: 'Pending UPI App Payment',
          upi_app_opened: app || 'unknown',
          opened_at: new Date().toISOString()
        }
      })
      .eq('transaction_id', txnid);

    if (updateError) throw updateError;

    // 3. Update the corresponding order status to 'pending' so it becomes visible in the admin panel
    if (paymentRecord?.order_id) {
      const { error: orderUpdateErr } = await supabaseAdmin
        .from('orders')
        .update({ status: 'pending' })
        .eq('id', paymentRecord.order_id);
      
      if (orderUpdateErr) {
        console.error('Failed to update order status to pending:', orderUpdateErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
