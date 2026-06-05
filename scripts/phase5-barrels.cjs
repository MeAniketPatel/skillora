const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src', 'features');

const features = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name);

for (const feature of features) {
  const repoDir = path.join(ROOT, feature, 'repositories');
  if (!fs.existsSync(repoDir)) continue;
  const files = fs.readdirSync(repoDir).filter(f => f.endsWith('.repository.ts'));
  if (files.length === 0) continue;
  const barrelPath = path.join(ROOT, feature, 'index.ts');
  let content = '// Auto-generated barrel: re-exports all repositories for the ' + feature + ' feature.\n';
  for (const f of files) {
    const base = f.replace('.repository.ts', '');
    content += `export * from "./repositories/${base}.repository";\n`;
  }
  fs.writeFileSync(barrelPath, content);
  console.log(`created: features/${feature}/index.ts (${files.length} repos)`);
}
console.log('\nDone');
