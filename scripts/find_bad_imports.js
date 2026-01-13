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
console.log('--- Scanning for Multiline Import Corruption ---');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Pattern: "import {" followed by "import" without a closing brace first
    // We can check if "import" appears twice before a "from" or ";"

    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('import {') && !line.includes('}')) {
            // Check next few lines for 'import'
            for (let i = 1; i < 5; i++) {
                if (idx + i < lines.length) {
                    if (lines[idx + i].includes('import ')) {
                        console.log(`[CORRUPTED IMPORT BRANCH] ${file}:${idx + i + 1}`);
                        console.log(`Line ${idx + 1}: ${line.trim()}`);
                        console.log(`Line ${idx + i + 1}: ${lines[idx + i].trim()}`);
                    }
                    if (lines[idx + i].includes('} from')) break;
                }
            }
        }
    });
});
console.log('--- Scan Complete ---');
