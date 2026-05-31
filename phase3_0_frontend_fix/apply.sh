#!/usr/bin/env bash
# Phase 3.0-C1 FRONTEND FIX — corrects the clarify card renderer that was
# never committed, fixing React error #31 (object rendered as child) that
# crashes the chat and forces refresh+retype.
# Run from dreamos-pwa root.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TS="$(date +%Y%m%d_%H%M%S)"
[[ -f "next.config.js" || -f "next.config.ts" || -f "next.config.mjs" ]] || { echo "✗ Not in dreamos-pwa root."; exit 1; }
echo "✓ In dreamos-pwa root."
PF=("components/vendor/ChatThread.tsx" "hooks/vendor/useChat.ts" "lib/vendor/types/vendor.ts")
BK=".phase3_0_fix_backup/$TS"; mkdir -p "$BK/components/vendor" "$BK/hooks/vendor" "$BK/lib/vendor/types"
for f in "${PF[@]}"; do [[ -f "$f" ]] && cp "$f" "$BK/$f"; done
echo "✓ Backed up to $BK/"
for f in "${PF[@]}"; do cp "$SCRIPT_DIR/files-pwa/$f" "$f"; echo "  → $f"; done
echo "✓ Applied. Confirm the fix is present:"
grep -q "typeof opt === 'string'" components/vendor/ChatThread.tsx && echo "  ✓ ChatThread card renderer fixed" || echo "  ✗ ChatThread NOT fixed — report this"
echo ""
echo "  Make live: git add components/ hooks/ lib/ && git commit -m '3.0-C1 fix: clarify card renderer (fixes React #31 crash)' && git push origin main"
