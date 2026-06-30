const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Download/FuturesSystem2023-Mar-22/react-frontend/src';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(srcDir, function(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        if (content.includes('/api/assets')) {
            content = content.replace(/\/api\/assets/g, '/api/stock/assets');
            modified = true;
        }
        if (content.includes('/api/inventory')) {
            content = content.replace(/\/api\/inventory/g, '/api/stock/inventory');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed API paths in: ' + filePath);
        }
    }
});

console.log('Frontend API routing fix complete!');
