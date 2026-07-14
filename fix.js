const fs = require('fs');
const path = 'd:/Download/FuturesSystem2023-Mar-22/react-frontend/src/views/InventoryPage.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync(path, content);
console.log('Fixed escaping in InventoryPage.tsx');
