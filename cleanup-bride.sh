#!/usr/bin/env bash
# cleanup-bride.sh
# Run once from dreamos-pwa root after unzipping frost-pwa-bride.zip.
# Removes legacy couple post-login screens replaced by app/(bride)/.
#
# Dry run: bash cleanup-bride.sh --dry-run
# Live:    bash cleanup-bride.sh

set -euo pipefail
DRY="${1:-}"
if [[ "$DRY" == "--dry-run" ]]; then
  echo "=== DRY RUN ==="
  RM="echo [DRY] rm -rf"
else
  RM="rm -rf"
fi

APP="app"

# ── Verify (auth) couple screens exist before deleting originals ──────────────
echo "→ Checking (auth)/couple/ screens exist…"
for dir in pin pin-login onboarding; do
  if [[ ! -d "$APP/(auth)/couple/$dir" ]]; then
    echo "⚠  ABORT: $APP/(auth)/couple/$dir not found."
    echo "   Run the vendor session auth fix first: copy couple/pin, pin-login, onboarding into app/(auth)/couple/"
    exit 1
  fi
done
echo "  ✓ Auth screens confirmed at (auth)/couple/"

# ── Legacy couple post-login screens ─────────────────────────────────────────
echo "→ Removing legacy couple post-login screens…"
for dir in today plan muse discover dreamai circle me messages bespoke vendor; do
  target="$APP/couple/$dir"
  if [[ -d "$target" ]]; then
    echo "  $target"
    $RM "$target"
  fi
done

# ── Legacy couple auth screens (already at (auth)/couple/) ───────────────────
echo "→ Removing legacy couple auth screens…"
for dir in pin pin-login onboarding; do
  target="$APP/couple/$dir"
  if [[ -d "$target" ]]; then
    echo "  $target"
    $RM "$target"
  fi
done

# ── Legacy couple components, layout, page ───────────────────────────────────
echo "→ Removing legacy couple shell files…"
for item in components layout.tsx page.tsx; do
  target="$APP/couple/$item"
  if [[ -e "$target" ]]; then
    echo "  $target"
    $RM "$target"
  fi
done

# ── Remove empty shell ────────────────────────────────────────────────────────
if [[ -d "$APP/couple" ]]; then
  remaining=$(ls -A "$APP/couple" 2>/dev/null || true)
  if [[ -z "$remaining" ]]; then
    echo "→ Removing empty $APP/couple/"
    $RM "$APP/couple"
  else
    echo "⚠  $APP/couple/ not empty — leaving in place:"
    ls "$APP/couple/"
  fi
fi

echo ""
if [[ "$DRY" == "--dry-run" ]]; then
  echo "=== DRY RUN COMPLETE ==="
else
  echo "=== CLEANUP COMPLETE ==="
  echo "Commit: git add -A && git commit -m 'chore: remove legacy couple screens after frost-bride deploy'"
fi
