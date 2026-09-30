// app/v2/vendor/layout.tsx · DESIGN-1 · THE LAYOUT SWITCH · the v2 tree's own layout.
// Stage 1 loaded Inter in the root layout; the root is today's again (the standby is identical to the user), so the
// redesign's faces load here, for the v2 tree only: Inter, the vendor app's one family (display 'block': never a
// fallback), and the serif under --font-brand for the TDW name alone. Set on :root, not a wrapper, so a sheet portaled
// to <body> reads them too.
import { Inter, Cormorant_Garamond } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'block' });
const brand = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

export default function V2VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`:root{--font-inter:${inter.style.fontFamily};--font-brand:${brand.style.fontFamily}}`}</style>
      {children}
    </>
  );
}
