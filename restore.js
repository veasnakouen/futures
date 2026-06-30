const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\K-VeaSna\\.gemini\\antigravity-ide\\brain\\318945f4-aaa6-4d38-bfad-7148e3985ca2\\.system_generated\\logs\\transcript.jsonl', 'utf-8').split('\n').filter(Boolean);

let chunks = [];

for (const line of lines) {
    try {
        const entry = JSON.parse(line);
        if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
            for (const call of entry.tool_calls) {
                if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
                    if (call.args.TargetFile && call.args.TargetFile.includes('ClientAdvancedFeatures.tsx')) {
                        if (call.args.ReplacementChunks) {
                            chunks.push(call.args.ReplacementChunks);
                        } else {
                            chunks.push(call.args);
                        }
                    }
                }
            }
        }
    } catch (e) {}
}

fs.writeFileSync('d:\\Download\\FuturesSystem2023-Mar-22\\extracted_chunks.json', JSON.stringify(chunks.slice(-10), null, 2));
console.log('Extracted ' + chunks.length + ' chunks.');
