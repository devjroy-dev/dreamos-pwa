'use client';
// app/admin/_components/ContactRow.tsx · CE-47 · PTN-A1 app · one contact row, shared by Contacts and Forward a request.
// A Stopped row passes NO phone to the Kit, so the Kit draws no WhatsApp and no Call (the chair, 6 Oct 2026); its
// Instagram and website links stay.
import { PersonRow, C } from './Kit';
import { PartnerLinks } from './PartnerLinks';
import { CONTACT_KINDS } from '@/lib/partner/words';

export type Contact = { id: string; name: string; kind: string; how_we_know: string; phone: string | null; knows_tdw: boolean; stopped: boolean;
  instagram_handle: string | null; instagram_url: string | null; website_url: string | null };
const kindWord = (k: string) => (CONTACT_KINDS.find((x) => x.key === k) || { label: k }).label;
export const contactTag = (c: Contact) => (c.stopped ? 'Stopped' : c.knows_tdw ? 'Knows TDW' : c.instagram_url ? 'Instagram only' : 'Not yet sent');

/** One contact row. A Stopped row passes NO phone to the Kit, so the Kit draws no WhatsApp and no Call. */
export function ContactRow({ c, last, onOpen }: { c: Contact; last?: boolean; onOpen?: () => void }) {
  return (
    <PersonRow name={c.name} tag={contactTag(c)} tagTone={c.stopped ? C.bad : C.accent} line={`${kindWord(c.kind)} · ${c.how_we_know}`}
      phone={c.stopped ? undefined : c.phone} onOpen={onOpen} last={last}>
      <div data-contact-row="" data-stopped={c.stopped ? 'true' : 'false'}><PartnerLinks handle={c.instagram_handle} instagramUrl={c.instagram_url} websiteUrl={c.website_url} /></div>
    </PersonRow>
  );
}

