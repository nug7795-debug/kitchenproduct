const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\ANSARUL\\.gemini\\antigravity\\brain\\00e40cca-0963-42c1-8f28-030cc5f21691\\.system_generated\\steps\\1313\\content.md';
const data = fs.readFileSync(filePath, 'utf8');

const keywords = ['Pay Later', 'paylater', 'logo2.png', 'Credit Up to', '7 Days Replacement', '7 days Replacement'];

keywords.forEach(keyword => {
  let index = 0;
  console.log(`\n--- Matches for: "${keyword}" ---`);
  while ((index = data.indexOf(keyword, index)) !== -1) {
    const start = Math.max(0, index - 150);
    const end = Math.min(data.length, index + keyword.length + 150);
    console.log(`Match at index ${index}:`);
    console.log(data.substring(start, end));
    console.log('------------------------------------');
    index += keyword.length;
  }
});
