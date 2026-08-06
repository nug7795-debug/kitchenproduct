async function run() {
  try {
    const res = await fetch('https://goats-sale.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML Length:', html.length);
    
    // Save first 5000 chars to check if it's Cloudflare or actual site
    console.log('Snippet:', html.substring(0, 1000));
    
    const fs = require('fs');
    fs.writeFileSync('goats-sale.html', html);
    console.log('HTML saved to goats-sale.html');
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

run();
