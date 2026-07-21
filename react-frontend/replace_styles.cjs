const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'features', 'school', 'components');

const TARGET_INPUT_CLASS = 'w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all';
const TARGET_LABEL_CLASS = 'text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block';
const TARGET_TEXTAREA_CLASS = 'w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm p-4 resize-none focus:ring-2 focus:ring-blue-500 transition-all';

const OLD_INPUT_CLASSES = [
  'w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500',
  'w-full px-3 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors',
  'w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600'
];

const OLD_LABEL_CLASSES = [
  'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
  'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Replace inputs
      for (const oldClass of OLD_INPUT_CLASSES) {
        content = content.replaceAll(oldClass, TARGET_INPUT_CLASS);
      }

      // Replace labels
      for (const oldLabel of OLD_LABEL_CLASSES) {
        content = content.replaceAll(oldLabel, TARGET_LABEL_CLASS);
      }
      
      // SelectTrigger classes are slightly different. 
      // E.g., 'w-full h-[42px] rounded-lg bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 dark:hover:border-blue-600'
      const oldSelectTrigger = 'w-full h-[42px] rounded-lg bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 dark:hover:border-blue-600';
      const targetSelectTrigger = 'w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all';
      content = content.replaceAll(oldSelectTrigger, targetSelectTrigger);

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log("Done");
