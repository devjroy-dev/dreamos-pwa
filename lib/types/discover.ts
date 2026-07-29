// lib/types/discover.ts
// Types for the discover feed and muse board (B-1 / B-2).

export interface DiscoverVendor {
  id: string;
  name: string | null;
  category: string | null;
  city: string | null;
  routing_handle: string | null;
  starting_price: number | null;
  photos: string[];
  vibe_tags: string[];
  about: string | null;
  enquire_link: string | null;

  // ── TDW_07 P1 · three fields, all ADDITIVE and all optional ──────────────────
  // `is_demo` is NOT new on the wire — src/api/couple/discover.js has sent it since
  // the two-branch feed was born (:81 false / :122 true) and this type never declared
  // it. That gap is F-07.3, "a type behind its own contract"; it is cured here.
  //
  // All three are optional so every existing consumer compiles unchanged: the demo
  // subdomain surface (app/demodiscover) and the sanctuary feed
  // (app/(frost)/frost/canvas/sanctuary/page.tsx:1416/:1425) both read this type and
  // neither is touched by P1.
  is_demo?: boolean;

  /** Bare Instagram username — no '@', no URL. Server-normalised; null when absent
   *  or unusable. D-3's chip renders only when this is a non-empty string. */
  instagram_handle?: string | null;

  /** TRUE only where an approved vendor_featured_submissions row's scheduled window
   *  contains this instant (CE ruling §C/F5). NOT vendors.featured_eligible, which
   *  answers eligibility. The Manual honesty law: marked, always — and marked only
   *  when true. */
  featured?: boolean;
}

export interface FeaturedCollection {
  id: string;
  title: string;
  subtitle: string | null;
  cover_image: string | null;
  vendor_ids: string[];
}

export interface DiscoverHero {
  id: string;
  name: string | null;
  image_url: string | null;
  caption: string | null;
  routing_handle: string | null;
  enquire_link: string | null;
}

export interface MuseSave {
  id:                    string;
  save_number:           number;
  image_url:             string | null;
  source_type:           'vendor' | 'photo' | 'link' | 'image';
  vendor_id:             string | null;
  vendor_name:           string | null;
  vendor_city:           string | null;
  vendor_category:       string | null;
  vendor_starting_price: number | null;
  vendor_vibe_tags:      string[];
  vendor_routing_handle: string | null;
  enquire_link:          string | null;
  caption:               string | null;
  aesthetic_tags:        string[];
  saved_by_role:         'bride' | 'circle_member';
  circle_comment_count:  number;
  created_at:            string;
}

export interface MuseActivity {
  id: string;
  activity_type: string;
  member_name: string;
  role: string;
  content: string | null;
  created_at: string;
}

export interface MuseActivityResponse {
  ok: true;
  save: {
    id: string;
    image_url: string | null;
    vendor_name: string | null;
  };
  activity: MuseActivity[];
}
