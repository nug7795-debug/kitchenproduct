import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: globalRecord, error: globalErr } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'global_settings')
      .maybeSingle();

    const { data: upiRecord } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'upi_settings')
      .maybeSingle();

    const { data: merchantRecord } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'merchant_upi')
      .maybeSingle();

    if (globalErr) {
      console.error('Error fetching global settings:', globalErr);
    }

    return NextResponse.json({
      success: true,
      global_settings: globalRecord?.value || null,
      upi_settings: upiRecord?.value || null,
      merchant_upi: merchantRecord?.value || null
    });
  } catch (error: any) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json({ success: false, error: 'Settings payload is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // 1. Save global_settings
    const { error: globalErr } = await supabaseAdmin
      .from('settings')
      .upsert({
        key: 'global_settings',
        value: settings,
        updated_at: now
      }, { onConflict: 'key' });

    if (globalErr) throw globalErr;

    // 2. Save upi_settings so upi endpoints stay synced
    const payment = settings.payment || {};
    const defaultUpi = (payment.upi || payment.merchantUpiId || '03400C123L@mairtel').trim();
    const upi2 = (payment.upi2 || defaultUpi).trim();
    const upi3 = (payment.upi3 || defaultUpi).trim();
    const payeeName = (payment.payeeName || 'Flipkart').trim();
    const mccCode = (payment.mccCode || '4722').trim();

    const upiSettingsValue = {
      upi: defaultUpi,
      upi2: upi2,
      upi3: upi3,
      Gpay: true,
      Phonepe: true,
      Paytm: true,
      Bhim: true,
      WPay: true
    };

    await supabaseAdmin
      .from('settings')
      .upsert({
        key: 'upi_settings',
        value: upiSettingsValue,
        updated_at: now
      }, { onConflict: 'key' });

    // 3. Save merchant_upi
    const merchantUpiValue = {
      mode: 'manual',
      upi_id: defaultUpi,
      merchant_code: mccCode,
      merchant_name: payeeName
    };

    await supabaseAdmin
      .from('settings')
      .upsert({
        key: 'merchant_upi',
        value: merchantUpiValue,
        updated_at: now
      }, { onConflict: 'key' });

    return NextResponse.json({
      success: true,
      message: 'Payment and global configuration successfully updated.'
    });
  } catch (error: any) {
    console.error('POST /api/settings error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
