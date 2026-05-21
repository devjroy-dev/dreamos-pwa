#!/usr/bin/env python3
"""
B-4 bug fix — dreamos-pwa
1. Reminders page: add FAB + create sheet (matching events/expenses/vendors pattern)
2. Fix all unicode escape literals across circle and journey hub pages
3. Fix formatActivityLine switch cases in journey.ts
Drop in dreamos-pwa repo root. Run: python3 b4_bug_frontend.py
"""
import subprocess, sys

# ── Fix 1: reminders/page.tsx — add create (FAB + sheet) ─────────────────────
REMINDERS = "app/(frost)/frost/canvas/journey/reminders/page.tsx"
with open(REMINDERS) as f: src = f.read()

# Add createReminder import
src = src.replace(
"import { fetchReminders, toggleReminder, deleteReminder, type Reminder } from '../../../../../../lib/frost/journey';",
"import { fetchReminders, createReminder, toggleReminder, deleteReminder, type Reminder } from '../../../../../../lib/frost/journey';"
)

# Add addSheet state + handleCreate after the remove callback
src = src.replace(
"""  const pending = items.filter(r => !r.is_complete)""",
"""  const [addSheet, setAddSheet] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form, setForm] = useState({ text: '', due_date: '', event: '' });

  const handleCreate = async () => {
    if (!form.text.trim() || saving) return;
    setSaving(true);
    const created = await createReminder({ text: form.text.trim(), due_date: form.due_date || undefined, event: form.event || undefined });
    if (created) {
      setItems(prev => [created, ...prev]);
      setAddSheet(false);
      setForm({ text: '', due_date: '', event: '' });
    }
    setSaving(false);
  };

  const pending = items.filter(r => !r.is_complete)"""
)

# Add FAB and add sheet before closing CanvasShell tag
src = src.replace(
"""      {confirmId && <>""",
"""      {/* FAB */}
      <button onClick={() => setAddSheet(true)} style={{ position:'fixed', bottom:'calc(env(safe-area-inset-bottom,0px) + 88px)', right:24, zIndex:50, width:52, height:52, borderRadius:26, background:t.brass, border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 24px rgba(0,0,0,0.28)', touchAction:'manipulation' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#1B1612" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>

      {addSheet && <>
        <div onClick={() => setAddSheet(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`28px 24px calc(28px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:24, color:t.ink, marginBottom:4 }}>Add a reminder</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:24 }}>What needs to happen.</div>
          {([
            { key:'text',     label:'Reminder',  placeholder:'Call florist, confirm fitting…', type:'text' },
            { key:'event',    label:'For event',  placeholder:'Wedding, Mehendi…',               type:'text' },
            { key:'due_date', label:'Due date',   placeholder:'',                                type:'date' },
          ] as {key:string;label:string;placeholder:string;type:string}[]).map(f => (
            <div key={f.key} style={{ marginBottom:16 }}>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>{f.label}</div>
              <input type={f.type} value={(form as Record<string,string>)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.body, fontSize:15, color:t.ink, outline:'none', boxSizing:'border-box' as const, colorScheme:'dark' }} />
            </div>
          ))}
          <button onClick={handleCreate} disabled={!form.text.trim() || saving}
            style={{ width:'100%', padding:14, background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(!form.text.trim()||saving)?0.5:1, marginTop:4 }}>
            {saving ? 'Adding\u2026' : 'Add Reminder'}
          </button>
        </div>
      </>}

      {confirmId && <>"""
)

with open(REMINDERS, 'w') as f: f.write(src)
print('Patched reminders/page.tsx')

# ── Fix 2: circle/page.tsx — unicode escape literals ─────────────────────────
CIRCLE = "app/(frost)/frost/canvas/journey/circle/page.tsx"
with open(CIRCLE) as f: src = f.read()

src = src.replace('Loading\\u2026', 'Loading\u2026')
src = src.replace('Message\\u2026', 'Message\u2026')
src = src.replace('\\u2726\\u2002', '\u2726\u2002')
src = src.replace("placeholder=\"Ananya, Mom, Planner\\u2026\"", "placeholder=\"Ananya, Mom, Planner\u2026\"")
src = src.replace("'Generating\\u2026'", "'Generating\u2026'")

with open(CIRCLE, 'w') as f: f.write(src)
print('Fixed unicode in circle/page.tsx')

# ── Fix 3: journey/page.tsx — unicode escape literals ────────────────────────
HUB = "app/(frost)/frost/canvas/journey/page.tsx"
with open(HUB) as f: src = f.read()

src = src.replace("\\'s journey.", "\u2019s journey.")
src = src.replace("\\u2726\\u2002", "\u2726\u2002")
src = src.replace("you\\u2019d", "you\u2019d")

with open(HUB, 'w') as f: f.write(src)
print('Fixed unicode in journey/page.tsx')

# ── Fix 4: journey.ts — formatActivityLine + add createReminder ──────────────
JOURNEY = 'lib/frost/journey.ts'
with open(JOURNEY) as f: src = f.read()

