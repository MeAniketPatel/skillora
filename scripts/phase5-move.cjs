const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');

// Map: data file -> feature folder
const FEATURE_MAP = {
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
  // auth (user) already done in Phase 4
  // notifications -> no data file
};

const dataDir = path.join(ROOT, 'data');
const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.data.ts'));

let moved = 0;
for (const file of dataFiles) {
  if (file === 'index.ts' || file === 'user.data.ts') continue; // user done in Phase 4
  const base = file.replace('.data.ts', '');
  const feature = FEATURE_MAP[base];
  if (!feature) {
    console.log(`SKIP (no feature map): ${file}`);
    continue;
  }
  const targetDir = path.join(ROOT, 'features', feature, 'repositories');
  fs.mkdirSync(targetDir, { recursive: true });
  const target = path.join(targetDir, `${base}.repository.ts`);
  const source = path.join(dataDir, file);
  fs.copyFileSync(source, target);
  console.log(`copied: ${file} -> features/${feature}/repositories/${base}.repository.ts`);
  moved++;
}
console.log(`\nTotal moved: ${moved}`);
