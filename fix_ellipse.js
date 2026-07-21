const fs = require('fs');
const path = require('path');

const oldClass = 'className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white shadow-sm"';
const newClass = 'className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"';

function walk(dir) {
    let list = fs.readdirSync(dir);
    list.forEach(file => {
        let fpath = path.join(dir, file);
        let stat = fs.statSync(fpath);
        if (stat.isDirectory()) {
            walk(fpath);
        } else if (fpath.endsWith('.tsx')) {
            let content = fs.readFileSync(fpath, 'utf8');
            
            if (content.includes(oldClass)) {
                let newContent = content.split(oldClass).join(newClass);
                fs.writeFileSync(fpath, newContent);
                console.log('Fixed:', fpath);
            }
        }
    });
}
walk('d:/Download/FuturesSystem2023-Mar-22/react-frontend/src');
