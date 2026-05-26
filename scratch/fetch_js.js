const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\ANSARUL\\.gemini\\antigravity\\brain\\00e40cca-0963-42c1-8f28-030cc5f21691\\.system_generated\\steps\\1012\\content.md', 'utf8');

const queryImages = ['img/p-1.png', 'img/p-2.png', 'img/plus.png', 'img/wow.png', 'img/salec.png'];

queryImages.forEach((img) => {
  const index = content.indexOf(img);
  if (index !== -1) {
    console.log(`--- CONTEXT OF ${img} ---`);
    console.log(content.substring(index - 150, index + 350));
  } else {
    console.log(`--- ${img} not found ---`);
  }
});
