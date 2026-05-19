# frost-pwa-bride — Deploy Guide

## What's in this ZIP

Frost bride PWA build for `dreamos-pwa`. Adds `app/(bride)/` route group.

```
app/(bride)/
  layout.tsx              ← PLAN/DISCOVER mode context, TopBar, BottomNav
  couple/today/           ← countdown, events, muse preview, circle activity
  couple/muse/            ← full image grid, ceremony filter, tap-to-delete
  couple/plan/            ← events / bookings / receipts tabs
  couple/circle/          ← members list, activity feed, invite form
  couple/dreamai/         ← bride DreamAi chat (brideEngine, no tool_calls surface)
  couple/discover/        ← shell (P2-9)
  couple/messages/        ← shell (post-launch)
components/frost-bride/   ← TopBar, BottomNav, atoms, tokens
lib/types/bride.ts        ← P2-7a contract spec shapes (backend builds to match these)
lib/frost-api/couple.ts   ← typed client, 10 endpoint functions
lib/mocks/bride.ts        ← Priya Sharma persona mock data
```

---

## Deploy steps

### 1. Prerequisite — couple auth screens at (auth)/couple/

The vendor session cleanup.sh deleted `app/couple/pin`, `pin-login`, `onboarding`.
They must be at `app/(auth)/couple/` before proceeding. Check:

```bash
ls "app/(auth)/couple/"
# Should show: onboarding  pin  pin-login
```

If missing:
```bash
mkdir -p "app/(auth)/couple"
git checkout HEAD -- app/couple/pin app/couple/pin-login app/couple/onboarding
cp -r app/couple/pin        "app/(auth)/couple/pin"
cp -r app/couple/pin-login  "app/(auth)/couple/pin-login"
cp -r app/couple/onboarding "app/(auth)/couple/onboarding"
# Fix import depth (4 levels deep)
sed -i "s|from '../../lib/api'|from '../../../../lib/api'|g" "app/(auth)/couple/pin-login/page.tsx"
sed -i "s|from '../../lib/api'|from '../../../../lib/api'|g" "app/(auth)/couple/pin/page.tsx"
sed -i "s|from '../../lib/api'|from '../../../../lib/api'|g" "app/(auth)/couple/onboarding/page.tsx"
```

### 2. Unzip

```bash
unzip -o frost-pwa-bride.zip && cp -r deploy/* . && rm -rf deploy frost-pwa-bride.zip
```

### 3. Cleanup (dry run first)

```bash
bash cleanup-bride.sh --dry-run
bash cleanup-bride.sh
```

### 4. Smoke test

```bash
NEXT_PUBLIC_USE_MOCKS=true npm run dev
```

In browser console (set session):
```javascript
localStorage.setItem('access_token', 'mock-token');
localStorage.setItem('couple_session', JSON.stringify({
  coupleId: '97f3f358-1130-449d-bb65-2863d006c79a',
  id: '97f3f358-1130-449d-bb65-2863d006c79a',
  name: 'Priya',
  pin_set: true
}));
localStorage.setItem('couple_web_session', localStorage.getItem('couple_session'));
```

Navigate to `/couple/today`.

### 5. Commit

```bash
git add -A && git commit -m "feat: frost-bride PWA — (bride) route group, typed client, 7 screens"
```

---

## Flip to real backend

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE=https://dream-os-production.up.railway.app
```

Note: couple API endpoints (P2-7a) are not yet built on dream-os. `lib/types/bride.ts` shapes ARE the P2-7a spec — backend builds to match.

---

## DreamAi notes

`brideEngine.js` (2,134 lines) — separate from vendor engine. Response shape: `{ ok, reply }` only. The agent acts silently; its reply describes what it did. No tool_calls surface. Same DB-side memory pattern as vendor (conversation row per couple, kind='couple_self').

---

## Next session

- Build dream-os P2-7a couple API handlers to match `lib/types/bride.ts`
- Wire `lib/frost-api/couple.ts` to real endpoints (`USE_MOCKS=false`)
- `app/(auth)/couple/` auth screens need import-depth fix (same as vendor session)
