'use client';
// ADM-1 · MORE — everything that is not one of the four daily pages, in plain groups.
// Nothing removed: every live admin route is one tap from here (adminNav.MORE_GROUPS).
import { useRouter } from 'next/navigation';
import { useMode } from '@/lib/worklist/ModeContext';
import { clearAdminSession } from '@/lib/admin-api/_base';
import { MORE_GROUPS } from '../_components/adminNav';
import { C, F, PageHead, Group, NavRow, Ico } from '../_components/Kit';

export default function MorePage() {
  const router = useRouter();
  const { mode, setMode } = useMode();
  return (
    <div>
      <PageHead title="More" sub="Everything else in the admin" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, alignItems: 'start' }}>
        {MORE_GROUPS.map(g => (
          <Group key={g.title} title={g.title}>
            {g.sections.map((s, i) => <NavRow key={s.path} icon={s.icon} label={s.label} sub={s.sub} href={s.path} last={i === g.sections.length - 1} />)}
          </Group>
        ))}
        <Group title="Money">
          <NavRow icon="chart" label="Revenue and subscriptions" sub="Payments, plans and renewals" soon last />
        </Group>
        <Group title="You">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', minHeight: 56, borderBottom: `0.5px solid ${C.line}` }}>
            <span style={{ flex: 1, font: F.t3, color: C.ink }}>Look</span>
            {(['light', 'dark'] as const).map(m => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} style={{ minHeight: 44, padding: '0 16px', borderRadius: 12, border: `1px solid ${mode === m ? C.primary : C.line}`, background: mode === m ? C.primary : 'transparent', color: mode === m ? C.onPrimary : C.soft, font: F.t4 }}>{m === 'light' ? 'Light' : 'Dark'}</button>
            ))}
          </div>
          <button type="button" onClick={() => { clearAdminSession(); router.replace('/admin/login'); }} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 14px', minHeight: 56, background: 'none', border: 'none', textAlign: 'left', color: C.ink, font: F.t3 }}>
            <span style={{ color: C.accent }}><Ico n="out" /></span>Sign out
          </button>
        </Group>
      </div>
    </div>
  );
}
