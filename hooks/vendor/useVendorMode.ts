// hooks/useVendorMode.ts — TYPE-ONLY RESIDUE · TDW_09 PACKAGE 2 (fork 8.4)
//
// THE HOOK IS RETIRED BY NAME (chair relay #3). `useVendorMode` persisted the
// nav mode ('ai' | 'studio' | 'discover') to localStorage under
// `vendor_app_mode` — a no-localStorage-law residue that dies with its organ:
// the mode is dissolved under R-X27 arm (a) and nothing reads or writes it in
// the live lane. The function, the key, the VALID list and the DEFAULT are all
// deleted here, not moved.
//
// WHAT SURVIVES AND WHY: the `VendorMode` TYPE. The demo twin is DECLARED-HELD
// on the old two-membership nav (F-09.89, fork 8.5 = (b)) and its own
// classifier (components/demo/DemoVendorHeader.tsx::modeFromPath) is typed on
// it. When F-09.89's rider retires the demo's old nav, this file retires WITH
// it — a named line in that sitting's delivery.
//
// `useVictorMode` (Business/Advisor, server-persisted) was ALWAYS disjoint
// from this hook — its own header says so — and is untouched.

export type VendorMode = 'ai' | 'studio' | 'discover';
