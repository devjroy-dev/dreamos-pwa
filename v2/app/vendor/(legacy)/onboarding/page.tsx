'use client';
// v2/app/vendor/(legacy)/onboarding/page.tsx · CE-47 · FE-9 · THE TWO-MINUTE START (G3, the chair's ruling, 6 Oct 2026).
// This address is where every unfinished vendor is already sent, so the set-up flow lives here (S4 to S10 now; S2, S3,
// B1 and B2 in package 2, on WEB-4's cut 20, whose Instagram return lands on this same address). The old six-box form's
// rule travels with S5: only the fields the server lists as missing, the server's own refusal words, no copy of its list.
import StartFlow from '@/v2/components/start/StartFlow';

export default function VendorOnboardingPage() {
  return <StartFlow />;
}
