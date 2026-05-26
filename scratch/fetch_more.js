const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\ANSARUL\\.gemini\\antigravity\\brain\\00e40cca-0963-42c1-8f28-030cc5f21691\\.system_generated\\steps\\1012\\content.md', 'utf8');

const sIdx = content.indexOf('Similar Products');
if (sIdx !== -1) {
  console.log('--- CONTEXT OF Similar Products ---');
  console.log(content.substring(sIdx - 150, sIdx + 450));
} else {
  console.log('No "Similar Products" found');
}
