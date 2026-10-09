'use client';
// components/frost/ReportPictureSheet.tsx · CE-47 · FE-9 · R-47.2 (the founder, 8 Oct 2026): A DREAMER'S REPORT.
// Opened from Discover's "⋯" on the picture she is looking at. One of the founder's four reasons, an optional note
// (up to 300 characters), Send. The report goes to TDW's admin and never hides the picture: nothing on this sheet says
// or implies that it will. Every refusal (400, 401, 404) is the server's own sentence, shown as it comes.
import React, { useState } from 'react';
import { reportPicture, type ReportReason } from '@/lib/frost-api/discover';
import { FT } from '@/lib/frost/tokens';   // the bride tree's rungs (tdw09_frost_parity 6.12): room for the title, body for the rest

// The four reasons: the founder's words, word for word (8 October 2026, 21:33; cut 30 section 8). One home.
export const REPORT_REASONS: ReadonlyArray<{ key: ReportReason; line: string }> = [
  { key: 'not_wedding_work', line: 'This is not wedding work.' },
  { key: 'not_their_work', line: 'This is someone else’s work.' },
  { key: 'offensive', line: 'This picture is offensive.' },
  { key: 'other', line: 'Something else.' },
];
// The sheet's own words (CE-47, for the founder's yes; R-47.1: plain, complete where they are sentences).
export const REPORT_COPY = {
  menu: 'Report this picture',
  head: 'Report this picture',
  ask: 'Why are you reporting it?',
  note: 'A note for TDW (optional)',
  send: 'Send report',
  sent: 'Your report was sent. TDW will look at it.',
  already: 'You have already reported this picture.',
  close: 'Close',
  failed: 'Your report could not be sent. Please try again.',
} as const;
const NOTE_MAX = 300;

export default function ReportPictureSheet({ vendorId, imageUrl, onClose }: { vendorId: string; imageUrl: string; onClose: () => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState('');
  async function send() {
    if (!reason || busy) return;
    setBusy(true); setErr('');
    try {
      const n = note.trim();
      const r = await reportPicture({ vendor_id: vendorId, image_url: imageUrl, reason, ...(n ? { note: n } : {}) });
      setDone(r.already ? REPORT_COPY.already : REPORT_COPY.sent);
    } catch (e) {
      const m = e && typeof (e as { message?: unknown }).message === 'string' ? (e as { message: string }).message : '';
      setErr(m || REPORT_COPY.failed);
    }
    setBusy(false);
  }
  const ink = 'rgba(248,247,245,.92)', mute = 'rgba(248,247,245,.55)', line = 'rgba(248,247,245,.16)';
  return (
    <div data-report-sheet="" role="dialog" aria-modal="true" aria-label={REPORT_COPY.head}
      onClick={(e) => { e.stopPropagation(); onClose(); }} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(14,12,14,.97)', borderTop: `0.5px solid ${line}`,
        borderRadius: '16px 16px 0 0', padding: '20px 20px calc(20px + env(safe-area-inset-bottom,0px))', display: 'flex', flexDirection: 'column', gap: 12, color: ink }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 500, fontSize: FT.room, lineHeight: 1.3 }}>{REPORT_COPY.head}</h2>
        {done ? (
          <>
            <p data-report-done="" role="status" style={{ margin: 0, fontSize: FT.body, lineHeight: 1.5 }}>{done}</p>
            <button type="button" onClick={onClose} style={{ minHeight: 48, borderRadius: 12, border: `0.5px solid ${line}`, background: 'transparent', color: ink, fontSize: FT.body, cursor: 'pointer' }}>{REPORT_COPY.close}</button>
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: FT.body, lineHeight: 1.5, color: mute }}>{REPORT_COPY.ask}</p>
            <div role="radiogroup" aria-label={REPORT_COPY.ask} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REPORT_REASONS.map((r) => (
                <button key={r.key} type="button" role="radio" aria-checked={reason === r.key} data-reason={r.key} onClick={() => setReason(r.key)}
                  style={{ minHeight: 48, textAlign: 'left', padding: '12px 16px', borderRadius: 12, cursor: 'pointer', fontSize: FT.body, lineHeight: 1.4,
                    background: reason === r.key ? 'rgba(248,247,245,.12)' : 'transparent', color: ink,
                    border: `1px solid ${reason === r.key ? 'rgba(248,247,245,.6)' : line}` }}>{r.line}</button>
              ))}
            </div>
            <textarea value={note} maxLength={NOTE_MAX} rows={2} placeholder={REPORT_COPY.note} aria-label={REPORT_COPY.note}
              onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
              style={{ width: '100%', boxSizing: 'border-box', borderRadius: 12, border: `0.5px solid ${line}`, background: 'transparent', color: ink, padding: 12, fontSize: FT.body, fontFamily: 'inherit', resize: 'none' }} />
            {err ? <p role="alert" data-report-err="" style={{ margin: 0, fontSize: FT.body, lineHeight: 1.5, color: 'rgba(255,170,160,.95)' }}>{err}</p> : null}
            <button type="button" disabled={!reason || busy} onClick={() => void send()}
              style={{ minHeight: 48, borderRadius: 12, border: 'none', background: reason ? 'rgba(248,247,245,.92)' : 'rgba(248,247,245,.2)', color: '#0e0c0e',
                fontSize: FT.body, fontWeight: 500, cursor: reason ? 'pointer' : 'default' }}>{REPORT_COPY.send}</button>
          </>
        )}
      </div>
    </div>
  );
}
