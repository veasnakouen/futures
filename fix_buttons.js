const fs = require('fs');
const path = require('path');
function walk(d) {
    let list = fs.readdirSync(d);
    list.forEach(f => {
        let fpath = path.join(d, f);
        let stat = fs.statSync(fpath);
        if (stat.isDirectory()) {
            walk(fpath);
        } else if (fpath.endsWith('.tsx')) {
            let c = fs.readFileSync(fpath, 'utf8');
            let nc = c.replace(/className=\"p-1\.5 text-gray-500 (bg-transparent|bg-white) rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm\"/g, 'className=\"flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white shadow-sm\"');
            if (c !== nc) {
                fs.writeFileSync(fpath, nc);
                console.log('Fixed:', fpath);
            }
        }
    });
}
walk('d:/Download/FuturesSystem2023-Mar-22/react-frontend/src');
