/* public/site/enquire-panel.js · TDW · CE-47 · WEB-7 · the enquiry panel on every page of a vendor's website.
   Plain script, no framework. Loaded AFTER the page's load event by lib/site/enquirePanelBoot.ts, so the first paint
   never waits for it. Reads the page's card from <script type="application/json" id="tdw-site-card">.
   Doors (dream-os, WEB-4 cut 6): POST /api/v2/public/site-enquiry/:code, POST /api/v2/public/site-chat/:code;
   the date-check reader GET /api/v2/public/availability/:code/:date. Rulings: CE-46 forks 1-8, copy lines 1-15;
   CE-47: every country, "Name the occasion", default chips, Basic's optional Date, the consent line. */
(function(){
'use strict';
if(window.__tdwEnquire)return;
const $=s=>document.querySelector(s);
let CARD={};try{CARD=JSON.parse(($('#tdw-site-card')||{}).textContent||'{}')}catch(_){CARD={}}
if(!CARD.code)return;                                                    // no card, no panel
const API=(CARD.api_base||'https://dream-os-production.up.railway.app').replace(/\/+$/,'');
const CC=[["IN","India","91"],["AE","United Arab Emirates","971"],["GB","United Kingdom","44"],["US","United States","1"],["CA","Canada","1"],["AU","Australia","61"],["SG","Singapore","65"],["AF","Afghanistan","93"],["AX","Aland","358"],["AL","Albania","355"],["DZ","Algeria","213"],["AS","American Samoa","1684"],["AD","Andorra","376"],["AO","Angola","244"],["AI","Anguilla","1264"],["AQ","Antarctica","672"],["AG","Antigua and Barbuda","1268"],["AR","Argentina","54"],["AM","Armenia","374"],["AW","Aruba","297"],["AC","Ascension Island","247"],["AT","Austria","43"],["AZ","Azerbaijan","994"],["BS","Bahamas","1242"],["BH","Bahrain","973"],["BD","Bangladesh","880"],["BB","Barbados","1246"],["BY","Belarus","375"],["BE","Belgium","32"],["BZ","Belize","501"],["BJ","Benin","229"],["BM","Bermuda","1441"],["BT","Bhutan","975"],["BO","Bolivia","591"],["BQ","Bonaire","5997"],["BA","Bosnia and Herzegovina","387"],["BW","Botswana","267"],["BV","Bouvet Island","47"],["BR","Brazil","55"],["IO","British Indian Ocean Territory","246"],["VG","British Virgin Islands","1284"],["BN","Brunei","673"],["BG","Bulgaria","359"],["BF","Burkina Faso","226"],["BI","Burundi","257"],["CV","Cabo Verde","238"],["KH","Cambodia","855"],["CM","Cameroon","237"],["KY","Cayman Islands","1345"],["CF","Central African Republic","236"],["TD","Chad","235"],["CL","Chile","56"],["CN","China","86"],["CX","Christmas Island","61"],["CC","Cocos (Keeling) Islands","61"],["CO","Colombia","57"],["KM","Comoros","269"],["CK","Cook Islands","682"],["CR","Costa Rica","506"],["HR","Croatia","385"],["CU","Cuba","53"],["CW","Curacao","5999"],["CY","Cyprus","357"],["CZ","Czechia","420"],["CD","Democratic Republic of the Congo","243"],["DK","Denmark","45"],["DJ","Djibouti","253"],["DM","Dominica","1767"],["DO","Dominican Republic","1809"],["DO","Dominican Republic","1829"],["DO","Dominican Republic","1849"],["TL","East Timor","670"],["EC","Ecuador","593"],["EG","Egypt","20"],["SV","El Salvador","503"],["GQ","Equatorial Guinea","240"],["ER","Eritrea","291"],["EE","Estonia","372"],["SZ","Eswatini","268"],["ET","Ethiopia","251"],["FK","Falkland Islands","500"],["FO","Faroe Islands","298"],["FJ","Fiji","679"],["FI","Finland","358"],["FR","France","33"],["GF","French Guiana","594"],["PF","French Polynesia","689"],["TF","French Southern Territories","262"],["GA","Gabon","241"],["GM","Gambia","220"],["GE","Georgia","995"],["DE","Germany","49"],["GH","Ghana","233"],["GI","Gibraltar","350"],["GR","Greece","30"],["GL","Greenland","299"],["GD","Grenada","1473"],["GP","Guadeloupe","590"],["GU","Guam","1671"],["GT","Guatemala","502"],["GG","Guernsey","44"],["GN","Guinea","224"],["GW","Guinea-Bissau","245"],["GY","Guyana","592"],["HT","Haiti","509"],["HM","Heard Island and McDonald Islands","61"],["HN","Honduras","504"],["HK","Hong Kong","852"],["HU","Hungary","36"],["IS","Iceland","354"],["ID","Indonesia","62"],["IR","Iran","98"],["IQ","Iraq","964"],["IE","Ireland","353"],["IM","Isle of Man","44"],["IL","Israel","972"],["IT","Italy","39"],["CI","Ivory Coast","225"],["JM","Jamaica","1876"],["JP","Japan","81"],["JE","Jersey","44"],["JO","Jordan","962"],["KZ","Kazakhstan","7"],["KE","Kenya","254"],["KI","Kiribati","686"],["XK","Kosovo","377"],["XK","Kosovo","381"],["XK","Kosovo","383"],["XK","Kosovo","386"],["KW","Kuwait","965"],["KG","Kyrgyzstan","996"],["LA","Laos","856"],["LV","Latvia","371"],["LB","Lebanon","961"],["LS","Lesotho","266"],["LR","Liberia","231"],["LY","Libya","218"],["LI","Liechtenstein","423"],["LT","Lithuania","370"],["LU","Luxembourg","352"],["MO","Macao","853"],["MG","Madagascar","261"],["MW","Malawi","265"],["MY","Malaysia","60"],["MV","Maldives","960"],["ML","Mali","223"],["MT","Malta","356"],["MH","Marshall Islands","692"],["MQ","Martinique","596"],["MR","Mauritania","222"],["MU","Mauritius","230"],["YT","Mayotte","262"],["MX","Mexico","52"],["FM","Micronesia","691"],["MD","Moldova","373"],["MC","Monaco","377"],["MN","Mongolia","976"],["ME","Montenegro","382"],["MS","Montserrat","1664"],["MA","Morocco","212"],["MZ","Mozambique","258"],["MM","Myanmar","95"],["NA","Namibia","264"],["NR","Nauru","674"],["NP","Nepal","977"],["NL","Netherlands","31"],["NC","New Caledonia","687"],["NZ","New Zealand","64"],["NI","Nicaragua","505"],["NE","Niger","227"],["NG","Nigeria","234"],["NU","Niue","683"],["NF","Norfolk Island","672"],["KP","North Korea","850"],["MK","North Macedonia","389"],["MP","Northern Mariana Islands","1670"],["NO","Norway","47"],["OM","Oman","968"],["PK","Pakistan","92"],["PW","Palau","680"],["PS","Palestine","970"],["PA","Panama","507"],["PG","Papua New Guinea","675"],["PY","Paraguay","595"],["PE","Peru","51"],["PH","Philippines","63"],["PN","Pitcairn Islands","64"],["PL","Poland","48"],["PT","Portugal","351"],["PR","Puerto Rico","1787"],["PR","Puerto Rico","1939"],["QA","Qatar","974"],["CG","Republic of the Congo","242"],["RE","Reunion","262"],["RO","Romania","40"],["RU","Russia","7"],["RW","Rwanda","250"],["BL","Saint Barthelemy","590"],["SH","Saint Helena","290"],["KN","Saint Kitts and Nevis","1869"],["LC","Saint Lucia","1758"],["MF","Saint Martin","590"],["PM","Saint Pierre and Miquelon","508"],["VC","Saint Vincent and the Grenadines","1784"],["WS","Samoa","685"],["SM","San Marino","378"],["ST","Sao Tome and Principe","239"],["SA","Saudi Arabia","966"],["SN","Senegal","221"],["RS","Serbia","381"],["SC","Seychelles","248"],["SL","Sierra Leone","232"],["SX","Sint Maarten","1721"],["SK","Slovakia","421"],["SI","Slovenia","386"],["SB","Solomon Islands","677"],["SO","Somalia","252"],["ZA","South Africa","27"],["GS","South Georgia and the South Sandwich Islands","500"],["KR","South Korea","82"],["SS","South Sudan","211"],["ES","Spain","34"],["LK","Sri Lanka","94"],["SD","Sudan","249"],["SR","Suriname","597"],["SJ","Svalbard and Jan Mayen","4779"],["SE","Sweden","46"],["CH","Switzerland","41"],["SY","Syria","963"],["TW","Taiwan","886"],["TJ","Tajikistan","992"],["TZ","Tanzania","255"],["TH","Thailand","66"],["TG","Togo","228"],["TK","Tokelau","690"],["TO","Tonga","676"],["TT","Trinidad and Tobago","1868"],["TA","Tristan da Cunha","290"],["TN","Tunisia","216"],["TR","Türkiye","90"],["TM","Turkmenistan","993"],["TC","Turks and Caicos Islands","1649"],["TV","Tuvalu","688"],["UM","U.S. Minor Outlying Islands","1"],["VI","U.S. Virgin Islands","1340"],["UG","Uganda","256"],["UA","Ukraine","380"],["UY","Uruguay","598"],["UZ","Uzbekistan","998"],["VU","Vanuatu","678"],["VA","Vatican City","379"],["VE","Venezuela","58"],["VN","Vietnam","84"],["WF","Wallis and Futuna","681"],["EH","Western Sahara","212"],["YE","Yemen","967"],["ZM","Zambia","260"],["ZW","Zimbabwe","263"]];                                                          // countries-list 3.4.1: [iso, name, code]
const OCC={makeup:['Wedding','Engagement','Reception','Mehendi','Sangeet','Other'],
  photography:['Wedding','Pre-wedding shoot','Engagement','Reception','Portraits','Other'],
  performer:['Sangeet','Wedding','Reception','Mehendi','Corporate event','Other'],
  planning:['Wedding','Destination wedding','Engagement','Reception','Other']};
const OCC_DEFAULT=['Wedding','Engagement','Reception','Sangeet','Other'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const CONSENT_VERSION='enq-2026-09-30';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const studio=()=>CARD.studio_name||'the studio';
const eliza=()=>CARD.eliza||{};
const longDate=iso=>{const [y,m,d]=iso.split('-').map(Number);return `${d} ${MONTHS[m-1]} ${y}`};
const grouped=d=>d.length>5?d.slice(0,5)+' '+d.slice(5):d;
const todayIST=()=>new Date(Date.now()+330*60000).toISOString().slice(0,10);
let st={};

document.body.insertAdjacentHTML('beforeend',`<aside class="w7" id="w7" role="dialog" aria-modal="true" aria-labelledby="w7Name" aria-hidden="true">
 <div class="w7h"><span class="w7mono" id="w7Mono" aria-hidden="true"></span><div class="w7t"><b id="w7Name"></b><span>Enquiries</span></div>
  <button class="w7x" id="w7X" type="button" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>
 <div class="w7m" id="w7M" aria-live="polite"></div>
 <form class="w7foot" id="w7Foot" hidden><input class="w7in" id="w7Free" maxlength="600" placeholder="Write a message" aria-label="Write a message" autocomplete="off"><button class="w7btn" type="submit">Send</button></form>
</aside>`);
const P=$('#w7'),MS=$('#w7M');
function el(t,c,x){const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function push(n){MS.appendChild(n);MS.scrollTop=1e6;return n}
function say(text,delay){return new Promise(r=>setTimeout(()=>r(push(el('div','w7s',text))),RM?0:(delay||0)))}
function you(text){push(el('div','w7u',text))}
function dots(){const d=el('div','w7dots');d.innerHTML='<i></i><i></i><i></i>';return push(d)}
async function door(method,path,body,ms){
  const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),ms||12000);
  try{const r=await fetch(API+path,{method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,signal:ctl.signal,credentials:'omit'});
    let j={};try{j=await r.json()}catch(_){}return {status:r.status,body:j}}
  catch(_){return {status:0,body:{}}}finally{clearTimeout(t)}}
const pageFact=()=>{const lookTitle=(document.querySelector('[data-look-title]')||{}).dataset;
  return lookTitle&&lookTitle.lookTitle?{kind:'look',title:lookTitle.lookTitle}:(CARD.page||{kind:'home'})};

/* WEB-8 C2 (MERGED, CE-47): a pricing row's "Ask for a quote" opens the panel with that package chosen; the door records it as the page ("Pricing: <package>"), the WhatsApp hand-off names it */
function open(pkg){
  pkg=typeof pkg==='string'?pkg.trim().slice(0,60):'';
  st={occasion:null,date:null,name:null,e164:null,token:null,pkg:pkg||null,page:pkg?{kind:'other',title:`Pricing: ${pkg}`}:pageFact()};
  $('#w7Name').textContent=studio();$('#w7Mono').textContent=CARD.monogram||'';
  MS.textContent='';$('#w7Foot').hidden=true;const pk=$('#w7Pk');if(pk)pk.hidden=true;
  P.classList.add('on');P.setAttribute('aria-hidden','false');document.documentElement.classList.add('w7-open');
  say(`Hello, you've reached ${studio()}.`);if(st.pkg)say(`You are asking about ${st.pkg}.`,200);askOccasion(st.pkg?600:400);setTimeout(()=>$('#w7X').focus(),RM?0:450)}
function close(){P.classList.remove('on');P.setAttribute('aria-hidden','true');document.documentElement.classList.remove('w7-open')}

async function askOccasion(d){await say('What is the occasion?',d);const row=push(el('div','w7row'));
  (OCC[CARD.category]||OCC_DEFAULT).forEach(o=>{const b=el('button','w7chip',o);b.type='button';b.onclick=()=>pickOccasion(o,row);row.appendChild(b)})}
function pickOccasion(o,row){if(st.occasion)return;row.querySelectorAll('button').forEach(b=>{b.disabled=true;b.classList.toggle('on',b.textContent===o)});
  if(o==='Other'){const f=el('form','w7dt');const i=el('input','w7in');i.maxLength=40;i.placeholder='Name the occasion';i.setAttribute('aria-label','Name the occasion');
    const b=el('button','w7btn','Send');b.type='submit';f.append(i,b);push(f);i.focus();
    f.onsubmit=e=>{e.preventDefault();const v=i.value.trim();if(!v)return;f.remove();st.occasion=v;you(v);afterOccasion()};return}
  st.occasion=o;you(o);afterOccasion()}
function afterOccasion(){if(CARD.date_check_enabled===true)askDate();else askEnquiry(true)}
async function askDate(){
  await say(`Which date is the ${st.occasion.toLowerCase()}?`,350);
  const f=el('form','w7dt');const i=el('input','w7in');i.type='date';i.min=todayIST();i.setAttribute('aria-label','Date');
  const b=el('button','w7btn','Check');b.type='submit';f.append(i,b);push(f);
  f.onsubmit=async e=>{e.preventDefault();if(!i.value||i.value<todayIST())return;f.querySelectorAll('input,button').forEach(x=>x.disabled=true);
    st.date=i.value;you(longDate(i.value));const d=dots();
    const r=await door('GET',`/api/v2/public/availability/${encodeURIComponent(CARD.code)}/${i.value}`,null,6000);d.remove();
    const v=r.body||{};const free=r.status===200&&v.ok===true&&v.blocked===false&&v.sold===false&&v.any_held===false;
    await say(free?`${studio()} is free on ${longDate(st.date)}.`:`${studio()} will confirm ${longDate(st.date)} with you.`);
    askEnquiry(false)}}
async function askEnquiry(withDate){
  await say(`Leave your name and number and ${studio()} will get back to you.`,450);
  const f=el('form','w7f');f.noValidate=true;
  const ln=el('label',null,'Name');const n=el('input','w7in');n.maxLength=40;n.autocomplete='name';ln.appendChild(n);
  const lp=el('label',null,'Phone');const box=el('div','w7ph');let cc=CC[0];
  const ccb=el('button','w7cc');ccb.type='button';ccb.setAttribute('aria-haspopup','dialog');
  const ccPaint=()=>{ccb.textContent='+'+cc[2];ccb.insertAdjacentHTML('beforeend','<svg viewBox="0 0 12 12"><path d="M2 4l4 4 4-4"/></svg>');ccb.setAttribute('aria-label','Country code, '+cc[1]+' +'+cc[2])};ccPaint();
  const p=el('input','w7in');p.inputMode='numeric';p.autocomplete='tel-national';p.setAttribute('aria-label','Phone');box.append(ccb,p);lp.appendChild(box);
  const fmt=()=>{let d=p.value.replace(/\D/g,'');if(cc[2]==='91'){d=d.replace(/^91(?=\d{10})/,'').slice(0,10);p.value=grouped(d)}else p.value=d.slice(0,14)};
  p.oninput=fmt;ccb.onclick=()=>openPicker(cc,pick=>{cc=pick;ccPaint();fmt();p.focus()});
  f.append(ln,lp);let dIn=null;
  if(withDate){const ld=el('label',null,'Date');dIn=el('input','w7in');dIn.type='date';dIn.min=todayIST();ld.appendChild(dIn);f.appendChild(ld)}
  const err=el('div','w7err');
  const cons=el('div','w7cons',`The Dream Wedding passes your name and number to ${studio()} only to answer this enquiry. `);
  const pl=el('a',null,'Privacy');pl.href='https://thedreamwedding.in/privacy';pl.target='_blank';pl.rel='noopener';cons.appendChild(pl);
  const b=el('button','w7btn','Send');b.type='submit';f.append(err,cons,b);push(f);
  f.onsubmit=async e=>{e.preventDefault();const name=n.value.trim();const d=p.value.replace(/\D/g,'');err.textContent='';
    if(!name){err.textContent='Please add your name.';n.focus();return}
    const ok=cc[2]==='91'?/^[6-9]\d{9}$/.test(d):/^\d{6,14}$/.test(d);
    if(!ok){err.textContent=cc[2]==='91'?'Please add a 10-digit mobile number.':'Please add your mobile number.';p.focus();return}
    if(dIn&&dIn.value)st.date=dIn.value;
    const body={name,country:cc[0],phone_e164:'+'+cc[2]+d,occasion:st.occasion,page:st.page,consent:true,consent_version:CONSENT_VERSION};
    if(st.date)body.date=st.date;
    f.querySelectorAll('input,button').forEach(x=>x.disabled=true);
    const r=await door('POST',`/api/v2/public/site-enquiry/${encodeURIComponent(CARD.code)}`,body);
    if(r.status===200&&r.body.ok===true){st.name=name;st.e164=body.phone_e164;st.token=r.body.chat_token||null;sent();return}
    /* WEB-8 (MERGED, CE-47 ruling 4): the door answers 404 while it is OFF; the visitor is handed to her WhatsApp link, never an error */
    if(r.status===404&&handoffHref()){st.name=name;st.e164=body.phone_e164;doorOff();return}
    f.querySelectorAll('input,button').forEach(x=>x.disabled=false);
    err.textContent=(r.status===400||r.status===429)&&r.body.error?r.body.error:'Your enquiry could not be sent. Please try again in a moment.'};
  setTimeout(()=>n.focus({preventScroll:true}),RM?0:500)}
function openPicker(cur,done){
  let pk=$('#w7Pk');
  if(!pk){P.insertAdjacentHTML('beforeend',`<div class="w7pk" id="w7Pk" role="dialog" aria-label="Country code" hidden><div class="w7pkh"><input class="w7in" id="w7PkQ" placeholder="Search country or code" aria-label="Search country or code" autocomplete="off"><button class="w7x" id="w7PkX" type="button" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div><ul class="w7pkl" id="w7PkL"></ul></div>`);pk=$('#w7Pk')}
  const q=$('#w7PkQ'),L=$('#w7PkL');
  const draw=()=>{const s=q.value.trim().toLowerCase().replace(/^\+/,'');L.textContent='';
    const hits=CC.filter(r=>!s||r[1].toLowerCase().includes(s)||r[2].startsWith(s)||r[0].toLowerCase()===s);
    if(!hits.length){L.appendChild(el('li','w7pke','No country matches your search.'));return}
    hits.forEach(r=>{const li=el('li');const bt=el('button');bt.type='button';if(r===cur)bt.className='on';bt.append(el('span',null,r[1]),el('span',null,'+'+r[2]));
      bt.onclick=()=>{pk.hidden=true;done(r)};li.appendChild(bt);L.appendChild(li)})};
  q.value='';q.oninput=draw;draw();pk.hidden=false;$('#w7PkX').onclick=()=>{pk.hidden=true};setTimeout(()=>q.focus({preventScroll:true}),0)}
/* the hand-off: built on the card's enquire_link, never by hand (W7-d) */
function withText(link,words){if(!link)return null;try{const u=new URL(link);const t=u.searchParams.get('text');
  u.searchParams.set('text',t?`${t} ${words}`:words);return u.toString()}catch(_){return null}}
function handoffHref(){const about=st.pkg?`a quote for ${st.pkg}`:(st.page&&st.page.title)||st.occasion||'an enquiry';
  return withText(CARD.enquire_link,`Hello ${studio()}, I enquired on your website about ${about}${st.date?` on ${longDate(st.date)}`:''}.`)}
async function doorOff(){
  await say(`Thank you, ${st.name}. Please continue on WhatsApp to reach ${studio()}.`,300);
  const a=el('a','w7btn','Continue on WhatsApp');a.href=handoffHref();a.target='_blank';a.rel='noopener';push(a)}
async function sent(){
  await say(`Thank you, ${st.name}. ${studio()} has your enquiry.`,300);
  const h=handoffHref();if(h){const a=el('a','w7btn alt','Continue on WhatsApp');a.href=h;a.target='_blank';a.rel='noopener';push(a)}
  const lb=eliza().live_booking;
  if(lb==='coming_soon'){await say(`Would you like a call with ${studio()}?`,500);const r=push(el('div','w7row'));const c=el('button','w7chip','Coming soon');c.type='button';c.disabled=true;r.appendChild(c)}
  if(st.token)$('#w7Foot').hidden=false}
let inFlight=false;
$('#w7Foot').onsubmit=async e=>{e.preventDefault();if(inFlight)return;const i=$('#w7Free');const v=i.value.trim();if(!v||!st.token)return;
  inFlight=true;i.value='';you(v);const d=dots();
  const r=await door('POST',`/api/v2/public/site-chat/${encodeURIComponent(CARD.code)}`,{chat_token:st.token,text:v},30000);d.remove();inFlight=false;
  if(r.status===200&&r.body.ok===true){const rs=Array.isArray(r.body.replies)?r.body.replies:[];
    if(r.body.held===true||!rs.length){await say(`${studio()} will reply to you soon.`);return}
    for(const t of rs)if(typeof t==='string'&&t.trim())await say(t,250);return}
  push(el('div','w7err',(r.body&&typeof r.body.error==='string'&&r.status!==404)?r.body.error:'Your message could not be sent. Please try again in a moment.'))};
/* entry points: WEB-5's [data-enquire] (and the prototype's [data-eliza]) */
document.addEventListener('click',e=>{const t=e.target.closest('[data-enquire],[data-eliza]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();open(t.dataset.package||'')},true);
/* line 15: a look's WhatsApp request, the look named */
document.addEventListener('click',e=>{const a=e.target.closest('a[data-look-request]');if(!a)return;
  const h=withText(CARD.enquire_link,`Hello ${studio()}, I would like to ask about ${a.dataset.lookRequest||'this look'}.`);if(h)a.href=h},true);
$('#w7X').onclick=close;
addEventListener('keydown',e=>{if(e.key==='Escape'&&P.classList.contains('on')){const pk=$('#w7Pk');if(pk&&!pk.hidden)pk.hidden=true;else close()}});
window.__tdwEnquire={open,close,version:1};
})();
