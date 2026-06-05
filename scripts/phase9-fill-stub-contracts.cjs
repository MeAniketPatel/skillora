#!/usr/bin/env node
/**
 * Fill stub contracts (TODO: define input shape) with a valid generic
 * Zod schema, fix the type alias to match, and sync the client barrel's
 * Contracts section to the actual exports.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

const GENERIC = `  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),`;

let filled = 0;
let typesUpdated = 0;
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const contractsDir = path.join(featuresDir, f.name, "contracts");
  if (!fs.existsSync(contractsDir)) continue;
  for (const file of fs.readdirSync(contractsDir)) {
    if (!file.endsWith(".contract.ts")) continue;
    const fp = path.join(contractsDir, file);
    let text = fs.readFileSync(fp, "utf8");
    if (!/TODO: define input shape/.test(text)) continue;
    const m = text.match(/export\s+const\s+(create\w+Schema)\s*=/);
    if (!m) continue;
    const createName = m[1];
    const inputTypeName = `Create${createName.replace(/^create/, "").replace(/Schema$/, "")}Input`;
    text = text.replace(
      /export\s+const\s+create\w+Schema\s*=\s*z\.object\(\{\s*\/\/\s*TODO: define input shape\s*\}\)\s*;?/,
      `export const ${createName} = z.object({\n${GENERIC}\n});`
    );
    text = text.replace(
      new RegExp(`export\\s+type\\s+${inputTypeName}\\s*=\\s*z\\.infer<typeof\\s+(create\\w+Schema)\\s*>;`),
      `export type ${inputTypeName} = z.infer<typeof ${createName}>;`
    );
    fs.writeFileSync(fp, text, "utf8");
    filled += 1;
  }
}

// Sync client barrels: replace the Contracts section cleanly
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const barrel = path.join(featuresDir, f.name, "index.ts");
  if (!fs.existsSync(barrel)) continue;
  const contractsDir = path.join(featuresDir, f.name, "contracts");
  if (!fs.existsSync(contractsDir)) continue;
  const schemaNames = [];
  const typeNames = [];
  const sourceByName = {};
  const re1 = /export\s+const\s+(\w+Schema)\s*=/g;
  const re2 = /export\s+type\s+(\w+Input)\s*=/g;
  for (const cf of fs.readdirSync(contractsDir).filter(x => x.endsWith(".contract.ts"))) {
    const ctext = fs.readFileSync(path.join(contractsDir, cf), "utf8");
    let m;
    re1.lastIndex = 0;
    while ((m = re1.exec(ctext)) !== null) {
      schemaNames.push(m[1]);
      sourceByName[m[1]] = cf;
    }
    re2.lastIndex = 0;
    while ((m = re2.exec(ctext)) !== null) {
      typeNames.push(m[1]);
      sourceByName[m[1]] = cf;
    }
  }
  if (schemaNames.length === 0 && typeNames.length === 0) continue;
  let text = fs.readFileSync(barrel, "utf8");
  const byFile = {};
  for (const n of schemaNames) (byFile[sourceByName[n]] ??= { schemas: [], types: [] }).schemas.push(n);
  for (const n of typeNames)   (byFile[sourceByName[n]] ??= { schemas: [], types: [] }).types.push(n);
  const parts = Object.entries(byFile).flatMap(([cf, v]) => {
    const out = [];
    if (v.schemas.length) out.push(`export { ${v.schemas.join(", ")} } from "./contracts/${cf.replace(/\.contract\.ts$/, ".contract")}";`);
    if (v.types.length)   out.push(`export type { ${v.types.join(", ")} } from "./contracts/${cf.replace(/\.contract\.ts$/, ".contract")}";`);
    return out;
  });
  // Match the existing Contracts section (greedy until next section or EOF)
  // Use \r?\n to handle CRLF line endings on Windows.
  const sectionRe = /\/\/ Contracts\r?\n[\s\S]*?(?=\r?\n\/\/ [A-Z]|\s*$)/;
  // Strip all existing // Contracts blocks so the script is idempotent.
  let prev;
  do { prev = text; text = text.replace(sectionRe, ""); } while (text !== prev);
  text += "\n// Contracts\n" + parts.join("\n") + "\n";
  fs.writeFileSync(barrel, text, "utf8");
  typesUpdated += 1;
}

console.log(`Filled ${filled} stub contracts; synced ${typesUpdated} client barrels.`);
