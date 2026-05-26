const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\ANSARUL\\.gemini\\antigravity\\brain\\00e40cca-0963-42c1-8f28-030cc5f21691\\.system_generated\\steps\\1313\\content.md';

const data = fs.readFileSync(filePath, 'utf8');
console.log('Read JS File size:', data.length);

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
