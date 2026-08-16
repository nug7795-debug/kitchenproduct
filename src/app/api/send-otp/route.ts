import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid 10-digit phone number' }, { status: 400 });
    }

    // Generate 6 digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send real SMS if FAST2SMS_API_KEY or SMS_API_KEY is configured in env
    const apiKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;
    if (apiKey) {
      try {
        await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            variables_values: otp,
            route: 'otp',
            numbers: phone
          })
        });
      } catch (err) {
        console.error('Fast2SMS Error:', err);
      }
    }

    return NextResponse.json({ success: true, otp, phone });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}
