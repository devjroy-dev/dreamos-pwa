'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR, EASE } from '../../../../../../lib/frost/tokens';
import {
  fetchBookings, createBooking, updateBooking, deleteBooking, recordPayment, fmtINR,
  type CoupleBooking,
} from '../../../../../../lib/frost/journey';

// Pipeline display order. DB CHECK only allows booked|advance_paid|paid.
// considering/shortlisted/in_discussion are app-layer labels stored in notes
// or managed via the WhatsApp agent — not in the DB state column.
const PIPELINE: { key: string; label: string }[] = [
  { key: 'paid',          label: 'PAID' },
  { key: 'advance_paid',  label: 'ADVANCE PAID' },
  { key: 'booked',        label: 'BOOKED' },
];

const CATEGORIES = [
  'photographer','videographer','mua','designer',
  'venue','caterer','decor','florist','music','planner','other',
] as const;
type BookingCategory = typeof CATEGORIES[number];

const inp = (t: any): React.CSSProperties => ({
  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
  border: `0.5px solid ${t.hairline}`, borderRadius: FR.md, fontFamily: FF.body,
  fontSize: 15, color: t.ink, outline: 'none', boxSizing: 'border-box' as const,
});

export default function JourneyVendors() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [bookings, setBookings] = useState<CoupleBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [actionBooking, setActionBooking] = useState<CoupleBooking | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [toast, setToast] = useState('');

  // Add form
  const [newName, setNewName]     = useState('');
  const [newCat, setNewCat]       = useState<BookingCategory>('photographer');
  const [newTotal, setNewTotal]   = useState('');
  const [newAdv, setNewAdv]       = useState('');
  const [newDue, setNewDue]       = useState('');
  const [newNotes, setNewNotes]   = useState('');
  const [saving, setSaving]       = useState(false);

  // Payment form
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate]     = useState('');
  const [paying, setPaying]       = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    fetchBookings().then(b => { setBookings(b); setLoading(false); });
  }, []);

  const handleAdd = useCallback(async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const body: any = { vendor_name: newName.trim(), category: newCat };
      if (newTotal) body.amount_total = parseInt(newTotal.replace(/,/g,''), 10);
      if (newAdv)   body.amount_advance = parseInt(newAdv.replace(/,/g,''), 10);
      if (newDue)   body.balance_due_date = newDue;
      if (newNotes.trim()) body.notes = newNotes.trim();
      const b = await createBooking(body);
      setBookings(prev => [b, ...prev]);
      setShowAdd(false); setNewName(''); setNewCat('photographer'); setNewTotal(''); setNewAdv(''); setNewDue(''); setNewNotes('');
      showToast('Booking added.');
    } catch { showToast('Could not add. Try again.'); }
    setSaving(false);
  }, [newName, newCat, newTotal, newAdv, newDue, newNotes]);

  const handlePayment = useCallback(async () => {
    if (!actionBooking || !payAmount) return;
    const amt = parseInt(payAmount.replace(/,/g,''), 10);
    if (isNaN(amt) || amt <= 0) { showToast('Enter a valid amount.'); return; }
    setPaying(true);
    try {
      const updated = await recordPayment(actionBooking.id, amt, payDate || undefined);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      setShowPayment(false); setActionBooking(null); setPayAmount(''); setPayDate('');
      showToast('Payment recorded.');
    } catch { showToast('Could not record payment.'); }
    setPaying(false);
  }, [actionBooking, payAmount, payDate]);

  const handleDelete = useCallback(async (b: CoupleBooking) => {
    setActionBooking(null);
    setBookings(prev => prev.filter(x => x.id !== b.id));
    await deleteBooking(b.id);
    showToast('Removed.');
  }, []);

  // Group by pipeline state
  const groups = PIPELINE.map(p => ({
    label: p.label,
    items: bookings.filter(b => b.state === p.key),
  })).filter(g => g.items.length > 0);

  const totalCommitted = bookings.reduce((s, b) => s + (b.amount_total || 0), 0);
  const totalPaid      = bookings.reduce((s, b) => s + (b.amount_paid || 0), 0);

  return (
    <CanvasShell eyebrow="Vendors" backTo="/frost/canvas/journey">
      {toast && (
        <div style={{ position:'fixed', top:'calc(env(safe-area-inset-top) + 70px)', left:'50%', transform:'translateX(-50%)', background:t.ink, color:t.pagePaper, fontFamily:FF.label, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', padding:'8px 18px', borderRadius:20, zIndex:400, pointerEvents:'none', whiteSpace:'nowrap' }}>{toast}</div>
      )}
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:SP.xl }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:26, color:t.ink }}>My team.</div>
          <button onClick={() => setShowAdd(true)} style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:FR.pill, border:`0.5px solid rgba(191,160,77,0.3)`, background:'transparent', fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.brassMuted, cursor:'pointer' }}>
            <Plus size={12} color={t.brassMuted} strokeWidth={1.5} />Add
          </button>
        </div>

        {/* Totals summary */}
        {bookings.length > 0 && (
          <FrostedSurface style={{ padding:SP.l, marginBottom:SP.xl }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Committed</div>
                <div style={{ fontFamily:FF.display, fontSize:22, color:t.ink }}>{fmtINR(totalCommitted)}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Paid</div>
                <div style={{ fontFamily:FF.display, fontSize:22, color:t.brass }}>{fmtINR(totalPaid)}</div>
              </div>
            </div>
          </FrostedSurface>
        )}

        {loading && <div style={{ fontFamily:FF.display, fontSize:32, color:t.brassMuted, letterSpacing:6 }}>…</div>}
        {!loading && bookings.length === 0 && (
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:18, color:t.soft, textAlign:'center', paddingTop:80 }}>No one yet. Add your first booking.</div>
        )}

        {groups.map(g => (
          <div key={g.label} style={{ marginBottom:SP.xl }}>
            <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>{g.label}</div>
            {g.items.map(b => {
              const initial = (b.category?.[0] || b.vendor_name?.[0] || '·').toUpperCase();
              const balance = (b.amount_total || 0) - (b.amount_paid || 0);
              const metaParts: string[] = [b.category];
              if (b.amount_total) metaParts.push(fmtINR(b.amount_total));
              if (b.balance_due_date) metaParts.push(`Due ${new Date(b.balance_due_date).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}`);
              return (
                <div key={b.id} onClick={() => setActionBooking(b)}
                  style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.l}px 0`, borderBottom:`0.5px solid ${t.hairline}`, cursor:'pointer' }}>
                  <div style={{ width:36, height:36, borderRadius:18, border:`0.5px solid ${t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:FF.label, fontSize:11, color:t.soft }}>
                    {initial}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:FF.body, fontSize:15, color:t.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.vendor_name}</div>
                    <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.1em', color:t.soft, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{metaParts.join(' · ')}</div>
                  </div>
                  {b.amount_total && b.amount_paid < b.amount_total && (
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.1em', color:t.brassMuted }}>Bal</div>
                      <div style={{ fontFamily:FF.display, fontSize:15, color:t.ink }}>{fmtINR(balance)}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop:SP.xl, fontFamily:FF.display, fontStyle:'italic', fontSize:13, color:t.soft, textAlign:'center' }}>✦  Tell Dream Ai when something moves.</div>
      </div>

      {/* Add booking sheet */}
      {showAdd && <>
        <div onClick={() => setShowAdd(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))`, maxHeight:'90vh', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>Add a booking</div>
            <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Vendor name</div>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder='Aanya Studio' style={inp(t)} />
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Category</div>
              <select value={newCat} onChange={e => setNewCat(e.target.value as BookingCategory)} style={{ ...inp(t), appearance:'none' as any }}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: t.pagePaper }}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Total amount (Rs, optional)</div>
              <input value={newTotal} onChange={e => setNewTotal(e.target.value)} placeholder='450000' inputMode='numeric' style={inp(t)} />
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Advance agreed (Rs, optional)</div>
              <input value={newAdv} onChange={e => setNewAdv(e.target.value)} placeholder='50000' inputMode='numeric' style={inp(t)} />
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Balance due date (optional)</div>
              <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} style={inp(t)} />
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Notes (optional)</div>
              <input value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder='What is included, terms…' style={inp(t)} />
            </div>
            <button onClick={handleAdd} disabled={saving || !newName.trim()} style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity: (saving || !newName.trim()) ? 0.5 : 1, transition:`opacity 200ms ${EASE}` }}>
              {saving ? 'Adding…' : 'Add booking'}
            </button>
          </div>
        </div>
      </>}

      {/* Action sheet — booking selected */}
      {actionBooking && !showPayment && <>
        <div onClick={() => setActionBooking(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:2 }}>{actionBooking.vendor_name}</div>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', color:t.soft, textTransform:'uppercase', marginBottom:SP.m }}>{actionBooking.category} · {actionBooking.state.replace(/_/g,' ')}</div>
          {actionBooking.amount_total && (
            <div style={{ display:'flex', gap:SP.xl, marginBottom:SP.xl }}>
              <div><div style={{ fontFamily:FF.label, fontSize:9, color:t.soft, letterSpacing:'0.15em' }}>TOTAL</div><div style={{ fontFamily:FF.display, fontSize:18, color:t.ink }}>{fmtINR(actionBooking.amount_total)}</div></div>
              <div><div style={{ fontFamily:FF.label, fontSize:9, color:t.soft, letterSpacing:'0.15em' }}>PAID</div><div style={{ fontFamily:FF.display, fontSize:18, color:t.brass }}>{fmtINR(actionBooking.amount_paid)}</div></div>
              {actionBooking.amount_paid < (actionBooking.amount_total || 0) && (
                <div><div style={{ fontFamily:FF.label, fontSize:9, color:t.soft, letterSpacing:'0.15em' }}>BALANCE</div><div style={{ fontFamily:FF.display, fontSize:18, color:t.ink }}>{fmtINR((actionBooking.amount_total||0) - actionBooking.amount_paid)}</div></div>
              )}
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={() => setShowPayment(true)} style={{ padding:14, background:`rgba(191,160,77,0.12)`, border:`0.5px solid rgba(191,160,77,0.3)`, borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:t.brass, cursor:'pointer' }}>Record a payment</button>
            <button onClick={() => handleDelete(actionBooking)} style={{ padding:14, background:'rgba(184,69,62,0.12)', border:'0.5px solid rgba(184,69,62,0.3)', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Remove booking</button>
            <button onClick={() => setActionBooking(null)} style={{ padding:14, background:'rgba(255,255,255,0.04)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Close</button>
          </div>
        </div>
      </>}

      {/* Record payment sheet */}
      {actionBooking && showPayment && <>
        <div onClick={() => { setShowPayment(false); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:202 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:203, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink }}>Record payment</div>
            <button onClick={() => setShowPayment(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:SP.xl }}>{actionBooking.vendor_name} · paid so far: {fmtINR(actionBooking.amount_paid)}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Amount paid (Rs)</div>
              <input value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder='50000' inputMode='numeric' style={inp(t)} />
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Payment date (optional)</div>
              <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} style={inp(t)} />
            </div>
            <button onClick={handlePayment} disabled={paying || !payAmount} style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity: (paying || !payAmount) ? 0.5 : 1, transition:`opacity 200ms ${EASE}` }}>
              {paying ? 'Recording…' : 'Record payment'}
            </button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}
