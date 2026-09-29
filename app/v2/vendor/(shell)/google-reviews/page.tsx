// DESIGN-1 · THE LAYOUT SWITCH: the v2 route tree. middleware.ts rewrites /vendor/* here for a vendor whose
// layout is v2; the page itself lives in v2/ (outside app/, components/ and lib/), a copy of the redesign.
export { default } from '@/v2/app/vendor/(shell)/google-reviews/page';
