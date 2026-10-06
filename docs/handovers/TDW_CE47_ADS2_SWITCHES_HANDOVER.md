# TDW · CE-47 · ADS-2 · A VENDOR'S META FEATURE SWITCHES · dreamos-pwa · app half · 4 October 2026

The server half landed in dream-os a29a45b (0214 with its grant, featureGate, the door GET/PUT /api/v2/vendor/features,
the hourly sweep that turns a feature on only when Meta lists it live AND the live probe passes).

lib/worklist/features.ts (and v2): the words, ruled verbatim: "On", "Off", "Waiting for Meta's approval. It starts by
itself when approved.", "Live", and the list's title "Meta features". lineFor (Live once on, else the waiting line).
SWITCHABLE: Instagram messages and ads (the photo import has none until its room is rebuilt, Q5; insights none, Q4). The
door client: GET; PUT { key, choice } with the app's own auth header.
components/solutions/FeatureSwitch.tsx (and v2): one feature (only=) or the list. On/Off as two pressed-state buttons;
her tap is saved through the door and reverted if the save fails.
THE ROOMS: "Meta features" (the list) in the WhatsApp and Instagram room, at the head of MetaRoomSections, so present in
both of that room's modes, right after the WhatsApp number section (the chair's acceptance of 4 Oct); the ads switch
at the top of the ads room. Both trees.
OWED WORDS: switchboardCopy.ts "needs all six ads permissions below"; the photo import "Meta app App-LIVE · needs
Instagram basic". The locked chooser row dimmed (.ads-opt[aria-disabled="true"] opacity .55), both ads rooms.
PROOF: b256 21/0 (M1-M4); b143 v2 121/0; b143 121/0; b173 38/0; tsc exit 0; next build --webpack rc 0. The census and
tdw41_c3: their base reds only, identical on the clean tip.
