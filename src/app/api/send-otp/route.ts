import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid 10-digit phone number' }, { status: 400 });
    }

    // Generate 6 digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    let sentViaSms = false;

    // 1. Fetch SMS API keys from global_settings in Supabase
    try {
      const { data: settingsData } = await supabase
        .from('global_settings')
        .select('value')
        .eq('key', 'global_settings')
        .single();

      const settings = settingsData?.value || {};
      const fast2smsKey = settings.sms?.fast2sms_key || process.env.FAST2SMS_API_KEY;
      const twoFactorKey = settings.sms?.two_factor_key || process.env.TWO_FACTOR_API_KEY;

      // Try Fast2SMS Route
      if (fast2smsKey) {
        const smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': fast2smsKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            variables_values: otp,
            route: 'otp',
            numbers: phone
          })
        });
        if (smsRes.ok) sentViaSms = true;
      }

      // Try 2Factor Route if Fast2SMS not set/failed
      if (!sentViaSms && twoFactorKey) {
        const tfRes = await fetch(`https://2factor.in/API/V1/${twoFactorKey}/SMS/${phone}/${otp}/OTP1`);
        if (tfRes.ok) sentViaSms = true;
      }
    } catch (err) {
      console.error('SMS Gateway Error:', err);
    }

    // Log OTP in Supabase otp_logs table for admin tracking
    try {
      await supabase.from('otp_logs').insert([{
        phone,
        otp,
        sent_via_sms: sentViaSms,
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      // Table might not exist yet, suppress error
    }

    return NextResponse.json({ 
      success: true, 
      otp, 
      phone, 
      sentViaSms,
      message: sentViaSms ? 'OTP sent via SMS' : 'OTP generated successfully' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}
