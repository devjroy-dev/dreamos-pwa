"use client";
// v2/components/vendor/CollabWherePosted.tsx · CE-47 · CLB-1 · "Where it is posted" on one call's page.
// Reads /collab/:post_id/shares. Draws NOTHING when the call has no shares, so a vendor the gate never opened for
// sees no change at all (Rule 1). Rows: the account, its state in plain words, the tags; a live post's row opens it.
// FE-7's shared rows (RoomRows), no colour of its own.
import { useEffect, useState } from 'react';
import { Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { CS, fetchShares, type Share } from '@/v2/lib/vendor/collabShare';

const TONE: Record<string, 'ok' | 'soon' | 'warn'> = { published: 'ok', queued: 'soon', approved: 'soon', rejected: 'warn', failed: 'warn' };

export function CollabWherePosted({ postId }: { postId: string }) {
  const [shares, setShares] = useState<Share[] | null>(null);
  useEffect(() => { if (postId) fetchShares(postId).then(setShares); }, [postId]);
  if (!shares) return null;
  // Loaded and empty: nothing a person can see. The hidden marker lets a bench wait on "loaded" instead of a pause (e-275).
  if (shares.length === 0) return <span data-clb-where-none="" hidden />;
  return (
    <div data-clb-where="">
      <style>{FR_CSS}</style>
      <Head text={CS.whereHead} />
      <Group>
        {shares.map((s) => {
          const live = s.state === 'published' && !!s.permalink;
          const facts = [CS.state[s.state] || s.state, (s.hashtags || []).join(' ')].filter(Boolean).join(' \u00B7 ');
          return (
            <Row key={s.id} title={CS.account(s.account, s.platform)} facts={facts}
                 pill={{ text: CS.pill[s.state] || s.state, tone: TONE[s.state] || 'plain' }}
                 onClick={live ? () => { window.open(s.permalink as string, '_blank', 'noopener'); } : undefined} chevron={live} />
          );
        })}
      </Group>
    </div>
  );
}
