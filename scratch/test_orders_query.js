const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOrders() {
  console.log('Fetching orders...');
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        total_amount,
        discount_amount,
        shipping_charge,
        addresses (
          full_name,
          phone,
          street_address,
          city,
          state,
          postal_code
        ),
        order_items (
          id,
          quantity,
          price,
          products (
            name,
            price,
            sale_price
          )
        ),
        payments (
          transaction_id,
          status,
          raw_response
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('QUERY ERROR:', error);
      return;
    }
    
    const sizeInBytes = Buffer.byteLength(JSON.stringify(data));
    console.log('SUCCESS! Fetched orders:', data.length);
    console.log('Total JSON size in bytes:', sizeInBytes);
    console.log('Total JSON size in KB:', (sizeInBytes / 1024).toFixed(2));
  } catch (e) {
    console.error('CRASH:', e);
  }
}

testOrders();
