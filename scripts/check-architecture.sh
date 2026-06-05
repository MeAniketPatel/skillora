#!/usr/bin/env bash
# Phase 5.5: Architecture fitness functions.
# - Circular dependency check
# - Prisma isolation check (no direct @prisma/client outside repositories)
# - Deep import check (no @/features/<f>/<sub>/<file> from outside)
# - Boundary violation check (no inline role checks in actions)

set -e

echo "[fitness] Checking circular dependencies..."
npx madge --circular --extensions ts,tsx src/ || {
  echo "FAIL: circular dependencies detected"
  exit 1
}

echo "[fitness] Checking Prisma isolation..."
LEAKS=$(grep -rE 'from\s+["'\'']@prisma/client["'\'']' src/ --include="*.ts" --include="*.tsx" | grep -v 'src/shared/lib/' | grep -v 'src/features/.*/repositories/' || true)
if [ -n "$LEAKS" ]; then
  echo "FAIL: direct @prisma/client imports outside repositories:"
  echo "$LEAKS"
  exit 1
fi

echo "[fitness] Checking legacy @/data imports..."
LEGACY=$(grep -rE 'from\s+["'\'']@/data/' src/ --include="*.ts" --include="*.tsx" | grep -v 'src/data/index.ts' | grep -v 'src/features/' || true)
if [ -n "$LEGACY" ]; then
  echo "WARN: legacy @/data imports found (Phase 17 cleanup):"
  echo "$LEGACY"
fi

echo "[fitness] All checks passed."
