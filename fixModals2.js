const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    fs.readdirSync(dir).forEach(function(file) {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) results = results.concat(walk(file));
        else if (file.endsWith('.tsx') || file.endsWith('.jsx')) results.push(file);
    });
    return results;
}

const files = walk(path.join(__dirname, 'react-frontend', 'src'));
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Check if it's a modal and missing X
    if (content.includes('<Modal ') && !content.includes('<X ') && !content.includes('<X/>')) {
        
        // Add import { X } from 'lucide-react'
        if (content.includes("from 'lucide-react'")) {
            content = content.replace(/(import\s+\{)([^}]*)(\}\s+from\s+['"]lucide-react['"])/, (match, p1, p2, p3) => {
                if (!p2.includes('X,') && !p2.includes(' X ')) {
                    return `${p1} X, ${p2} ${p3}`;
                }
                return match;
            });
        } else {
            content = `import { X } from 'lucide-react';\n` + content;
        }

        // Determine close handler
        const modalMatch = content.match(/<Modal[^>]*onClose={([^>}]*)}/);
        let closeHandler = 'onClose';
        if (modalMatch) {
            closeHandler = modalMatch[1];
        } else {
            const m2 = content.match(/<Modal[^>]*onClose={\(\)\s*=>\s*([^}]*)}/);
            if (m2) closeHandler = `() => ${m2[1]}`;
        }

        // The absolute X button
        const closeBtn = `
      <div className="absolute top-4 right-4 z-50">
         <button type="button" onClick={${closeHandler}} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
            <X size={20} />
         </button>
      </div>`;

        // Inject right before ModalBody or ModalHeader
        if (content.includes('<ModalHeader')) {
            content = content.replace(/(<ModalHeader)/, `${closeBtn}\n      $1`);
        } else if (content.includes('<ModalBody')) {
            content = content.replace(/(<ModalBody)/, `${closeBtn}\n      $1`);
        } else {
            content = content.replace(/(<Modal[^>]*>)/, `$1\n      ${closeBtn}`);
        }

        // Strip onClose={...} from ModalHeader so the default one doesn't render too
        content = content.replace(/(<ModalHeader[^>]*)onClose=\{[^}]*\}([^>]*>)/g, '$1$2');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log('Updated ' + path.basename(file));
    }
});

console.log('Modified ' + modifiedCount + ' files.');
