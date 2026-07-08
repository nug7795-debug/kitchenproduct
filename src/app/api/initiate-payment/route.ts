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
    const merchantUpiId = paymentSettings.merchantUpiId || process.env.UPI_ID || process.env.MERCHANT_UPI_ID || 'paytm.s29ckmp@pty';
    const storeName = paymentSettings.payeeName || process.env.STORE_NAME || 'Gohil Vikrambhai Kanabhai';
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
    const paytmIntent = `paytmmp://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(storeName)}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${txnid}&tr=${txnid}`;

    // PhonePe Intent Link
    const phonepeIntent = `phonepe://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(storeName)}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${txnid}&tr=${txnid}`;

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
