'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR, EASE } from '../../../../../../lib/frost/tokens';
import { fetchProfile, saveProfile, type CoupleProfile } from '../../../../../../lib/frost/journey';

const EVENTS = ['Mehendi','Sangeet','Haldi','Reception','Cocktail','Engagement','Other'] as const;
const TIER_PERKS: Record<string,string> = {
  lite:      '10 DreamAi queries · Discovery · Guest list',
  signature: '25 DreamAi queries · Full plan suite · Priority support',
  platinum:  '50 DreamAi queries · Couture access · Memory Box',
};

export default function JourneySettings() {
  const router = useRouter();
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingCity, setWeddingCity] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchProfile().then(p => {
      setProfile(p); setName(p.name || ''); setPartnerName(p.partner_name || '');
      setWeddingDate(p.wedding_date || ''); setWeddingCity(p.wedding_city || '');
    });
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const handleSaveIdentity = async () => {
    setSaving(true);
    const ok = await saveProfile({ name, partner_name: partnerName, wedding_date: weddingDate, wedding_city: weddingCity });
    setSaving(false);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); showToast('Saved.'); }
    else showToast('Could not save. Try again.');
  };

  const logout = () => {
    try { ['couple_session','couple_web_session','access_token','refresh_token','couple_last_path','couple_app_mode'].forEach(k => localStorage.removeItem(k)); } catch {}
    router.replace('/');
  };

  const tier = profile?.tier || 'lite';
  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.06)', border: `0.5px solid ${t.hairline}`,
    borderRadius: FR.md, fontFamily: FF.body, fontSize: 15,
    color: t.ink, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <CanvasShell eyebrow="Settings" backTo="/frost/canvas/journey">
      {toast && (
        <div style={{ position:'fixed', top:'calc(env(safe-area-inset-top)+70px)', left:'50%', transform:'translateX(-50%)', background:t.ink, color:t.pagePaper, fontFamily:FF.label, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', padding:'8px 18px', borderRadius:20, zIndex:300, pointerEvents:'none', whiteSpace:'nowrap' }}>{toast}</div>
      )}
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>

        {/* Identity */}
        <SectionLabel t={t}>Identity</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:SP.m, marginBottom:SP.xl }}>
          {[
            { label:'Your name', val:name, set:setName, placeholder:'Priya' },
            { label:'Partner\'s name', val:partnerName, set:setPartnerName, placeholder:'Rohan' },
            { label:'Wedding date', val:weddingDate, set:setWeddingDate, placeholder:'YYYY-MM-DD', type:'date' },
            { label:'Wedding city', val:weddingCity, set:setWeddingCity, placeholder:'Delhi' },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>{f.label}</div>
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} type={f.type || 'text'} style={inp} />
            </div>
          ))}
          <button onClick={handleSaveIdentity} disabled={saving} style={{ padding:'13px 0', background:saved?`rgba(191,160,77,0.15)`:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:saved?t.brass:'#1B1612', cursor:'pointer', opacity:saving?0.6:1, transition:`background 300ms ${EASE}` }}>
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>

        <div style={{ height:'0.5px', background:t.hairline, opacity:0.4, marginBottom:SP.xl }} />

        {/* Events */}
        <SectionLabel t={t}>Wedding events</SectionLabel>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:SP.xl }}>
          {EVENTS.map(ev => {
            const on = selectedEvents.includes(ev);
            return (
              <button key={ev} onClick={() => setSelectedEvents(prev => on ? prev.filter(x => x !== ev) : [...prev, ev])}
                style={{ padding:'7px 14px', borderRadius:FR.pill, border:`0.5px solid ${on ? t.brass : t.hairline}`, background:on?`rgba(191,160,77,0.12)`:'transparent', fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:on?t.brass:t.soft, cursor:'pointer' }}>
                {ev}
              </button>
            );
          })}
        </div>

        <div style={{ height:'0.5px', background:t.hairline, opacity:0.4, marginBottom:SP.xl }} />

        {/* Account */}
        <SectionLabel t={t}>Account</SectionLabel>
        <FrostedSurface style={{ padding:SP.l, marginBottom:SP.m }}>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:4 }}>Your plan</div>
          <div style={{ display:'flex', alignItems:'center', gap:SP.m }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.brass }}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</div>
            <div style={{ fontFamily:FF.body, fontSize:12, color:t.soft, flex:1 }}>{TIER_PERKS[tier] || ''}</div>
          </div>
        </FrostedSurface>
        {profile?.phone && (
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:SP.xl }}>
            <span style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', marginRight:8 }}>WhatsApp</span>{profile.phone}
          </div>
        )}
        <FrostedSurface onPress={logout} style={{ padding:SP.l }}>
          <div style={{ display:'flex', alignItems:'center', gap:SP.m }}>
            <LogOut size={16} color={'#B8453E'} strokeWidth={1.5} />
            <div style={{ fontFamily:FF.body, fontSize:14, color:'#B8453E' }}>Sign out</div>
          </div>
        </FrostedSurface>
      </div>
    </CanvasShell>
  );
}

function SectionLabel({ children, t }: { children: string; t: any }) {
  return <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>{children}</div>;
}
