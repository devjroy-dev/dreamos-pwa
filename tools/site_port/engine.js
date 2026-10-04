/* TDW site runtime · WEB-3 prototype · one engine, many styles. STYLE is defined by the page before this. */
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const H=document.documentElement;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAIRS={"1": ["\"Bodoni Moda\",Didot,Georgia,serif", "\"Inter Tight\",\"Helvetica Neue\",Arial,sans-serif"], "2": ["\"Cormorant Garamond\",Garamond,Georgia,serif", "\"Manrope\",\"Helvetica Neue\",Arial,sans-serif"], "3": ["\"Italiana\",\"Bodoni Moda\",Didot,serif", "\"Jost\",\"Futura\",\"Helvetica Neue\",sans-serif"], "4": ["\"Marcellus\",Georgia,serif", "\"Mulish\",\"Helvetica Neue\",sans-serif"], "5": ["\"Fraunces\",Georgia,serif", "\"Plus Jakarta Sans\",\"Helvetica Neue\",sans-serif"], "6": ["\"Instrument Serif\",Georgia,serif", "\"Instrument Sans\",\"Helvetica Neue\",Arial,sans-serif"], "7": ["\"Gilda Display\",Georgia,serif", "\"Figtree\",\"Helvetica Neue\",sans-serif"], "8": ["\"Cormorant Garamond\",Garamond,Georgia,serif", "\"Figtree\",\"Helvetica Neue\",sans-serif"]};
const S=Object.assign({trade:'makeup',pal:STYLE.palettes[0][0],font:STYLE.fonts[0][0],motion:'lively',name:'short'},STYLE.defaults||{});
const NAMES={short:STYLE.names?STYLE.names[0]:'Studio Ivara',long:STYLE.names?STYLE.names[1]:'Rukmini Sethi Bridal Artistry'};
function rs(n){if(typeof n!=='number')return n;const s=String(n),l=s.slice(-3),r=s.slice(0,-3);return 'Rs '+(r?r.replace(/\B(?=(\d{2})+(?!\d))/g,',')+',':'')+l}
function mono(n){const stop=['studio','the','by','and','of','bridal','artistry','films','events'];const all=n.split(/\s+/);let w=all.filter(x=>!stop.includes(x.toLowerCase()));if(w.length<2)w=all;return w.slice(0,2).map(x=>x[0]).join('').toUpperCase()}
const SLOW=(()=>{const c=navigator.connection;return !!(c&&(c.saveData||/(^|-)2g|3g/.test(c.effectiveType||'')))})();
function pic(k,o={}){const m=IMG[k];const pr=o.hero?'fetchpriority="high"':o.eager?'':'loading="lazy"';
  const src=(o.hero&&SLOW&&m.a4)?m.a4:m.s;const set=(o.hero&&SLOW)?'':(m.l?`${m.s} 960w, ${m.l} 1600w`:'');
  const S=o.defer?'data-src':'src',SS=o.defer?'data-srcset':'srcset';   /* deferred covers wait for the first cover */
  return `<img class="${o.cls||''}" alt="${o.alt||''}" decoding="async" ${pr} ${S}="${src}" ${set?`${SS}="${set}" sizes="${o.sizes||'100vw'}"`:''} style="object-position:${o.pos||m.pos}">`}
function releaseDeferred(){const go=()=>document.querySelectorAll('img[data-src]').forEach(i=>{if(i.dataset.srcset){i.srcset=i.dataset.srcset;i.removeAttribute('data-srcset')}i.src=i.dataset.src;i.removeAttribute('data-src')});
  const h=document.querySelector('img[fetchpriority=high]');if(!h||h.complete)go();else{h.addEventListener('load',go,{once:true});h.addEventListener('error',go,{once:true})}}
function lq(k){return `--lq:url(${IMG[k].lq})`}

