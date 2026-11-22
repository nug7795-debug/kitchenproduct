import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { amount, productinfo, firstname, email, phone, txnid: reqTxnId, orderId } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const isAndroid = /Android/i.test(userAgent);

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    // 1. Fetch payment settings dynamically from settings table
    const { data: upiRecord } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'upi_settings')
      .maybeSingle();

    const { data: settingsRecord } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'global_settings')
      .maybeSingle();

    const upiSettings = upiRecord?.value || {};
    const globalSettings = settingsRecord?.value?.payment || {};

    const defaultUpi = (globalSettings.upi || upiSettings.upi || globalSettings.merchantUpiId || process.env.UPI_ID || process.env.MERCHANT_UPI_ID || '03400C123L@mairtel').trim();
    const phonepeUpi = (globalSettings.upi2 || upiSettings.upi2 || defaultUpi).trim();
    const paytmUpi = (globalSettings.upi3 || upiSettings.upi3 || defaultUpi).trim();
    const storeName = (globalSettings.payeeName || process.env.STORE_NAME || 'Flipkart').trim();

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
          status: 'draft'
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
    const orderAmt = Number(amount).toFixed(2);
    const orderNote = `Paying To Flipkart ORDER${orderIdToUse || txnid}`;
    const encName = encodeURIComponent(storeName);
    const encNote = encodeURIComponent(orderNote);

    // Universal standard NPCI UPI link
    const upiUrl = `upi://pay?pa=${defaultUpi}&pn=${encName}&am=${orderAmt}&cu=INR&tn=${encNote}&tr=${txnid}`;

    // Dynamic QR code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiUrl)}&size=300x300`;

    // Direct Intent links without fake merchant codes
    const paytmIntent = `paytmmp://pay?pa=${paytmUpi}&pn=${encName}&am=${orderAmt}&cu=INR&tn=${encNote}&tr=${txnid}`;
    const phonepeIntent = `phonepe://pay?pa=${phonepeUpi}&pn=${encName}&am=${orderAmt}&cu=INR&tn=${encNote}&tr=${txnid}`;
    const gpayIntent = `tez://upi/pay?pa=${defaultUpi}&pn=${encName}&am=${orderAmt}&cu=INR&tn=${encNote}&tr=${txnid}`;

    return NextResponse.json({
      success: true,
      txnid,
      amount: Number(amount),
      upiUrl,
      qrCodeUrl,
      paytmIntent,
      phonepeIntent,
      gpayIntent,
      merchantName: storeName,
      upiId: defaultUpi,
      phonepeUpi,
      paytmUpi
    });
  } catch (error: any) {
    console.error('Initiate Payment Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
