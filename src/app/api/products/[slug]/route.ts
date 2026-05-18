import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, product_images(*), product_variants(*)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}
