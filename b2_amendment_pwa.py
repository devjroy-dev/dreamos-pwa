#!/usr/bin/env python3
"""
B-2 amendment — dreamos-pwa: MuseSave type + FullBleedOverlay vendor overlay
Run from dreamos-pwa Codespace: python3 b2_amendment_pwa.py
"""
import sys

# ── 1. Update MuseSave type ───────────────────────────────────────────────────
types_path = 'lib/types/discover.ts'
with open(types_path, 'r') as f:
    types = f.read()

old_type = """export interface MuseSave {
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
}"""

new_type = """export interface MuseSave {
  id:                    string;
  save_number:           number;
  image_url:             string | null;
  source_type:           'vendor' | 'photo' | 'link';
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
}"""

if old_type not in types:
    print('ERROR: MuseSave type not found'); sys.exit(1)
with open(types_path, 'w') as f:
    f.write(types.replace(old_type, new_type, 1))
print('lib/types/discover.ts: MuseSave updated ✓')

# ── 2. Replace FullBleedOverlay in muse/page.tsx ──────────────────────────────
muse_path = 'app/(frost)/frost/canvas/muse/page.tsx'
with open(muse_path, 'r') as f:
    muse = f.read()

old_overlay = """function FullBleedOverlay({
  save, activity, onClose,
}: {
  save: MuseSave;
  activity: MuseActivity[];
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0C0A09', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        {save.image_url ? (
          <img src={save.image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#1a1714', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: 'rgba(248,247,245,0.2)' }}>No image</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 16px)', left: 16, zIndex: 55, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '0.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {save.vendor_name && (
          <div style={{ position: 'absolute', bottom: 80, left: 20, right: 20 }}>
            <p style={{ fontFamily: FF.display, fontSize: 22, fontWeight: 300, color: '#F8F7F5', margin: 0 }}>{save.vendor_name}</p>
          </div>
        )}
      </div>

      {activity.length > 0 && (
        <div
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'rgba(12,10,9,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: expanded ? '20px 20px calc(env(safe-area-inset-bottom,0px) + 20px)' : '14px 20px calc(env(safe-area-inset-bottom,0px) + 14px)', cursor: 'pointer', transition: 'padding 240ms ease' }}
        >
          {!expanded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C' }} />
              <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.6)' }}>
                {activity.length} circle interaction{activity.length !== 1 ? 's' : ''} \\u00b7 tap to see
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.4)', marginBottom: 4 }}>Circle Activity</span>
              {activity.map(a => (
                <div key={a.id}>
                  <span style={{ fontFamily: FF.body, fontSize: 12, fontWeight: 400, color: 'rgba(248,247,245,0.8)' }}>{a.member_name}</span>
                  <span style={{ fontFamily: FF.body, fontSize: 12, fontWeight: 300, color: 'rgba(248,247,245,0.5)' }}>
                    {a.activity_type === 'comment' && a.content ? `: "${a.content}"` : ` ${a.activity_type.replace(/_/g, ' ')}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activity.length === 0 && (
        <div style={{ height: 'calc(env(safe-area-inset-bottom,0px) + 20px)' }} />
      )}
    </div>
  );
}"""