const T={
 makeup:{items:'Looks',item:'look',cats:['New looks','Bridal','Engagement','Reception','Mehendi','Sangeet'],req:'Request this look',
  names:['The Emerald Bride','Rose Mehendi','Maang Tikka Classic','Golden Hour','Palace Morning','Pavilion Evening','The Groom Edit','Kaleere and Chooda'],
  prices:[55000,18000,48000,35000,45000,42000,15000,22000],coll:['The Winter Brides','Mehendi and Haldi','Reception Glam','Destination'],
  price:[['Bridal makeup and hair',45000],['Engagement or reception',25000],['Mehendi or haldi',18000],['Family and bridesmaids, per person',8000],['Trial session',5000]],
  lead:'Makeup that looks like you, on the best day of your life.',desc:'Soft-focus skin, a defined eye and a lip chosen to sit with the jewellery. Built to last from the pheras to the last photograph.',
  inc:['Makeup and hair for the bride','Draping and jewellery setting','Touch-ups through the ceremony','Travel within Delhi NCR'],
  roll:['Mehendi','Haldi','Sangeet','Pheras','Reception']},
 photo:{items:'Work',item:'story',cats:['Latest','Weddings','Pre-wedding','Portraits','Films'],req:'Ask about a similar shoot',
  names:['Aditi and Rohan, Jaipur','Before the pheras','The quiet hour','Reception, Delhi','Palace morning, Udaipur','Pavilion, Gurugram','The groom','Kaleere, close'],
  prices:[250000,60000,90000,150000,300000,220000,40000,60000],coll:['Palace weddings','Mehendi days','Evenings','Destinations'],
  price:[['Wedding day coverage',250000],['Two-day wedding',420000],['Pre-wedding shoot',60000],['Film add-on',90000],['Album, 40 pages',35000]],
  lead:'Photographs that hold the whole day, not only the poses.',desc:'Full-day coverage with two photographers, edited to the studio\'s colour. The whole story, delivered in forty days.',
  inc:['Two photographers, full day','Edited gallery, 600 photographs','Private online gallery for the family','Travel within Delhi NCR'],
  roll:['Weddings','Portraits','Films','Pre-wedding']},
 performer:{items:'Acts',item:'act',cats:['Latest','Sangeet','Baraat','Reception','Corporate'],req:'Request this act',video:true,
  names:['Sangeet Live, full band','The Mehendi Set','Sufi Night','Golden Hour Unplugged','Palace Baraat','Pavilion Jazz','Groom Entry','Kaleere Ceremony Song'],
  prices:[150000,60000,120000,80000,180000,110000,40000,30000],coll:['Sangeet sets','Mehendi music','Reception bands','Destination acts'],
  price:[['Sangeet, two hours',150000],['Reception set',120000],['Mehendi acoustic',60000],['Baraat band',90000],['Travel within NCR','Included']],
  lead:'Music that fills the floor and keeps it full.',desc:'A live set built around the family\'s songs, with sound and lights. The full film plays on YouTube.',
  inc:['Six musicians and a singer','Sound and stage lights','Two rehearsals with the family','Travel within Delhi NCR'],
  roll:['Sangeet','Baraat','Sufi','Reception','Unplugged']},
 planner:{items:'Events',item:'event',cats:['Recent','Palace','Destination','Intimate','Décor'],req:'Plan an event like this',
  names:['The Emerald Wedding','A mehendi afternoon','Sangeet in the courtyard','Golden hour reception','Palace morning pheras','Pavilion dinner','The groom\'s arrival','Chooda ceremony'],
  prices:[1500000,300000,600000,900000,2500000,800000,200000,150000],coll:['Palace weddings','Lakeside','Intimate','Farmhouse'],
  price:[['Full wedding planning',1500000],['Destination planning',2500000],['Day coordination',300000],['Décor only',600000],['First consultation','Free']],
  lead:'Weddings planned to the minute, so you can be in every one of them.',desc:'Venue, vendors, décor and the running order, planned and run by the studio on the day.',
  inc:['Venue and vendor shortlist','Budget and running order','The studio\'s team on the day','Guest travel desk'],
  roll:['Palace','Lakeside','Courtyard','Farmhouse']}
};
const PH=STYLE.pairs||[['green-necklace','kundan'],['veil-hands','mehendi'],['tikka','kaleere'],['pastel-saree','sikh-couple'],['arch','staircase'],['pavilion','pink-stair'],['sherwani','sikh-couple'],['kaleere','veil-hands']];
const REVIEWS=[['She understood my face in ten minutes. On the day I cried twice and nothing moved.','Ananya · Udaipur, February 2026'],
 ['Calm, on time, and the trial was exactly what I wore on the day. My mother wants her for my sister.','Ira · New Delhi, December 2025'],
 ['Every photograph from the reception looks like me, only rested. That is all I wanted.','Sana · Gurugram, March 2026']];
