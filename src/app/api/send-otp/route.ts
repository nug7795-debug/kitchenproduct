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
    const smsMessage = `LOGIN to your Flipkart account using OTP ${otp}. DO NOT SHARE this code with anyone, including delivery agents. #${otp}`;
    let sentViaSms = false;
    let gatewayResponse: any = null;

    // 1. Fetch SMS API keys from global_settings or settings in Supabase
    try {
      const { data: settingsData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'global_settings')
        .maybeSingle();

      const settings = settingsData?.value || {};
      const fast2smsKey = settings.sms?.fast2sms_key || process.env.FAST2SMS_API_KEY;
      const twoFactorKey = settings.sms?.two_factor_key || process.env.TWO_FACTOR_API_KEY;

      // Try Fast2SMS GET & POST Routes
      if (fast2smsKey && !sentViaSms) {
        try {
          // Method A: Fast2SMS GET Bulk V2 OTP Route
          const getUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${otp}&numbers=${phone}`;
          const resA = await fetch(getUrl);
          const dataA = await resA.json();
          if (dataA.return === true || dataA.status_code === 200) {
            sentViaSms = true;
            gatewayResponse = dataA;
          } else {
            // Method B: Fast2SMS Quick SMS Route
            const resB = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&message=${encodeURIComponent(smsMessage)}&language=english&route=q&numbers=${phone}`);
            const dataB = await resB.json();
            if (dataB.return === true || dataB.status_code === 200) {
              sentViaSms = true;
              gatewayResponse = dataB;
            }
          }
        } catch (fErr) {
          console.error('Fast2SMS fetch error:', fErr);
        }
      }

      // Try 2Factor Route if Fast2SMS not set or failed
      if (twoFactorKey && !sentViaSms) {
        try {
          const tfRes = await fetch(`https://2factor.in/API/V1/${twoFactorKey}/SMS/${phone}/${otp}/OTP1`);
          const tfData = await tfRes.json();
          if (tfData.Status === 'Success') {
            sentViaSms = true;
            gatewayResponse = tfData;
          }
        } catch (tfErr) {
          console.error('2Factor fetch error:', tfErr);
        }
      }
    } catch (err) {
      console.error('SMS Gateway Config Error:', err);
    }

    // Save sent OTP record in Supabase database for admin tracking
    try {
      await supabase.from('otp_logs').insert([{
        phone,
        otp,
        message: smsMessage,
        sent_via_sms: sentViaSms,
        gateway_response: gatewayResponse,
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
      smsMessage,
      message: sentViaSms ? 'OTP SMS sent successfully to mobile number' : 'OTP generated. Please configure Fast2SMS/2Factor API key in Admin Settings for SMS delivery.' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}
