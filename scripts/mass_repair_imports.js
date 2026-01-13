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
let fixedCount = 0;

console.log('--- Starting Mass Repair ---');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Regex to match import statements that might be corrupted
    // We look for "import" ... "from" blocks
    // And inside them, we look for "const { t } = useTranslation();"

    // Strategy:
    // 1. Find all instances of "const { t } = useTranslation();"
    // 2. Check if they are inside an import statement (heuristically)
    //    An import statement starts with "import" and ends with "from '...'" or 'from "...";'

    // Improved Strategy:
    // Just find "const { t } = useTranslation();" that is preceded by "import" and NOT followed by "{" (start of component)?
    // No.

    // Let's use a replacer on the import blocks.
    // Match "import ... from ..." strictly?
    // /import[\s\S]*?from\s+['"][^'"]+['"]/g

    content = content.replace(/import[\s\S]*?from\s+['"][^'"]+['"]/g, (match) => {
        if (match.includes('const { t } = useTranslation();')) {
            console.log(`Fixing import in ${file}`);
            // Remove the bad string
            return match.replace(/const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);,?\s*/g, '');
        }
        return match;
    });

    // Also handle the case where "import React, {" has it immediately after

    if (content !== original) {
        // Now ensure the component HAS the hook
        // Logic from previous script
        const componentRegex = /(const\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{|function\s+\w+\s*\([^)]*\)\s*\{|export\s+default\s+function\s*(?:\w+)?\s*\([^)]*\)\s*\{)/;

        if (!content.includes('const { t } = useTranslation();')) {
            if (componentRegex.test(content)) {
                content = content.replace(componentRegex, (match) => {
                    return `${match}\n  const { t } = useTranslation();`;
                });
            }
        }

        fs.writeFileSync(file, content, 'utf8');
        fixedCount++;
    }
});

console.log(`--- Repair Complete. Fixed ${fixedCount} files. ---`);
