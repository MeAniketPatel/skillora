const fs = require('fs');
const path = require('path');

const actionsDir = path.join(__dirname, 'src/actions');
const storesDir = path.join(__dirname, 'src/stores');
const featuresDir = path.join(__dirname, 'src/features');

function toPlural(name) {
  if (name.endsWith('y')) return name.slice(0, -1) + 'ies';
  if (name.endsWith('ch') || name.endsWith('sh') || name.endsWith('s') || name.endsWith('x')) return name + 'es';
  return name + 's';
}

function getFeatureName(baseName) {
  const map = {
    'auth': 'auth',
    'admin': 'admin',
    'ai': 'ai',
    'course-insights': 'courses',
    'enrollment': 'enrollment',
    'contact': 'contact',
    'privacy': 'privacy',
    'profile': 'profile',
    'search': 'search',
    'settings': 'settings',
    'wishlist': 'wishlist',
    'gamification': 'gamification',
    'social': 'social',
    'marketing': 'marketing',
    'learn': 'learn',
    'cart': 'cart',
    'chat': 'chat',
    'email-preference': 'email-preferences',
    'feature-flag': 'feature-flags',
    'skill-gap': 'skill-gap',
    'moderation': 'moderation',
    'qa': 'qa',
  };

  const nameWithoutExt = baseName.split('.')[0];
  if (map[nameWithoutExt]) return map[nameWithoutExt];

  return toPlural(nameWithoutExt);
}

const features = fs.readdirSync(featuresDir);
const validFeatures = new Set(features);

function moveFiles(sourceDir, typeFolder) {
  if (!fs.existsSync(sourceDir)) return;
  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    if (file === '.gitkeep' || file === 'index.ts') {
        fs.unlinkSync(path.join(sourceDir, file));
        continue;
    }

    let featureName = getFeatureName(file);
    if (!validFeatures.has(featureName)) {
      if (validFeatures.has(file.split('.')[0])) {
         featureName = file.split('.')[0];
      } else {
         validFeatures.add(featureName);
      }
    }

    const targetFeatureDir = path.join(featuresDir, featureName, typeFolder);
    if (!fs.existsSync(targetFeatureDir)) {
      fs.mkdirSync(targetFeatureDir, { recursive: true });
    }

    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetFeatureDir, file);
    
    fs.renameSync(sourcePath, targetPath);
  }
  
  if (fs.readdirSync(sourceDir).length === 0) {
      fs.rmdirSync(sourceDir);
  }
}

moveFiles(actionsDir, 'actions');
moveFiles(storesDir, 'stores');

// Global find-and-replace for imports
function replaceImportsInDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      replaceImportsInDirectory(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      // Extract current feature name if we are inside a feature
      const featureMatch = fullPath.match(/src[\\/]features[\\/]([^\\/]+)[\\/]/);
      const currentFeature = featureMatch ? featureMatch[1] : null;

      const regex = /from\s+['"]@\/(actions|stores)\/(.+)\.(actions|store)['"]/g;
      content = content.replace(regex, (match, type, name, suffix) => {
          const fileName = `${name}.${suffix}`;
          const targetFeatureName = getFeatureName(fileName);
          changed = true;
          
          if (currentFeature === targetFeatureName) {
              const relativeDepth = fullPath.substring(fullPath.indexOf(`\\src\\features\\${currentFeature}\\`) + `\\src\\features\\${currentFeature}\\`.length).split('\\').length - 1;
              const prefix = '../'.repeat(relativeDepth) || './';
              return `from "${prefix}${type}/${name}.${suffix}"`;
          } else {
              return `from "@/features/${targetFeatureName}/${type}/${name}.${suffix}"`;
          }
      });
      
      const regex2 = /from\s+['"]@\/(actions|stores)\/([^'"]+)['"]/g;
      content = content.replace(regex2, (match, type, name) => {
          if (name.includes('.')) return match;
          const suffix = type === 'actions' ? 'actions' : 'store';
          const fileName = `${name}.${suffix}.ts`;
          const targetFeatureName = getFeatureName(fileName);
          changed = true;
          
          if (currentFeature === targetFeatureName) {
              const relativeDepth = fullPath.substring(fullPath.indexOf(`\\src\\features\\${currentFeature}\\`) + `\\src\\features\\${currentFeature}\\`.length).split('\\').length - 1;
              const prefix = '../'.repeat(relativeDepth) || './';
              return `from "${prefix}${type}/${name}.${suffix}"`;
          } else {
              return `from "@/features/${targetFeatureName}/${type}/${name}.${suffix}"`;
          }
      });

      // Special cases fixes for known wrong imports
      if (content.includes('@/features/blogs/')) {
        content = content.replace(/@\/features\/blogs\//g, '@/features/blog/');
        changed = true;
      }
      
      if (content.includes('@/features/quizs/')) {
        content = content.replace(/@\/features\/quizs\//g, '@/features/quizzes/');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceImportsInDirectory(path.join(__dirname, 'src'));

// Handle the specific imports manually
const replacements = [
  { file: 'src/app/(dashboard)/admin/categories/page.tsx', find: 'from "@/actions"', replace: 'from "@/features/categories/actions/category.actions"' },
  { file: 'src/app/(dashboard)/admin/contact/page.tsx', find: 'from "@/actions"', replace: 'from "@/features/contact/actions/contact.actions"' },
  { file: 'src/app/(dashboard)/admin/settings/page.tsx', find: 'from "@/actions"', replace: 'from "@/features/settings/actions/settings.actions"' },
  { file: 'src/app/(dashboard)/admin/users/page.tsx', find: 'from "@/actions"', replace: 'from "@/features/admin/actions/admin.actions"' },
  { file: 'src/app/(dashboard)/student/wishlist/page.tsx', find: 'from "@/actions"', replace: 'from "@/features/wishlist/actions/wishlist.actions"' },
  { file: 'src/app/(dashboard)/teacher/courses/[courseId]/curriculum/page.tsx', find: 'from "@/actions"', replace: 'from "@/features/courses/actions/course.actions"' },
  { file: 'src/app/(dashboard)/teacher/courses/[courseId]/curriculum/page.tsx', find: 'import("@/actions")', replace: 'import("@/features/courses/actions/course.actions")' },
  { file: 'src/app/(dashboard)/teacher/courses/new/page.tsx', find: 'from "@/actions"', replace: 'from "@/features/courses/actions/course.actions"' },
  { file: 'src/app/contact/page.tsx', find: 'from "@/actions"', replace: 'from "@/features/contact/actions/contact.actions"' },
  { file: 'src/features/settings/components/notification-settings.tsx', find: 'from "@/actions"', replace: 'from "@/features/email-preferences/actions/email-preference.actions"' },
  { file: 'src/features/settings/components/privacy-settings.tsx', find: 'from "@/actions"', replace: 'from "@/features/privacy/actions/privacy.actions"' }
];

for (const { file, find, replace } of replacements) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    if (content.includes(find)) {
        content = content.replace(find, replace);
        fs.writeFileSync(fullPath, content);
    }
  }
}

console.log('Legacy move and imports update complete');
