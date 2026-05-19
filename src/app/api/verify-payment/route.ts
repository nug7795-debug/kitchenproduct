import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { txnid } = await request.json();

    if (!txnid) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Fetch the payment record
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('transaction_id', txnid)
      .maybeSingle();

    if (error || !payment) {
      return NextResponse.json({ success: true, status: 'pending' });
    }

    // Return the status in a format the client expects
    // The reference site's client script redirects to:
    // /PaymentConfirmation if status === 'success' (it checks "success" === r.status)
    // /PaymentFailed if status === 'failure' (it checks "failure" === r.status)
    // and if status is 'pending' or anything else, it continues polling.
    // Note: in our schema the standard statuses might be 'pending', 'processing', 'success', 'failed'.
    // If the record's status is 'processing', the client should still poll or wait (so we treat it as pending).
    // If it's 'success', we map it to 'success'.
    // If it's 'failed', we map it to 'failure'.
    let responseStatus = 'pending';
    if (payment.status === 'success') {
      responseStatus = 'success';
    } else if (payment.status === 'failed') {
      responseStatus = 'failure';
    } else if (payment.status === 'processing') {
      responseStatus = 'processing';
    }

    return NextResponse.json({
      success: true,
      status: responseStatus,
      utr: payment.raw_response?.utr || ''
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
