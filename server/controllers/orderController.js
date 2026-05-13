const { supabaseAdmin } = require('../config/supabase');

exports.createOrder = async (req, res) => {
  try {
    const { items, addressId, totalAmount, discountAmount, shippingCharge } = req.body;
    const userId = req.user.id;

    // 1. Create Order record
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        user_id: userId,
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
    const orderItems = items.map(item => ({
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

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
