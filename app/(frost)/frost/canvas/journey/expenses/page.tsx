'use client';
import React, { useState, useEffect, useCallback } from 'react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../../lib/frost/tokens';
import { fetchReceipts, deleteReceipt, fmtINR, type CoupleReceipt } from '../../../../../../lib/frost/journey';

function fmtReceiptDate(d: string | null | undefined): string {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function JourneyExpenses() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [receipts, setReceipts] = useState<CoupleReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => { fetchReceipts().then(r => { setReceipts(r); setLoading(false); }); }, []);

  const handleDelete = useCallback(async (id: string) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
    setConfirmId(null);
    await deleteReceipt(id);
    showToast('Receipt removed.');
  }, []);

  const totalAmount = receipts.reduce((s, r) => s + (r.amount || 0), 0);

  return (
    <CanvasShell eyebrow="Receipts" backTo="/frost/canvas/journey">
      {toast && (
        <div style={{ position:'fixed', top:'calc(env(safe-area-inset-top) + 70px)', left:'50%', transform:'translateX(-50%)', background:t.ink, color:t.pagePaper, fontFamily:FF.label, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', padding:'8px 18px', borderRadius:20, zIndex:400, pointerEvents:'none', whiteSpace:'nowrap' }}>{toast}</div>
      )}
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>
        <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:26, color:t.ink, marginBottom:SP.m }}>Receipt vault.</div>
        <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:SP.xl }}>Forward receipts to Dream Ai on WhatsApp to save them here.</div>

        {receipts.length > 0 && (
          <FrostedSurface style={{ padding:SP.l, marginBottom:SP.xl }}>
            <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Total logged</div>
            <div style={{ fontFamily:FF.display, fontSize:26, color:t.ink }}>{fmtINR(totalAmount)}</div>
          </FrostedSurface>
        )}

        {loading && <div style={{ fontFamily:FF.display, fontSize:32, color:t.brassMuted, letterSpacing:6 }}>…</div>}
        {!loading && receipts.length === 0 && (
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:18, color:t.soft, textAlign:'center', paddingTop:80 }}>No receipts yet.</div>
        )}

        {receipts.map(r => (
          <div key={r.id}
            onContextMenu={e => { e.preventDefault(); setConfirmId(r.id); }}
            onClick={() => setConfirmId(r.id)}
            style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.l}px 0`, borderBottom:`0.5px solid ${t.hairline}`, cursor:'pointer' }}>
            {r.image_url ? (
              <div style={{ width:44, height:44, borderRadius:FR.sm, overflow:'hidden', flexShrink:0, background:t.cardFill }}>
                <img src={r.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            ) : (
              <div style={{ width:44, height:44, borderRadius:FR.sm, background:`rgba(168,146,75,0.08)`, border:`0.5px solid ${t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <div style={{ fontFamily:FF.label, fontSize:9, color:t.brassMuted }}>REC</div>
              </div>
            )}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:FF.body, fontSize:15, color:t.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {r.vendor_name || r.description || 'Receipt'}
              </div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.12em', color:t.soft, marginTop:2 }}>
                {[fmtReceiptDate(r.receipt_date || r.created_at), ...(r.tags || []).slice(0,2)].filter(Boolean).join(' · ')}
              </div>
            </div>
            {r.amount && (
              <div style={{ fontFamily:FF.display, fontSize:17, color:t.ink, flexShrink:0 }}>{fmtINR(r.amount)}</div>
            )}
          </div>
        ))}

        {receipts.length > 0 && (
          <div style={{ marginTop:SP.xl, fontFamily:FF.display, fontStyle:'italic', fontSize:13, color:t.soft, textAlign:'center' }}>
            Long-press or tap a receipt to remove it.
          </div>
        )}
      </div>

      {confirmId && <>
        <div onClick={() => setConfirmId(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:8 }}>Remove this receipt?</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:20 }}>It will be gone from your vault. The original is safe wherever you saved it from.</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => handleDelete(confirmId)} style={{ flex:1, padding:14, background:'rgba(184,69,62,0.15)', border:'0.5px solid rgba(184,69,62,0.4)', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Remove</button>
            <button onClick={() => setConfirmId(null)} style={{ flex:1, padding:14, background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Keep</button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}