const FAQ=[['How far ahead should I book?','Most brides book four to eight months ahead. Winter weekends go first.'],['Do you travel for destination weddings?','Yes. Travel and stay are quoted with the booking.'],['Is a trial included?','A trial is booked separately and adjusted against the final package.'],['How do I hold my date?','Ask about your date here. The studio confirms on WhatsApp and a deposit holds it.']];
const HEART='<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1z"/></svg>';
const PLAY='<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>';
const W=()=>T[S.trade];
const looks=()=>PH.map((p,i)=>({i,a:p[0],b:p[1],name:W().names[i],price:W().prices[i],cat:W().cats[1+(i%(W().cats.length-1))]}));
const heartBtn=(i,cls='')=>`<button class="hbtn ${cls} ${liked.has(i)?'on':''}" data-like="${i}" aria-label="Save">${HEART}<span class="burst">${[0,60,120,180,240,300].map(r=>`<i style="--r:${r}deg"></i>`).join('')}</span></button>`;
const words=(t)=>t.split(' ').map((w,j)=>`<span class="w" style="--i:${j}">${w}</span>`).join(' ');
const lines=(t,n)=>{const w=t.split(' ');if(w.length<4||n===1)return `<span class="ln"><span>${t}</span></span>`;const h=Math.ceil(w.length/2);return [w.slice(0,h).join(' '),w.slice(h).join(' ')].map((l,i)=>`<span class="ln"><span style="transition-delay:${.08+i*.1}s">${l}</span></span>`).join('')};
let liked=new Set();

/* shared chrome: look page, Eliza, menu, tray */
document.body.insertAdjacentHTML('beforeend',`
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-label="Menu"><button class="x" id="drawerX"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg><span>Close</span></button><nav id="dnav"></nav><div class="dfoot"><a href="#top">Instagram</a><a href="#top">WhatsApp</a><span>New Delhi · Gurugram</span></div></aside>
<div class="lp" id="lp" role="dialog" aria-modal="true"><div class="top" id="lpTop"><button class="back" id="lpBack"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><span>Back</span></button><span id="lpHeartSlot"></span></div>
 <div class="wrap"><div class="gal"><div class="strip" id="strip"></div><div class="dots" id="gDots"></div><div class="ctr" id="gCtr"></div></div><div class="body" id="lpBody"></div></div></div>
<aside class="ez" id="ez" aria-label="Enquiry"><div class="eh"><span class="emono" id="ezMono"></span><div class="t"><b id="ezName"></b><span>Enquiries · replies in minutes</span></div><button class="x" id="ezX" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div><div class="msgs" id="msgs"></div><div class="ef">An automated assistant for the studio. The studio replies personally on WhatsApp.</div></aside>
<div class="pt" id="pt"><button id="ptBtn"><i></i>Prototype · ${STYLE.title}</button><div class="pan" id="ptPan"></div></div>`);

function tray(){const g=(k,label,opts)=>`<div class="g"><span>${label}</span><div data-k="${k}">${opts.map(o=>`<button data-v="${o[0]}">${o[1]}</button>`).join('')}</div></div>`;
 $('#ptPan').innerHTML=g('trade','Trade (words follow her trade)',[['makeup','Makeup'],['photo','Photographer'],['performer','Performer'],['planner','Planner']])+g('pal','Palette',STYLE.palettes)+g('font','Type',STYLE.fonts)+g('motion','Motion',[['calm','Calm'],['lively','Lively'],['cinema','Cinematic']])+(STYLE.toggles||[]).map(t=>g(t[0],t[1],[['on','On'],['off','Off']])).join('')+g('name','Studio name',[['short','Short'],['long','Long']])+`<small>Prototype controls, not part of the site. Photographs: Pexels set for mocks. Studio names and reviews are invented. The date check is simulated.</small>`;
 $$('.pt [data-k] button').forEach(b=>b.onclick=()=>{const k=b.parentElement.dataset.k;S[k]=b.dataset.v;apply();paint();if(k==='trade'||k==='name'){closeLook();build();releaseDeferred()}else{(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{fitAll();STYLE.restyle&&STYLE.restyle(S)})}});
 paint()}
