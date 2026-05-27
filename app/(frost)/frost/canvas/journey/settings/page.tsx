'use client';
// Redirects to Sanctuary — this page is now a bloom room inside Sanctuary.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Redirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/frost/canvas/sanctuary'); }, [router]);
  return null;
}
