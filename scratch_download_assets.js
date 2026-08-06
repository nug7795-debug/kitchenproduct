const fs = require('fs');
const path = require('path');

const assets = [
  {
    url: 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/xxx/upor5.webp',
    dest: 'public/uploads/upor5.webp'
  },
  {
    url: 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/xxx/banner/lapalop1.webp',
    dest: 'public/uploads/lapalop1.webp'
  },
  {
    url: 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/xxx/banner/lapalop2.webp',
    dest: 'public/uploads/lapalop2.webp'
  },
  {
    url: 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/xxx/banner/lapalop3.webp',
    dest: 'public/uploads/lapalop3.webp'
  },
  {
    url: 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/assets/website/images/theme/clock.svg',
    dest: 'public/uploads/clock.svg'
  }
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/'
};

async function downloadAsset(url, dest) {
  console.log(`Downloading ${url} to ${dest}...`);
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}. Status: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  
  // Ensure directory exists
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(dest, Buffer.from(buffer));
  console.log(`Successfully saved ${dest}`);
}

async function main() {
  for (const asset of assets) {
    try {
      await downloadAsset(asset.url, asset.dest);
    } catch (e) {
      console.error(`Error downloading ${asset.url}:`, e.message);
    }
  }
}

main();
