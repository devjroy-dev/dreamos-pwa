// DESIGN-1 · THE LAYOUT SWITCH: the v2 route tree. middleware.ts rewrites /vendor/* here for a vendor whose
// layout is v2; the page itself lives in v2/ (outside app/, components/ and lib/), a copy of the redesign.
// CE-47 · THE HUB CUT (INS): the door for /vendor/payment-links. The page it opens is its seat's to replace.
export { default } from '@/v2/app/vendor/(shell)/payment-links/page';
