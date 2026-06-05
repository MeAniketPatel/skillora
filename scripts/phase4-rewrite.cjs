const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');

const REPLACEMENTS = [
  // auth actions -> features/auth
  [/from\s+["']@\/actions\/auth\.actions["']/g, 'from "@/features/auth"'],
  // auth components -> features/auth (when specific component)
  [/from\s+["']@\/components\/auth\/login-form["']/g, 'from "@/features/auth"'],
  [/from\s+["']@\/components\/auth\/register-form["']/g, 'from "@/features/auth"'],
  [/from\s+["']@\/components\/auth\/forgot-password-form["']/g, 'from "@/features/auth"'],
  [/from\s+["']@\/components\/auth\/reset-password-form["']/g, 'from "@/features/auth"'],
  [/from\s+["']@\/components\/auth\/signout-button["']/g, 'from "@/features/auth"'],
  // auth schema -> features/auth
  [/from\s+["']@\/validations\/auth\.schema["']/g, 'from "@/features/auth"'],
];

let totalFiles = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      // Skip files INSIDE features/auth (they already use the right paths or relative ones)
      if (full.includes(`${path.sep}features${path.sep}auth${path.sep}`)) continue;
      const before = fs.readFileSync(full, 'utf8');
      let after = before;
      for (const [rx, rep] of REPLACEMENTS) {
        after = after.replace(rx, rep);
      }
      if (after !== before) {
        fs.writeFileSync(full, after, 'utf8');
        totalFiles++;
        console.log(`updated: ${path.relative(process.cwd(), full)}`);
      }
    }
  }
}

walk(ROOT);
console.log(`\nFiles changed: ${totalFiles}`);

const REMAIN_PATTERNS = REPLACEMENTS.map(([rx]) => rx);
let remaining = 0;
function walk2(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk2(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      if (full.includes(`${path.sep}features${path.sep}auth${path.sep}`)) continue;
      const c = fs.readFileSync(full, 'utf8');
      for (const rx of REMAIN_PATTERNS) {
        const m = c.match(rx);
        if (m) remaining += m.length;
      }
    }
  }
}
walk2(ROOT);
console.log(`Remaining old-style imports: ${remaining}`);
