const fs = require('fs');
const content = fs.readFileSync('c:/Users/iulia/travelai_deals/src/affiliates/registry.ts', 'utf8');
const lines = content.split('\n');
const keys = [];
lines.forEach((line, i) => {
    // Look for key: { patterns, allowing for leading whitespace
    const match = line.match(/^\s*([a-z0-9_]+):\s*{/);
    if (match) {
        keys.push({ key: match[1], line: i + 1 });
    }
});

const counts = {};
const duplicates = [];

keys.forEach(k => {
    if (counts[k.key]) {
        duplicates.push({ key: k.key, firstLine: counts[k.key], dupLine: k.line });
    } else {
        counts[k.key] = k.line;
    }
});

if (duplicates.length > 0) {
    console.log('Duplicates found:');
    duplicates.forEach(d => console.log(`- ${d.key}: lines ${d.firstLine} and ${d.dupLine}`));
} else {
    console.log('No duplicates found.');
}
