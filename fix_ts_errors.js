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

    // 1. Remove onClose={...} from <ModalHeader>
    content = content.replace(/(<ModalHeader[^>]*)onClose=\{[^}]*\}([^>]*>)/g, '$1$2');

    // 2. Fix ReactNode import in DataCard.tsx
    if (file.endsWith('DataCard.tsx')) {
        content = content.replace(/import\s+React\s*,\s*\{\s*ReactNode\s*\}\s*from\s+['"]react['"];/, "import React, { type ReactNode } from 'react';");
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log('Updated ' + path.basename(file));
    }
});

console.log('Modified ' + modifiedCount + ' files.');
