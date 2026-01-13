// scripts/fix_closing_tags.js
// Fixes the bug where replacing text removed the forward slash in closing tags
// e.g., >{t("key")}<div -> >{t("key")}</div>

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

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Pattern: >{t("...")}<tag>  --> should be </tag>
    // We look for: >\{t\("[^"]+"\)\}<([a-zA-Z0-9]+)>
    // ensuring that the tag matches an opening tag logic is hard, but we know
    // the previous script outputted exactly `>{t("${key}")}<${tag}>` where tag came from `</tag>`

    content = content.replace(/>(\{t\("[^"]+"\)\})<([a-zA-Z0-9]+)>/g, (match, translation, tag) => {
        changed = true;
        return `>${translation}</${tag}>`;
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed', filePath);
    }
}

const files = getFiles(srcDir);
files.forEach(fixFile);

console.log('Fix complete.');
