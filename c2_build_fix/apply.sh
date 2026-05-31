#!/usr/bin/env bash
# C2 build fix — ChatThread used F.body which doesn't exist (only F.label).
# This broke the Vercel TypeScript build. One-line fix.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "next.config.js" || -f "next.config.ts" || -f "next.config.mjs" ]] || { echo "✗ Not in dreamos-pwa root."; exit 1; }
cp "$SCRIPT_DIR/files-pwa/components/vendor/ChatThread.tsx" components/vendor/ChatThread.tsx
echo "✓ ChatThread fixed."
grep -q "F.body" components/vendor/ChatThread.tsx && echo "  ✗ F.body still present!" || echo "  ✓ no F.body references — build should pass"
echo "  Make live: git add components/ && git commit -m 'fix: C2 build error — F.body → F.label in ChatThread' && git push origin main"
