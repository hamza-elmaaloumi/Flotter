const fs = require('fs');
const path = './app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Colors
content = content.replace(/bg-\[#121212\]/g, 'bg-[var(--bg-primary)]');
content = content.replace(/bg-\[#1C1C1E\]/g, 'bg-[var(--bg-secondary)]');
content = content.replace(/bg-\[#222222\]/g, 'bg-[var(--bg-tertiary)]');
content = content.replace(/bg-\[#1e1e1e\]/g, 'bg-[var(--bg-elevated)]');
content = content.replace(/border-\[#2D2D2F\]/g, 'border-[var(--border-primary)]');
content = content.replace(/border-\[#262626\]/g, 'border-[var(--border-secondary)]');
content = content.replace(/text-\[#FFFFFF\]/g, 'text-[var(--text-primary)]');
content = content.replace(/text-white/g, 'text-[var(--text-primary)]');
content = content.replace(/text-\[#9CA3AF\]/g, 'text-[var(--text-secondary)]');
content = content.replace(/text-gray-400/g, 'text-[var(--text-secondary)]');
content = content.replace(/text-\[#6B7280\]/g, 'text-[var(--text-tertiary)]');
content = content.replace(/text-gray-500/g, 'text-[var(--text-tertiary)]');
content = content.replace(/text-\[#48484A\]/g, 'text-[var(--text-quaternary)]');

// Text sizes
content = content.replace(/text-\[10px\]/g, 'text-xs');
content = content.replace(/text-\[11px\]/g, 'text-xs');
content = content.replace(/text-\[9px\]/g, 'text-[10px]');
content = content.replace(/text-xs/g, 'text-sm');
content = content.replace(/text-sm/g, 'text-base');

fs.writeFileSync(path, content);
console.log('Done');
