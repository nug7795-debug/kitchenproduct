const fs = require('fs');

const url = 'https://newsale.big-sale-offer.com/MPPklD/OFFER/newsale';

async function fetchWithRedirects(targetUrl, depth = 0) {
  if (depth > 5) {
    throw new Error('Too many redirects');
  }
  console.log(`Fetching: ${targetUrl} (depth: ${depth})`);
  
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
    fs.writeFileSync('scratch_scraped_page.html', rawData);
    console.log('HTML saved to scratch_scraped_page.html');
    
    // Extract image URLs
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    const images = [];
    while ((match = imgRegex.exec(rawData)) !== null) {
      images.push(match[1]);
    }
    console.log('\nFound Images:');
    console.log(JSON.stringify(images, null, 2));

    // Extract link stylesheet tags
    const cssRegex = /<link[^>]+href="([^">]+\.css)"/g;
    const stylesheets = [];
    while ((match = cssRegex.exec(rawData)) !== null) {
      stylesheets.push(match[1]);
    }
    console.log('\nFound Stylesheets:');
    console.log(JSON.stringify(stylesheets, null, 2));
  })
  .catch(err => {
    console.error('Error fetching page:', err);
  });
