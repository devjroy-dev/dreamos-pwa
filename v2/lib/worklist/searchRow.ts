// v2/lib/worklist/searchRow.ts · DESIGN-1 · WHERE THE SEARCH ROW IS NOT DRAWN (one home).
// The new layout draws the search row under the header on every page (stage 3) except the pages named here.
// CE-46 2.1 (a), the founder through the chair, 30 Sept 2026: the Ads draft, so its Run button and all four rows sit on
// the first screen of a 374 x 812 phone, 44 px clear of the Ask bar, nothing reordered (b143_v2 2.1 pins it).
import { ADS_HREF } from '@/v2/lib/solutions/routes';   // the Ads page's one address (C31: no /vendor literal)
export const NO_SEARCH_ROW: readonly string[] = [ADS_HREF];

/** true when the page at this path draws the search row. A trailing slash reads as the same page. */
export function searchRowFor(pathname: string | null | undefined): boolean {
  const p = String(pathname || '').replace(/\/+$/, '') || '/';
  return !NO_SEARCH_ROW.includes(p);
}
