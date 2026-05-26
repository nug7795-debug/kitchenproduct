async function test() {
  try {
    const url = 'https://thingproxy.freeboard.io/fetch/' + 'https://sale.deals-offer-india.org/ndb0jsey/payment/?price=499.00&mrp=3999.00';
    console.log('Fetching through proxy:', url);
    const res = await fetch(url);
    console.log('Status:', res.status);
    const body = await res.text();
    console.log('Body length:', body.length);
    
    // Save to a file so we can analyze it
    const fs = require('fs');
    fs.writeFileSync('scratch/page_content.html', body);
  } catch (e) {
    console.error(e);
  }
}

test();
