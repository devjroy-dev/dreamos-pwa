// Redirect /admin/invite-requests → /admin/invite-requests/dreamers
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function InviteRequestsRoot() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/invite-requests/dreamers'); }, [router]);
  return null;
}
