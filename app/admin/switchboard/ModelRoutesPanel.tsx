'use client';
// app/admin/switchboard/ModelRoutesPanel.tsx — MODEL ROUTES. CE-41 seat F, R-41.85.
//
// Who answers, per lane, per hand, from the founder's phone, with no shell and no
// deploy. Victor's hand and Donna's on the WhatsApp vendor line and in the app;
// Mira's reply and Mira's nudge on the marketing line; the couple line; harvest.
//
// THE ROOM IS SEAT E'S, THE PLANE IS SEAT F'S. Every shape here is ratified in
// `docs/mocks/COCKPIT/COCKPIT_VETO_SHEET.md` §D: the group head with its surface
// count (27), the surface rows (28), tiers beneath a surface (29), one 44px role
// row per switch (30), the value in words (31), the `Differs from code` chip on the
// tier head (32), the two-sentence env banner (33), the read-only outlined switch
// (34/43). THE PAINT IS THE CURRENT CARD'S — `T` from `AdminUI.tsx` — because seat
// E's `--atelier-*` retint has not landed in code at 81570ed3; the chair's
// instruction is the current card's tokens. When the retint lands, the colours in
// this file are the ones to move and there are no others: every colour is a `T.*`
// reference and this file contains no colour literal (b64 §4 asserts it).
//
// A COMPONENT, NOT A PAGE. Seat E's Switchboard re-shape (R-41.82) will house this
// as its own group; until then `app/admin/model-routes/page.tsx` mounts it so the
// founder can walk §7 without waiting for that landing. One line moves it home.
//
// THE PANEL HOLDS NO ROUTING MAP. No lane key, no provider id, no model string is
// written here. Keys, roles, the switchable set and the fallback geometry all come
// down the wire from `src/lib/modelRouter.js`'s registry through F1's read door. A
// copy on the glass is the day the glass and the wire disagree, and the wire wins
// while the founder reads the glass.
//
// PERSONA NAMES ARE LAWFUL ON THIS SURFACE AND NO OTHER (R-41.89). They live in
// `lib/admin-api/modelRoutesCopy.ts` and reach nothing else.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { T, GhostBtn, Toast } from '../_components/AdminUI';
import {
  getModelRoutes, setModelRoute,
  type ModelRouteLane, type ModelRole,
} from '../../../lib/admin-api/index';
import {
  SURFACE_ORDER, surfaceName, surfaceSub, tierName, roleName, providerName, provenanceWord,
} from '../../../lib/admin-api/modelRoutesCopy';

// ── THE TWO-WAY SWITCH (§E-43) ────────────────────────────────────────────────
// Segmented, the live side filled, the read-only variant outlined. The fill is a
// SELECTION and not a state, so it takes the card's accent rather than one of the
// three state inks — R-40.129 forbids a role as a ground, and reaching for
// `T.success` here to match the frame's teal would have been exactly that.
function TwoWay({ options, value, onPick, disabled, readOnly, label }: {
  options: { id: string; label: string }[];
  value: string | undefined; onPick: (id: string) => void;
  disabled?: boolean; readOnly?: boolean; label: string;
}) {
  return (
    <div
      role={readOnly ? undefined : 'group'} aria-label={label}
      style={{ display: 'inline-flex', border: `0.5px solid ${T.border}`, borderRadius: 3, overflow: 'hidden' }}
    >
      {options.map(o => {
        const on = o.id === value;
        const base: React.CSSProperties = {
          minHeight: 36, minWidth: 84, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 12px', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.08em',
          textTransform: 'uppercase', border: 'none', whiteSpace: 'nowrap',
          transition: 'background 140ms, color 140ms',
        };
        if (readOnly) {
          return (
            <span key={o.id} style={{
              ...base,
              background: 'transparent',
              color: on ? T.gold : T.muted,
              boxShadow: on ? `inset 0 0 0 1px ${T.gold}` : 'none',
            }}>{o.label}</span>
          );
        }
        return (
          <button
            key={o.id} onClick={() => !on && onPick(o.id)} disabled={disabled}
            aria-pressed={on}
            style={{
              ...base,
              background: on ? T.gold : 'transparent',
              color: on ? T.onAccent : T.muted,
              cursor: disabled ? 'not-allowed' : on ? 'default' : 'pointer',
              opacity: disabled ? 0.55 : 1,
            }}
          >{o.label}</button>
        );
      })}
    </div>
  );
}

