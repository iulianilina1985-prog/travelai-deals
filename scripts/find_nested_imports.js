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
console.log('--- Scanning for Nested Import Corruption ---');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Find all 'import' keywords
    const matches = [...content.matchAll(/\bimport\b/g)];

    // For each 'import', check if the NEXT 'import' comes before the NEXT 'from'
    for (let i = 0; i < matches.length - 1; i++) {
        const currentImportIndex = matches[i].index;
        const nextImportIndex = matches[i + 1].index;

        const substring = content.substring(currentImportIndex, nextImportIndex);

        // If there is NO 'from' in the substring, it means we have:
        // import ... import ... from ...
        // Which is corrupted.

        // Wait, "import 'style.css'" has no 'from'.
        // So we only flag if the first 'import' has a '{' or is a named import starts.

        const firstLineOfImport = substring.split('\n')[0];
        if (substring.includes('{') && !substring.includes('from')) {
            // Potential corruption
            const lineNum = content.substring(0, currentImportIndex).split('\n').length;
            console.log(`[NESTED IMPORT] ${file}:${lineNum}`);
            console.log(substring.trim());
            console.log('---');
        }
    }
});
console.log('--- Scan Complete ---');
