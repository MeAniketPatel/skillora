const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');

let count = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      let c = fs.readFileSync(full, 'utf8');
      const before = c;
      c = c.replace(/@\/features\/user\/repositories\/user\.repository/g, '@/features/auth');
      if (c !== before) {
        fs.writeFileSync(full, c, 'utf8');
        count++;
        console.log('updated:', path.relative(process.cwd(), full));
      }
    }
  }
}
walk(ROOT);
console.log('\nFiles changed:', count);
