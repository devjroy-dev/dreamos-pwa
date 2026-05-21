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
  id: string;
  save_number: number;
  image_url: string | null;
  source_type: string;
  vendor_id: string | null;
  vendor_name: string | null;
  caption: string | null;
  aesthetic_tags: string[];
  saved_by_role: 'bride' | 'circle_member';
  circle_comment_count: number;
  created_at: string;
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
