const fs = require('fs');
const path = require('path');

const premiumClass = 'className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white shadow-sm"';

function walk(dir) {
    let list = fs.readdirSync(dir);
    list.forEach(file => {
        let fpath = path.join(dir, file);
        let stat = fs.statSync(fpath);
        if (stat.isDirectory()) {
            walk(fpath);
        } else if (fpath.endsWith('.tsx')) {
            let content = fs.readFileSync(fpath, 'utf8');
            let modified = false;

            // This regex matches a button tag that contains an <X /> icon
            // It looks for <button ... className="..." ...> \s* <X
            let newContent = content.replace(/<button([^>]*)className="([^"]*(?:rounded-md|rounded-sm|rounded-lg|rounded)[^"]*)"([^>]*)>\s*<X/g, (match, beforeClass, oldClass, afterClass) => {
                // We only want to replace buttons that are clearly just close buttons.
                // But since they have an X, they are almost definitely close buttons.
                console.log(`Replacing in ${fpath}:\nOld class: ${oldClass}`);
                return `<button${beforeClass}${premiumClass}${afterClass}>\n            <X`;
            });

            if (content !== newContent) {
                fs.writeFileSync(fpath, newContent);
                console.log('Saved:', fpath);
            }
        }
    });
}
walk('d:/Download/FuturesSystem2023-Mar-22/react-frontend/src');