function paint(){$$('.pt [data-k]').forEach(g=>g.querySelectorAll('button').forEach(b=>b.classList.toggle('on',S[g.dataset.k]===b.dataset.v)))}
function apply(){H.dataset.pal=S.pal;H.dataset.font=S.font;const pr=PAIRS[S.font];if(pr){H.style.setProperty('--serif',pr[0]);H.style.setProperty('--sans',pr[1])}H.dataset.trade=S.trade;H.dataset.motion=S.motion;(STYLE.toggles||[]).forEach(t=>H.dataset[t[0]]=S[t[0]]);H.classList.toggle('calm',S.motion==='calm');H.classList.toggle('cinema',S.motion==='cinema')}
$('#ptBtn').onclick=()=>$('#pt').classList.toggle('open');
if(/rec=1/.test(location.search))$('#pt').style.display='none';

/* fitting: nothing leaves its box; long names fall back to the monogram */
function fitLine(el,min,max){if(!el)return;el.style.fontSize='';const cs=getComputedStyle(el);let f=max||parseFloat(cs.fontSize);const box=el.parentElement.getBoundingClientRect().width-parseFloat(getComputedStyle(el.parentElement).paddingLeft)-parseFloat(getComputedStyle(el.parentElement).paddingRight);
 const tr=el.style.transition;el.style.transition='none';el.style.whiteSpace='nowrap';el.style.display='inline-block';el.style.fontSize=f+'px';let g=0;
 while(el.getBoundingClientRect().width>box-2&&f>min&&g++<500){f-=.5;el.style.fontSize=f+'px'}
 const ok=el.getBoundingClientRect().width<=box-2;el.style.display='';el.style.transition=tr;if(!ok){el.style.whiteSpace='normal'}return ok}
function fitHeader(){const hd=$('#hd');if(!hd)return;const wm=hd.querySelector('.wmt');if(!wm)return;hd.classList.remove('use-mono');H.classList.remove('use-mono');wm.style.fontSize='';wm.style.width='max-content';wm.style.flex='none';
 const cs=getComputedStyle(hd);const lw=hd.querySelector('.l').getBoundingClientRect().width,rw=hd.querySelector('.r').getBoundingClientRect().width;const room=Math.min(STYLE.wmMax||1e9,hd.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-2*Math.max(lw,rw)-24);let f=parseFloat(getComputedStyle(wm).fontSize);const min=STYLE.wmMin||11;
 while(wm.getBoundingClientRect().width>room&&f>min){f-=.5;wm.style.fontSize=f+'px'}if(wm.getBoundingClientRect().width>room){hd.classList.add('use-mono');H.classList.add('use-mono')}else H.classList.remove('use-mono')}
function fitAll(){fitHeader();$$('[data-fit]').forEach(el=>{const [mn,mx]=(el.dataset.fit||'18,').split(',');fitLine(el,+mn,mx?+mx:0)});
 $$('[data-fill]').forEach(el=>{const box=el.parentElement.clientWidth-parseFloat(getComputedStyle(el.parentElement).paddingLeft)-parseFloat(getComputedStyle(el.parentElement).paddingRight);el.style.transition='none';el.style.display='inline-block';el.style.whiteSpace='nowrap';let f=12;el.style.fontSize=f+'px';let g=0;while(el.getBoundingClientRect().width<box-4&&f<(+el.dataset.fill||260)&&g++<600){f+=1;el.style.fontSize=f+'px'}while(el.getBoundingClientRect().width>box&&f>14){f-=1;el.style.fontSize=f+'px'}el.style.display='block';void el.offsetWidth;el.style.transition=''});
 $$('.fitlines').forEach(h=>{h.style.fontSize='';let f=parseFloat(getComputedStyle(h).fontSize);const bx=h.getBoundingClientRect().width;let g=0;while([...h.querySelectorAll('.ln>span')].some(p=>p.getBoundingClientRect().width>bx+1)&&f>22&&g++<80){f-=1;h.style.fontSize=f+'px'}});
 qHeight()}

/* reveals */
let io;function observe(){if(io)io.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});$$('.rv').forEach(el=>RM?el.classList.add('in'):io.observe(el))}

