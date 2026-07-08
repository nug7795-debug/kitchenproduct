const supabaseUrl = 'https://rcsqcbrdfqgxqhnyqtoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3FjYnJkZnFneHFobnlxdG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTgxNTYsImV4cCI6MjA5OTAzNDE1Nn0.8J3-Sb6e-aF1cv6Lll-y7KNR-oIQ6mFzllndgxrVKHM';

async function run() {
  const url = `${supabaseUrl}/rest/v1/products?select=*,categories(name,slug),product_images(image_url,is_featured)&order=created_at.desc`;
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    if (!res.ok) {
      console.error('HTTP Error:', res.status, await res.text());
      return;
    }
    
    const data = await res.json();
    console.log('Total Products:', data.length);
    data.forEach((p, index) => {
      if (!p.name) {
        console.log(`Product at index ${index} has missing/null name! ID:`, p.id);
      }
      if (p.price === null || p.price === undefined) {
        console.log(`Product at index ${index} ("${p.name}") has missing price! ID:`, p.id);
      }
    });
    console.log('Scan complete.');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
