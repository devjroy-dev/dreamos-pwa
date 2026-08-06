#!/usr/bin/env node
// scripts/tdw09_vendor_census.mjs — TDW_09 · PACKAGE 1 · B-3
// THE VENDOR-LANE LITERAL CENSUS, as a committed instrument.
//
// THE COUNTING METHOD, STATED (the roster-is-the-number's-home law — this
// instrument OWNS every count it prints; no prose carries a number this file
// does not emit):
//   · LANE = app/vendor/** + components/vendor/** + app/demo/vendor/**
//     (demo mirrors follow the vendor lane per R-S1-AMENDED).
//   · FILES = *.ts / *.tsx / *.css inside the lane.
//   · COMMENTS STRIPPED FIRST (block + line), the estate's stripper discipline:
//     the tree documents its dead verbatim, and a census that reads epitaphs
//     convicts the graveyard (the IA map's conviction №4).
//   · TWO SPECIES, counted separately because a hex census is BLIND to the
//     second (S1's home-5 blindness, confirmed at lane scale by F-09.84):
//       HEX   = #RRGGBB | #RGB   (case-folded)
//       BRASS = rgba(201,168,76,α)  — the gold-hairline family
//   · Every number is a FLOOR over code text: values reached through JS consts
//     one hop away are counted at their literal site, not their read sites.
//
// THE LAWFUL-INVARIANT EXCEPTIONS — listed BY LAW, never "cleaned up". A
// theming pass that "harmonizes" any row below is reverting a ruling:
//
//   · THE PIN TRIO (app/vendor/pin/, pin-login/, pin-reset/) — theme-invariant
//     DARK by R-M6 / THE-LANDING-IS-THE-LAW (the founder's cream veto, CE-198):
//     photo-slide gates match the landing, ink pinned to match, permanently.
//   · Splash.tsx — ruled invariant at R-M4(c); its own comment names the
//     mechanism and the fact it deliberately does not read --atelier-bg.
//   · #25D366 — THE WHATSAPP GREEN, RULED INVARIANT BY FOUNDER WORD.
//     Verbatim warrant: 「 green it 」 (2026-08-06, the Package 1 relay — the
//     shelf item riding every succession note since Block 08 closes on it).
//     MECHANISM (F-06.85's shape): the value is the universal WhatsApp-
//     recognition green; its entire job is being recognised as WhatsApp, so it
//     is theme-blind on every surface PERMANENTLY — no future theming pass ever
//     re-tints it, on any theme, for any palette. This census lists its sites
//     so the exemption is enumerable, not folklore.
//
// Run: node scripts/tdw09_vendor_census.mjs        (from the repo root)
// Emits the per-value and per-file tables plus the invariant-site roster.
// scripts/tdw09_p1_canon.proof.mjs asserts this file's properties.

import fs from 'fs';
import path from 'path';

const LANES = ['app/vendor', 'components/vendor', 'app/demo/vendor'];
const WHATSAPP_GREEN = '#25d366'; // 「 green it 」 — see the header.
const INVARIANT_PATHS = [
  'app/vendor/pin/', 'app/vendor/pin-login/', 'app/vendor/pin-reset/', // R-M6
  'components/vendor/Splash.tsx',                                      // R-M4(c)
];

function strip(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1');
}
function walk(d, acc) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx?|css)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const perFile = {};      // file -> { hex, brass }
const hexAgg = {};       // value -> count
const brassAgg = {};     // alpha -> count
const greenSites = [];   // [file, line]

for (const lane of LANES) {
  for (const f of walk(lane, [])) {
    const raw = fs.readFileSync(f, 'utf8');
    const c = strip(raw);
    const hex = c.match(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/g) || [];
    const brass = c.match(/rgba\(201,168,76,[0-9.]+\)/g) || [];
    if (hex.length || brass.length) perFile[f] = { hex: hex.length, brass: brass.length };
    for (const h of hex) hexAgg[h.toLowerCase()] = (hexAgg[h.toLowerCase()] || 0) + 1;
    for (const b of brass) {
      const a = b.match(/rgba\(201,168,76,([0-9.]+)\)/)[1];
      brassAgg[a] = (brassAgg[a] || 0) + 1;
    }
    // Invariant roster: the green's sites, enumerated with line numbers from the
    // RAW file (an exemption you cannot locate is folklore, not law).
    raw.split('\n').forEach((line, i) => {
      if (/#25D366/i.test(line)) greenSites.push(`${f}:${i + 1}`);
    });
  }
}

const hexTotal = Object.values(hexAgg).reduce((a, b) => a + b, 0);
const brassTotal = Object.values(brassAgg).reduce((a, b) => a + b, 0);

console.log('══ TDW_09 VENDOR-LANE LITERAL CENSUS (code-only, comments stripped) ══');
console.log(`HEX:   ${hexTotal} occurrences · ${Object.keys(hexAgg).length} distinct · ${Object.keys(perFile).length} files carry literals`);
console.log(`BRASS: ${brassTotal} occurrences · ${Object.keys(brassAgg).length} distinct alphas (F-09.84's species — invisible to any hex census)`);
console.log('\n── HEX per value ──');
for (const [k, v] of Object.entries(hexAgg).sort((a, b) => b[1] - a[1]))
  console.log(String(v).padStart(4), k, k === WHATSAPP_GREEN ? '   ← RULED-INVARIANT 「 green it 」' : '');
console.log('\n── BRASS per alpha ──');
for (const [k, v] of Object.entries(brassAgg).sort((a, b) => b[1] - a[1]))
  console.log(String(v).padStart(4), `rgba(201,168,76,${k})`);
console.log('\n── per file (hex · brass) ──');
for (const [k, v] of Object.entries(perFile).sort((a, b) => (b[1].hex + b[1].brass) - (a[1].hex + a[1].brass)))
  console.log(String(v.hex).padStart(3), String(v.brass).padStart(4), k);
console.log('\n── LAWFUL-INVARIANT ROSTER ──');
console.log('R-M6 pin trio + R-M4(c) Splash: every literal inside these paths is exempt BY RULING:');
for (const p of INVARIANT_PATHS) console.log('  ·', p);
console.log(`#25D366 「 green it 」 sites (${greenSites.length}):`);
for (const s of greenSites) console.log('  ·', s);

// Machine-readable emission for the bench.
fs.writeFileSync('scripts/tdw09_vendor_census.json', JSON.stringify({
  hexTotal, hexDistinct: Object.keys(hexAgg).length,
  brassTotal, brassDistinct: Object.keys(brassAgg).length,
  files: Object.keys(perFile).length,
  greenSites, invariantPaths: INVARIANT_PATHS,
}, null, 2));
console.log('\nwritten: scripts/tdw09_vendor_census.json');
