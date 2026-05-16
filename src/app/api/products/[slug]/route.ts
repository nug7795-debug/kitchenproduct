import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, product_images(*), product_variants(*)')
      .eq('slug', params.slug)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}
