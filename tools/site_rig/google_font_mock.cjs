// Mocked Google Fonts CSS for next/font in a container with no route to Google (WEB-5 rig only).
// Each URL next/font asks for is answered with @font-face blocks pointing at @fontsource's latin woff2.
const path = require('path');
const F = n => path.join(__dirname, 'node_modules/@fontsource', n, 'files');
function css(family, pkg, specs) {
  return specs.map(([w, st]) => `/* latin */\n@font-face {\n  font-family: '${family}';\n  font-style: ${st};\n  font-weight: ${w};\n  font-display: swap;\n  src: url(${F(pkg)}/${pkg}-latin-${w}-${st}.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n`).join('');
}
module.exports = {
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=block': css('Inter', 'inter', [[400, 'normal'], [500, 'normal'], [600, 'normal']]).replace(/swap/g, 'block'),
  // WEB-8 (MERGED): ADM-1's admin layout asks for Inter with 700 as well; without this a rig build on today's main stops at the font loader
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=block': css('Inter', 'inter', [[400, 'normal'], [500, 'normal'], [600, 'normal'], [700, 'normal']]).replace(/swap/g, 'block'),
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&display=swap': css('Cormorant Garamond', 'cormorant-garamond', [[400, 'normal'], [500, 'normal']]),
  // WEB-8 (CE-47, P5 r2): PTN's components/partner/PartnerShell.tsx asks for these two; without them a rig build of main stops at the font loader
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap': css('Inter', 'inter', [[400, 'normal'], [500, 'normal'], [600, 'normal']]),
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&display=swap': css('Cormorant Garamond', 'cormorant-garamond', [[500, 'normal']]),
  'https://fonts.googleapis.com/css2?family=Italiana:wght@400&display=swap': css('Italiana', 'italiana', [[400, 'normal']]),
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap':
    css('Cormorant Garamond', 'cormorant-garamond', [[300, 'normal'], [400, 'normal'], [500, 'normal'], [300, 'italic'], [400, 'italic'], [500, 'italic']]),
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap': css('DM Sans', 'dm-sans', [[300, 'normal'], [400, 'normal'], [500, 'normal']]),
  'https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500&display=swap': css('Jost', 'jost', [[200, 'normal'], [300, 'normal'], [400, 'normal'], [500, 'normal']]),
};
