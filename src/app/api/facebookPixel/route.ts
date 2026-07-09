import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save Pixel settings
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({
        key: 'pixel_settings',
        value: {
          FacebookPixel: body.pixelId,
          order: 0
        },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) throw error;

    return NextResponse.json({ status: 1 });
  } catch (error: any) {
    console.error('facebookPixel POST error:', error);
    return NextResponse.json({ status: 0, error: error.message }, { status: 500 });
  }
}
