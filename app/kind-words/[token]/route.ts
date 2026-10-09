// app/kind-words/[token]/route.ts · TDW · CE-47 · WEB-7 · THE CLIENT'S PAGE FOR KIND WORDS.
// One plain server-drawn document: no React on the page, no login, no cookie, no storage.
// The door: GET/POST ${API_BASE}/api/v2/public/testimonial/:token (dream-os src/api/public/testimonial.js).
// The server's lines for 400, 429 and 503 are drawn as sent; a used, expired, revoked or unknown link shows its
// one line. The token never leaves this page except to that door.
import { API_BASE } from '@/lib/api';

export const dynamic = 'force-dynamic';

const TOKEN = /^[A-Za-z0-9_-]{20,64}$/;

function page(token: string): string {
  const cfg = JSON.stringify({ api: API_BASE.replace(/\/+$/, ''), token })
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex">
<meta name="referrer" content="no-referrer"><title>Client reviews</title><style>${CSS}</style></head>
<body><main id="m" aria-live="polite"><p class="eyebrow">Client reviews</p><p class="one">The page is loading.</p></main>
<script type="application/json" id="cfg">${cfg}</script><script>${JS}</script></body></html>`;
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const t = TOKEN.test(token || '') ? token : '';
  return new Response(page(t), {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'x-robots-tag': 'noindex',
    },
  });
}

const CSS = `:root{--bg:#f7f4ee;--ink:#1c1a17;--mute:#5f5a52;--line:#d9d2c5;--serif:Georgia,"Times New Roman",serif;--sans:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--pad:clamp(18px,5vw,40px);box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#161512;--ink:#f1ece2;--mute:#b3ab9d;--line:#3a362f}}
:root[data-theme=dark]{--bg:#161512;--ink:#f1ece2;--mute:#b3ab9d;--line:#3a362f}
*,*::before,*::after{box-sizing:inherit}html,body{margin:0;background:var(--bg);color:var(--ink)}body{font:400 16px/1.5 var(--sans)}
main{max-width:560px;margin:0 auto;padding:40px var(--pad) 56px}.eyebrow{font:500 11px/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--mute);margin:0 0 14px}
h1{font:400 clamp(28px,8vw,40px)/1.1 var(--serif);margin:0 0 12px;overflow-wrap:anywhere}.lede{color:var(--mute);margin:0 0 30px}
form{display:flex;flex-direction:column;gap:18px}label{display:flex;flex-direction:column;gap:7px;font:500 11px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
input,textarea,select{font:400 16px/1.4 var(--sans);color:var(--ink);background:transparent;border:1px solid var(--line);border-radius:0;padding:12px;min-height:48px;width:100%;min-width:0;letter-spacing:normal;text-transform:none}
select option{color:#1c1a17}textarea{min-height:150px;resize:vertical}.two{display:flex;gap:10px}.two select{flex:1}
.count{align-self:flex-end;font:400 12.5px var(--sans);letter-spacing:normal;text-transform:none;color:var(--mute)}
.cons{display:flex;flex-direction:row;gap:12px;align-items:flex-start;font:400 14px/1.45 var(--sans);letter-spacing:normal;text-transform:none;color:var(--ink)}
.cons input{width:22px;min-height:22px;height:22px;flex:none;margin:1px 0 0;accent-color:var(--ink)}.cons a{color:var(--ink);text-underline-offset:3px}
.err{font:400 14px/1.4 var(--sans);color:var(--ink);border-left:2px solid var(--ink);padding-left:10px}.err:empty{display:none}
button{font:500 12px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;background:var(--ink);color:var(--bg);border:0;min-height:52px;cursor:pointer}button[disabled]{opacity:.6;cursor:default}
.one{font:400 clamp(20px,5.6vw,24px)/1.35 var(--serif);margin:0}:focus-visible{outline:2px solid var(--ink);outline-offset:2px}`;

const JS = String.raw`(function(){'use strict';
var C=JSON.parse(document.getElementById('cfg').textContent);var M=document.getElementById('m');
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var GONE='This link is not available.',FAILED='Your words could not be saved. Please try again in a moment.';
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function oneLine(x){M.textContent='';M.append(el('p','eyebrow','Client reviews'),el('p','one',x))}
function door(method,body){var url=C.api+'/api/v2/public/testimonial/'+encodeURIComponent(C.token);
  return fetch(url,{method:method,credentials:'omit',cache:'no-store',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined})
  .then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {status:r.status,body:j}})})
  .catch(function(){return {status:0,body:{}}})}
if(!C.token){oneLine(GONE);return}
var ist=new Date(Date.now()+330*60000),NOW_Y=ist.getUTCFullYear(),NOW_M=ist.getUTCMonth()+1;
door('GET').then(function(r){
  if(r.status!==200||!r.body||!r.body.form){oneLine((r.body&&r.body.error)||GONE);return}
  var f=r.body.form,studio=f.studio_name||'the studio';M.textContent='';
  M.append(el('p','eyebrow','Client reviews'),el('h1',null,studio),el('p','lede','Please write a few words about your time with '+studio+". Your words appear on the studio's website after the studio approves them."));
  var form=el('form');form.noValidate=true;
  function field(label,input){var l=el('label',null,label);l.appendChild(input);return l}
  var name=el('input');name.maxLength=40;name.autocomplete='name';if(f.person_name)name.value=f.person_name;
  var occ=el('input');occ.maxLength=40;var place=el('input');place.maxLength=40;
  var mm=el('select');mm.setAttribute('aria-label','Month');mm.appendChild(el('option',null,'Month'));mm.options[0].value='';
  MONTHS.forEach(function(n,i){var o=el('option',null,n);o.value=(i<9?'0':'')+(i+1);mm.appendChild(o)});
  var yy=el('select');yy.setAttribute('aria-label','Year');yy.appendChild(el('option',null,'Year'));yy.options[0].value='';
  for(var y=NOW_Y;y>=1990;y--){var o=el('option',null,String(y));o.value=String(y);yy.appendChild(o)}
  var my=el('div','two');my.append(mm,yy);var ml=el('label',null,'Month and year');ml.appendChild(my);
  var words=el('textarea');words.maxLength=600;var cnt=el('span','count','0 of 600');words.oninput=function(){cnt.textContent=words.value.length+' of 600'};
  var wl=field('Your words',words);wl.appendChild(cnt);
  form.append(field('Your name',name),field('Occasion',occ),ml,field('Place',place),wl);
  var vid=null;if(f.video_allowed===true){vid=el('input');vid.type='url';vid.inputMode='url';vid.placeholder='https://';form.appendChild(field('Video link (YouTube or Instagram)',vid))}
  var cons=el('label','cons'),cb=el('input');cb.type='checkbox';var ct=el('span',null,'I agree that '+studio+' may show my words and name on their website. ');
  var pl=el('a',null,'Privacy');pl.href='https://thedreamwedding.in/privacy';pl.target='_blank';pl.rel='noopener';ct.appendChild(pl);cons.append(cb,ct);
  var err=el('div','err');err.setAttribute('role','alert');var send=el('button',null,'Send');send.type='submit';
  form.append(cons,err,send);M.appendChild(form);
  form.onsubmit=function(e){e.preventDefault();err.textContent='';
    var body={name:name.value.trim(),occasion:occ.value.trim(),month:(yy.value&&mm.value)?yy.value+'-'+mm.value:'',place:place.value.trim(),words:words.value.trim(),consent:cb.checked===true};
    if(vid&&vid.value.trim())body.video_url=vid.value.trim();
    send.disabled=true;door('POST',body).then(function(r2){send.disabled=false;
      if(r2.status===200&&r2.body&&r2.body.ok===true){M.textContent='';M.append(el('p','eyebrow','Client reviews'),el('h1',null,'Thank you.'),el('p','lede',studio+' has received your words. They appear on the website after the studio approves them.'));return}
      if(r2.status===404){oneLine((r2.body&&r2.body.error)||GONE);return}
      err.textContent=(r2.body&&typeof r2.body.error==='string')?r2.body.error:FAILED;err.scrollIntoView({block:'center'})})};
});
})();`;