// The divergence chip (§D-32, §E-42): edge and ink, never a tinted ground.
function DiffersChip({ fields }: { fields: string[] }) {
  return (
    <span
      title={`Differs from the code default: ${fields.join(', ')}`}
      style={{
        display: 'inline-block', border: `0.5px solid ${T.warning}`, color: T.warning,
        borderRadius: 3, padding: '3px 8px', fontFamily: T.ff.label, fontSize: 9,
        letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}
    >Differs from code</span>
  );
}

// ── ONE ROLE ─────────────────────────────────────────────────────────────────
// Its own row, its own switch, 44px minimum (§D-30, and F-41.67's cure: at 374 a
// tier · switch · hand triptych clipped the second segment off the glass, so the
// tier became a heading and each role got a row of its own).
function RoleRow({ lane, role, providers, busy, onPick }: {
  lane: ModelRouteLane; role: ModelRole; providers: { id: string; label: string }[];
  busy: boolean; onPick: (role: ModelRole, provider: string) => void;
}) {
  const pf = role === 'provider' ? 'provider' : role === 'donna' ? 'donna_provider' : 'nudge_provider';
  const current = lane.effective[pf] as string | undefined;
  // A split that is not set means the hand FOLLOWS the primary — Donna riding
  // Victor's route rather than her own. The switch shows where she actually is,
  // which is the primary's provider, and the word beneath says she is following.
  const following = role !== 'provider' && !current;
  const shown = current ?? (lane.effective.provider as string | undefined);
  const name = roleName(lane.surface, role);
  const outside = lane.outside_switchable.includes(role);
  // A lane whose value lives on the server has no switch to offer — the founder
  // changes it in Railway, not here, and a control that cannot act is worse than
  // none. F1b serves `read_only_because` so the glass says WHY in the same breath.
  const readOnly = !lane.reachable || outside || !!lane.env;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 10, alignItems: 'center', minHeight: 44 }}>
      <div style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted, minWidth: 0 }}>
        {name && <b style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.soft }}>{name}</b>}
        {providerName(shown)} · {following ? `following ${roleName(lane.surface, 'provider') || 'the main hand'}` : provenanceWord(lane, role)}
        {outside && ' · outside the two this panel offers'}
      </div>
      <TwoWay
        label={`${name || surfaceName(lane.surface)} — choose who answers`}
        options={providers} value={shown} disabled={busy} readOnly={readOnly}
        onPick={p => onPick(role, p)}
      />
    </div>
  );
}

