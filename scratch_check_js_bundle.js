const fs = require('fs');
const https = require('https');

const url = 'https://akkskitchensalee.vercel.app/static/js/main.0a37cb46.js';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Downloaded JS Bundle of size:', data.length);
    
    // Let's search for some keywords and print surrounding context
    const keywords = ['7 days Replacement', 'product-data1', 'product-data2', 'product-data3', 'product-data4', 'wow-badge'];
    
    keywords.forEach(keyword => {
      let index = 0;
      console.log(`\n--- Matches for: "${keyword}" ---`);
      while ((index = data.indexOf(keyword, index)) !== -1) {
        const start = Math.max(0, index - 250);
        const end = Math.min(data.length, index + keyword.length + 250);
        console.log(`Match at index ${index}:`);
        console.log(data.substring(start, end));
        console.log('------------------------------------');
        index += keyword.length;
      }
    });
  });
}).on('error', (err) => {
  console.error('Error fetching bundle:', err);
});
