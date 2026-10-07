'use client';
// app/admin/_components/PartnerLinks.tsx · CE-47 · PTN-A1 app · a row's Instagram and website as links (the founder's rule),
// drawn only from the ready https addresses the server sends.
import { ExtLink } from '@/components/partner/ExtLink';
import { F } from './Kit';
export function PartnerLinks({ handle, instagramUrl, websiteUrl }: { handle?: string | null; instagramUrl?: string | null; websiteUrl?: string | null }) {
  if (!instagramUrl && !websiteUrl) return null;
  return (
    <div style={{ padding: '0 14px 12px', font: F.t4, display: 'flex', gap: 14, flexWrap: 'wrap' }} data-partner-links="">
      {instagramUrl ? <ExtLink href={instagramUrl}>@{handle}</ExtLink> : null}
      {websiteUrl ? <ExtLink href={websiteUrl}>{websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</ExtLink> : null}
    </div>
  );
}
