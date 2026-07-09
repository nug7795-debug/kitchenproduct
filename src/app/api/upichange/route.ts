import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: upiRecord } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'upi_settings')
      .maybeSingle();

    const { data: pixelRecord } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', 'pixel_settings')
      .maybeSingle();

    // Get exact order count
    const { count } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const upi = upiRecord?.value || {
      upi: 'paytm.s27z8uz@pty',
      upi2: 'paytm.s27z8uz@pty',
      upi3: 'paytm.s27z8uz@pty',
      Gpay: true,
      Phonepe: true,
      Paytm: true,
      Bhim: true,
      WPay: true
    };

    const pixelId = pixelRecord?.value || {
      FacebookPixel: '',
      order: count || 0
    };

    // Return the structure expected by the settings client page
    return NextResponse.json({
      upi: {
        upi: upi.upi,
        upi2: upi.upi2,
        upi3: upi.upi3,
        Gpay: upi.Gpay,
        Phonepe: upi.Phonepe,
        Paytm: upi.Paytm,
        Bhim: upi.Bhim,
        WPay: upi.WPay
      },
      pixelId: {
        FacebookPixel: pixelId.FacebookPixel,
        order: count || 0
      }
    });
  } catch (error: any) {
    console.error('upichange GET error:', error);
    return NextResponse.json({ status: 0, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({
        key: 'upi_settings',
        value: {
          upi: body.upi,
          upi2: body.upi2,
          upi3: body.upi3,
          Gpay: !!body.Gpay,
          Phonepe: !!body.Phonepe,
          Paytm: !!body.Paytm,
          Bhim: !!body.Bhim,
          WPay: !!body.WPay
        },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) throw error;

    return NextResponse.json({ status: 1 });
  } catch (error: any) {
    console.error('upichange POST error:', error);
    return NextResponse.json({ status: 0, error: error.message }, { status: 500 });
  }
}
