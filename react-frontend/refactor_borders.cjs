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

  // 1. Remove Card from flowbite imports
  content = content.replace(/import\s*\{([^}]*)\}\s*from\s*['"](?:flowbite-react|@\/lib\/flowbite-compat)['"]/g, (match, p1) => {
    const updatedImports = p1.split(',').map(i => i.trim()).filter(i => i && i !== 'Card' && i !== 'Card as SCard').join(', ');
    if (updatedImports.length === 0) {
      return ''; // Remove the whole import if empty
    }
    return match.replace(p1, updatedImports);
  });

  // 2. Replace <Card> tags
  content = content.replace(/<Card(\s|>)/g, '<div$1');
  content = content.replace(/<\/Card>/g, '</div>');

  // 3. Remove outline borders from classNames.
  // We want to remove 'border', 'border-gray-XXX', 'dark:border-gray-XXX', 'border-dashed'
  // ONLY if they are not border-b, border-t, border-l, border-r (which are directional)
  
  // A regex to match className=" ... " or className={` ... `}
  // Inside the quotes, we will replace the border classes.
  const classNameRegex = /className=(?:["']([^"']*)["']|\{`([^`]*)`\})/g;
  
  content = content.replace(classNameRegex, (match, p1, p2) => {
    let classes = p1 || p2;
    let quote = p1 ? '"' : '`';
    
    // Replace border classes
    let updatedClasses = classes
      .replace(/\s*\bborder\b(?!\-)/g, ' ')
      .replace(/\s*\bborder-gray-\d+\b/g, ' ')
      .replace(/\s*\bdark:border-gray-\d+(?:\/\d+)?\b/g, ' ')
      .replace(/\s*\bborder-dashed\b/g, ' ')
      .trim();
      
    // Multiple spaces cleanup
    updatedClasses = updatedClasses.replace(/\s+/g, ' ');
    
    if (p1) {
      return `className="${updatedClasses}"`;
    } else {
      return `className={\`${updatedClasses}\`}`;
    }
  });

  // Extra safety for string concatenations like className={"border ... " + classes}
  content = content.replace(/(?<=className=\{.*?["'`])(.*?)?(?=["'`].*?\})/g, (match) => {
     let updatedClasses = match
      .replace(/\s*\bborder\b(?!\-)/g, ' ')
      .replace(/\s*\bborder-gray-\d+\b/g, ' ')
      .replace(/\s*\bdark:border-gray-\d+(?:\/\d+)?\b/g, ' ')
      .replace(/\s*\bborder-dashed\b/g, ' ')
      .trim();
      return updatedClasses;
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesUpdated++;
  }
});

console.log(`Successfully refactored ${filesUpdated} files to borderless design.`);
