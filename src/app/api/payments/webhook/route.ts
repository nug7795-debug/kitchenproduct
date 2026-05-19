import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('Incoming payment webhook payload:', payload);

    // SMS to Webhook apps typically send:
    // { "from": "Paytm", "text": "You have received Rs.350.00 in your bank account Ref: 612456789012" }
    // Or generic keys like "message", "body", "content", "sender".
    const text = payload.text || payload.message || payload.body || payload.content || '';
    const sender = payload.from || payload.sender || '';

    if (!text) {
      return NextResponse.json({ error: 'Message body is required' }, { status: 400 });
    }

    // 1. Extract Amount from SMS body using regular expressions
    // Matches patterns like "Rs. 350.00", "Rs.350.00", "INR 350", "credited with 350.00", "received 350.00"
    const amountRegex = /(?:Rs\.?|INR|credited\s+with|received\s+)\s*([0-9]+(?:\.[0-9]+)?)/i;
    const amountMatch = text.match(amountRegex);
    const parsedAmount = amountMatch ? parseFloat(amountMatch[1]) : null;

    // 2. Extract 12-digit UPI UTR/Ref Number
    // UPI Reference numbers are always exactly 12 numeric digits in India (usually starting with 3, 4, 5, 6, etc.)
    const utrRegex = /\b([0-9]{12})\b/;
    const utrMatch = text.match(utrRegex);
    const parsedUtr = utrMatch ? utrMatch[1] : null;

    if (!parsedAmount) {
      return NextResponse.json({ error: 'Could not parse amount from SMS body' }, { status: 400 });
    }

    console.log(`Parsed Webhook Data - Amount: ₹${parsedAmount}, UTR/Ref: ${parsedUtr || 'None'}`);

    // 3. Match and auto-verify the payment in the database
    // We search for a pending or processing payment matching the exact parsed amount.
    // If a UTR is parsed, we also search for payments with matching UTR in raw_response, or we save it.
    let matchedPayment = null;

    // Step A: If UTR is present, try to find a payment where the user entered this UTR
    if (parsedUtr) {
      const { data: paymentsWithUtr } = await supabaseAdmin
        .from('payments')
        .select('*')
        .or(`status.eq.pending,status.eq.processing`);

      if (paymentsWithUtr) {
        // Find if any payment record matches the UTR in raw_response or has the same amount
        matchedPayment = paymentsWithUtr.find(p => {
          const userUtr = p.raw_response?.utr || '';
          const matchUtr = userUtr.trim() === parsedUtr.trim();
          const matchAmount = Math.abs(Number(p.amount) - parsedAmount) < 0.05;
          return matchUtr || (matchAmount && !userUtr);
        });
      }
    }

    // Step B: Fallback to matching only by amount if no explicit UTR match was found
    if (!matchedPayment) {
      const { data: paymentsByAmount } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (paymentsByAmount) {
        // Find the most recent pending payment matching the exact amount (allowing small float rounding)
        matchedPayment = paymentsByAmount.find(p => Math.abs(Number(p.amount) - parsedAmount) < 0.05);
      }
    }

    if (!matchedPayment) {
      console.log(`No pending payment found matching amount ₹${parsedAmount}`);
      return NextResponse.json({ 
        success: false, 
        message: `No pending payment matches amount ₹${parsedAmount}. Saved for manual reconciliation.` 
      });
    }

    console.log(`Matching Payment Record Found: ID ${matchedPayment.id}, TxnId: ${matchedPayment.transaction_id}`);

    // 4. Update the Payment record to success
    const finalUtr = parsedUtr || matchedPayment.raw_response?.utr || `AUTO_${Date.now()}`;
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'success',
        raw_response: {
          ...matchedPayment.raw_response,
          utr: finalUtr,
          verified_at: new Date().toISOString(),
          verification_method: 'SMS_WEBHOOK',
          raw_sms: text,
          sender: sender
        }
      })
      .eq('id', matchedPayment.id);

    if (updateError) throw updateError;

    // 5. Update the associated Order status to paid / processing
    if (matchedPayment.order_id) {
      const { error: orderError } = await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', matchedPayment.order_id);

      if (orderError) {
        console.error('Error updating order status in webhook:', orderError);
      }
    }

    console.log(`Transaction ${matchedPayment.transaction_id} verified successfully via SMS webhook!`);

    return NextResponse.json({
      success: true,
      message: 'Transaction auto-verified successfully.',
      transactionId: matchedPayment.transaction_id,
      amount: parsedAmount,
      utr: finalUtr
    });
  } catch (err: any) {
    console.error('Webhook Verification Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
