const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'checkout', 'page.tsx');
const content = fs.readFileSync(filePath, 'utf8');

// Match tags (opening and closing)
// E.g. <div, </div>, <p, </p>, etc.
const lines = content.split('\n');

const stack = [];
let insideJSX = false;

// We'll search for open/close tags
const tagRegex = /<\/?[a-zA-Z0-9_\-]+(?:\s+[^>]*?)?>/g;
const selfClosingRegex = /\/>$/;

lines.forEach((line, index) => {
  const lineNum = index + 1;
  let match;
  
  // Find all matches on this line
  const matches = [];
  tagRegex.lastIndex = 0;
  while ((match = tagRegex.exec(line)) !== null) {
    matches.push({
      tagStr: match[0],
      index: match.index
    });
  }

  matches.forEach(({ tagStr }) => {
    // Determine tag name
    let isClosing = tagStr.startsWith('</');
    let isSelfClosing = tagStr.endsWith('/>');
    
    let tagNameMatch = tagStr.match(/<\/?([a-zA-Z0-9_\-]+)/);
    if (!tagNameMatch) return;
    let tagName = tagNameMatch[1];
    
    // Skip native HTML tags if they are self-closing, or custom standard self-closing tags
    if (isSelfClosing) {
      return;
    }
    
    // Ignore some common self closing tags that might not have /> in some templates
    const alwaysSelfClosing = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    if (alwaysSelfClosing.includes(tagName.toLowerCase()) && !isClosing) {
      return;
    }

    if (isClosing) {
      if (stack.length === 0) {
        console.log(`Error: Extra closing tag </${tagName}> found at line ${lineNum}: ${line.trim()}`);
      } else {
        const top = stack.pop();
        if (top.tagName !== tagName) {
          console.log(`Error: Tag mismatch at line ${lineNum}. Found </${tagName}> closing <${top.tagName}> from line ${top.lineNum}`);
        }
      }
    } else {
      stack.push({ tagName, lineNum, lineContent: line.trim() });
    }
  });
});

console.log('Unclosed tags remaining in stack:', stack.length);
stack.forEach(item => {
  console.log(`- <${item.tagName}> opened at line ${item.lineNum}: "${item.lineContent}"`);
});
