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

    // 3. Update Payment record
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({ 
        status: 'processing',
        raw_response: { utr: utr } 
      })
      .eq('transaction_id', transactionId);

    if (updateError) throw updateError;

    // SIMULATION: In a real app, this would be a background job.
    // We'll mark it as success immediately for this demo or use a serverless timeout (limited on Hobby).
    // Better yet, just return processing and let the user wait.
    
    return NextResponse.json({
      success: true,
      message: 'UTR submitted. Verification in progress...'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
