// components/worklist/RoomIcon.tsx -- CE-45 FE-1 HOME_2 · THE ONE COMPONENT THAT DRAWS A ROOM'S ICON.
// R-45.21 (the founder's approval of the mock as it opens) and the chair's (b)(i): the drawing is the
// registry's constant (lib/worklist/icons.ts), drawn verbatim as markup, never anything else. The
// `k` prop is typed IconKey, so a call site can only name a registry key; there is no prop through
// which markup could arrive. Colour is currentColor: the reader's CSS picks an existing token.
// aria-hidden: the room's name beside it is the accessible label; the icon adds no words.
import { ROOM_ICONS, type IconKey } from '@/lib/worklist/icons';

export function RoomIcon({ k, className }: { k: IconKey; className: string }) {
  return (
    <svg
      className={className}
      data-icon={k}
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ROOM_ICONS[k] }}
    />
  );
}
