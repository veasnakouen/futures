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

const files = walkSync(path.join(__dirname, 'src'));

let filesUpdated = 0;

files.forEach(file => {
  if (!file.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Clean up trailing 'dark:' or 'dark: /50' or 'dark: /' caused by previous regex
  content = content.replace(/dark:\s*(?:\/\d+)?(?=\s|"|'|`|}|\/)/g, '');
  
  // Clean up any double spaces in class names that might have been left
  content = content.replace(/className=(["'`])(.*?)\1/g, (match, quote, classes) => {
      let cleaned = classes.replace(/\s+/g, ' ').trim();
      return `className=${quote}${cleaned}${quote}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesUpdated++;
  }
});

console.log(`Successfully cleaned up dangling dark: prefixes in ${filesUpdated} files.`);
