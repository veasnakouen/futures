const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src/app'));

let filesUpdated = 0;

files.forEach(file => {
  if (!file.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  content = content.replace(/\(\s*boolean\)\s*=>\s*setTheme\(dark \? "dark" : "light"\)/g, '(dark: boolean) => setTheme(dark ? "dark" : "light")');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesUpdated++;
  }
});

console.log(`Successfully fixed syntax errors in ${filesUpdated} files.`);
