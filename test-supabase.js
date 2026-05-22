const supabaseUrl = 'https://scjbackzybmoapkupfbi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjamJhY2t6eWJtb2Fwa3VwZmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzM0MjUsImV4cCI6MjA5NDI0OTQyNX0.3rcgjJT4xpPijAW4sL6PQ--lshVlluQhAAU417zj5xw';

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
