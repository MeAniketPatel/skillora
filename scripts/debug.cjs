const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const featureMethods = new Map();
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const servicesDir = path.join(featuresDir, f.name, "services");
  if (!fs.existsSync(servicesDir)) continue;
  const svcFile = fs.readdirSync(servicesDir).find((x) => x.endsWith(".service.ts"));
  if (!svcFile) continue;
  const text = fs.readFileSync(path.join(servicesDir, svcFile), "utf8");
  const methods = new Set();
  const re = /^\s{2}(?:async\s+)?([a-zA-Z_$][\w$]*)\s*[:(]/gm;
  let m;
  while ((m = re.exec(text)) !== null) methods.add(m[1]);
  featureMethods.set(f.name, methods);
}
console.log("certificates has createCertificate?", featureMethods.get("certificates")?.has("createCertificate"));
console.log("certificates methods:", [...(featureMethods.get("certificates") || [])].slice(0, 5));
