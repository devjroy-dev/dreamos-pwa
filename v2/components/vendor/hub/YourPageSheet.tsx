'use client';
// v2/components/vendor/hub/YourPageSheet.tsx · CE-47 · HUB-2e · "YOUR PAGE" (the chair's ruling and the founder's answers, 8 Oct 2026).
// Opened from Mine. Her page at /c/<handle> shows:
//   - her name, city and Instagram, which FOLLOW her TDW profile (the server reads them through). They are shown here
//     but not edited here: one fact is corrected in one place, so the sheet sends her to her profile editor.
//   - what she does (up to 5 roles), what she is open to, and her website, which she sets here;
//   - up to 12 pictures, chosen ONLY from her TDW portfolio (R-47.2: any picture of hers there, never one the safety
//     check holds; the server decides which ones may be chosen, GET /hub/me/pictures).
// Her address never changes. The server's refusals are shown word for word. Lines are whole sentences (R-47.1).
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJson } from '@/lib/vendor/api/_base';
import { labelFor } from '@/lib/frost/categoryLabels';
import { API } from '@/v2/lib/solutions/routes';
import {
  HUB, arr, fetchMyPage, fetchMyPictures, saveMyPage, linkProps,
  PROFILE_HREF, PORTFOLIO_HREF, MAX_ROLES, MAX_PICTURES, type MyPage, type MyPicture,
} from '@/v2/lib/vendor/hub';
import { HUB_CSS } from './HubPeople';
import { SHEET_CSS } from './ShootTogetherSheet';