new_overlay = """function FullBleedOverlay({
  save, activity, onClose, onRemove,
}: {
  save: MuseSave;
  activity: MuseActivity[];
  onClose: () => void;
  onRemove: (saveId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const handleEnquire = () => {
    if (save.enquire_link) window.open(save.enquire_link, '_blank');
  };

  const handleShare = async () => {
    if (!save.enquire_link) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${save.vendor_name || 'Vendor'} \u2014 The Dream Wedding`,
          text: `Check out ${save.vendor_name || 'this vendor'} on TDW`,
          url: save.enquire_link,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(save.enquire_link);
        setCopyToast(true);
        setTimeout(() => setCopyToast(false), 2000);
      } catch {}
    }
  };

  const handleRemove = () => onRemove(save.id);

  const isVendorSave = save.source_type === 'vendor';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0C0A09', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }} onClick={() => isVendorSave && setOverlayVisible(v => !v)}>
        {save.image_url ? (
          <img src={save.image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#1a1714', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: 'rgba(248,247,245,0.2)' }}>No image</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

        <button
          onClick={e => { e.stopPropagation(); onClose(); }}
          style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 16px)', left: 16, zIndex: 55, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '0.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {isVendorSave && !overlayVisible && (
          <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Tap to see vendor</span>
          </div>
        )}

        {copyToast && (
          <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 60px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(12,10,9,0.8)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: '6px 16px', fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.9)', whiteSpace: 'nowrap' }}>
            Link copied
          </div>
        )}
      </div>

      {isVendorSave && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
          transform: overlayVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 340ms cubic-bezier(0.22,1,0.36,1)',
          background: 'rgba(12,10,9,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px 20px 0 0',
          paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
          </div>
          <div style={{ padding: '0 24px' }}>
            <p style={{ fontFamily: FF.label, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.5)', margin: '0 0 8px' }}>
              {save.vendor_category}&nbsp;\u00b7&nbsp;{save.vendor_city}
            </p>
            <h2 style={{ fontFamily: FF.display, fontSize: 26, fontWeight: 300, color: '#F8F7F5', margin: '0 0 4px', lineHeight: 1.1 }}>
              {save.vendor_name}
            </h2>
            {save.vendor_starting_price && (
              <p style={{ fontFamily: FF.body, fontSize: 13, fontWeight: 300, color: 'rgba(248,247,245,0.5)', margin: '0 0 8px' }}>
                {save.vendor_starting_price >= 100000
                  ? `Rs ${(save.vendor_starting_price / 100000).toFixed(save.vendor_starting_price % 100000 === 0 ? 0 : 1)}L onwards`
                  : `Rs ${(save.vendor_starting_price / 1000).toFixed(0)}K onwards`}
              </p>
            )}
            {save.vendor_vibe_tags.length > 0 && (
              <p style={{ fontFamily: FF.label, fontSize: 9, color: 'rgba(248,247,245,0.45)', letterSpacing: '0.12em', margin: '0 0 20px' }}>
                {save.vendor_vibe_tags.join(' \u00b7 ')}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={handleEnquire} style={{ width: '100%', padding: '14px 0', background: 'rgba(248,247,245,0.9)', border: 'none', borderRadius: 10, fontFamily: FF.label, fontSize: 10, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#111111', cursor: 'pointer', touchAction: 'manipulation' }}>
                Enquire \u2197
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleShare} style={{ flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.18)', borderRadius: 10, fontFamily: FF.label, fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.7)', cursor: 'pointer', touchAction: 'manipulation' }}>
                  Share \u2197
                </button>
                <button onClick={handleRemove} style={{ flex: 1, padding: '12px 0', background: 'rgba(184,69,62,0.15)', border: '0.5px solid rgba(184,69,62,0.3)', borderRadius: 10, fontFamily: FF.label, fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(220,100,90,0.9)', cursor: 'pointer', touchAction: 'manipulation' }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isVendorSave && (
        <div style={{ background: 'rgba(12,10,9,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: '16px 20px calc(env(safe-area-inset-bottom,0px) + 16px)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleShare} style={{ flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.18)', borderRadius: 10, fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.7)', cursor: 'pointer' }}>Share \u2197</button>
            <button onClick={handleRemove} style={{ flex: 1, padding: '12px 0', background: 'rgba(184,69,62,0.15)', border: '0.5px solid rgba(184,69,62,0.3)', borderRadius: 10, fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(220,100,90,0.9)', cursor: 'pointer' }}>Remove</button>
          </div>
        </div>
      )}

      {activity.length > 0 && (
        <div
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'rgba(12,10,9,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: expanded ? '20px 20px calc(env(safe-area-inset-bottom,0px) + 20px)' : '14px 20px calc(env(safe-area-inset-bottom,0px) + 14px)', cursor: 'pointer', transition: 'padding 240ms ease' }}
        >
          {!expanded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C' }} />
              <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.6)' }}>
                {activity.length} circle interaction{activity.length !== 1 ? 's' : ''} \u00b7 tap to see
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.4)', marginBottom: 4 }}>Circle Activity</span>
              {activity.map(a => (
                <div key={a.id}>
                  <span style={{ fontFamily: FF.body, fontSize: 12, fontWeight: 400, color: 'rgba(248,247,245,0.8)' }}>{a.member_name}</span>
                  <span style={{ fontFamily: FF.body, fontSize: 12, fontWeight: 300, color: 'rgba(248,247,245,0.5)' }}>
                    {a.activity_type === 'comment' && a.content ? `: "${a.content}"` : ` ${a.activity_type.replace(/_/g, ' ')}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activity.length === 0 && !isVendorSave && (
        <div style={{ height: 'calc(env(safe-area-inset-bottom,0px) + 8px)' }} />
      )}
    </div>
  );
}"""

if old_overlay not in muse:
    print('ERROR: FullBleedOverlay not found in muse/page.tsx'); sys.exit(1)
muse = muse.replace(old_overlay, new_overlay, 1)

# Wire onRemove to FullBleedOverlay call
old_call = """      {selectedSave && (
        <FullBleedOverlay
          save={selectedSave}
          activity={saveActivity}
          onClose={() => { setSelectedSave(null); setSaveActivity([]); }}
        />
      )}"""
new_call = """      {selectedSave && (
        <FullBleedOverlay
          save={selectedSave}
          activity={saveActivity}
          onClose={() => { setSelectedSave(null); setSaveActivity([]); }}
          onRemove={async (saveId) => {
            const ok = await deleteMuseSave(saveId);
            if (ok) {
              setSaves(prev => prev.filter(s => s.id !== saveId));
              setSelectedSave(null);
              setSaveActivity([]);
            }
          }}
        />
      )}"""
if old_call not in muse:
    print('ERROR: FullBleedOverlay call not found'); sys.exit(1)
muse = muse.replace(old_call, new_call, 1)

with open(muse_path, 'w') as f:
    f.write(muse)
print('muse/page.tsx: FullBleedOverlay updated ✓')

print('\nAll done. Now run:')
print('  npx tsc --noEmit')
print('  git add lib/types/discover.ts "app/(frost)/frost/canvas/muse/page.tsx"')
print('  git commit -m "feat(bride): muse full-bleed vendor overlay, enquire, share, remove"')
print('  git push')
