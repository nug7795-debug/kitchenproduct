import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { amount, productinfo, firstname, email, phone, txnid: reqTxnId, orderId } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    // 1. Fetch payment settings dynamically from settings table
    const { data: settingsRecord } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'global_settings')
      .maybeSingle();

    const paymentSettings = settingsRecord?.value?.payment || {};
    const merchantUpiId = paymentSettings.merchantUpiId || process.env.UPI_ID || process.env.MERCHANT_UPI_ID || 'paytm.s1w1ia2@pty';
    const storeName = paymentSettings.payeeName || process.env.STORE_NAME || 'Sale Hub';
    const mccCode = paymentSettings.mccCode || '5722';

    // 2. Determine order and transaction ID to use
    let orderIdToUse = orderId;
    let txnid = reqTxnId;

    if (orderIdToUse) {
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('id', orderIdToUse)
        .maybeSingle();
      
      if (!existingOrder) {
        orderIdToUse = null;
      }
    }

    if (!orderIdToUse) {
      // Create a pending order for tracking
      const { data: newOrder, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert([{
          total_amount: Number(amount),
          discount_amount: 0,
          shipping_charge: 0,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderErr) throw orderErr;
      orderIdToUse = newOrder.id;
    }

    if (!txnid) {
      // Generate a unique transaction ID matching the reference style: TXN + Timestamp + 4 random digits
      txnid = `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Check if a payment with this txnid already exists
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('transaction_id', txnid)
      .maybeSingle();

    if (!existingPayment) {
      const { error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert([
          {
            order_id: orderIdToUse,
            transaction_id: txnid,
            amount: Number(amount),
            status: 'pending',
            method: 'UPI',
            raw_response: {
              customer_name: firstname,
              customer_email: email,
              customer_phone: phone,
              product_info: productinfo
            }
          }
        ]);

      if (paymentError) throw paymentError;
    }

    // 4. Generate UPI URLs
    // Universal upi://pay link
    const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(storeName)}&am=${Number(amount).toFixed(2)}&tn=${txnid}&tr=${txnid}&cu=INR`;

    // Dynamic QR code URL via free stable QR API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiUrl)}&size=220x220`;

    // Paytm Intent Link
    const paytmIntent = `paytmmp://cash_wallet?pa=${merchantUpiId}&pn=${encodeURIComponent(storeName)}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${txnid}&tr=${txnid}&mc=${mccCode}&featuretype=money_transfer`;

    // PhonePe Intent Link (Base64 Encoded JSON structure matching PhonePe native format)
    const phonepePayload = {
      contact: {
        cbsName: storeName,
        nickName: "Payment",
        vpa: merchantUpiId,
        type: "VPA"
      },
      p2pPaymentCheckoutParams: {
        note: txnid,
        isByDefaultKnownContact: true,
        enableSpeechToText: false,
        allowAmountEdit: false,
        showQrCodeOption: false,
        disableViewHistory: true,
        shouldShowUnsavedContactBanner: false,
        isRecurring: false,
        checkoutType: "DEFAULT",
        transactionContext: "p2p",
        initialAmount: Math.round(Number(amount) * 100), // in paise
        disableNotesEdit: true,
        showKeyboard: true,
        currency: "INR",
        shouldShowMaskedNumber: true
      }
    };
    const base64Data = Buffer.from(JSON.stringify(phonepePayload)).toString('base64');
    const phonepeIntent = `phonepe://native?data=${base64Data}&id=p2ppayment`;

    return NextResponse.json({
      success: true,
      txnid,
      amount: Number(amount),
      upiUrl,
      qrCodeUrl,
      paytmIntent,
      phonepeIntent,
      merchantName: storeName,
      upiId: merchantUpiId
    });
  } catch (error: any) {
    console.error('Initiate Payment Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
