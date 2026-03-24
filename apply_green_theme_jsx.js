const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Hex colors
  content = content.replace(/#f97316/gi, '#7d9e57'); // brand-500
  content = content.replace(/#fb923c/gi, '#9cb974'); // brand-400
  content = content.replace(/#ea580c/gi, '#628043'); // brand-600
  content = content.replace(/#c2410c/gi, '#4c6434'); // brand-700
  content = content.replace(/#7c2d12/gi, '#2f3d1f'); // brand-900
  content = content.replace(/#ffedd5/gi, '#e2ead9'); // brand-100
  content = content.replace(/#fff7ed/gi, '#f4f7f1'); // brand-50

  // RGBA colors
  content = content.replace(/249,?\s*115,?\s*22/g, '125, 158, 87'); 
  content = content.replace(/251,?\s*146,?\s*60/g, '156, 185, 116');
  content = content.replace(/234,?\s*88,?\s*12/g, '98, 128, 67');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

walkDir('f:/fitsence/src', replaceInFile);
console.log('All components updated to raw rustic green theme!');
