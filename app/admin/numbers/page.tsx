'use client';
// ADM-1 · ALL NUMBERS — the old Bridge, unchanged, one tap from More > Settings and from Home's
// "See all numbers". Home (/admin) shows the few numbers Dev reads every day.
import { PageHeader } from '../_components/AdminUI';
import Bridge from '../_components/Bridge';
import { fullDate } from '../_components/Kit';

export default function AllNumbersPage() {
  return (
    <div>
      <PageHeader title="All numbers" sub={fullDate(new Date().toISOString())} />
      <Bridge />
    </div>
  );
}