// ── ONE SURFACE ──────────────────────────────────────────────────────────────
function SurfaceBlock({ surface, lanes, providers, busy, onPick }: {
  surface: string; lanes: ModelRouteLane[]; providers: { id: string; label: string }[];
  busy: string | null; onPick: (lane: ModelRouteLane, role: ModelRole, provider: string) => void;
}) {
  // ── F-41.94 · NO SWITCH SHARES A LINE WITH PROSE ──────────────────────────
  // A single-role surface used to wear its switch in this grid's right-hand `auto`
  // column, with the whole role row nested inside it. That column then sized to the
  // nested row's max-content — the value text PLUS 168px of segments — and at 374
  // it claimed nearly the whole box, squeezed the title to min-content, and the two
  // tracks overlapped: `Answer couples on WhatsApp` broke to four lines with
  // `Anthropic · seeded` painted over the first of them.
  //
  // This is F-41.67's class on the variant its cure never reached. Seat E fixed the
  // TIER row by giving it a line of its own; the flat row kept the triptych because
  // in the mock it carried no value text beside the switch — and mine does. So the
  // cure is the same cure, applied to the variant that was missed: EVERY lane now
  // renders as a block spanning `1 / -1`, tiered or not, and nothing nests in the
  // `auto` column at all. No pixel is named and no breakpoint is added; the row
  // cannot overlap because there are no longer two tracks competing for one line.
  // `TDW_M_ROWFIX_PASS2_HANDOVER.md`'s discipline — no cell names 374.
  //
  // `flat` now decides only whether a TIER HEADING is drawn, never where a switch
  // goes. Three surfaces are flat today: the couple line, harvest, and the bride app
  // lane F1b added — which arrives cured rather than arriving broken behind them.
  const flat = lanes.length === 1 && lanes[0].tier === 'default';
  const only = lanes[0];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 12, rowGap: 6,
      alignItems: 'start', padding: '12px 0', borderBottom: `0.5px solid ${T.border}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 500, color: T.ink, lineHeight: 1.35 }}>
          {surfaceName(surface)}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
          <span style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted }}>{surfaceSub(surface)}</span>
          {flat && only.differs.length > 0 && <DiffersChip fields={only.differs} />}
        </div>
      </div>

      {lanes.map(lane => (
        <div key={lane.key} style={{
          gridColumn: '1 / -1',
          padding: flat ? '2px 0 4px' : '8px 0 8px 14px',
          borderLeft: flat ? 'none' : `0.5px solid ${T.border}`,
          marginTop: flat ? 0 : 6,
        }}>
          {!flat && (
            <div style={{
              fontFamily: T.ff.body, fontSize: 12, color: T.soft,
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
            }}>
              <span>{tierName(lane.tier)}</span>
              {lane.differs.length > 0 && <DiffersChip fields={lane.differs} />}
            </div>
          )}

          {/* A lane set on the server says so where a switch would otherwise be. */}
          {lane.read_only_because && (
            <p style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted, margin: '2px 0 0', lineHeight: 1.45 }}>
              {lane.read_only_because}{lane.env ? ` · ${lane.env}${lane.env_set ? '' : ' is not set'}` : ''}
            </p>
          )}

          {/* A lane no code path can reach says so in place of offering a switch.
              `model.pwa_vendor.trial` is live, well-formed and asked for by nothing:
              vendors_tier_check admits four words and `trial` is not one of them
              (0115). The door refuses writes here; the glass must not offer one. */}
          {!lane.reachable && (
            <p style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted, margin: '2px 0 0', lineHeight: 1.45 }}>
              No lane reaches this row. It is read-only until it is retired.
            </p>
          )}

          {lane.roles.length === 0 ? (
            <div style={{ marginTop: 6 }}>
              <TwoWay
                label={`${tierName(lane.tier) || surfaceName(lane.surface)} — read only`} readOnly
                options={providers} value={lane.effective.provider as string} onPick={() => {}}
              />
            </div>
          ) : lane.roles.map(role => (
            <RoleRow
              key={role} lane={lane} role={role} providers={providers}
              busy={busy === lane.key} onPick={(r, p) => onPick(lane, r, p)}
            />
          ))}

          {lane.unknown_fields.length > 0 && (
            <p style={{ fontFamily: T.ff.body, fontSize: 10, color: T.muted, margin: '6px 0 0' }}>
              This row also carries {lane.unknown_fields.join(', ')} — nothing reads it, and this panel leaves it alone.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ── THE PANEL ────────────────────────────────────────────────────────────────
export default function ModelRoutesPanel() {
  const [lanes, setLanes] = useState<ModelRouteLane[]>([]);
  const [switchable, setSwitchable] = useState<Record<string, string>>({});
  const [forced, setForced] = useState<string | null>(null);
  const [cacheMs, setCacheMs] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await getModelRoutes();
      setLanes(r.lanes); setSwitchable(r.switchable); setForced(r.forced); setCacheMs(r.cache_ms);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'the door did not answer');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  // The two the door offers, in the order it offers them. Never a literal here.
  const providers = useMemo(
    () => Object.keys(switchable).map(id => ({ id, label: providerName(id) })),
    [switchable],
  );

  // Grouped by surface, in the frame's order; any surface the door serves that the
  // order does not name is appended rather than dropped.
  const groups = useMemo(() => {
    const by = new Map<string, ModelRouteLane[]>();
    for (const l of lanes) {
      if (!by.has(l.surface)) by.set(l.surface, []);
      (by.get(l.surface) as ModelRouteLane[]).push(l);
    }
    const named = SURFACE_ORDER.filter(s => by.has(s)) as string[];
    const rest = [...by.keys()].filter(s => !named.includes(s)).sort();
    return [...named, ...rest].map(s => ({ surface: s, lanes: by.get(s) as ModelRouteLane[] }));
  }, [lanes]);

  const pick = useCallback(async (lane: ModelRouteLane, role: ModelRole, provider: string) => {
    setBusy(lane.key);
    try {
      const r = await setModelRoute(lane.key, role, provider);
      // READ THE BOARD BACK, never patch it locally. The door applies the router's
      // own guards on the way out — a keyless provider drops a split, an out-of-set
      // model is refused — so the only honest next state is the one the door hands
      // back. R-39.15 in a click handler.
      await load();
      const seconds = Math.round((cacheMs || 60000) / 1000);
      setToast({
        msg: r.created
          ? `${roleName(lane.surface, role) || surfaceName(lane.surface)} set to ${providerName(provider)}. This lane had no row; one was written from what was already live. Live within ${seconds} seconds.`
          : `${roleName(lane.surface, role) || surfaceName(lane.surface)} set to ${providerName(provider)}. Live within ${seconds} seconds.`,
      });
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : 'the switch did not land', error: true });
      await load();
    } finally { setBusy(null); }
  }, [load, cacheMs]);

  const surfaceCount = groups.length;

  return (
    <section style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: '18px 20px 6px', marginBottom: 16 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        borderBottom: `0.5px solid ${T.border}`, paddingBottom: 6, marginBottom: 2, gap: 10,
      }}>
        <h2 style={{ fontFamily: T.ff.body, fontWeight: 600, fontSize: 14, color: T.ink, margin: 0 }}>Model routes</h2>
        <span style={{ fontFamily: T.ff.label, fontSize: 10, color: T.muted, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em' }}>
          {loading ? '…' : `${surfaceCount} surface${surfaceCount === 1 ? '' : 's'}`}
        </span>
      </div>

      {/* §D-33 — two short sentences, and it names no provider: the founder needs to
          know the switches are overridden, not which value overrode them. */}
      {forced && (
        <div style={{
          border: `0.5px solid ${T.warning}`, borderRadius: 3, padding: '10px 12px',
          fontFamily: T.ff.body, fontSize: 12, color: T.warning, lineHeight: 1.45, margin: '10px 0 0',
        }}>
          LLM_PROVIDER is set on the server. Every switch below is overridden until it is unset.
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '14px 0 6px' }}>
          <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.danger, margin: 0 }}>The door did not answer: {error}</p>
          <GhostBtn small label="Try again" onClick={() => void load()} />
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '14px 0' }}>
          {[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 96 }} />)}
        </div>
      ) : !error && lanes.length === 0 ? (
        <p style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, margin: '14px 0' }}>
          The router served no lanes. Check that dream-os is on a build carrying the model-routes door.
        </p>
      ) : groups.map(g => (
        <SurfaceBlock
          key={g.surface} surface={g.surface} lanes={g.lanes} providers={providers}
          busy={busy} onPick={pick}
        />
      ))}

      {!loading && !error && lanes.length > 0 && (
        <p style={{ fontFamily: T.ff.body, fontSize: 10, color: T.muted, margin: '12px 0 10px', lineHeight: 1.5 }}>
          A switch is live within {Math.round((cacheMs || 60000) / 1000)} seconds — the router holds each route for that
          long on every server that is running.
        </p>
      )}

      {toast && <Toast msg={toast.msg} error={toast.error} onDone={() => setToast(null)} />}
    </section>
  );
}
