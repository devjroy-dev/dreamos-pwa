'use client';
import React, { useState, useEffect, useCallback } from 'react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../../lib/frost/tokens';
import { fetchExpenses, markExpensePaid, deleteExpense, fmtINR, type Expense } from '../../../../../../lib/frost/journey';

export default function JourneyExpenses() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => { fetchExpenses().then(r => { setItems(r); setLoading(false); }); }, []);

  const handleMarkPaid = useCallback(async (id: string) => {
    setMarking(id);
    setItems(prev => prev.map(x => x.id === id ? {...x, payment_status:'paid'} : x));
    await markExpensePaid(id);
    setMarking(null);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setItems(prev => prev.filter(x => x.id !== id)); setConfirmId(null);
    await deleteExpense(id);
  }, []);

  const pending = items.filter(e => e.payment_status !== 'paid');
  const paid    = items.filter(e => e.payment_status === 'paid');
  const totalPending = pending.reduce((s,e) => s + (e.actual_amount || 0), 0);
  const totalPaid    = paid.reduce((s,e) => s + (e.actual_amount || 0), 0);

  return (
    <CanvasShell eyebrow="Expenses" backTo="/frost/canvas/journey">
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>
        <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:26, color:t.ink, marginBottom:SP.m }}>What I owe.</div>

        {/* Totals */}
        <FrostedSurface style={{ padding:SP.l, marginBottom:SP.xl }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Pending</div>
              <div style={{ fontFamily:FF.display, fontSize:24, color:t.ink }}>{fmtINR(totalPending)}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Paid</div>
              <div style={{ fontFamily:FF.display, fontSize:24, color:t.brass }}>{fmtINR(totalPaid)}</div>
            </div>
          </div>
        </FrostedSurface>

        {loading && <div style={{ fontFamily:FF.display, fontSize:32, color:t.brassMuted, letterSpacing:6 }}>…</div>}

        {/* Pending section */}
        {pending.length > 0 && <>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>PENDING</div>
          {pending.map(e => (
            <div key={e.id} onContextMenu={ev => { ev.preventDefault(); setConfirmId(e.id); }}
              style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.l}px 0`, borderBottom:`0.5px solid ${t.hairline}`, cursor:'context-menu' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FF.body, fontSize:15, color:t.ink }}>{e.vendor_name || e.description || 'Expense'}</div>
                <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.soft, marginTop:4 }}>
                  {[e.category, e.event].filter(Boolean).join(' · ')}
                  {e.due_date && <span style={{ color:t.brassMuted }}> · Due {new Date(e.due_date).toLocaleDateString('en-IN', {month:'short',day:'numeric'})}</span>}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:SP.m }}>
                <div style={{ fontFamily:FF.display, fontSize:18, color:t.ink }}>{fmtINR(e.actual_amount)}</div>
                <button
                  onClick={() => handleMarkPaid(e.id)}
                  disabled={marking === e.id}
                  style={{ fontFamily:FF.label, fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', background:`rgba(191,160,77,0.12)`, border:`0.5px solid rgba(191,160,77,0.3)`, borderRadius:FR.pill, padding:'5px 10px', color:t.brass, cursor:'pointer', opacity:marking===e.id?0.5:1, whiteSpace:'nowrap' }}
                >Mark paid</button>
              </div>
            </div>
          ))}
        </>}

        {/* Paid section */}
        {paid.length > 0 && <>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginTop:SP.xl, marginBottom:SP.m }}>PAID</div>
          {paid.map(e => (
            <div key={e.id} onContextMenu={ev => { ev.preventDefault(); setConfirmId(e.id); }}
              style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.l}px 0`, borderBottom:`0.5px solid ${t.hairline}`, opacity:0.55, cursor:'context-menu' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FF.body, fontSize:15, color:t.ink, textDecoration:'line-through' }}>{e.vendor_name || e.description || 'Expense'}</div>
                <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.soft, marginTop:4 }}>{[e.category, e.event].filter(Boolean).join(' · ')}</div>
              </div>
              <div style={{ fontFamily:FF.display, fontSize:18, color:t.soft }}>{fmtINR(e.actual_amount)}</div>
            </div>
          ))}
        </>}

        <div style={{ marginTop:SP.xl, fontFamily:FF.display, fontStyle:'italic', fontSize:13, color:t.soft, textAlign:'center' }}>
          ✦  Tell Dream Ai to add or change anything.
        </div>
      </div>

      {confirmId && <>
        <div onClick={() => setConfirmId(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.cardFill, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:8 }}>Remove this expense?</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => handleDelete(confirmId)} style={{ flex:1, padding:14, background:'rgba(184,69,62,0.15)', border:'0.5px solid rgba(184,69,62,0.4)', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Remove</button>
            <button onClick={() => setConfirmId(null)} style={{ flex:1, padding:14, background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Keep</button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}
