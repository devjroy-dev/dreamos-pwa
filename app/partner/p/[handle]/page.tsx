'use client';
// app/partner/p/[handle]/page.tsx · CE-47 · PTN-A1 app · the partner's public page. A blocked partner's page does not exist.
// Every handle and website is a link. No phone, no email. "Worked with" credits arrive with Collab Hub's credits (CLB).
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PartnerShell } from '@/components/partner/PartnerShell';
import { ExtLink } from '@/components/partner/ExtLink';
import { Mark } from '@/components/partner/Mark';
import { partnerApi } from '@/lib/partner/api';
import { W, FEE_LINE } from '@/lib/partner/words';

type P = { name: string; kind_words: string; cities: string[]; instagram_handle: string; instagram_url: string | null; website_url: string | null; check_words: string | null; fee_line: string };
export default function PartnerPublic() {
  const { handle } = useParams<{ handle: string }>();
  const [p, setP] = useState<P | null | 'none'>(null);
  useEffect(() => { void partnerApi.publicPage(String(handle || '')).then((r) => setP(r.ok && r.partner && r.partner.name ? r.partner : 'none')); }, [handle]);
  return (
    <PartnerShell>
      {p === null ? <div aria-busy="true" style={{ minHeight: 200 }} /> : p === 'none' ? <section className="sol-surface"><p className="sol-empty">{W.notFound}</p></section> : (
        <section className="sol-surface" data-partner-public="">
          <p className="sol-eyebrow">Partner on The Dream Wedding</p>
          <h1 className="sol-heading">{p.name}</h1>
          <Mark words={p.check_words} />
          <p className="sol-rowdesc">{p.kind_words}{(p.cities || []).length ? ` · ${(p.cities || []).join(', ')}` : ''}</p>
          <p className="sol-rowdesc">Instagram: <ExtLink href={p.instagram_url}>@{p.instagram_handle}</ExtLink></p>
          {p.website_url ? <p className="sol-rowdesc">Website: <ExtLink href={p.website_url}>{p.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</ExtLink></p> : null}
          <p className="sol-empty" style={{ marginTop: 12 }}>{W.publicLede(p.name)}</p>
          <p className="sol-note">{p.fee_line || FEE_LINE}</p>
        </section>
      )}
    </PartnerShell>
  );
}
