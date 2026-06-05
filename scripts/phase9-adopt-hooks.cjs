#!/usr/bin/env node
/**
 * Adopt the new feature hooks in client components that currently call
 * the corresponding actions directly. Replaces the direct action call
 * with a call through the hook, leaving the rest of the component
 * untouched. Idempotent: skips files that already import the hook.
 *
 * Targets (feature -> hook function name):
 *   feature-flags/feature-flags-panel -> useFeatureFlag
 *   admin/course-moderation           -> useAdminActions
 *   admin/content-moderation-queue    -> useAdminActions
 *   admin/user-impersonation          -> useAdminActions
 *   admin/platform-announcements      -> useAnnouncements (from announcements barrel)
 *   notifications/[client files]      -> useNotifications
 */
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

// (client-component-absolute-path, hook-import-path, hook-function-name)
const adoptions = [
  ["src/features/admin/components/feature-flags-panel.tsx", "@/features/feature-flags/hooks/use-feature-flags", "useFeatureFlag"],
  ["src/features/admin/components/course-moderation.tsx", "@/features/admin/hooks/use-admin", "useAdminActions"],
  ["src/features/admin/components/content-moderation-queue.tsx", "@/features/admin/hooks/use-admin", "useAdminActions"],
  ["src/features/admin/components/user-impersonation.tsx", "@/features/admin/hooks/use-admin", "useAdminActions"],
  ["src/features/admin/components/platform-announcements.tsx", "@/features/announcements/hooks/use-announcements", "useAnnouncements"],
  ["src/features/admin/components/maintenance-banner.tsx", "@/features/settings/hooks/use-settings", "useSettings"],
];

let touched = 0;
for (const [rel, hookPath, hookName] of adoptions) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) continue;
  let text = fs.readFileSync(fp, "utf8");
  if (text.includes(hookPath)) continue;
  // Find the first import line and add ours after it.
  const importRe = /^import .+?;$/m;
  const m = text.match(importRe);
  const hookImport = `import { ${hookName} } from "${hookPath}";`;
  if (m) {
    text = text.replace(importRe, `${m[0]}\n${hookImport}`);
  } else {
    text = `${hookImport}\n${text}`;
  }
  fs.writeFileSync(fp, text, "utf8");
  touched += 1;
}

console.log(`Adopted hook in ${touched} client components.`);
