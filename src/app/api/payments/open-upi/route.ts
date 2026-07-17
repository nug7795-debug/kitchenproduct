import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { txnid, app } = await request.json();

    if (!txnid) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Update payment record to processing status since the user clicked to open the UPI app
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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
