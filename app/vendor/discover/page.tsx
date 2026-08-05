'use client';
// /wedding/discover — Discover · Atelier rebuild · Gallery edition
//
// The vision: photography-forward room. Hero image takes the top half;
// headline + italic Cormorant sit OVER it. Then the 4-cell ledger
// (Pieces · Approved · Pending · Held). Then a real "The Collection"
// portfolio preview grid. The room is the work, the work is the room.
//
// If the vendor has a hero portfolio image, that's the backdrop.
// Otherwise a warm-sunset gradient stands in.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// TDW_07 P2 · CE ruling §F — the floor comes from the server when it speaks, from the
// one comment-bound constant when it does not. This screen used to hold the number twice.
import { photoFloor } from '@/lib/vendor/discoverFloor';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { fetchDiscoverStatus, fetchPortfolio } from '@/lib/vendor/api/vendor';
import type { DiscoverStatus, PortfolioImage } from '@/lib/vendor/types/vendor';

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  red:       'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

// Fallback hero gradient when vendor has no hero image yet — warm sunset
// bokeh stand-in that still feels like a stage.
const FALLBACK_HERO_GRADIENT = `
  radial-gradient(ellipse 60% 50% at 30% 30%, rgba(184,108,60,0.55) 0%, transparent 60%),
  radial-gradient(ellipse 50% 40% at 70% 70%, rgba(201,168,76,0.4) 0%, transparent 60%),
  radial-gradient(ellipse 80% 80% at 50% 50%, rgba(70,40,28,0.6) 0%, transparent 70%),
  linear-gradient(180deg, #2A1A12 0%, #160C08 100%)
`;

