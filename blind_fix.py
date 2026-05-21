#!/usr/bin/env python3
"""
Blind mode fix — flat photo queue across all vendors
Run from dreamos-pwa Codespace: python3 blind_fix.py
"""
import sys

path = 'app/(frost)/frost/canvas/discover/page.tsx'
with open(path, 'r') as f:
    content = f.read()

fixes = [
    (
        "  const [blindHint, setBlindHint] = useState<'left'|'right'|null>(null);",
        "  const [blindHint, setBlindHint] = useState<'dismiss'|null>(null);\n  const [blindIdx, setBlindIdx] = useState(0);"
    ),
    (
        "  const vendor = vendors[vendorIdx];",
        """  // Blind queue: flat list of {vendorId, imageUrl} across all vendors x all photos
  const blindQueue = React.useMemo(() => {
    const q: { vendorId: string; imageUrl: string; vendorObj: DiscoverVendor }[] = [];
    vendors.forEach(v => {
      if (v.photos.length === 0) {
        q.push({ vendorId: v.id, imageUrl: '', vendorObj: v });
      } else {
        v.photos.forEach(p => q.push({ vendorId: v.id, imageUrl: p, vendorObj: v }));
      }
    });
    return q;
  }, [vendors]);

  const vendor = vendors[vendorIdx];"""
    ),
    (
        """    if (isBlind) {
      // Blind mode: swipe up → next vendor. No carousel, no left/right.
      if (absY > absX && dy < -SWIPE_THRESHOLD) {
        goNextVendor();
      }
      return;
    }""",
        """    if (isBlind) {
      // Blind mode: swipe up → next photo in flat queue. No carousel, no left/right.
      if (absY > absX && dy < -SWIPE_THRESHOLD) {
        setBlindHint('dismiss');
        setTimeout(() => setBlindHint(null), 500);
        setBlindIdx(i => Math.min(i + 1, blindQueue.length - 1));
        setDissolveKey(k => k + 1);
        haptic(5);
      }
      return;
    }"""
    ),
    (
        """  const handleDoubleTap = useCallback(() => {
    if (!vendor) return;
    spawnHeart();
    handleSaveToMuse(vendor.id, currentPhotoRef.current).then(ok => spawnSaveToast(!ok));
  }, [vendor]);""",
        """  const handleDoubleTap = useCallback(() => {
    if (isBlind) {
      const item = blindQueue[blindIdx];
      if (!item) return;
      spawnHeart();
      handleSaveToMuse(item.vendorId, item.imageUrl || null).then(ok => spawnSaveToast(!ok));
      return;
    }
    if (!vendor) return;
    spawnHeart();
    handleSaveToMuse(vendor.id, currentPhotoRef.current).then(ok => spawnSaveToast(!ok));
  }, [isBlind, vendor, blindQueue, blindIdx]);"""
    ),
    (
        """function BlindCentreToast({ hint }: { hint: 'left'|'right'|null }) {
  if (!hint) return null;
  return (
    <div style={{ position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:30,pointerEvents:'none',animation:'heartPop 600ms cubic-bezier(0.22,1,0.36,1) forwards' }}>
      <span style={{ fontSize:72,lineHeight:1,color:'#C9A84C' }}>
        {hint === 'right' ? '\\u2665' : '\\u2715'}
      </span>
    </div>
  );
}""",
        """function BlindCentreToast({ hint }: { hint: 'dismiss'|null }) {
  if (!hint) return null;
  return (
    <div style={{ position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:30,pointerEvents:'none',animation:'heartPop 500ms cubic-bezier(0.22,1,0.36,1) forwards' }}>
      <span style={{ fontSize:72,lineHeight:1,color:'#C9A84C' }}>\u2715</span>
    </div>
  );
}"""
    ),
    (
        "  const photos = vendor.photos.length > 0 ? vendor.photos : [];\n  const currentPhoto = photos[imageIdx] || null;\n  currentPhotoRef.current = currentPhoto;",
        """  const photos = vendor.photos.length > 0 ? vendor.photos : [];
  const currentPhoto = photos[imageIdx] || null;
  currentPhotoRef.current = currentPhoto;

  // In blind mode, use the flat queue
  const blindItem = isBlind ? (blindQueue[blindIdx] || null) : null;
  const blindPhoto = blindItem?.imageUrl || null;"""
    ),
    (
        """          {currentPhoto ? (
            <img src={currentPhoto} alt="" draggable={false} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',willChange:'opacity' }} />
          ) : (
            <div style={{ position:'absolute',inset:0,background:'#1a1714',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:'italic',color:'rgba(248,247,245,0.2)' }}>No photo yet</span>
            </div>
          )}""",
        """          {(isBlind ? blindPhoto : currentPhoto) ? (
            <img src={(isBlind ? blindPhoto : currentPhoto)!} alt="" draggable={false} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',willChange:'opacity' }} />
          ) : (
            <div style={{ position:'absolute',inset:0,background:'#1a1714',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:'italic',color:'rgba(248,247,245,0.2)' }}>No photo yet</span>
            </div>
          )}"""
    ),
    (
        "  if (!vendor) return <EmptyDeck mode={mode} />;",
        "  if (isBlind && blindQueue.length > 0 && blindIdx >= blindQueue.length) return <EmptyDeck mode={mode} />;\n  if (!vendor) return <EmptyDeck mode={mode} />;"
    ),
]

for i, (old, new) in enumerate(fixes, 1):
    if old not in content:
        print(f'ERROR: Fix {i} target not found')
        sys.exit(1)
    content = content.replace(old, new, 1)
    print(f'Fix {i} ✓')

with open(path, 'w') as f:
    f.write(content)

print('\nAll done. Now run:')
print('  npx tsc --noEmit')
print('  git add "app/(frost)/frost/canvas/discover/page.tsx"')
print('  git commit -m "fix(bride): blind mode flat photo queue, gold x toast, all vendor photos"')
print('  git push')