# Fix formatActivityLine switch cases
src = src.replace(
"""export function formatActivityLine(e: CircleActivityEvent): string {
  const actor = e.actor_role === 'bride' ? 'You' : (e.payload?.actor_name || 'Someone');
  const p = e.payload || {};
  switch (e.event_type) {
    case 'vendor_booked':           return `${actor} booked ${p.vendor_name || 'a vendor'}`;
    case 'payment_logged':          return `${actor} logged a payment`;
    case 'task_completed':          return `${actor} completed a task`;
    case 'muse_saved':              return `${actor} saved to Muse`;
    case 'circle_message_sent':     return `${actor} sent a message`;
    case 'circle_invite_accepted':  return `${p.member_name || 'Someone'} joined your Circle`;
    default:                        return `${actor} made a change`;
  }
}""",
"""export function formatActivityLine(e: CircleActivityEvent): string {
  const actor = e.actor_role === 'bride' ? 'You' : (e.payload?.actor_name || e.payload?.member_name || 'Someone');
  const p = e.payload || {};
  switch (e.event_type) {
    case 'save_added':              return `${actor} saved to Muse`;
    case 'comment':                 return `${actor} commented`;
    case 'removed':                 return `${actor} removed a save`;
    case 'vendor_booked':           return `${actor} booked ${p.vendor_name || 'a vendor'}`;
    case 'payment_logged':          return `${actor} logged a payment`;
    case 'task_completed':          return `${actor} completed a task`;
    case 'muse_saved':              return `${actor} saved to Muse`;
    case 'circle_message_sent':     return `${actor} sent a message`;
    case 'circle_invite_accepted':  return `${p.member_name || 'Someone'} joined your Circle`;
    default:                        return `${actor} made a change`;
  }
}"""
)

# Add createReminder function after deleteReminder
src = src.replace(
"""export async function deleteReminder(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/checklist/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}""",
"""export async function deleteReminder(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/v2/couple/events/${getCoupleId()}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function createReminder(data: {
  text: string; due_date?: string; event?: string;
}): Promise<Reminder | null> {
  if (USE_MOCKS) {
    const mock: Reminder = { id: `r-${Date.now()}`, couple_id: '', text: data.text, due_date: data.due_date||null, is_complete: false, event: data.event||null };
    return delay(mock);
  }
  try {
    const id = getCoupleId();
    const r: any = await apiFetch(`/api/v2/couple/events/${id}`, {
      method: 'POST',
      body: JSON.stringify({ title: data.text, event_date: data.due_date || new Date().toISOString().split('T')[0], kind: 'reminder', notes: data.event || null }),
    });
    const e = r?.event;
    if (!e) return null;
    return { id: e.id, couple_id: id||'', text: e.title||data.text, due_date: e.event_date||null, is_complete: false, event: e.notes||data.event||null };
  } catch { return null; }
}"""
)

# Also fix fetchReminders and deleteReminder to use correct endpoints
src = src.replace(
"""export async function fetchReminders(): Promise<Reminder[]> {
  if (USE_MOCKS) return delay(MOCK_REMINDERS);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/couple/checklist/${id}`);
  return r?.data ?? [];
}""",
"""export async function fetchReminders(): Promise<Reminder[]> {
  if (USE_MOCKS) return delay(MOCK_REMINDERS);
  const id = getCoupleId();
  // Reminders are events with kind='reminder' stored in the events table
  const r: any = await apiFetch(`/api/v2/couple/events/${id}?state=all`);
  const raw: any[] = (r?.events ?? []).filter((e: any) => e.kind === 'reminder');
  return raw.map(e => ({
    id:          e.id,
    couple_id:   id || '',
    text:        e.title || '',
    due_date:    e.event_date || null,
    is_complete: e.state === 'done',
    event:       e.notes || null,
  }));
}"""
)

src = src.replace(
"""export async function toggleReminder(id: string, is_complete: boolean): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/checklist/${id}`, { method: 'PATCH', body: JSON.stringify({ is_complete }) }); return true; }
  catch { return false; }
}""",
"""export async function toggleReminder(id: string, is_complete: boolean): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try {
    await apiFetch(`/api/v2/couple/events/${id}/state`, {
      method: 'PATCH',
      body: JSON.stringify({ state: is_complete ? 'done' : 'upcoming' }),
    });
    return true;
  } catch { return false; }
}"""
)

# Fix deleteReminder — it incorrectly uses getCoupleId() instead of the event id
src = src.replace(
"""export async function deleteReminder(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/v2/couple/events/${getCoupleId()}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}""",
"""export async function deleteReminder(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/v2/couple/events/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}"""
)

with open(JOURNEY, 'w') as f: f.write(src)
print('Patched journey.ts')

# ── tsc ──────────────────────────────────────────────────────────────────────
result = subprocess.run(['npx', '--no-install', 'tsc', '--noEmit'], capture_output=True, text=True)
if result.returncode != 0:
    print('TSC ERRORS:')
    print(result.stdout)
    sys.exit(1)

print('tsc PASS\n')
print('Run next:')
print('  git add lib/frost/journey.ts "app/(frost)/frost/canvas/journey/reminders/page.tsx" "app/(frost)/frost/canvas/journey/circle/page.tsx" "app/(frost)/frost/canvas/journey/page.tsx"')
print('  git commit -m "fix(bride-b4): reminders CRUD, unicode fixes, circle activity types, correct endpoints"')
print('  git push origin main')
