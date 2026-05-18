import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, addressId, totalAmount, discountAmount, shippingCharge } = body;

    // 1. Create Order record
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        user_id: user.id,
        total_amount: totalAmount,
        discount_amount: discountAmount || 0,
        shipping_charge: shippingCharge || 0,
        address_id: addressId,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
