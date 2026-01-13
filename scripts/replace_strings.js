// scripts/replace_strings.js
// This script reads the generated locale JSON files and rewrites React component files
// to replace raw UI strings with i18next translation calls.

const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');
const localesDir = path.join(srcDir, 'locales');
const enPath = path.join(localesDir, 'en.json');
const enMap = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Flatten nested JSON into dot‑notation keys
function flatten(obj, prefix = '') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'object' && v !== null) {
            Object.assign(out, flatten(v, newKey));
        } else {
            out[newKey] = v;
        }
    }
    return out;
}
const flatMap = flatten(enMap);

// Helper to get all files
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

function ensureUseTranslation(content) {
    const importLine = "import { useTranslation } from 'react-i18next';";
    if (!content.includes(importLine)) {
        // Insert import after other imports (simple heuristic)
        const lines = content.split('\n');
        let insertIdx = 0;
        while (insertIdx < lines.length && lines[insertIdx].startsWith('import')) insertIdx++;
        lines.splice(insertIdx, 0, importLine);
        content = lines.join('\n');
    }
    // Ensure const { t } = useTranslation(); inside component body
    const tHook = 'const { t } = useTranslation();';
    if (!content.includes(tHook)) {
        // Find first function component or class component render method
        const funcMatch = content.match(/function\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{[^}]*return/);
        if (funcMatch) {
            const idx = content.indexOf(funcMatch[0]) + funcMatch[0].length - 6; // before return
            content = content.slice(0, idx) + '\n  ' + tHook + content.slice(idx);
        } else {
            // fallback: insert after first opening brace of the file
            const braceIdx = content.indexOf('{');
            if (braceIdx !== -1) {
                content = content.slice(0, braceIdx + 1) + '\n  ' + tHook + content.slice(braceIdx + 1);
            }
        }
    }
    return content;
}

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    // Replace JSX text nodes: >Text<
    content = content.replace(/>([^<>{}]+?)<\/(\w+)>/g, (match, txt, tag) => {
        const trimmed = txt.trim();
        const key = Object.keys(flatMap).find(k => flatMap[k] === trimmed);
        if (key) {
            changed = true;
            return `>{t("${key}")}<${tag}>`;
        }
        return match;
    });
    // Replace attribute strings (placeholder, title, alt, aria-label)
    content = content.replace(/(placeholder|title|alt|aria-label)\s*=\s*"([^"]+)"/g, (m, attr, val) => {
        const key = Object.keys(flatMap).find(k => flatMap[k] === val);
        if (key) {
            changed = true;
            return `${attr}={t("${key}")}`;
        }
        return m;
    });
    // Replace plain string literals inside JSX expressions (e.g., {"Login"})
    content = content.replace(/\{\s*"([^"]+)"\s*\}/g, (m, val) => {
        const key = Object.keys(flatMap).find(k => flatMap[k] === val);
        if (key) {
            changed = true;
            return `{t("${key}")}`;
        }
        return m;
    });

    if (changed) {
        content = ensureUseTranslation(content);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
}

const files = getFiles(srcDir);
files.forEach(replaceInFile);

console.log('Replacement complete.');
