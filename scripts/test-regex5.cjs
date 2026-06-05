const s = String.raw`^(\s*)import\s*\{([^}]+)\}\s*from\s*["'](@/features/[a-z0-9-]+/server)["']\s*;?\s*$`;
console.log("regex source:", s);
const re = new RegExp(s, "gm");
console.log("regex:", re);
const test = 'import { x } from "@/features/test/server";';
console.log("match:", test.match(re));
