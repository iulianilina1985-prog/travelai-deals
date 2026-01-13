// scripts/verify_no_raw_strings.js
// Scans source files for any human‑visible strings that are not wrapped in i18next translation calls.

const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');

function getFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...getFiles(full));
        else if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(entry.name))) files.push(full);
    }
    return files;
}

let violations = [];
const files = getFiles(srcDir);
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        // Detect JSX text nodes not using t()
        const jsxMatch = line.match(/>\s*([^<>{}]+?)\s*<\//);
        if (jsxMatch) {
            const text = jsxMatch[1].trim();
            if (text && !/^\s*$/.test(text) && !/\{\s*t\(/.test(line)) {
                violations.push({ file, line: idx + 1, text });
            }
        }
        // Detect attribute strings not using t()
        const attrMatch = line.match(/(placeholder|title|alt|aria-label)\s*=\s*"([^"]+)"/);
        if (attrMatch) {
            const val = attrMatch[2];
            if (!/\{\s*t\(/.test(line)) {
                violations.push({ file, line: idx + 1, text: `${attrMatch[1]}="${val}"` });
            }
        }
        // Detect plain string literals inside JSX expressions not using t()
        const exprMatch = line.match(/\{\s*"([^"]+)"\s*\}/);
        if (exprMatch) {
            const val = exprMatch[1];
            if (val.trim() !== '' && !/t\(/.test(line)) {
                violations.push({ file, line: idx + 1, text: `"${val}"` });
            }
        }
    });
});

if (violations.length === 0) {
    console.log('No raw UI strings found. Verification passed.');
} else {
    console.log('Found raw UI strings:');
    violations.forEach(v => {
        console.log(`${v.file}:${v.line} -> ${v.text}`);
    });
    process.exit(1);
}