/* hearts */
function toggleLike(i){const on=!liked.has(i);on?liked.add(i):liked.delete(i);$$(`[data-like="${i}"]`).forEach(b=>{b.classList.toggle('on',on);b.classList.remove('pop');void b.offsetWidth;if(on)b.classList.add('pop')});
 $$('[data-hc]').forEach(x=>x.textContent=liked.size);$$('[data-hh]').forEach(h=>{h.classList.toggle('has',liked.size>0);h.classList.remove('bump');void h.offsetWidth;h.classList.add('bump')})}

/* quotes: fully readable before any change */
let rot=0,qT=null,qSeen=false,qHeld=false;
function qHTML(){return REVIEWS.map((r,i)=>`<div class="q ${i?'':'on'}"><p>${words(r[0])}</p><div class="by">${r[1]}</div></div>`).join('')}
function qHeight(){const w=$('#qwrap');if(!w)return;let h=0;$$('.q').forEach(q=>h=Math.max(h,q.offsetHeight));w.style.height=h+'px'}
function qDwell(){const q=$$('.q')[rot];const n=q?q.querySelectorAll('.w').length:20;return 1200+n*32+Math.max(6000,n*380)}
function qArm(){clearTimeout(qT);if(RM||!qSeen||qHeld)return;qT=setTimeout(()=>nextQ(1,true),qDwell())}
function nextQ(d,auto){const qs=$$('.q');if(!qs.length)return;rot=(rot+d+qs.length)%qs.length;qs.forEach((q,i)=>q.classList.toggle('on',i===rot));const c=$('#qCt');if(c)c.textContent=(rot+1)+' / '+qs.length;if(!auto)qHeld=true;qArm();STYLE.onQuote&&STYLE.onQuote(rot)}

/* look page */
let lpIndex=-1;
function openLook(i,fromEl){const w=W(),L=looks()[i];lpIndex=i;const gal=[L.a,L.b,(STYLE.covers||['green-necklace'])[i%(STYLE.covers||[1]).length]];
 $('#strip').innerHTML=gal.map(k=>`<div class="ph" style="${lq(k)}">${pic(k,{eager:true,sizes:'(min-width:1024px) 30vw, 100vw'})}</div>`).join('');
 $('#gDots').innerHTML=gal.map((_,j)=>`<i class="${j?'':'on'}"></i>`).join('');$('#gCtr').textContent='1 / '+gal.length;
 $('#lpHeartSlot').innerHTML=heartBtn(i,'lph');
 const other=looks().filter(x=>x.i!==i).slice(0,5);
 $('#lpBody').innerHTML=`<span class="crumb">${w.items} / ${L.cat}</span><h1 class="lpt">${L.name}</h1><div class="from">From ${rs(L.price)}</div><p class="desc">${w.desc}</p>
  <a class="btn btn-main" href="https://wa.me/?text=${encodeURIComponent('Hello '+NAMES[S.name]+', I would like to ask about "'+L.name+'" for my wedding.')}" target="_blank" rel="noopener"><span>${w.req}</span><span class="ar">→</span></a>
  <button class="btn btn-alt" data-eliza><span>Check your date</span></button>
  <div class="blk"><div class="bh">What's included</div><ul class="inc">${w.inc.map(x=>`<li>${x}</li>`).join('')}</ul></div>
  <div class="blk"><div class="bh">Credits</div><ul class="cred"><li><span>Outfit</span><a href="#top">Label Noor · TDW</a></li><li><span>Jewellery</span><a href="#top">Kundan House · TDW</a></li><li><span>Photograph</span><a href="#top">Frame and Field · TDW</a></li></ul></div>
  <div class="blk also"><div class="bh">Complete the ${w.item}</div><div class="arail">${other.map(o=>`<a class="acard" href="#" data-open="${o.i}"><div class="ph" style="${lq(o.a)}">${pic(o.a,{sizes:'40vw'})}</div><b>${o.name}</b></a>`).join('')}</div></div>`;
 const lp=$('#lp');lp.scrollTop=0;document.body.style.overflow='hidden';
 const mode=RM?'none':(STYLE.lookOpen||'flip');
 if(mode==='flip'&&fromEl){const src=fromEl.querySelector('img'),r=src.getBoundingClientRect();const f=document.createElement('img');f.className='fly';f.src=src.currentSrc||src.src;Object.assign(f.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',objectPosition:src.style.objectPosition});document.body.appendChild(f);
  lp.style.transition='none';lp.classList.add('on');lp.style.opacity=0;const t=$('#strip .ph').getBoundingClientRect();
  requestAnimationFrame(()=>{Object.assign(f.style,{left:t.left+'px',top:t.top+'px',width:t.width+'px',height:t.height+'px'});setTimeout(()=>{lp.style.transition='opacity .35s ease';lp.style.opacity=1;setTimeout(()=>f.remove(),380)},720*(S.motion==='cinema'?1.4:S.motion==='calm'?.7:1))})}
 else{lp.style.transition='';lp.classList.remove('on');void lp.offsetWidth;lp.style.opacity='';lp.classList.add('on')}
 if(!RM)$$('#lpBody > *').forEach((el,j)=>el.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:760,delay:(mode==='flip'?480:260)+j*60,easing:'cubic-bezier(.22,.8,.2,1)',fill:'both'}));
 const strip=$('#strip');strip.onscroll=()=>{const j=Math.round(strip.scrollLeft/strip.clientWidth);$('#gCtr').textContent=(j+1)+' / '+gal.length;$$('#gDots i').forEach((d,x)=>d.classList.toggle('on',x===j))};
 lp.onscroll=()=>$('#lpTop').classList.toggle('solid',lp.scrollTop>innerWidth*1.05);
 $$('#lpBody [data-open]').forEach(a=>a.onclick=e=>{e.preventDefault();openLook(+a.dataset.open,a)});
 $$('#lp [data-eliza]').forEach(b=>b.onclick=openEliza);$$('#lp [data-like]').forEach(b=>b.onclick=e=>{e.stopPropagation();toggleLike(+b.dataset.like)});
 history.replaceState(null,'','#'+w.item+'/'+i)}
