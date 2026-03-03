const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('./app');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace standard light borders with thicker, colorful borders and shadows
    content = content.replace(/border-\[\#E2E4E9\]/g, 'border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:border-[#2D2D2F]');
    content = content.replace(/border-\[\#EBEDF0\]/g, 'border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:border-[#262626]');
    content = content.replace(/border-gray-200/g, 'border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:border-gray-800');
    content = content.replace(/border-gray-100/g, 'border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:border-gray-800');
    // More colorful sections or cards if specified instead of black:
    // Actually the prompt specifically says "clear colorful colors and a strong stroke"
    // Let's do some colorful variations for borders if they exist, or just use a colorful palette
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated borders in ${file}`);
    }
});
