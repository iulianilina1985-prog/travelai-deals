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
console.log('--- Scanning for Missing useTranslation() Calls ---');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Check for t(" or t(' but missing const { t } = useTranslation()
    if ((content.includes('t("') || content.includes("t('")) && !content.includes('useTranslation()')) {
        console.log(`[MISSING HOOK] ${file}`);
    }

    // Special case for multi-component files:
    // This is harder, but let's at least flag if there are multiple components and only 1 hook call.
    // Actually, one hook call per file is enough if all components are in the same scope, 
    // BUT they are usually separate functions.
});
console.log('--- Scan Complete ---');
