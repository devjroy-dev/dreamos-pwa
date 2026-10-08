// v2/app/vendor/(shell)/supplies/style.ts · CE-47 · PRO · Supplies' own sheet, shared by its views (the list, Join,
// the IndiaMART requirement, Bills, Gear). Moved out of screen.tsx in P2 so the views import it without a cycle.
export const SP_CSS = `
.sp-lede{margin:4px 0 4px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.sp-card{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);padding:16px;display:flex;flex-direction:column;gap:8px}
.sp-card + .sp-card{margin-top:12px}
.sp-tags{display:flex;flex-wrap:wrap;gap:6px}
.sp-tag{font:var(--wl-t5);color:var(--atelier-ink-mute);border:1px solid var(--atelier-card-border);border-radius:999px;padding:3px 9px}
.sp-name{font:var(--wl-t2);color:var(--atelier-ink)}
.sp-txt{font:var(--wl-t4);color:var(--atelier-ink)}
.sp-mute{font:var(--wl-t4);color:var(--atelier-ink-mute)}
.sp-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.sp-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--atelier-accent-text);background:transparent;color:var(--atelier-accent-text);font:var(--wl-tb);text-decoration:none;box-sizing:border-box;touch-action:manipulation}
.sp-btn.solid{background:var(--atelier-accent-text);color:var(--atelier-card-bg)}
.sp-btn:disabled{opacity:.6}
.sp-field{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--atelier-card-border);font:var(--wl-t4);color:var(--atelier-ink)}
.sp-field span:first-child{color:var(--atelier-ink-mute)}
.sp-step{flex:1;text-align:left}
.sp-loop{display:flex;gap:10px;align-items:center;justify-content:space-between;border-top:1px solid var(--atelier-card-border);padding-top:10px;margin-top:4px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.sp-loop{flex-wrap:wrap}
.sp-loop .sp-btn{flex-shrink:0;white-space:nowrap}
.sp-back{align-self:flex-start;min-height:44px;padding:0;background:transparent;border:0;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.sp-label{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:4px 0 6px}
.sp-in{width:100%;box-sizing:border-box;min-height:44px;padding:10px 14px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:12px;font:var(--wl-t4);color:var(--atelier-ink)}
.sp-dw{margin:6px 0 0;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.sp-copy{font:var(--wl-t4);color:var(--atelier-ink);border:1px dashed var(--atelier-card-border);border-radius:10px;padding:12px}
.sp-link{color:var(--atelier-accent-text);overflow-wrap:anywhere}
.sp-status{margin:0;font:var(--wl-t4);color:var(--atelier-ink);border-left:3px solid var(--role-metal);padding:6px 10px}
.sp-status.error{border-left-color:var(--role-critical)}
`;
