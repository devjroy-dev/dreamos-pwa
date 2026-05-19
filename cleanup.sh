#!/usr/bin/env bash
# cleanup.sh
# Run once from dreamos-pwa root after unzipping frost-pwa-vendor.zip.
#
# What this does:
#   1. Removes legacy flat post-login vendor screens (replaced by app/(vendor)/)
#   2. Removes legacy flat couple post-login screens (replaced by app/(bride)/ next session)
#   3. Removes legacy flat auth screens that are now in app/(auth)/
#   4. Removes the now-empty legacy app/vendor/ and app/couple/ shells
#   5. Removes legacy app/page.tsx and landing-adjacent folders now in app/(landing)/
#
# What this does NOT touch:
#   - app/layout.tsx           (root HTML shell, stays at root)
#   - app/admin/               (admin portal, separate surface)
#   - app/circle/              (circle PWA)
#   - app/coplanner/           (co-planner PWA)
#   - app/api/                 (Next.js API routes)
#   - app/globals.css etc      (global styles)
#   - app/components/          (shared legacy components)
#
# Dry-run first:
#   bash cleanup.sh --dry-run
#
# Live run:
#   bash cleanup.sh

set -euo pipefail

DRY="${1:-}"
if [[ "$DRY" == "--dry-run" ]]; then
  echo "=== DRY RUN — no files will be deleted ==="
  RM="echo [DRY] rm -rf"
else
  RM="rm -rf"
fi

APP="app"

# ── Legacy vendor post-login screens (replaced by app/(vendor)/) ──────────────
echo "→ Removing legacy vendor post-login screens…"
for dir in today leads clients money dreamai studio discovery dashboard demo mobile setup; do
  target="$APP/vendor/$dir"
  if [[ -d "$target" ]]; then
    echo "  $target"
    $RM "$target"
  fi
done

# ── Legacy vendor auth screens (now at app/(auth)/vendor/) ───────────────────
echo "→ Removing legacy vendor auth screens (moved to (auth)/)…"
for dir in pin pin-login onboarding; do
  target="$APP/vendor/$dir"
  if [[ -d "$target" ]]; then
    echo "  $target"
    $RM "$target"
  fi
done

# ── Legacy vendor components folder ──────────────────────────────────────────
echo "→ Removing legacy vendor components…"
for item in components layout.tsx; do
  target="$APP/vendor/$item"
  if [[ -e "$target" ]]; then
    echo "  $target"
    $RM "$target"
  fi
done

# ── Remove empty legacy vendor shell ─────────────────────────────────────────
if [[ -d "$APP/vendor" ]]; then
  remaining=$(ls -A "$APP/vendor" 2>/dev/null || true)
  if [[ -z "$remaining" ]]; then
    echo "→ Removing empty $APP/vendor/"
    $RM "$APP/vendor"
  else
    echo "⚠  $APP/vendor/ not empty after cleanup — leaving in place:"
    ls "$APP/vendor/"
  fi
fi

# ── Legacy couple post-login screens ─────────────────────────────────────────
# NOTE: couple screens are NOT replaced in this session — app/(bride)/ is built
# next session. This section is a placeholder. Uncomment after frost-bride ZIP
# is deployed.
echo ""
echo "→ Couple screens: SKIPPED — frost-bride builds next session."
echo "  Run cleanup.sh again after deploying frost-bride.zip."
echo ""
# Uncomment after frost-bride:
# for dir in today plan muse discover dreamai circle me messages bespoke vendor; do
#   $RM "$APP/couple/$dir"
# done
# for dir in pin pin-login onboarding; do
#   $RM "$APP/couple/$dir"
# done
# $RM "$APP/couple/components" "$APP/couple/page.tsx" "$APP/couple/layout.tsx"
# rmdir "$APP/couple" 2>/dev/null || true

# ── Legacy landing screens (now at app/(landing)/) ───────────────────────────
echo "→ Removing legacy landing files (moved to (landing)/)…"
for item in page.tsx about discover join; do
  target="$APP/$item"
  if [[ -e "$target" ]]; then
    echo "  $target"
    $RM "$target"
  fi
done

echo ""
if [[ "$DRY" == "--dry-run" ]]; then
  echo "=== DRY RUN COMPLETE — run without --dry-run to apply ==="
else
  echo "=== CLEANUP COMPLETE ==="
  echo "Commit the result: git add -A && git commit -m 'chore: remove legacy screens after frost-vendor deploy'"
fi
