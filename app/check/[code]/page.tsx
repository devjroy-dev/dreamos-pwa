// app/check/[code]/page.tsx · CE-47 · PRO · P1 · THE CHECK PAGE (thedreamwedding.in/check/<code>), public, for a bank,
// a landlord, a visa office or a programme to confirm a paper she gave them. The page's server never calls the check
// door: the visitor's own browser does (CheckView), so the door's 60-an-hour limit is per visitor (F-44.361).
import type { Metadata } from 'next';
import { CheckView } from './view';

export const metadata: Metadata = { title: 'Check a paper · The Dream Wedding', robots: { index: false, follow: false } };
export default async function CheckPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <CheckView code={decodeURIComponent(code)} />;
}
