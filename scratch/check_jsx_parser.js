const fs = require('fs');
const content = fs.readFileSync('src/app/globals.css', 'utf8');

const regex = /content/g;
let m;
const matches = [];
while ((m = regex.exec(content)) !== null) {
  matches.push(m.index);
}

matches.forEach((idx) => {
  console.log('--- CSS CONTENT MATCH ---');
  console.log(content.substring(idx - 100, idx + 200));
});
