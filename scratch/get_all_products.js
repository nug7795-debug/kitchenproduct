const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getProducts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        product_images (image_url, is_featured)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    fs.writeFileSync('scratch/products.json', JSON.stringify(products, null, 2));
    console.log('SUCCESS! Wrote', products.length, 'products to scratch/products.json');
  } catch (e) {
    console.error(e);
  }
}

getProducts();