const PAY: { v: string; label: string }[] = [{ v: 'paid', label: 'Paid' }, { v: 'barter', label: 'Barter' }, { v: 'credit_only', label: 'Credit only' }];
const siteText = (u: string | null | undefined) => String(u || '').replace(/^https:\/\//i, '').replace(/\/$/, '');

export function YourPageSheet({ onClose, onSaved }: { onClose: () => void; onSaved: (line: string) => void }) {
  const [page, setPage] = useState<MyPage | null>(null);
  const [unread, setUnread] = useState(false);
  const [pictures, setPictures] = useState<MyPicture[] | null>(null);
  const [most, setMost] = useState(MAX_PICTURES);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [openTo, setOpenTo] = useState<string[]>([]);
  const [website, setWebsite] = useState('');
  const [chosen, setChosen] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    fetchMyPage().then((d) => {
      if (!live) return;
      if (!d || !d.ok || !d.page) { setUnread(true); return; }
      setPage(d.page); setRoles(arr(d.page.roles)); setOpenTo(arr(d.page.open_to)); setWebsite(siteText(d.page.website && d.page.website.url)); setChosen(arr(d.page.work));
    }).catch(() => { if (live) setUnread(true); });
    fetchMyPictures().then((d) => {
      if (!live) return;
      setPictures(d && d.ok ? arr(d.pictures) : []);
      if (d && d.ok && typeof d.most === 'number') setMost(d.most);
    }).catch(() => { if (live) setPictures([]); });
    getJson<{ ok: boolean; requirement_types?: string[] }>(API.collabRequirementTypes())
      .then((d) => { if (live && d.ok) setAllRoles(arr(d.requirement_types)); })
      .catch(() => { /* her chosen roles still show */ });
    return () => { live = false; };
  }, []);

  function toggleRole(r: string) {
    if (roles.includes(r)) { setNote(''); setRoles(roles.filter((x) => x !== r)); return; }
    if (roles.length >= MAX_ROLES) { setNote(HUB.page.rolesFull); return; }
    setNote(''); setRoles([...roles, r]);
  }
  function togglePicture(u: string) {
    if (chosen.includes(u)) { setNote(''); setChosen(chosen.filter((x) => x !== u)); return; }
    if (chosen.length >= most) { setNote(HUB.page.picturesFull(most)); return; }
    setNote(''); setChosen([...chosen, u]);
  }
  async function save() {
    if (saving) return;
    setSaving(true); setError('');
    const r = await saveMyPage({ roles, open_to: openTo, website: website.trim(), work_urls: chosen })
      .catch(() => ({ ok: false, error: HUB.page.failed } as { ok: boolean; error?: string; line?: string }));
    setSaving(false);
    if (!r.ok) { setError(r.error || HUB.page.failed); return; }
    onSaved(r.line || HUB.page.saved);
  }

  const address = page ? linkProps(page.page_url) : null;
  const ig = page && page.instagram ? linkProps(page.instagram.url) : null;
  const shownRoles = [...roles, ...allRoles.filter((r) => !roles.includes(r))];

  return (
    <div className="hub-scrim" role="dialog" aria-modal="true" aria-label={HUB.page.title} data-hub-page-sheet="">
      <style>{HUB_CSS + SHEET_CSS + PAGE_CSS}</style>
      <div className="hub-sheet">
        <div className="hub-sheet-head">
          <h2 className="hub-sheet-title">{HUB.page.title}</h2>
          <button type="button" className="hub-x" aria-label={HUB.close} onClick={onClose}>{'✕'}</button>
        </div>
        {unread ? <p className="hub-small bad" role="alert">{HUB.page.unread}</p> : !page ? <p className="hub-note">Loading…</p> : (<>
          <p className="hub-note">{HUB.page.note}</p>

          <div className="hub-card" data-hub-page-address="">
            <div className="hub-label">{HUB.page.address}</div>
            <div className="hub-facts">{page.page_url.replace(/^https:\/\//, '')}</div>
            {address && <div className="hub-btns"><a {...address} className="hub-btn s">{HUB.page.see}</a></div>}
          </div>

          <div className="hub-card" data-hub-page-profile="">
            <dl className="hub-dl">
              <dt>{HUB.page.name}</dt><dd>{page.name}</dd>
              <dt>{HUB.page.city}</dt><dd>{page.city || HUB.page.notAdded}</dd>
              <dt>{HUB.page.instagram}</dt><dd>{ig && page.instagram ? <a {...ig} className="hub-inline">{page.instagram.handle}</a> : HUB.page.notAdded}</dd>
            </dl>
            <p className="hub-small">{HUB.page.fromProfile}</p>
            <div className="hub-btns"><Link href={PROFILE_HREF} className="hub-btn s" data-hub-page-edit-profile="">{HUB.page.editProfile}</Link></div>
          </div>

          <div className="hub-label">{HUB.page.roles}</div>
          <p className="hub-small">{HUB.page.rolesNote}</p>
          <div className="hub-chips" role="group" aria-label={HUB.page.roles} data-hub-page-roles="">
            {shownRoles.map((r) => (
              <button key={r} type="button" className={'hub-chip' + (roles.includes(r) ? ' on' : '')} aria-pressed={roles.includes(r)} onClick={() => toggleRole(r)}>{labelFor(r)}</button>))}
          </div>

          <div className="hub-label">{HUB.page.openTo}</div>
          <div className="hub-chips" role="group" aria-label={HUB.page.openTo} data-hub-page-open-to="">
            {PAY.map((k) => (
              <button key={k.v} type="button" className={'hub-chip' + (openTo.includes(k.v) ? ' on' : '')} aria-pressed={openTo.includes(k.v)}
                onClick={() => setOpenTo((xs) => (xs.includes(k.v) ? xs.filter((x) => x !== k.v) : [...xs, k.v]))}>{k.label}</button>))}
          </div>

          <label className="hub-field"><span>{HUB.page.website}</span>
            <input value={website} inputMode="url" autoCapitalize="none" maxLength={200} placeholder={HUB.page.websiteHint} onChange={(e) => setWebsite(e.target.value)} data-hub-page-website="" /></label>

          <div className="hub-label">{HUB.page.pictures}{pictures && pictures.length > 0 ? ` · ${HUB.page.chosen(chosen.length, most)}` : ''}</div>
          {pictures === null ? <p className="hub-note">Loading…</p> : pictures.length === 0 ? (<>
            <p className="hub-small" data-hub-page-no-pictures="">{HUB.page.noPictures}</p>
            <div className="hub-btns"><Link href={PORTFOLIO_HREF} className="hub-btn s" data-hub-page-open-portfolio="">{HUB.page.openPortfolio}</Link></div>
          </>) : (<>
            <p className="hub-small">{HUB.page.picturesNote(most)}</p>
            <div className="hub-pics" data-hub-page-pictures="">
              {pictures.map((p) => { const n = chosen.indexOf(p.url);
                return (
                  <button key={p.id} type="button" className={'hub-pic' + (n >= 0 ? ' on' : '')} aria-pressed={n >= 0} aria-label={n >= 0 ? `Picture ${n + 1} on your page` : 'Picture not on your page'} onClick={() => togglePicture(p.url)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="" loading="lazy" />
                    {n >= 0 && <span className="hub-pic-n" aria-hidden="true">{n + 1}</span>}
                  </button>); })}
            </div>
          </>)}

          {note && <p className="hub-small" role="status">{note}</p>}
          {error && <p className="hub-small bad" role="alert">{error}</p>}
          <button type="button" className="hub-btn p hub-wide" disabled={saving} data-hub-page-save="" onClick={() => void save()}>{saving ? HUB.page.saving : HUB.page.save}</button>
        </>)}
      </div>
    </div>
  );
}

// The app's own pieces: the chosen picture is marked like a chosen chip (filled with the primary, veto 54); tokens only.
const PAGE_CSS = `
.hub-label{margin:16px 0 4px;font:var(--wl-t5);color:var(--atelier-label)}
.hub-dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0;font:var(--wl-t4)}
.hub-dl dt{color:var(--atelier-label)}
.hub-dl dd{margin:0;color:var(--atelier-ink)}
.hub-pics{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}
.hub-pic{position:relative;padding:0;border:2px solid transparent;border-radius:10px;overflow:hidden;background:var(--atelier-card-bg);cursor:pointer;aspect-ratio:4/5}
.hub-pic img{display:block;width:100%;height:100%;object-fit:cover}
.hub-pic.on{border-color:var(--role-primary)}
.hub-pic:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.hub-pic-n{position:absolute;top:6px;left:6px;min-width:24px;height:24px;padding:0 6px;box-sizing:border-box;border-radius:12px;background:var(--role-primary);color:var(--role-on-primary);font:var(--wl-t5);display:flex;align-items:center;justify-content:center}
`;
