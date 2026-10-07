#!/usr/bin/env node
// scripts/b244_ce47_pro_privacy_bench.js · CE-47 · PRO · F-44.368 · THE PRIVACY PAGE NAMES GOOGLE CLOUD VISION.
// The founder's words (7 October 2026), and the code facts they rest on, read from the dream-os sibling (../dream-os)
// so the page never says less than the code does. Without the sibling the code cells REFUSE and the bench exits 3:
// never green and never red on a missing clone.
'use strict';
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..'); const SIB = path.join(ROOT, '..', 'dream-os');
let pass = 0, fail = 0, refused = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log(`  PASS  ${name}`); } else { fail++; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 200) + ']'}`); } };
const refuse = (name, why) => { refused++; console.log(`  REFUSED  ${name}  (${why})`); };
const flat = (s) => s.replace(/\s+/g, ' ');
const page = flat(fs.readFileSync(path.join(ROOT, 'app/privacy/page.tsx'), 'utf8'));

console.log('\n── 1  the words, as the founder approved them ──');
ok(page.includes('<strong>Google Cloud Vision</strong>: when you send TDW a picture on WhatsApp or add one in the app, Google reads it from the address where TDW stores it, to find its text, what it shows and its colours, so TDW can file it as inspiration, a receipt or a moment. Google does not keep the picture. TDW keeps what Google found with your saved picture.'),
  '1.1 the Google Cloud Vision bullet, word for word');
ok(page.includes('<strong>Cloudinary</strong>: where portfolio photos and the pictures you save in TDW are stored.') && !page.includes('<strong>Cloudinary</strong>: where portfolio photos are stored.'), '1.2 the Cloudinary bullet names the pictures she saves, and the old line is gone');
ok(page.includes('<strong>Anthropic and DeepSeek</strong>: AI model providers. The content of your messages is sent to these providers'), '1.3 the Anthropic bullet is unchanged here (its bill clause rides the P2 app package, as ruled)');
ok(!/—/.test(page.slice(page.indexOf('Google Cloud Vision'), page.indexOf('Google Cloud Vision') + 400)), '1.4 no em dash in the new bullet');

console.log('\n── 2  the code it rests on (dream-os sibling) ──');
const R = (p) => fs.readFileSync(path.join(SIB, p), 'utf8');
if (!fs.existsSync(path.join(SIB, 'src/lib/imageOCRRouter.js'))) {
  refuse('2.1 to 2.3', 'the dream-os sibling is absent at ../dream-os; clone it beside this repo and re-run');
} else {
  const ocr = R('src/lib/imageOCRRouter.js'), pipe = R('src/lib/imagePipeline.js');
  ok(/image: \{ source: \{ imageUri: image_url \} \}/.test(ocr) && /image: \{ source: \{ imageUri: imageUrl \} \}/.test(pipe) && !/image: \{ content:/.test(ocr + pipe),
    '2.1 "Google reads it from the address where TDW stores it": both calls send imageUri (an address), never the bytes');
  const feats = [...new Set([...(ocr + pipe).matchAll(/type: '([A-Z_]+)'/g)].map((m) => m[1]))].sort().join();
  ok(feats === 'DOCUMENT_TEXT_DETECTION,IMAGE_PROPERTIES,LABEL_DETECTION' && /'DOCUMENT_TEXT_DETECTION'/.test(ocr) && /'IMAGE_PROPERTIES'/.test(pipe),
    '2.2 "its text, what it shows and its colours": DOCUMENT_TEXT_DETECTION, LABEL_DETECTION, IMAGE_PROPERTIES, and no other feature',
    JSON.stringify([...(ocr + pipe).matchAll(/type: '([A-Z_]+)'/g)].map((m) => m[1])));
  ok(/vision_raw/.test(R('src/lib/museSave.js')) && /'receipt'/.test(ocr) && /'moment'/.test(ocr) && /'muse'/.test(ocr),
    '2.3 "file it as inspiration, a receipt or a moment" and "TDW keeps what Google found with your saved picture" (muse_saves.vision_raw)');
}
console.log(`\nb244 · ${pass} PASS · ${fail} FAIL · ${refused} REFUSED`);
if (fail) console.log('FAILED: ' + failed.join(' | '));
// a missing sibling is neither green nor red: exit 3, REFUSED (the chair, 7 October 2026)
process.exit(fail ? 1 : refused ? 3 : 0);
