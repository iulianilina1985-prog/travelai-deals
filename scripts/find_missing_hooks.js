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
console.log('--- Scanning for Missing Hook Declarations ---');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Check if t() is used
    if (content.includes('t("') || content.includes("t('")) {
        // Check if useTranslation is imported
        if (!content.includes('useTranslation')) {
            console.log(`[MISSING IMPORT] ${file}`);
        }

        // Count t() calls vs useTranslation() calls
        // This is tricky for files with multiple components

        // Let's at least check if "useTranslation()" appears at all
        if (!content.includes('useTranslation()')) {
            console.log(`[MISSING HOOK CALL] ${file}`);
        }
    }
});
console.log('--- Scan Complete ---');
