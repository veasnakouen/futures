const fs = require('fs');
const parser = require('@babel/parser');

try {
   const code = fs.readFileSync('src/components/clients/ClientAdvancedFeatures.tsx', 'utf8');
   parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
   });
   console.log('No syntax errors found by Babel!');
} catch (e) {
   console.error('Syntax Error at line', e.loc?.line, 'column', e.loc?.column);
   console.error(e.message);
   const lines = fs.readFileSync('src/components/clients/ClientAdvancedFeatures.tsx', 'utf8').split('\n');
   if (e.loc?.line) {
      console.log('--- Context ---');
      for (let i = Math.max(0, e.loc.line - 3); i < Math.min(lines.length, e.loc.line + 3); i++) {
         console.log(`${i + 1}: ${lines[i]}`);
      }
   }
}
