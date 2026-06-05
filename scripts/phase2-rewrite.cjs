const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');

const REPLACEMENTS = [
  // lib -> shared/lib (both static `from` and dynamic `import()`)
  [/from\s+["']@\/lib\/prisma["']/g, 'from "@/shared/lib/prisma"'],
  [/from\s+["']@\/lib\/stripe["']/g, 'from "@/shared/lib/stripe"'],
  [/from\s+["']@\/lib\/uploadthing["']/g, 'from "@/shared/lib/uploadthing"'],
  [/from\s+["']@\/lib\/mail["']/g, 'from "@/shared/lib/mail"'],
  [/from\s+["']@\/lib\/action-utils["']/g, 'from "@/shared/lib/action-utils"'],
  [/from\s+["']@\/lib\/auth-helpers["']/g, 'from "@/shared/lib/auth-helpers"'],
  [/from\s+["']@\/lib\/auth-security["']/g, 'from "@/shared/lib/auth-security"'],
  [/from\s+["']@\/lib\/utils["']/g, 'from "@/shared/lib/utils"'],
  [/from\s+["']@\/lib\/errors["']/g, 'from "@/shared/lib/errors"'],
  [/import\(["']@\/lib\/prisma["']\)/g, 'import("@/shared/lib/prisma")'],
  [/import\(["']@\/lib\/mail["']\)/g, 'import("@/shared/lib/mail")'],
  [/import\(["']@\/lib\/stripe["']\)/g, 'import("@/shared/lib/stripe")'],
  [/import\(["']@\/lib\/uploadthing["']\)/g, 'import("@/shared/lib/uploadthing")'],
  [/import\(["']@\/lib\/action-utils["']\)/g, 'import("@/shared/lib/action-utils")'],
  [/import\(["']@\/lib\/auth-helpers["']\)/g, 'import("@/shared/lib/auth-helpers")'],
  [/import\(["']@\/lib\/utils["']\)/g, 'import("@/shared/lib/utils")'],
  [/import\(["']@\/lib\/errors["']\)/g, 'import("@/shared/lib/errors")'],
  // components/providers (barrel)
  [/from\s+["']@\/components\/providers["']/g, 'from "@/shared/components/providers"'],
  // Note: ai-client, calendar-export, pdf-generator, points, webhook-sender, impersonation are NOT in plan's Phase 2 move list. Leave them in lib for now (not actively used; Phase 17 cleanup).
  // hooks -> shared/hooks
  [/from\s+["']@\/hooks\/use-clipboard["']/g, 'from "@/shared/hooks/use-clipboard"'],
  [/from\s+["']@\/hooks\/use-countdown["']/g, 'from "@/shared/hooks/use-countdown"'],
  [/from\s+["']@\/hooks\/use-debounce["']/g, 'from "@/shared/hooks/use-debounce"'],
  [/from\s+["']@\/hooks\/use-intersection-observer["']/g, 'from "@/shared/hooks/use-intersection-observer"'],
  [/from\s+["']@\/hooks\/use-media-query["']/g, 'from "@/shared/hooks/use-media-query"'],
  [/from\s+["']@\/hooks\/use-pagination["']/g, 'from "@/shared/hooks/use-pagination"'],
  // components -> shared/components
  [/from\s+["']@\/components\/ui\//g, 'from "@/shared/components/ui/'],
  [/from\s+["']@\/components\/shared\//g, 'from "@/shared/components/shared/'],
  [/from\s+["']@\/components\/layout\//g, 'from "@/shared/components/layout/'],
  [/from\s+["']@\/components\/providers\//g, 'from "@/shared/components/providers/'],
  // stores -> shared/stores (only global UI stores)
  [/from\s+["']@\/stores\/sidebar\.store["']/g, 'from "@/shared/stores/sidebar.store"'],
];

let totalFiles = 0;
let totalChanges = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      const before = fs.readFileSync(full, 'utf8');
      let after = before;
      for (const [rx, rep] of REPLACEMENTS) {
        after = after.replace(rx, rep);
      }
      if (after !== before) {
        fs.writeFileSync(full, after, 'utf8');
        totalFiles++;
        const lines = before.split('\n').length;
        console.log(`updated: ${path.relative(process.cwd(), full)} (${lines} lines)`);
      }
    }
  }
}

walk(ROOT);
console.log(`\nFiles changed: ${totalFiles}`);

// Also count remaining old-style imports
const REMAIN_PATTERNS = [
  /from\s+["']@\/lib\/(prisma|stripe|uploadthing|mail|action-utils|auth-helpers|auth-security|utils|errors)["']/g,
  /from\s+["']@\/hooks\/(use-clipboard|use-countdown|use-debounce|use-intersection-observer|use-media-query|use-pagination)["']/g,
  /from\s+["']@\/components\/(ui|shared|layout|providers)\//g,
  /from\s+["']@\/stores\/sidebar\.store["']/g,
];

let remaining = 0;
function walk2(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk2(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
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
