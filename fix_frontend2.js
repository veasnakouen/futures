const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Download/FuturesSystem2023-Mar-22/react-frontend/src';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        fs.statSync(dirPath).isDirectory() ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(srcDir, function(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        content = content.replace(/(['"`])\/hr\/assets/g, '$1/stock/hr/assets');
        content = content.replace(/api\.([a-z]+)\(\s*(['"`])\/inventory/g, 'api.$1($2/stock/inventory');
        content = content.replace(/safeFetch\(\s*(['"`])\/inventory/g, 'safeFetch($1/stock/inventory');
        content = content.replace(/api\.([a-z]+)\(\s*(['"`])\/assets\//g, 'api.$1($2/stock/assets/');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed API paths in: ' + filePath);
        }
    }
});
console.log('Done');
