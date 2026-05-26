const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\ANSARUL\\.gemini\\antigravity\\brain\\00e40cca-0963-42c1-8f28-030cc5f21691\\.system_generated\\steps\\1313\\content.md';
const data = fs.readFileSync(filePath, 'utf8');

const start = 662000;
const end = 672000;

console.log('Extracting section from index', start, 'to', end);
fs.writeFileSync('c:\\Users\\ANSARUL\\OneDrive\\Desktop\\kitchenproduct\\scratch_product_jsx.txt', data.substring(start, end), 'utf8');
console.log('Done!');
