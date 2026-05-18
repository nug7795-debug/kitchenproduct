const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'checkout', 'page.tsx');
const content = fs.readFileSync(filePath, 'utf8');

console.log('File size:', content.length, 'characters');

let braces = 0;
let parens = 0;
let brackets = 0;
let lineNum = 1;
let colNum = 1;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === '\n') {
    lineNum++;
    colNum = 1;
  } else {
    colNum++;
  }

  if (char === '{') braces++;
  if (char === '}') braces--;
  if (char === '(') parens++;
  if (char === ')') parens--;
  if (char === '[') brackets++;
  if (char === ']') brackets--;

  if (braces < 0) {
    console.log(`Unbalanced closing curly brace at line ${lineNum}, col ${colNum}`);
    braces = 0;
  }
  if (parens < 0) {
    console.log(`Unbalanced closing parenthesis at line ${lineNum}, col ${colNum}`);
    parens = 0;
  }
  if (brackets < 0) {
    console.log(`Unbalanced closing bracket at line ${lineNum}, col ${colNum}`);
    brackets = 0;
  }
}

console.log('Final counts:', { braces, parens, brackets });
