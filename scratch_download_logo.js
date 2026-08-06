const fs = require('fs');
const https = require('https');
const url = 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/xxx/fliplpogo.png';
const dest = 'public/uploads/fliplpogo.png';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/product.php?id=2'
  }
};

function download(targetUrl) {
  console.log(`Downloading: ${targetUrl}`);
  https.get(targetUrl, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    if (res.statusCode === 301 || res.statusCode === 302) {
      console.log(`Redirecting to: ${res.headers.location}`);
      download(res.headers.location);
      return;
    }
    if (res.statusCode !== 200) {
      console.error(`Download failed: status ${res.statusCode}`);
      return;
    }
    const data = [];
    res.on('data', chunk => data.push(chunk));
    res.on('end', () => {
      fs.writeFileSync(dest, Buffer.concat(data));
      console.log(`Saved logo to ${dest}`);
    });
  }).on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
}

download(url);
