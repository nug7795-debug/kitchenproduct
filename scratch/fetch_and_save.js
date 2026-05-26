const fs = require('fs');

async function main() {
  try {
    const url = 'https://akkskitchensalee.vercel.app/static/js/main.0a37cb46.js';
    console.log('Fetching:', url);
    
    // We can use a retry loop for robust fetching
    let res;
    for (let i = 0; i < 3; i++) {
      try {
        res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (res.ok) break;
      } catch (err) {
        console.log(`Attempt ${i+1} failed: ${err.message}`);
        if (i === 2) throw err;
      }
    }
    
    const text = await res.text();
    fs.writeFileSync('scratch/main_bundle.js', text);
    console.log('Successfully saved to scratch/main_bundle.js. Length:', text.length);
  } catch (e) {
    console.error('Error fetching JS bundle:', e);
  }
}

main();
