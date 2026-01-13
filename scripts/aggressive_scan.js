const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');

function getFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getFiles(full));
        } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
            files.push(full);
        }
    }
    return files;
}

const files = getFiles(srcDir);
console.log('--- Aggressive Syntax Scan ---');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    // 1. Nested imports
    let inImportBraces = false;
    lines.forEach((line, idx) => {
        if (line.includes('import {')) inImportBraces = true;
        if (line.includes(' import ') && inImportBraces) {
            console.log(`[NESTED IMPORT] ${file}:${idx + 1}`);
        }
        if (line.includes('} from')) inImportBraces = false;
    });

    // 2. Fragmented/Duplicated keywords
    if (/const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);/g.test(content)) {
        const matches = content.match(/const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);/g);
        if (matches.length > 1) {
            console.log(`[DUP HOOK] ${file} (${matches.length} times)`);
        }
    }

    // 3. useTranslation outside component (simplified check: top level)
    lines.forEach((line, idx) => {
        if (line.includes('const { t } = useTranslation()') && !line.startsWith(' ') && !line.startsWith('\t')) {
            // This might be okay if it's the start of a component, but let's flag it if it's NOT inside a function
            // Actually, usually it starts with "  const { t }"
            // If it starts at col 0, it's suspicious.
            if (line.startsWith('const')) {
                console.log(`[TOP LEVEL HOOK?] ${file}:${idx + 1}`);
            }
        }
    });

    // 4. Broken imports (import import)
    if (/\bimport\s+import\b/.test(content)) {
        console.log(`[BROKEN KEYWORD] ${file}`);
    }
});

console.log('--- Scan Complete ---');
