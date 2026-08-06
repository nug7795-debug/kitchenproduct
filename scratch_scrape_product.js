const fs = require('fs');

const url = 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale/product.php?id=2';

async function fetchWithRedirects(targetUrl) {
  console.log(`Fetching: ${targetUrl}`);
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  const response = await fetch(targetUrl, {
    headers: headers,
    redirect: 'follow'
  });

  console.log(`Status Code: ${response.status}`);
  console.log(`Final URL: ${response.url}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch. Status: ${response.status}`);
  }

  const rawData = await response.text();
  return { rawData, finalUrl: response.url };
}

fetchWithRedirects(url)
  .then(({ rawData, finalUrl }) => {
    fs.writeFileSync('scratch_scraped_product.html', rawData);
    console.log('HTML saved to scratch_scraped_product.html');
    
    // Extract SVG/image tags related to header
    // We can parse the top of the body or search for header-like tags.
    // Let's print out lines containing images, links or SVG icons in the top navigation area.
    console.log('\nHTML Scraped Successfully.');
  })
  .catch(err => {
    console.error('Error fetching page:', err);
  });
