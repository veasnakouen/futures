const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'react-frontend', 'src'));
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Add onClose={...} to ModalHeader
    // First, find what Modal uses for onClose.
    const modalMatch = content.match(/<Modal[^>]*onClose={([^>}]*)}/);
    let closeHandler = 'onClose';
    if (modalMatch) {
        closeHandler = modalMatch[1];
    } else {
        const modalMatch2 = content.match(/<Modal[^>]*onClose={\(\)\s*=>\s*([^}]*)}/);
        if (modalMatch2) {
           closeHandler = `() => ${modalMatch2[1]}`;
        }
    }

    // Replace <ModalHeader className=... with <ModalHeader onClose={...} className=...
    content = content.replace(/<ModalHeader(?!.*?onClose)(.*?)>/g, `<ModalHeader onClose={${closeHandler}}$1>`);

    // 2. Ensure footer buttons have h-12
    // Look for Button elements inside ModalFooter or divs near the end.
    // Actually, just find any Button with color="light" or color="gray" that's used for discarding/canceling, and if it has className="..." but lacks h-12, add h-12.
    // Also add h-12 to the submit buttons if they lack it.
    
    // Instead of parsing perfectly, let's just use regex to inject h-12 into buttons inside ModalFooter
    const footerBlocks = content.match(/<ModalFooter[\s\S]*?<\/ModalFooter>/g);
    if (footerBlocks) {
        footerBlocks.forEach(block => {
            let newBlock = block.replace(/<Button([^>]*)className="([^"]*?)"([^>]*)>/g, (match, before, classes, after) => {
                if (!classes.includes('h-12')) {
                    return `<Button${before}className="${classes} h-12"${after}>`;
                }
                return match;
            });
            content = content.replace(block, newBlock);
        });
    }

    // Also look for custom footers like <div className="flex justify-end gap-4...
    // We can just add h-12 to buttons that contain text like "Cancel", "Discard", "Close" and their sibling primary buttons.
    content = content.replace(/<Button([^>]*)>([\s\S]*?(?:Cancel|Discard|Close|Update|Initialize|Save|Submit|Add|Create|Publish|Enroll|Confirm)[\s\S]*?)<\/Button>/g, (match, props, text) => {
        if (props.includes('className="') && !props.includes('h-12')) {
            return `<Button${props.replace(/className="([^"]*?)"/, 'className="$1 h-12"')}>${text}</Button>`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Modified ${modifiedCount} files.`);
