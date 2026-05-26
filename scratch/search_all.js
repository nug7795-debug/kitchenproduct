const fs = require('fs');
const diff = fs.readFileSync('scratch/diff.txt', 'utf8');

const lines = diff.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('WOW') || line.includes('EXPRESS')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
