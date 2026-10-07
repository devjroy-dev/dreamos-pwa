"use client";
// app/check/[code]/view.tsx · CE-47 · PRO · P1 · what the paper states, its issue date, and Valid or Withdrawn, exactly
// as the check door answers (frozen at issue). Light and dark by the visitor's own setting. No sign-in.
import { useEffect, useState } from 'react';
import { fetchCheck, errOf, type CheckPaper } from '@/v2/lib/vendor/api/papers';

export function CheckView({ code }: { code: string }) {
  const [s, setS] = useState<{ v: 'wait' } | { v: 'ok'; p: CheckPaper } | { v: 'no'; error: string }>({ v: 'wait' });
  useEffect(() => { let live = true; fetchCheck(code).then((r) => { if (live) setS(r.ok ? { v: 'ok', p: (r as { paper: CheckPaper }).paper } : { v: 'no', error: errOf(r) }); }); return () => { live = false; }; }, [code]);
  return (<main className="ck">
    <div className="box" data-check={s.v === 'ok' ? s.p.state : s.v}>
      <div className="brand">The Dream Wedding · Check</div>
      {s.v === 'wait' ? <p className="m">Checking {code}…</p> : null}
      {s.v === 'no' ? (<><h1 className="t">Not found</h1><p className="m">{s.error}</p><p className="m">Code checked: {code}</p></>) : null}
      {s.v === 'ok' ? (<>
        <div className={s.p.state === 'valid' ? 'ok' : 'wd'}>{s.p.state === 'valid' ? 'Valid' : 'Withdrawn'}</div>
        <h1 className="t">{s.p.title}</h1>
        <div className="m">Check code {s.p.check_code}</div>
        {s.p.purpose ? <div className="m">{s.p.purpose}</div> : null}
        {s.p.state === 'valid' && s.p.photo_url && /^https:\/\//.test(s.p.photo_url) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ph" src={s.p.photo_url} alt={`Photo of ${s.p.name}`} data-check-photo="" />) : null}
        {s.p.state === 'withdrawn' ? (<><div className="r"><span>Name</span><span>{s.p.name}</span></div><div className="r"><span>Issued</span><span>{s.p.issued_on}</span></div><div className="r"><span>Withdrawn</span><span>{s.p.withdrawn_on}</span></div></>)
          : s.p.lines.map(([k, v]) => (<div className="r" key={k}><span>{k}</span><span>{v}</span></div>))}
        <p className="note">{s.p.note}</p>
      </>) : null}
    </div>
    <style>{`
.ck{min-height:100dvh;display:flex;justify-content:center;padding:32px 16px;box-sizing:border-box;background:#f6f5f2;color:#1d1d1f;font-family:system-ui,-apple-system,'Segoe UI',sans-serif}
.box{width:100%;max-width:440px;background:#fff;border:1px solid #e3e1dc;border-radius:14px;padding:24px;display:flex;flex-direction:column;gap:10px;align-self:flex-start;box-sizing:border-box}
.brand{font-weight:600;font-size:13px;letter-spacing:.12em;text-transform:uppercase}
.ok,.wd{align-self:flex-start;font-weight:600;font-size:14px;border-radius:999px;padding:4px 12px}
.ok{color:#1f7a4d;border:1px solid #1f7a4d}.wd{color:#8a2d2d;border:1px solid #8a2d2d}
.t{font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:24px;margin:4px 0 0}
.m{font-size:14px;color:#6b6b6b;margin:0;overflow-wrap:anywhere}
.r{display:flex;justify-content:space-between;gap:12px;border-top:1px solid #ecebe7;padding:10px 0;font-size:15px}
.r span:first-child{opacity:.7}.r span:last-child{text-align:right;overflow-wrap:anywhere}
.ph{width:120px;height:160px;object-fit:cover;border-radius:10px;margin:6px 0}
.note{font-size:13px;line-height:1.5;opacity:.8;margin:6px 0 0}
@media (prefers-color-scheme:dark){.ck{background:#17181a;color:#ececec}.box{background:#202124;border-color:#34363a}.m{color:#a3a3a3}.r{border-color:#34363a}.ok{color:#6fcf97;border-color:#6fcf97}.wd{color:#e08b8b;border-color:#e08b8b}}
`}</style>
  </main>);
}
