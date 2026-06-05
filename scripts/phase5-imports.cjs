const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');

// Map: data file base -> feature folder
const FEATURE_MAP = {
  'user': 'auth',
  'notification': 'notifications',
  'course': 'courses',
  'section': 'courses',
  'lesson': 'courses',
  'quiz': 'courses',
  'resource': 'courses',
  'peer-review': 'courses',
  'live-session': 'courses',
  'streak': 'students',
  'bookmark': 'students',
  'learning-goal': 'students',
  'collection': 'students',
  'note': 'students',
  'lesson-progress': 'students',
  'payout': 'teachers',
  'audit': 'admin',
  'coupon': 'admin',
  'moderation': 'admin',
  'profile': 'social',
  'follow': 'social',
  'study-group': 'social',
  'message': 'social',
  'activity': 'social',
  'blog': 'blog',
  'discussion': 'discussions',
  'qa': 'discussions',
  'flashcard': 'flashcards',
  'learning-path': 'learning-paths',
  'referral': 'referrals',
  'payment': 'payments',
  'enrollment': 'enrollment',
  'certificate': 'certificates',
  'search': 'search',
  'announcement': 'announcements',
  'assignment': 'assignments',
  'attachment': 'attachments',
  'category': 'categories',
  'contact': 'contact',
  'email-preference': 'email-preferences',
  'feature-flag': 'feature-flags',
  'gamification': 'gamification',
  'gift-card': 'gift-cards',
  'poll': 'polls',
  'review': 'reviews',
  'settings': 'settings',
  'skill-gap': 'skill-gap',
  'subscription': 'subscriptions',
  'webhook': 'webhooks',
  'wishlist': 'wishlist',
  'bundle': 'bundles',
};

const dataDir = path.join(ROOT, 'data');
const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.data.ts') && f !== 'user.data.ts');

// Build map: dataFileBase -> feature
const fileBaseToFeature = {};
for (const f of dataFiles) {
  const base = f.replace('.data.ts', '');
  fileBaseToFeature[base] = FEATURE_MAP[base] || base;
}

// Walk all source files, rewrite imports
let totalChanges = 0;
const filesChanged = new Set();

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      // Don't rewrite INSIDE the moved repositories themselves
      if (full.includes(`${path.sep}repositories${path.sep}`) && full.includes(`${path.sep}features${path.sep}`)) continue;
      walk(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      let c = fs.readFileSync(full, 'utf8');
      const before = c;
      // Replace specific deep imports: from "@/data/<x>"
      c = c.replace(/from\s+["']@\/data\/([a-z0-9-]+)\.data["']/g, (m, base) => {
        const feature = fileBaseToFeature[base] || base;
        return `from "@/features/${feature}/repositories/${base}.repository"`;
      });
      // Replace @/data/index barrel imports with a smarter strategy: leave the import as is, but we need to also update src/data/index.ts
      // Actually, the simplest is to keep @/data/index.ts as a re-export aggregator for now (Phase 17 deletes it)
      if (c !== before) {
        fs.writeFileSync(full, c, 'utf8');
        filesChanged.add(full);
        totalChanges++;
      }
    }
  }
}
walk(ROOT);
console.log(`Files changed: ${totalChanges}`);

// List remaining @/data references
let remaining = 0;
function walk2(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk2(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      const c = fs.readFileSync(full, 'utf8');
      const m = c.match(/from\s+["']@\/data\/([a-z0-9-]+)\.data["']/g);
      if (m) {
        console.log(`REMAIN: ${path.relative(process.cwd(), full)} -> ${m.length} imports`);
        remaining += m.length;
      }
    }
  }
}
walk2(ROOT);
console.log(`\nRemaining @/data/<x>.data imports: ${remaining}`);

// List all @/data (any) references for awareness
let anyData = 0;
function walk3(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk3(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      const c = fs.readFileSync(full, 'utf8');
      const m = c.match(/from\s+["']@\/data[^"']*["']/g);
      if (m) {
        console.log(`@/data* in ${path.relative(process.cwd(), full)}: ${m.length}`);
        anyData += m.length;
      }
    }
  }
}
walk3(ROOT);
console.log(`\nTotal @/data* imports: ${anyData}`);
