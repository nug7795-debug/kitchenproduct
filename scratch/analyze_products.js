const fs = require('fs');
const products = JSON.parse(fs.readFileSync('scratch/products.json', 'utf8'));

products.forEach((p) => {
  if (p.name.includes('Safari') || p.name.includes('Magnum')) {
    console.log('--- FOUND PRODUCT ---');
    console.log(JSON.stringify(p, null, 2));
  }
});
