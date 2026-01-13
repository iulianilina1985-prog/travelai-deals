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

const corruptionPattern = /(?:import\s+.*?const\s+\{\s*t\s*\}\s*=\s*useTranslation)|(?:const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);\s*useTranslation\s*\})/;

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (corruptionPattern.test(content)) {
        console.log(`Fixing corrupted file: ${filePath}`);

        // 1. Fix the import line
        content = content.replace(corruptionPattern, "useTranslation } from 'react-i18next';");

        // 2. Insert the hook inside the component
        // Look for common component patterns
        // const Component = (...) => {
        // function Component(...) {
        // export default function (...) {

        let hookInserted = false;

        // Strategy: find the *first* function body that looks like a component and insert the hook.
        // We'll look for the opening brace of the function.

        const componentRegex = /(const\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{|function\s+\w+\s*\([^)]*\)\s*\{|export\s+default\s+function\s*(?:\w+)?\s*\([^)]*\)\s*\{)/;

        // Verify if hook is already there to avoid dupes (though unlikely given the corruption)
        if (!content.includes('const { t } = useTranslation();')) {
            if (componentRegex.test(content)) {
                content = content.replace(componentRegex, (match) => {
                    if (hookInserted) return match; // only insert once
                    hookInserted = true;
                    return `${match}\n  const { t } = useTranslation();`;
                });
            } else {
                console.warn(`  WARNING: Could not find component body to insert hook in ${filePath}`);
            }
        }

        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

const files = getFiles(srcDir);
let fixedCount = 0;
files.forEach(file => {
    if (fixFile(file)) {
        fixedCount++;
    }
});

console.log(`Fixed ${fixedCount} files.`);