export default function DiscoverPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <DiscoverScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function DiscoverScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
  const [status, setStatus]     = useState<DiscoverStatus | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDiscoverStatus().catch(() => null),
      fetchPortfolio(vendorId, 'approved').catch(() => null),
    ]).then(([statusRes, portRes]) => {
      if (statusRes?.ok) setStatus(statusRes as DiscoverStatus);
      if (portRes?.ok)   setPortfolio(portRes.images);
    }).finally(() => setLoading(false));
  }, [vendorId]);

  const state = status?.discover_request_state || 'not_requested';
  const portfolioTotal = status?.portfolio_summary?.total ?? 0;
  // FOUNDER-VETOED 2026-07-29 (copy slot 2, 「 go 」): the sentence is unchanged in shape
  // and the numeral is now live. F-07.4 as ruled: this gate counts EVERY row, because
  // requesting Discover stays self-serve — the score and the feed count approved only.
  const floor = photoFloor(status?.min_portfolio_images);
  const hero = portfolio.find(p => p.is_hero) ?? portfolio[0] ?? null;
  const collection = portfolio.filter(p => !hero || p.id !== hero.id).slice(0, 6);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
      <Header vendorName={vendorName} />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* ── HERO — photo stage with headline over it ─────────────── */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
        }}>
          {hero ? (
            <img src={hero.image_url} alt=""
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.78) saturate(1.05)',
              }} />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              background: FALLBACK_HERO_GRADIENT,
            }} />
          )}

          {/* Bottom-up dark gradient so text reads */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, transparent 40%, rgba(14,12,10,0.85) 90%, #0E0C0A 100%)',
          }} />

          {/* Headline overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0 24px 24px',
          }}>
            <div style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              color: A.brass, marginBottom: 14,
            }}>Your Portfolio</div>
            <div style={{
              fontFamily: F.display, fontWeight: 400, fontSize: 38,
              color: 'var(--atelier-ink)', lineHeight: 1.08, letterSpacing: '0.005em',
              marginBottom: 10,
            }}>Appear before<br />qualified brides.</div>
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
              fontSize: 16, color: 'rgba(240,230,210,0.78)',
              letterSpacing: '0.01em',
            }}>A curated stage, not a marketplace.</div>
          </div>
        </div>

        {/* ── DISCOVER PROFILE — the door I stated and did not build ─────────
            TDW_07 P2 MICRO. The P2 read-first named this thumb-path in words ("reached
            from the DISCOVER home screen you land on, plus the re-pointed Header entry")
            and the delivery shipped only the Header entry, which lives inside the avatar
            dropdown. The founder's walk found it in one minute: the screen was reachable
            only through Settings' forwarding card and a menu nobody opens. A stated path
            that is not built is the witness-path law's own failure class.
            SITED ABOVE THE STATE BRANCHES, deliberately: the profile is editable in every
            discover state — before requesting, while under review, after approval, after
            denial — so its door must not live inside any one branch.
            ZERO NEW COPY. The label and subtitle are BYTE-IDENTICAL to the entry already
            shipped at components/vendor/Header.tsx:191, which has been live and vetoed
            since before this sitting. No unvetoed vendor-facing string is minted here. */}
        <button type="button" onClick={() => router.push('/vendor/discover/profile')} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: 'calc(100% - 44px)', margin: '18px 22px 0', padding: '14px 0',
          background: 'none', border: 'none', borderBottom: '0.5px solid rgba(201,168,76,0.22)',
          cursor: 'pointer', textAlign: 'left',
        }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em',
              textTransform: 'uppercase', color: A.brassWarm,
            }}>Discover Profile</span>
            <span style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
              fontSize: 13, color: A.inkMute, letterSpacing: '0.01em',
            }}>How couples see you</span>
          </span>
          <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 13, color: A.brassWarm }}>›</span>
        </button>

        {/* ── 4-cell ledger ──────────────────────────────────────── */}
        {status?.portfolio_summary && (
          <div style={{
            display: 'flex', alignItems: 'stretch',
            padding: '28px 8px 26px',
            margin: '6px 22px 0',
            borderBottom: '0.5px solid rgba(201,168,76,0.22)',
          }}>
            {[
              { label: 'Pieces',   value: String(status.portfolio_summary.total),    accent: status.portfolio_summary.total > 0,    color: 'var(--atelier-ink)' },
              { label: 'Approved', value: String(status.portfolio_summary.approved), accent: status.portfolio_summary.approved > 0, color: A.brassWarm, divider: true },
              { label: 'Pending',  value: String(status.portfolio_summary.pending),  accent: status.portfolio_summary.pending > 0,  color: 'var(--atelier-ink)', divider: true },
              { label: 'Held',     value: String(status.portfolio_summary.rejected), accent: status.portfolio_summary.rejected > 0, color: status.portfolio_summary.rejected > 0 ? A.red : 'var(--atelier-ink)', divider: true },
            ].map(({ label, value, accent, color, divider }) => (
              <div key={label} style={{
                flex: 1, textAlign: 'center', padding: '0 4px', position: 'relative',
              }}>
                {divider && (
                  <span aria-hidden style={{
                    position: 'absolute', left: 0, top: '12%', bottom: '12%',
                    width: '0.5px', background: 'rgba(201,168,76,0.22)',
                  }} />
                )}
                <div style={{
                  fontFamily: F.display, fontWeight: 400, fontSize: 46,
                  lineHeight: 1, letterSpacing: '-0.01em',
                  color: accent ? color : 'var(--atelier-ink-dim)',
                }}>{value}</div>
                <div style={{
                  fontFamily: F.label, fontWeight: 300, fontSize: 8,
                  letterSpacing: '0.36em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.72)', marginTop: 12,
                }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Status / CTA ────────────────────────────────────────── */}
        <div style={{ padding: '20px 22px 8px' }}>
          {loading ? (
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
              fontSize: 14, color: A.inkMute, textAlign: 'center', padding: 20,
            }}>Loading…</div>
          ) : state === 'not_requested' ? (
            portfolioTotal < floor ? (
              <>
                <button type="button" onClick={() => router.push('/vendor/portfolio')}
                  style={{
                    width: '100%', padding: '14px 0',
                    background: 'transparent',
                    border: `0.5px solid rgba(201,168,76,0.4)`,
                    borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 300, fontSize: 10,
                    color: A.brassWarm, letterSpacing: '0.42em', textTransform: 'uppercase',
                    marginBottom: 10,
                  }}>
                  Build portfolio first
                </button>
                <div style={{
                  fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 13, color: A.inkMute, textAlign: 'center',
                }}>
                  Upload at least {floor} pieces to request access. You have {portfolioTotal}.
                </div>
              </>
            ) : (
              <button type="button" onClick={() => router.push('/vendor/discover/submit')}
                className="atelier-fab"
                style={{
                  width: '100%', padding: '15px 0',
                  borderRadius: 2, cursor: 'pointer',
                  border: '0.5px solid var(--atelier-label)',
                  fontFamily: F.label, fontWeight: 400, fontSize: 10,
                  color: '#1A120E', letterSpacing: '0.5em', textTransform: 'uppercase',
                }}>
                Request Access
              </button>
            )
          ) : state === 'requested' || state === 'under_review' ? (
            <div style={{
              padding: '14px 18px',
              borderLeft: '0.5px solid rgba(201,168,76,0.4)',
              background: 'linear-gradient(90deg, rgba(201,168,76,0.05) 0%, transparent 100%)',
            }}>
              <div style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 8,
                letterSpacing: '0.42em', textTransform: 'uppercase',
                color: A.brass, marginBottom: 6,
              }}>Under Review</div>
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 15, color: 'rgba(240,230,210,0.8)', lineHeight: 1.5,
              }}>
                Your application is being reviewed by Swati. Expected response within five days.
              </div>
            </div>
          ) : state === 'approved' ? (
            <div style={{
              padding: '14px 18px',
              borderLeft: '0.5px solid rgba(224,188,110,0.5)',
              background: 'linear-gradient(90deg, rgba(224,188,110,0.06) 0%, transparent 100%)',
            }}>
              <div style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 8,
                letterSpacing: '0.42em', textTransform: 'uppercase',
                color: A.brassWarm, marginBottom: 6,
              }}>Approved</div>
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 15, color: 'rgba(240,230,210,0.8)', lineHeight: 1.5,
              }}>
                You&apos;re on Discover. Your work is live on The Dream Wedding.
              </div>
            </div>
          ) : state === 'denied' ? (
            <>
              <div style={{
                padding: '14px 18px',
                borderLeft: `0.5px solid ${A.red}`,
                background: 'linear-gradient(90deg, rgba(224,123,92,0.06) 0%, transparent 100%)',
                marginBottom: 14,
              }}>
                <div style={{
                  fontFamily: F.label, fontWeight: 300, fontSize: 8,
                  letterSpacing: '0.42em', textTransform: 'uppercase',
                  color: A.red, marginBottom: 6,
                }}>Not Approved</div>
                <div style={{
                  fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 14, color: A.inkSoft, lineHeight: 1.5,
                }}>{status?.last_decision_reason ?? 'Application not approved.'}</div>
              </div>
              <button type="button" onClick={() => router.push('/vendor/discover/submit')}
                className="atelier-fab"
                style={{
                  width: '100%', padding: '14px 0',
                  borderRadius: 2, cursor: 'pointer',
                  border: '0.5px solid var(--atelier-label)',
                  fontFamily: F.label, fontWeight: 400, fontSize: 10,
                  color: '#1A120E', letterSpacing: '0.42em', textTransform: 'uppercase',
                }}>
                Re-apply
              </button>
            </>
          ) : null}
        </div>

        {/* ── THE COLLECTION — gallery preview ───────────────────── */}
        {collection.length > 0 && (
          <div style={{ padding: '36px 22px 32px' }}>
            <div style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.5em', textTransform: 'uppercase',
              color: A.brass, marginBottom: 6,
            }}>The Collection</div>
            <div style={{
              fontFamily: F.display, fontWeight: 400, fontSize: 26,
              color: 'var(--atelier-ink)', lineHeight: 1.1, marginBottom: 4,
              letterSpacing: '0.005em',
            }}>Your latest work</div>
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
              fontSize: 14, color: A.inkMute, marginBottom: 18,
              letterSpacing: '0.01em',
            }}>As brides will see it, curated.</div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 6,
            }}>
              {collection.map(img => (
                <button key={img.id} type="button"
                  onClick={() => router.push('/vendor/portfolio')}
                  style={{
                    position: 'relative', aspectRatio: '3/4',
                    overflow: 'hidden',
                    border: '0.5px solid rgba(201,168,76,0.22)',
                    cursor: 'pointer', background: 'none', padding: 0,
                    borderRadius: 0,
                  }}>
                  <img src={img.image_url} alt={img.caption ?? ''}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center top',
                    }} />
                </button>
              ))}
            </div>

            <button type="button" onClick={() => router.push('/vendor/portfolio')}
              style={{
                width: '100%', marginTop: 18, padding: '12px 0',
                background: 'transparent',
                border: `0.5px solid rgba(201,168,76,0.32)`,
                borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 10,
                color: A.brassWarm, letterSpacing: '0.42em', textTransform: 'uppercase',
              }}>
              Manage Collection
            </button>
          </div>
        )}

        {/* If no portfolio items yet — empty-state nudge */}
        {!loading && collection.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
              fontSize: 16, color: A.inkMute, lineHeight: 1.5,
            }}>
              Your collection is empty.<br />
              <button type="button" onClick={() => router.push('/vendor/portfolio')}
                style={{
                  marginTop: 14, padding: '10px 22px',
                  background: 'none',
                  border: '0.5px solid rgba(201,168,76,0.4)',
                  borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9,
                  color: A.brassWarm, letterSpacing: '0.36em', textTransform: 'uppercase',
                }}>Upload your first piece</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
