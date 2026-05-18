import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