function closeLook(){const lp=$('#lp');if(!lp.classList.contains('on'))return;lp.classList.add('closing');setTimeout(()=>{lp.classList.remove('on','closing');lp.style.opacity=''},RM?0:450);document.body.style.overflow='';lpIndex=-1;history.replaceState(null,'','#')}

/* Eliza */
function openEliza(e){if(e&&e.preventDefault)e.preventDefault();const name=NAMES[S.name],h=new Date().getHours(),greet=h<12?'Good morning':h<17?'Good afternoon':'Good evening';$('#msgs').innerHTML='';
 say(`${greet}. Welcome to ${name}.`,0);say(`Which date is your wedding? I can check the studio's calendar now.`,500,`<div class="dt"><input type="date" id="ezDate" value="2027-02-14" aria-label="Wedding date"><button class="btn btn-main" id="ezCheck"><span>Check</span></button></div>`);
 $('#ez').classList.add('on');$('#scrim').classList.add('on');setTimeout(()=>{const b=$('#ezCheck');if(b)b.onclick=check},560)}
function say(t,d,extra='',cls='s'){setTimeout(()=>{const m=document.createElement('div');m.className='m '+cls;m.innerHTML=t+extra;$('#msgs').appendChild(m);$('#msgs').scrollTop=1e6},d)}
function check(){const v=$('#ezDate').value;const d=v?new Date(v+'T00:00'):null;const txt=d?d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):'that date';
 say(txt,0,'','u');say('<span class="checking">Checking the calendar <i></i><i></i><i></i></span>',250);
 setTimeout(()=>{$('#msgs').lastChild.remove();say(`${txt} is open.`,0);say(`Would you like a short call with the studio to hold it?`,450,`<div class="chips"><button class="chip">Today, 6 pm</button><button class="chip">Tomorrow, 11 am</button><button class="chip">Tomorrow, 4 pm</button></div><div class="chips"><a class="chip" href="https://wa.me/?text=${encodeURIComponent('Hello '+NAMES[S.name]+', I checked '+txt+' on your website.')}" target="_blank" rel="noopener">Continue on WhatsApp</a></div>`);
  setTimeout(()=>$$('#msgs button.chip').forEach(c=>c.onclick=()=>{c.classList.add('on');say(c.textContent,100,'','u');say(`Booked. The studio will call you ${c.textContent.toLowerCase()}. A confirmation will come on WhatsApp.`,700)}),520)},1500)}
