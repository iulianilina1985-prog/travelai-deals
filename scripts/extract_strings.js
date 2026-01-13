// scripts/extract_strings.js
// This script scans the src directory for human-visible UI strings in React components
// and generates translation key maps for English and Romanian locales.

const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');
const localesDir = path.join(srcDir, 'locales');
if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir);

// Helper to walk directory recursively and collect files with given extensions
function getFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getFiles(fullPath));
        } else if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(entry.name))) {
            files.push(fullPath);
        }
    }
    return files;
}

// Simple regex patterns to capture visible strings
const jsxTextRegex = />([^<>{}]+?)<\/[^>]+>/g; // <Tag>Text</Tag>
const attrStringRegex = /(placeholder|title|alt|aria-label)\s*=\s*"([^"]+)"/g;
const literalStringRegex = /\b(t|translate)\s*\(\s*"([^"]+)"\s*\)/g; // ignore already translated

function generateKey(filePath, line, text) {
    // Create a deterministic key based on file path and a slug of the text
    const relPath = path.relative(srcDir, filePath).replace(/\\/g, '/');
    const base = relPath.replace(/\.[jt]sx?$/, '').replace(/[\/]/g, '.');
    const slug = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return `${base}.${slug}`;
}

const enMap = {};
const roMap = {};

const files = getFiles(srcDir);
files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        let match;
        // JSX text nodes
        while ((match = jsxTextRegex.exec(line)) !== null) {
            const text = match[1].trim();
            if (text && !/^\s*$/.test(text)) {
                const key = generateKey(file, idx + 1, text);
                enMap[key] = text;
                roMap[key] = text; // placeholder – will be manually translated later
            }
        }
        // Attribute strings
        while ((match = attrStringRegex.exec(line)) !== null) {
            const attr = match[1];
            const text = match[2].trim();
            if (text) {
                const key = generateKey(file, idx + 1, text);
                enMap[key] = text;
                roMap[key] = text;
            }
        }
    });
});

// Write JSON files with nested structure
function nestObject(flat) {
    const result = {};
    Object.entries(flat).forEach(([key, value]) => {
        const parts = key.split('.');
        let cur = result;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                cur[part] = value;
            } else {
                cur[part] = cur[part] || {};
                cur = cur[part];
            }
        }
    });
    return result;
}

fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(nestObject(enMap), null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'ro.json'), JSON.stringify(nestObject(roMap), null, 2), 'utf8');

console.log('Extraction complete. Generated en.json and ro.json with', Object.keys(enMap).length, 'keys.');
