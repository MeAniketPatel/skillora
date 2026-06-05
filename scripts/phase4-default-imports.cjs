const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');

const REPLACEMENTS = [
  [/import LoginForm from "@\/features\/auth";/g, 'import { LoginForm } from "@/features/auth";'],
  [/import RegisterForm from "@\/features\/auth";/g, 'import { RegisterForm } from "@/features/auth";'],
  [/import ForgotPasswordForm from "@\/features\/auth";/g, 'import { ForgotPasswordForm } from "@/features/auth";'],
  [/import ResetPasswordForm from "@\/features\/auth";/g, 'import { ResetPasswordForm } from "@/features/auth";'],
  [/import SignOutButton from "@\/features\/auth";/g, 'import { SignOutButton } from "@/features/auth";'],
];

let count = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk(full);
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      let c = fs.readFileSync(full, 'utf8');
      const before = c;
      for (const [rx, rep] of REPLACEMENTS) c = c.replace(rx, rep);
      if (c !== before) {
        fs.writeFileSync(full, c, 'utf8');
        count++;
        console.log('updated:', path.relative(process.cwd(), full));
      }
    }
  }
}
walk(ROOT);
console.log('\nFiles changed:', count);
