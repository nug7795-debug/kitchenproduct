const fs = require('fs');
const path = require('path');

function searchAllDirs(dir, term) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.next' || file === '.git') return;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchAllDirs(fullPath, term);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(term)) {
          console.log(`FOUND "${term}" IN: ${fullPath}`);
        }
      } catch (e) {}
    }
  });
}

searchAllDirs('.', 'WOW');
searchAllDirs('.', 'EXPRESS');
searchAllDirs('.', 'Bank offer');
