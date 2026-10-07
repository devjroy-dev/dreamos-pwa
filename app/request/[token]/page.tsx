'use client';
// app/request/[token]/page.tsx · CE-47 · PTN-A1 app · the request link a forwarded message carries. It never shows the
// vendor's phone or email (the server never sends them). An organisation signs up as a partner; a person goes to Collab
// Hub's join, which shows "Launching soon" until it is live.
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PartnerShell } from '@/components/partner/PartnerShell';
import { ExtLink } from '@/components/partner/ExtLink';
import { partnerApi } from '@/lib/partner/api';
import { W } from '@/lib/partner/words';

export default function RequestPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [r, setR] = useState<Awaited<ReturnType<typeof partnerApi.request>> | null>(null);
  useEffect(() => { void partnerApi.request(String(token || '')).then(setR); }, [token]);
  return (
    <PartnerShell>
      {r === null ? <div aria-busy="true" style={{ minHeight: 200 }} />
        : !r.ok ? <section className="sol-surface"><p className="sol-empty">{r.error}</p></section>
        : r.ended || !r.request ? <section className="sol-surface"><p className="sol-empty">{r.line || W.reqEnded}</p></section> : (
        <section className="sol-surface" data-request-page="">
          <p className="sol-eyebrow">{W.reqFromTdw}</p>
          <h1 className="sol-heading">{r.request.vendor.name} needs {/^[aeiou]/i.test(r.request.need) ? 'an' : 'a'} {r.request.need}</h1>
          <p className="sol-rowdesc">{r.request.vendor.trade.charAt(0).toUpperCase() + r.request.vendor.trade.slice(1)} · {r.request.city} · {r.request.date_words}</p>
          {r.request.vendor.instagram_url ? <p className="sol-rowdesc"><ExtLink href={r.request.vendor.instagram_url}>@{r.request.vendor.instagram_handle}</ExtLink></p> : null}
          <p className="sol-rowdesc">Budget {r.request.budget_words} · {r.request.pay_words}</p>
          {r.request.note ? <p className="sol-rowdesc">Note: {r.request.note}</p> : null}
          <div style={{ height: 16 }} />
          <p className="sol-empty">{W.reqAnswer}</p>
          <div className="px-choice">
            <button type="button" className="px-opt" onClick={() => router.push('/partner/join')}><span className="sol-rowlabel">{W.reqOrg}</span><span className="sol-rowdesc">{W.reqOrgSub}</span></button>
            <button type="button" className="px-opt" onClick={() => router.push('/partner/join?me=1')}><span className="sol-rowlabel">{W.reqMe}</span><span className="sol-rowdesc">{W.reqMeSub}</span></button>
          </div>
          <p className="sol-note">{r.request.phone_line}</p>
        </section>
      )}
    </PartnerShell>
  );
}
