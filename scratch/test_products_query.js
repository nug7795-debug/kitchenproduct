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

async function testProducts() {
  console.log('Fetching products...');
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        ),
        product_images (
          image_url,
          is_featured
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('QUERY ERROR:', error);
      return;
    }
    
    console.log('SUCCESS! Fetched products:', data.length);
    if (data.length > 0) {
      console.log('First product sample:');
      console.log(JSON.stringify(data[0], null, 2));
    }
  } catch (e) {
    console.error('CRASH:', e);
  }
}

testProducts();
