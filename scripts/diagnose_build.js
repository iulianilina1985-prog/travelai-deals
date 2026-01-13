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

const output = `--- Starting Diagnosis ---
${files.map(file => {
    const content = fs.readFileSync(file, 'utf8');
    let log = '';

    // Check for duplicate imports
    const importMatches = content.match(/import\s+\{\s*useTranslation\s*\}\s+from\s+['"]react-i18next['"]/g);
    if (importMatches && importMatches.length > 1) {
        log += `[DUPLICATE IMPORT] ${file}: Found ${importMatches.length} imports\n`;
    }

    // Check for duplicate hook declarations
    const hookMatches = content.match(/const\s+\{\s*t.*\}\s*=\s*useTranslation\(\)/g);
    if (hookMatches && hookMatches.length > 1) {
        log += `[DUPLICATE HOOK] ${file}: Found ${hookMatches.length} declarations\n`;
    }

    // Check for corrupted import lines (multiline aware)
    // Matches "import ... const { t } ... from"
    if (/import[\s\S]*?const\s+\{\s*t\s*\}[\s\S]*?from/.test(content)) {
        // Exclude false positives where "const { t }" is inside a correctly formed component that happens to be after an import?
        // No, "import ... from" should NOT contain "const { t }".
        // Unless it's "import { const } from ..." (invalid).
        // The only valid case is if the import ends, and then const starts.

        // We look for: import [no semicolon] const { t } [no semicolon] from
        // This is hard to regex perfectly without parser.
        // But checking for "const { t } = useTranslation();" inside an import block is enough?

        // Let's refine: import { ... const { t } ... } from
        if (/import\s*\{[^}]*const\s+\{\s*t\s*\}[^}]*\}\s+from/.test(content)) {
            log += `[CORRUPTED IMPORT (INSIDE BRACES)] ${file}\n`;
        }

        // Also check for: import ... \n const { t } ... \n ... from (if braces are split)
    }

    // Check for "const { t } = useTranslation();" appearing BEFORE "from " on the same line or block?

    // Let's just use the known pattern: "const { t } = useTranslation();" followed by "useState" or "useEffect" inside "import {" ?

    if (/import\s+React,\s*\{\s*const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);/.test(content)) {
        log += `[CORRUPTED REACT IMPORT] ${file}\n`;
    }

    return log;
}).join('')}
--- Diagnosis Complete ---`;

fs.writeFileSync('diag_utf8.txt', output, 'utf8');
console.log(output);
