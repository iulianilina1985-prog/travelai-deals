const fs = require('fs');
const content = fs.readFileSync('c:/Users/iulia/travelai_deals/src/affiliates/registry.ts', 'utf8');
const lines = content.split('\n');
const keys = [];
lines.forEach((line, i) => {
    const match = line.match(/^    ([a-z0-9_]+): \{/);
    if (match) {
        keys.push({ key: match[1], line: i + 1 });
    }
});

const seen = new Set();
const dups = [];
keys.forEach(k => {
    if (seen.has(k.key)) {
        dups.push(k);
    }
    seen.add(k.key);
});

console.log('Duplicates found:', JSON.stringify(dups, null, 2));