function closeEliza(){$('#ez').classList.remove('on');if(!$('#drawer').classList.contains('on'))$('#scrim').classList.remove('on')}

/* menu */
function openMenu(){$('#drawer').classList.add('on');$('#scrim').classList.add('on');H.classList.add('menu-open')}
function closeMenu(){$('#drawer').classList.remove('on');H.classList.remove('menu-open');if(!$('#ez').classList.contains('on'))$('#scrim').classList.remove('on')}
$('#drawerX').onclick=closeMenu;$('#scrim').onclick=()=>{closeMenu();closeEliza()};$('#ezX').onclick=closeEliza;$('#lpBack').onclick=closeLook;

/* scroll loop */
let tick=false;function onScroll(){if(tick)return;tick=true;requestAnimationFrame(()=>{tick=false;const y=scrollY;const hd=$('#hd');if(hd)hd.classList.toggle('solid',y>(STYLE.solidAt?STYLE.solidAt():innerHeight*.8));if(STYLE.scroll)STYLE.scroll(y,{RM,S})})}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',()=>{fitAll();STYLE.resize&&STYLE.resize()});

/* build */
function build(){const w=W(),name=NAMES[S.name];apply();
 STYLE.render({w,name,looks:looks(),rs,pic,lq,mono,heartBtn,words,lines,qHTML,REVIEWS,FAQ,PLAY,HEART,S,IMG,T});
 $$('[data-name]').forEach(e=>e.textContent=name);$$('[data-mono]').forEach(e=>e.textContent=mono(name));$$('[data-items]').forEach(e=>e.textContent=w.items);
 $('#ezMono').textContent=mono(name);$('#ezName').textContent=name;
 $('#dnav').innerHTML=[w.items,'Collections','Journal','Pricing','The studio','Kind words','Questions','Enquire'].map((t,i)=>`<a href="${['#looks','#collections','#top','#pricing','#story','#reviews','#faq','#enq'][i]}" style="--i:${i}"><em>0${i+1}</em>${t}</a>`).join('');
 $$('#dnav a').forEach(a=>a.onclick=e=>{closeMenu();if(a.getAttribute('href')==='#enq'){e.preventDefault();setTimeout(openEliza,400)}});
 $$('[data-eliza]').forEach(b=>b.onclick=openEliza);$$('[data-menu]').forEach(b=>b.onclick=openMenu);
 $$('.card[data-i]').forEach(c=>c.onclick=e=>{if(e.target.closest('[data-like]'))return;e.preventDefault();openLook(+c.dataset.i,c)});
 $$('[data-like]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();toggleLike(+b.dataset.like)});
 $$('[data-hh]').forEach(h=>h.onclick=()=>{const l=document.getElementById('looks');l&&l.scrollIntoView({behavior:RM?'auto':'smooth'})});
 $$('.fq button').forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));
 const qp=$('#qPrev'),qn=$('#qNext');if(qp)qp.onclick=()=>nextQ(-1);if(qn)qn.onclick=()=>nextQ(1);rot=0;qHeld=false;
 const rv=$('#reviews');if(rv)new IntersectionObserver(es=>es.forEach(e=>{qSeen=e.isIntersecting&&e.intersectionRatio>.5;qSeen?qArm():clearTimeout(qT)}),{threshold:[0,.5,1]}).observe(rv);
 (STYLE.over||[]).forEach(q=>$$(q).forEach(e=>e.setAttribute('data-over','')));fitAll();observe();STYLE.after&&STYLE.after({RM,S,W:w});onScroll();requestAnimationFrame(()=>requestAnimationFrame(fitAll));setTimeout(fitAll,350)}
tray();apply();
build();H.classList.add('ready');releaseDeferred();   /* the page never waits for its fonts: fallback face first, web font swapped in */
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{fitAll()});
window.__proto={fitAll,S,openLook,closeLook,openEliza,closeEliza,openMenu,closeMenu,toggleLike,nextQ,set:(k,v)=>{const b=document.querySelector(`.pt [data-k="${k}"] [data-v="${v}"]`);b&&b.click()},style:STYLE};
})();
