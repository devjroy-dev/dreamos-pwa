
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR, EASE } from '../../../../../../lib/frost/tokens';
import {
  fetchReceipts, deleteReceipt,
  fetchBookings, recordPayment,
  fmtINR,
  type CoupleReceipt, type CoupleBooking,
} from '../../../../../../lib/frost/journey';

type Slice = 'my' | 'vendor' | 'receipts';

function fmtDate(d: string | null | undefined): string {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const inp = (t: any): React.CSSProperties => ({
  width: '100%', padding: '11px 13px', background: 'rgba(255,255,255,0.06)',
  border: `0.5px solid ${t.hairline}`, borderRadius: FR.md,
  fontFamily: FF.body, fontSize: 15, color: t.ink, outline: 'none',
  boxSizing: 'border-box' as const, userSelect: 'text' as const,
});

export default function JourneyExpenses() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];

  const [slice, setSlice]           = useState<Slice>('my');
  const [receipts, setReceipts]     = useState<CoupleReceipt[]>([]);
  const [bookings, setBookings]     = useState<CoupleBooking[]>([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState('');
  const [fullImg, setFullImg]       = useState<string | null>(null);

  // Add expense
  const [showAdd, setShowAdd]     = useState(false);
  const [newVendor, setNewVendor] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate]     = useState('');
  const [newDesc, setNewDesc]     = useState('');
  const [saving, setSaving]       = useState(false);

  // Confirm delete
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Vendor payment
  const [payBooking, setPayBooking] = useState<CoupleBooking | null>(null);
  const [payAmount, setPayAmount]   = useState('');
  const [payDate, setPayDate]       = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    Promise.all([fetchReceipts(), fetchBookings()]).then(([r, b]) => {
      setReceipts(r); setBookings(b); setLoading(false);
    });
  }, []);

  const totalCommitted  = bookings.reduce((s, b) => s + (b.amount_total || 0), 0);
  const totalPaid       = bookings.reduce((s, b) => s + (b.amount_paid  || 0), 0);
  const totalBalance    = totalCommitted - totalPaid;
  const totalMySpend    = receipts.filter(r => !r.image_url).reduce((s, r) => s + (r.amount || 0), 0);

  // My Expenses = manual adds (no image). Receipts = WhatsApp image receipts.
  const myExpenses    = receipts.filter(r => !r.image_url);
  const imageReceipts = receipts.filter(r => !!r.image_url);

  const handleAddExpense = useCallback(async () => {
    if (!newVendor.trim() || !newAmount) return;
    setSaving(true);
    try {
      const token    = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const raw      = typeof window !== 'undefined' ? (localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session')) : null;
      const coupleId = raw ? JSON.parse(raw)?.id : null;
      if (token && coupleId) {
        const res  = await fetch(
          `${'https://dream-os-production.up.railway.app'}/api/v2/couple/expenses/${coupleId}`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vendor_name:  newVendor.trim(),
              amount:       parseInt(newAmount.replace(/,/g, ''), 10),
              receipt_date: newDate || new Date().toISOString().slice(0, 10),
              description:  newDesc.trim() || null,
            }),
          }
        );
        const data = await res.json();
        if (data.ok && data.expense) setReceipts(prev => [data.expense, ...prev]);
      }
      setShowAdd(false); setNewVendor(''); setNewAmount(''); setNewDate(''); setNewDesc('');
      showToast('Expense added.');
    } catch { showToast('Could not add. Try again.'); }
    setSaving(false);
  }, [newVendor, newAmount, newDate, newDesc]);

  const handleDeleteReceipt = useCallback(async (id: string) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
    setConfirmId(null);
    await deleteReceipt(id);
    showToast('Removed.');
  }, []);

  const handlePayment = useCallback(async () => {
    if (!payBooking || !payAmount) return;
    const amt = parseInt(payAmount.replace(/,/g, ''), 10);
    if (isNaN(amt) || amt <= 0) { showToast('Enter a valid amount.'); return; }
    setSaving(true);
    try {
      const updated = await recordPayment(payBooking.id, amt, payDate || undefined);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      setPayBooking(null); setPayAmount(''); setPayDate('');
      showToast('Payment recorded.');
    } catch { showToast('Could not record.'); }
    setSaving(false);
  }, [payBooking, payAmount, payDate]);

  const SliceBtn = ({ id, label }: { id: Slice; label: string }) => (
    <button onClick={() => setSlice(id)}
      style={{ flex: 1, padding: '9px 0', borderRadius: FR.md, border: `0.5px solid ${slice === id ? t.brass : t.hairline}`, background: slice === id ? `rgba(191,160,77,0.12)` : 'transparent', fontFamily: FF.label, fontSize: 9, letterSpacing: '0.13em', textTransform: 'uppercase', color: slice === id ? t.brass : t.soft, cursor: 'pointer', transition: `all 150ms ${EASE}` }}>
      {label}
    </button>
  );

  return (
    <CanvasShell eyebrow="Expenses" backTo="/frost/canvas/journey">
      {toast && (
        <div style={{ position:'fixed', top:'calc(env(safe-area-inset-top) + 70px)', left:'50%', transform:'translateX(-50%)', background:t.ink, color:t.pagePaper, fontFamily:FF.label, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', padding:'8px 18px', borderRadius:20, zIndex:400, pointerEvents:'none', whiteSpace:'nowrap' }}>{toast}</div>
      )}

      {/* Full-screen receipt image viewer */}
      {fullImg && (
        <>
          <div onClick={() => setFullImg(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.92)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src={fullImg} alt="Receipt" style={{ maxWidth:'94vw', maxHeight:'88vh', objectFit:'contain', borderRadius:FR.md }} />
            <button onClick={() => setFullImg(null)} style={{ position:'absolute', top:24, right:24, background:'rgba(255,255,255,0.12)', border:'none', borderRadius:20, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <X size={18} color="rgba(245,240,232,0.8)" strokeWidth={1.5} />
            </button>
          </div>
        </>
      )}

      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px`, userSelect:'none' }}>

        {/* Snapshot */}
        <FrostedSurface style={{ padding:SP.l, marginBottom:SP.xl }}>
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:SP.m }}>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Committed</div>
              <div style={{ fontFamily:FF.display, fontSize:20, color:t.ink }}>{fmtINR(totalCommitted)}</div>
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Paid</div>
              <div style={{ fontFamily:FF.display, fontSize:20, color:t.brass }}>{fmtINR(totalPaid)}</div>
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Balance</div>
              <div style={{ fontFamily:FF.display, fontSize:20, color:t.ink }}>{fmtINR(totalBalance)}</div>
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>My Spend</div>
              <div style={{ fontFamily:FF.display, fontSize:20, color:t.soft }}>{fmtINR(totalMySpend)}</div>
            </div>
          </div>
        </FrostedSurface>

        {/* Slice tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:SP.xl }}>
          <SliceBtn id="my"       label="My expenses" />
          <SliceBtn id="vendor"   label="Vendors" />
          <SliceBtn id="receipts" label="Receipts" />
        </div>

        {loading && <div style={{ fontFamily:FF.display, fontSize:32, color:t.brassMuted, letterSpacing:6 }}>…</div>}

        {/* ── MY EXPENSES ──────────────────────────────────────────────────── */}
        {!loading && slice === 'my' && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
              <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink }}>What I've spent.</div>
              <button onClick={() => setShowAdd(true)}
                style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:FR.pill, border:`0.5px solid rgba(191,160,77,0.3)`, background:'transparent', fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.brassMuted, cursor:'pointer' }}>
                <Plus size={11} color={t.brassMuted} strokeWidth={1.5} />Add
              </button>
            </div>
            {myExpenses.length === 0 && (
              <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:16, color:t.soft, textAlign:'center', paddingTop:60 }}>
                No expenses yet. Tap Add to log one.
              </div>
            )}
            {myExpenses.map(r => (
              <div key={r.id} onClick={() => setConfirmId(r.id)}
                style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.l}px 0`, borderBottom:`0.5px solid ${t.hairline}`, cursor:'pointer' }}>
                <div style={{ width:44, height:44, borderRadius:FR.sm, background:`rgba(168,146,75,0.08)`, border:`0.5px solid ${t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontFamily:FF.label, fontSize:8, color:t.brassMuted }}>EXP</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:FF.body, fontSize:14, color:t.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.vendor_name || r.description || 'Expense'}</div>
                  <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.1em', color:t.soft, marginTop:2 }}>{fmtDate(r.receipt_date || r.created_at)}</div>
                </div>
                {r.amount ? <div style={{ fontFamily:FF.display, fontSize:16, color:t.ink, flexShrink:0 }}>{fmtINR(r.amount)}</div> : null}
              </div>
            ))}
          </>
        )}

        {/* ── VENDOR EXPENSES ───────────────────────────────────────────────── */}
        {!loading && slice === 'vendor' && (
          <>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:SP.l }}>My team.</div>
            {bookings.length === 0 && (
              <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:16, color:t.soft, textAlign:'center', paddingTop:60 }}>
                No bookings yet. Add vendors in the Vendors canvas.
              </div>
            )}
            {bookings.map(b => {
              const balance = (b.amount_total || 0) - (b.amount_paid || 0);
              return (
                <div key={b.id} style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.l}px 0`, borderBottom:`0.5px solid ${t.hairline}` }}>
                  <div style={{ width:36, height:36, borderRadius:18, border:`0.5px solid ${t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:FF.label, fontSize:11, color:t.soft }}>
                    {(b.category?.[0] || b.vendor_name?.[0] || '·').toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:FF.body, fontSize:14, color:t.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.vendor_name}</div>
                    <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.1em', color:t.soft, marginTop:2 }}>
                      {b.category}
                      {b.amount_paid > 0 && <span style={{ color:t.brassMuted }}> · paid {fmtINR(b.amount_paid)}</span>}
                      {balance > 0 && <span> · bal {fmtINR(balance)}</span>}
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
                    {b.amount_total && <div style={{ fontFamily:FF.display, fontSize:15, color:t.ink }}>{fmtINR(b.amount_total)}</div>}
                    <button onClick={() => { setPayBooking(b); setPayAmount(''); setPayDate(''); }}
                      style={{ padding:'4px 10px', borderRadius:FR.pill, border:`0.5px solid rgba(191,160,77,0.3)`, background:'transparent', fontFamily:FF.label, fontSize:8, letterSpacing:'0.12em', textTransform:'uppercase', color:t.brassMuted, cursor:'pointer' }}>
                      Pay
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ── RECEIPT TRACKER ───────────────────────────────────────────────── */}
        {!loading && slice === 'receipts' && (
          <>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:SP.s }}>Receipt vault.</div>
            <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:SP.xl }}>
              Tap the thumbnail to open full size. Forward receipts to Dream Ai on WhatsApp to save them here.
            </div>
            {imageReceipts.length === 0 && (
              <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:16, color:t.soft, textAlign:'center', paddingTop:60 }}>No receipts yet. Forward a receipt image to Dream Ai on WhatsApp.</div>
            )}
            {imageReceipts.map(r => (
              <div key={r.id}
                style={{ display:'flex', alignItems:'flex-start', gap:SP.m, padding:`${SP.l}px 0`, borderBottom:`0.5px solid ${t.hairline}` }}>
                {/* Thumbnail — tappable to full screen */}
                <div onClick={() => r.image_url && setFullImg(r.image_url)}
                  style={{ width:56, height:72, borderRadius:FR.sm, overflow:'hidden', flexShrink:0, background:`rgba(168,146,75,0.08)`, border:`0.5px solid ${t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:r.image_url ? 'zoom-in' : 'default' }}>
                  {r.image_url ? (
                    <img src={r.image_url} alt="Receipt" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <span style={{ fontFamily:FF.label, fontSize:8, color:t.brassMuted }}>REC</span>
                  )}
                </div>
                {/* Details */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:FF.body, fontSize:14, color:t.ink }}>{r.vendor_name || r.description || 'Receipt'}</div>
                  {r.description && r.vendor_name && (
                    <div style={{ fontFamily:FF.body, fontSize:12, color:t.soft, marginTop:2, lineHeight:1.4 }}>{r.description}</div>
                  )}
                  <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.1em', color:t.soft, marginTop:4 }}>{fmtDate(r.receipt_date || r.created_at)}</div>
                  {(r.tags || []).length > 0 && (
                    <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6 }}>
                      {(r.tags || []).slice(0, 3).map((tag: string) => (
                        <span key={tag} style={{ fontFamily:FF.label, fontSize:8, letterSpacing:'0.1em', color:t.brassMuted, padding:'2px 6px', border:`0.5px solid rgba(191,160,77,0.25)`, borderRadius:FR.pill }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Amount + delete */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, flexShrink:0 }}>
                  {r.amount ? <div style={{ fontFamily:FF.display, fontSize:16, color:t.ink }}>{fmtINR(r.amount)}</div> : null}
                  <button onClick={() => setConfirmId(r.id)}
                    style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
                    <X size={14} color={t.soft} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add Expense sheet */}
      {showAdd && <>
        <div onClick={() => setShowAdd(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))`, maxHeight:'85vh', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>Add an expense</div>
            <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Where / who</div>
              <input value={newVendor} onChange={e => setNewVendor(e.target.value)} placeholder='Sabya showroom, Carma…' style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Amount (Rs)</div>
              <input value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder='15000' inputMode='numeric' style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Date (optional)</div>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Notes (optional)</div>
              <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder='Trial deposit, transport…' style={inp(t)} /></div>
            <button onClick={handleAddExpense} disabled={saving || !newVendor.trim() || !newAmount}
              style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(saving || !newVendor.trim() || !newAmount) ? 0.5 : 1 }}>
              {saving ? 'Adding…' : 'Add expense'}
            </button>
          </div>
        </div>
      </>}

      {/* Confirm delete */}
      {confirmId && <>
        <div onClick={() => setConfirmId(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:8 }}>Remove this?</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:SP.xl }}>It will be removed from your list. The original is safe wherever it came from.</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => handleDeleteReceipt(confirmId)} style={{ flex:1, padding:14, background:'rgba(184,69,62,0.15)', border:'0.5px solid rgba(184,69,62,0.4)', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Remove</button>
            <button onClick={() => setConfirmId(null)} style={{ flex:1, padding:14, background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Keep</button>
          </div>
        </div>
      </>}

      {/* Vendor payment sheet */}
      {payBooking && <>
        <div onClick={() => setPayBooking(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.m }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink }}>Record payment</div>
            <button onClick={() => setPayBooking(null)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:SP.xl }}>
            {payBooking.vendor_name} · paid so far: {fmtINR(payBooking.amount_paid)}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Amount (Rs)</div>
              <input value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder='50000' inputMode='numeric' style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Date (optional)</div>
              <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} style={inp(t)} /></div>
            <button onClick={handlePayment} disabled={saving || !payAmount}
              style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(saving || !payAmount) ? 0.5 : 1 }}>
              {saving ? 'Recording…' : 'Record payment'}
            </button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}
