import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { adminOnly } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await adminOnly(request);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status } = await request.json();
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
