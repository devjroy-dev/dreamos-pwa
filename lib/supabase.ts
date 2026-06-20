// lib/supabase.ts
// Browser Supabase client (anon key) for Phone-OTP login — Path 1.
// The session it mints (signInWithOtp/verifyOtp) IS the auth token the rest of the
// app sends as Bearer; dream-os requireAuth verifies it via getUser(). The provision
// endpoint then links/creates the vendor|couple row. Env set in Vercel:
//   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
import { createClient } from '@supabase/supabase-js';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || '';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(URL, ANON, {
  auth: { persistSession: false, autoRefreshToken: false },
});
