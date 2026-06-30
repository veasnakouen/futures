const fs = require('fs');

let content = fs.readFileSync('d:\\Download\\FuturesSystem2023-Mar-22\\react-frontend\\src\\components\\clients\\ClientAdvancedFeatures.tsx', 'utf-8');
const chunksArrays = JSON.parse(fs.readFileSync('d:\\Download\\FuturesSystem2023-Mar-22\\extracted_chunks.json', 'utf-8'));

for (let chunks of chunksArrays) {
    if (typeof chunks === 'string') {
        chunks = JSON.parse(chunks);
    }
    let arr = Array.isArray(chunks) ? chunks : [chunks];
    
    // Sort chunks in descending order of StartLine to not mess up offsets
    arr.sort((a, b) => b.StartLine - a.StartLine);
    
    for (const chunk of arr) {
        if (!chunk.TargetContent || !chunk.ReplacementContent) continue;
        
        // We will try exact string replacement first
        if (content.includes(chunk.TargetContent)) {
            content = content.replace(chunk.TargetContent, chunk.ReplacementContent);
            console.log(`Replaced chunk starting with: ${chunk.TargetContent.substring(0, 30)}...`);
        } else {
            console.log(`COULD NOT FIND: ${chunk.TargetContent.substring(0, 30)}...`);
        }
    }
}

fs.writeFileSync('d:\\Download\\FuturesSystem2023-Mar-22\\react-frontend\\src\\components\\clients\\ClientAdvancedFeatures.tsx', content);
console.log("Done restoring file.");
