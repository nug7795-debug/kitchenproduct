import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getUser, adminOnly } from '@/lib/auth';

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
      .neq('status', 'draft')
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

export async function DELETE(request: Request) {
  try {
    const user = await adminOnly(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty IDs list' }, { status: 400 });
    }

    // 1. Delete associated payments first to prevent foreign key errors
    const { error: payErr } = await supabaseAdmin
      .from('payments')
      .delete()
      .in('order_id', ids);
    if (payErr) console.warn("Payment delete warning:", payErr);

    // 2. Delete associated order_items
    const { error: itemsErr } = await supabaseAdmin
      .from('order_items')
      .delete()
      .in('order_id', ids);
    if (itemsErr) console.warn("Order items delete warning:", itemsErr);

    // 3. Delete the orders
    const { error: orderErr } = await supabaseAdmin
      .from('orders')
      .delete()
      .in('id', ids);

    if (orderErr) throw orderErr;

    return NextResponse.json({ success: true, deletedCount: ids.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
