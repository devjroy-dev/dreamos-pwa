# frost-pwa-vendor — Deploy Guide

## What's in this ZIP

Frost vendor PWA build for `dreamos-pwa`. Restructures the flat `app/vendor/` post-login screens into a clean route-group architecture:

```
app/
  (landing)/            ← marketing surface
    layout.tsx          ← passthrough
    page.tsx            ← homepage (moved from app/page.tsx)
    about/              ← moved
    discover/           ← moved
    join/               ← moved
  (auth)/               ← PIN + login + onboarding
    layout.tsx          ← passthrough
    vendor/pin/
    vendor/pin-login/
    vendor/onboarding/
    couple/pin/
    couple/pin-login/
    couple/onboarding/
  (vendor)/             ← Frost vendor PWA (this build)
    layout.tsx          ← mode context, TopBar, BottomNav
    vendor/today/
    vendor/leads/
    vendor/clients/
    vendor/clients/[clientId]/
    vendor/money/
    vendor/dreamai/
    vendor/studio/      ← shell
    vendor/discovery/   ← shell
    vendor/discovery/leads/
    vendor/discovery/images/
    vendor/discovery/collab/
  (bride)/              ← next session (frost-bride)
  layout.tsx            ← root HTML shell — NEVER moved
```

URLs are unchanged: `/vendor/today`, `/vendor/leads`, etc. Route groups don't affect URLs. Login redirects keep working.

---

## Deploy steps

### 1. Unzip at repo root

```bash
cd dreamos-pwa
unzip -o frost-pwa-vendor.zip
cp -r deploy/* .
rm -rf deploy frost-pwa-vendor.zip
```

### 2. Verify auth screens exist at new location

```bash
ls app/\(auth\)/vendor/pin/
ls app/\(auth\)/vendor/pin-login/
ls app/\(auth\)/vendor/onboarding/
ls app/\(landing\)/
```

If any are missing, the ZIP didn't include them (they weren't in scope — copy manually from `app/vendor/` before running cleanup).

### 3. Run cleanup (dry run first)

```bash
bash cleanup.sh --dry-run   # see what will be deleted
bash cleanup.sh             # apply
```

### 4. Start dev server with mocks

```bash
NEXT_PUBLIC_USE_MOCKS=true npm run dev
```

Navigate to `/vendor/pin-login` → PIN `1234` (demo couple) → `/vendor/today`. Full screen flow with mock data.

### 5. Typecheck

```bash
npx tsc --noEmit
```

Zero errors expected. If there are errors, they'll be in pre-existing legacy files — not in the new `(vendor)/` screens.

---

## Flip to real backend

In `.env.local` at repo root:

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE=https://dream-os-production.up.railway.app
```

Restart dev server. Zero code changes. The `USE_MOCKS` flag in `lib/api/_base.ts` controls every endpoint.

---

## What's NOT in this ZIP (intentional)

| What | Why |
|------|-----|
| `app/(auth)/vendor/pin*`, `couple/pin*` | Auth screens untouched — you copy manually if needed |
| `app/(bride)/` | Next session: frost-bride |
| `app/admin/`, `app/circle/`, `app/coplanner/` | Separate surfaces, untouched |
| `app/layout.tsx` | Root HTML shell — never in scope |
| Couple post-login screens | Next session |

---

## DreamAi screen notes

The vendor DreamAi screen calls `POST /api/v2/vendor/chat` on dream-os. Key architectural points verified against `src/api/vendor/chat.js`:

- **One agent.** WhatsApp and PWA share `runAgenticTurn()` in `src/agent/engine.js`.
- **One conversation row per vendor** (`kind='vendor_self'`). Agent remembers across surfaces — vendor's WhatsApp history is visible from the PWA and vice versa.
- **History field is contract compliance only.** Backend reads from DB. Frontend passes it for session continuity, not for agent memory.
- **`tool_calls` returns names only** (`string[]`). Full audit stays server-side. PWA surfaces them as pills: "✦ Updated lead state", "✦ Read invoices".
- **`channel='web'`** suppresses cross-channel WhatsApp confirmations. PWA reply owns the confirmation.

---

## Next session: frost-bride

Same pattern. `app/(bride)/couple/` route group with identical foundation (types → api → mocks → layout → screens). Screens: today, plan, muse, discover, dreamai, circle. `lib/types/bride.ts` shapes become the dream-os P2-7a contract spec.
