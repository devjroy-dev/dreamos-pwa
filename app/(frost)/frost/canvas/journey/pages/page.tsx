'use client';

// app/(frost)/frost/canvas/journey/pages/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Pages — the bride's private diary.
//
// Five layers working together:
//   1. The page is already drawn before she arrives — date set, daily line
//      in mineral teal, hairline rule, "How are you feeling?" in Italianno
//      at the bottom as an invitation (not a text field placeholder).
//
//   2. Mood as the first stroke — 12 coloured dots mirroring the aesthetic
//      taxonomy. She taps one. The mood word fades up. Then writing begins.
//
//   3. The writing surface — a full-bleed textarea that feels like paper.
//      No toolbar. No formatting. Just her words on the page.
//
//   4. Past entries — a reverse-chronological list of previous diary pages,
//      each showing date + mood + first line. Tapping opens that day's entry
//      in read-only view.
//
//   5. The Sanctuary row preview — when the bride returns to Sanctuary,
//      the Pages row shows the first ~40 chars of her most recent entry
//      in faded italic. This is wired via localStorage for now; Supabase
//      persistence comes when the backend couple_pages table is ready.
//
// localStorage keys (temporary — will migrate to Supabase):
//   frost_pages_entries  — JSON array of { id, date, mood, moodColor, text, preview }
//   frost_pages_preview  — string, first line of most recent entry (for Sanctuary row)
//
// Architecture note: this page manages its own full-screen layout.
// Does NOT use CanvasShell — the diary needs its own spatial grammar.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AUBADE, FF } from '../../../../../../lib/frost/tokens';

// ── Types ────────────────────────────────────────────────────────────────────
interface PageEntry {
  id:        string;
  date:      string;   // ISO string
  dateLabel: string;   // "Tuesday, the Twenty-sixth of May"
  mood:      string;   // e.g. "hopeful"
  moodColor: string;   // hex
  text:      string;
  preview:   string;   // first 60 chars of text
}

// ── Mood taxonomy — 12 dots mirroring aesthetic tags ────────────────────────
// Each has a colour, a word, and an ambient sub-label.
const MOODS = [
  { id: 'hopeful',          color: '#D89854', word: 'hopeful',          sub: 'something good is coming'      },
  { id: 'heavy',            color: '#6B7280', word: 'heavy',            sub: 'the weight of it all'           },
  { id: 'tender',           color: '#D4A0A0', word: 'tender',           sub: 'close to the surface'           },
  { id: 'tired',            color: '#8B9BAB', word: 'tired',            sub: 'running on less than enough'    },
  { id: 'angry',            color: '#C45A3A', word: 'angry',            sub: 'something is not right'        },
  { id: 'still',            color: '#E8E0CC', word: 'still',            sub: 'the quiet between the noise'    },
  { id: 'missing-someone',  color: '#9B8EC4', word: 'missing someone',  sub: 'they should be here'           },
  { id: 'proud',            color: '#C9A55C', word: 'proud',            sub: 'I did something hard'          },
  { id: 'doubting',         color: '#4A5260', word: 'doubting',         sub: 'the voice that questions'      },
  { id: 'peaceful',         color: '#7A9E8A', word: 'peaceful',         sub: 'for a moment, enough'          },
  { id: 'overwhelmed',      color: '#B07040', word: 'overwhelmed',      sub: 'too much at once'              },
  { id: 'in-between',       color: '#C8C0B4', word: 'in-between',       sub: 'not one thing, not another'    },
];

// ── Daily idle lines — different one each day, in mineral teal ──────────────
const DAILY_LINES = [
  'The light in October will be the colour of old letters.',
  'A bride is not made. She arrives.',
  'Some days the counting is a comfort.',
  'Everything you love about flowers is also true of weddings.',
  'The dress does not make the bride. The bride makes the dress.',
  'Beauty is patient. Your day will come.',
  'The morning of your wedding will feel like no other morning.',
  'What you plan now, you will barely remember planning.',
  'The people who matter will cry. That is how you will know.',
  'Your grandmother wore something borrowed too.',
  'The music you choose will play in your memory for decades.',
  'A wedding is a beginning, not an ending.',
  'The photographs are for your children.',
  'Some things only happen once. This is one of them.',
  'You will be nervous. That is correct.',
  'The flowers will die. The love will not.',
  'Something will go wrong. It will become the story you tell.',
  'The people watching you will see something you cannot.',
  'You are already the bride. You have been for weeks.',
  'The countdown makes time strange.',
  'Every bride thinks she is not ready. Every bride is wrong.',
  'Your florist knows something about beauty that is worth trusting.',
  'The ring is a circle. That is not an accident.',
];

function getDailyLine(): string {
  const day = new Date().getDate();
  return DAILY_LINES[day % DAILY_LINES.length];
}

// ── Date helpers ─────────────────────────────────────────────────────────────
const DOM_WORDS = [
  '','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth',
  'Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth',
  'Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second',
  'Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh',
  'Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First',
];

function buildDateLabel(d: Date): string {
  const weekday  = d.toLocaleDateString('en-IN', { weekday: 'long' });
  const dom      = DOM_WORDS[d.getDate()] || String(d.getDate());
  const month    = d.toLocaleDateString('en-IN', { month: 'long' });
  return `${weekday}, the ${dom} of ${month}`;
}

function buildShortDate(d: Date): string {
  const dom   = DOM_WORDS[d.getDate()] || String(d.getDate());
  const month = d.toLocaleDateString('en-IN', { month: 'long' });
  return `${dom} of ${month}`;
}

// ── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY         = 'frost_pages_entries';
const STORAGE_PREVIEW_KEY = 'frost_pages_preview';

function loadEntries(): PageEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEntries(entries: PageEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    // Update Sanctuary row preview
    const preview = entries[0]?.preview || '';
    localStorage.setItem(STORAGE_PREVIEW_KEY, preview);
  } catch {}
}

// ── View states ──────────────────────────────────────────────────────────────
type View = 'landing' | 'mood' | 'writing' | 'saved' | 'reading';

// ── Root ─────────────────────────────────────────────────────────────────────
export default function PagesPage() {
  const router = useRouter();

  const [view,         setView]         = useState<View>('landing');
  const [entries,      setEntries]      = useState<PageEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [moodVisible,  setMoodVisible]  = useState(false);
  const [text,         setText]         = useState('');
  const [readEntry,    setReadEntry]    = useState<PageEntry | null>(null);
  const [animIn,       setAnimIn]       = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const today      = new Date();
  const dateLabel  = buildDateLabel(today);
  const dailyLine  = getDailyLine();

  useEffect(() => {
    const e = loadEntries();
    setEntries(e);
    // Check if today's entry already exists
    const todayISO = today.toDateString();
    const hasToday = e.some(en => new Date(en.date).toDateString() === todayISO);
    if (!hasToday) {
      setView('landing');
    } else {
      setView('saved');
    }
    // Fade in
    requestAnimationFrame(() => setAnimIn(true));
  }, []);

  // Focus textarea when entering writing mode
  useEffect(() => {
    if (view === 'writing' && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [view]);

  const handleMoodSelect = (mood: typeof MOODS[0]) => {
    setSelectedMood(mood);
    setMoodVisible(true);
    setTimeout(() => setView('writing'), 900);
  };

  const handleSave = useCallback(() => {
    if (!text.trim() || !selectedMood) return;
    const entry: PageEntry = {
      id:        Date.now().toString(),
      date:      today.toISOString(),
      dateLabel: buildShortDate(today),
      mood:      selectedMood.word,
      moodColor: selectedMood.color,
      text:      text.trim(),
      preview:   text.trim().slice(0, 60),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setText('');
    setSelectedMood(null);
    setMoodVisible(false);
    setView('saved');
  }, [text, selectedMood, entries, today]);

  const handleReadEntry = (entry: PageEntry) => {
    setReadEntry(entry);
    setView('reading');
  };

  // ── Shared back button ───────────────────────────────────────────────────
  const BackButton = ({ onPress }: { onPress: () => void }) => (
    <button
      onClick={onPress}
      style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top,0px) + 16px)',
        left: 22,
        zIndex: 20,
        background: 'none', border: 'none',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: FF.mono,
        fontSize: 9,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: AUBADE.inkMute,
        cursor: 'pointer',
        padding: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{ color: AUBADE.aubade }}>←</span>
      Sanctuary
    </button>
  );

  // ── LANDING VIEW — the prepared page ────────────────────────────────────
  if (view === 'landing') {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`,
        display: 'flex', flexDirection: 'column',
        opacity: animIn ? 1 : 0,
        transition: 'opacity 600ms ease',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}>
        <BackButton onPress={() => router.push('/frost/canvas/sanctuary')} />

        {/* Page content */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          padding: 'calc(env(safe-area-inset-top,0px) + 80px) 32px 40px',
        }}>

          {/* Date — already written */}
          <div style={{
            fontFamily: FF.aubade,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 15,
            color: AUBADE.inkSoft,
            letterSpacing: '-0.01em',
            marginBottom: 14,
            fontFeatureSettings: '"opsz" 9',
            fontVariationSettings: '"opsz" 9, "wght" 300',
          }}>
            {dateLabel}
          </div>

          {/* Daily line — mineral teal */}
          <div style={{
            fontFamily: FF.aubade,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 17,
            color: AUBADE.nocturne,
            lineHeight: 1.5,
            marginBottom: 20,
            fontFeatureSettings: '"opsz" 9',
            fontVariationSettings: '"opsz" 9, "wght" 300',
          }}>
            {dailyLine}
          </div>

          {/* Hairline rule */}
          <div style={{
            width: '100%', height: 1,
            background: AUBADE.line,
            marginBottom: 24,
          }} />

          {/* TODAY label */}
          <div style={{
            fontFamily: FF.mono,
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: AUBADE.inkMute,
            marginBottom: 20,
          }}>
            Today
          </div>

          {/* Faint margin line */}
          <div style={{
            position: 'absolute',
            left: 56,
            top: 'calc(env(safe-area-inset-top,0px) + 200px)',
            bottom: 140,
            width: 1,
            background: `rgba(92,126,128,0.12)`,
            pointerEvents: 'none',
          }} />

          {/* Past entries preview — faded, above the invitation */}
          {entries.length > 0 && (
            <div style={{
              flex: 1,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              marginBottom: 24,
            }}>
              {entries.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => handleReadEntry(entry)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '14px 0',
                    borderBottom: `1px solid ${AUBADE.line}`,
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: entry.moodColor,
                    flexShrink: 0,
                    marginTop: 5,
                  }} />
                  <div>
                    <div style={{
                      fontFamily: FF.mono,
                      fontSize: 8.5,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: AUBADE.inkMute,
                      marginBottom: 4,
                    }}>
                      {entry.dateLabel} · {entry.mood}
                    </div>
                    <div style={{
                      fontFamily: FF.aubade,
                      fontStyle: 'italic',
                      fontWeight: 300,
                      fontSize: 15,
                      color: `rgba(239,233,221,0.45)`,
                      lineHeight: 1.5,
                      fontFeatureSettings: '"opsz" 9',
                    }}>
                      {entry.preview}{entry.text.length > 60 ? '…' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Spacer */}
          {entries.length === 0 && <div style={{ flex: 1 }} />}

          {/* "How are you feeling?" — the invitation, written on the page */}
          <div
            onClick={() => setView('mood')}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 16px)',
            }}
          >
            <div style={{
              fontFamily: FF.italianno,
              fontSize: 32,
              color: `rgba(239,233,221,0.42)`,
              lineHeight: 1.2,
              marginBottom: 10,
            }}>
              How are you feeling?
            </div>
            <div style={{
              fontFamily: FF.mono,
              fontSize: 8.5,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: AUBADE.inkMute,
            }}>
              tap to begin today's page
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MOOD VIEW — twelve dots ──────────────────────────────────────────────
  if (view === 'mood') {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`,
        display: 'flex', flexDirection: 'column',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}>
        <BackButton onPress={() => setView('landing')} />

        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'calc(env(safe-area-inset-top,0px) + 80px) 32px calc(env(safe-area-inset-bottom,0px) + 40px)',
        }}>

          {/* Invitation */}
          <div style={{
            fontFamily: FF.italianno,
            fontSize: 36,
            color: AUBADE.inkSoft,
            marginBottom: 8,
            lineHeight: 1.1,
          }}>
            How are you feeling?
          </div>
          <div style={{
            fontFamily: FF.aubade,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 15,
            color: AUBADE.inkMute,
            marginBottom: 48,
            fontFeatureSettings: '"opsz" 9',
          }}>
            {dateLabel}
          </div>

          {/* Mood selected — word fades up */}
          {moodVisible && selectedMood && (
            <div style={{
              marginBottom: 32,
              opacity: moodVisible ? 1 : 0,
              transition: 'opacity 500ms ease',
            }}>
              <div style={{
                fontFamily: FF.aubade,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 28,
                color: selectedMood.color,
                letterSpacing: '-0.02em',
                marginBottom: 6,
                fontFeatureSettings: '"opsz" 9',
              }}>
                {selectedMood.word}
              </div>
              <div style={{
                fontFamily: FF.mono,
                fontSize: 9,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: AUBADE.inkMute,
              }}>
                {selectedMood.sub}
              </div>
            </div>
          )}

          {/* 12 mood dots — 4×3 grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            marginBottom: 40,
          }}>
            {MOODS.map(mood => (
              <div
                key={mood.id}
                onClick={() => !moodVisible && handleMoodSelect(mood)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  opacity: moodVisible && selectedMood?.id !== mood.id ? 0.3 : 1,
                  transition: 'opacity 400ms ease',
                }}
              >
                <div style={{
                  width: 22, height: 22,
                  borderRadius: '50%',
                  background: mood.color,
                  boxShadow: selectedMood?.id === mood.id
                    ? `0 0 16px ${mood.color}`
                    : 'none',
                  transition: 'box-shadow 300ms ease',
                }} />
                <div style={{
                  fontFamily: FF.mono,
                  fontSize: 7.5,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: AUBADE.inkMute,
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}>
                  {mood.word.replace('-', '\u00AD')}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ── WRITING VIEW — full page textarea ───────────────────────────────────
  if (view === 'writing') {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`,
        display: 'flex', flexDirection: 'column',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}>

        {/* Top bar */}
        <div style={{
          padding: 'calc(env(safe-area-inset-top,0px) + 16px) 22px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${AUBADE.line}`,
          flexShrink: 0,
        }}>
          <button
            onClick={() => { setView('landing'); setSelectedMood(null); setMoodVisible(false); setText(''); }}
            style={{
              background: 'none', border: 'none',
              fontFamily: FF.mono, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: AUBADE.inkMute, cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: 8,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ color: AUBADE.aubade }}>←</span> discard
          </button>

          {/* Mood indicator */}
          {selectedMood && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: selectedMood.color,
              }} />
              <span style={{
                fontFamily: FF.mono, fontSize: 9,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: AUBADE.inkMute,
              }}>
                {selectedMood.word}
              </span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!text.trim()}
            style={{
              background: 'none', border: 'none',
              fontFamily: FF.mono, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: text.trim() ? AUBADE.aubade : AUBADE.inkMute,
              cursor: text.trim() ? 'pointer' : 'default',
              padding: 0,
              transition: 'color 300ms ease',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            save →
          </button>
        </div>

        {/* Date */}
        <div style={{
          padding: '20px 32px 8px',
          fontFamily: FF.aubade,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 14,
          color: AUBADE.inkMute,
          flexShrink: 0,
          fontFeatureSettings: '"opsz" 9',
        }}>
          {dateLabel}
        </div>

        {/* Faint margin line */}
        <div style={{
          position: 'absolute',
          left: 56,
          top: 'calc(env(safe-area-inset-top,0px) + 100px)',
          bottom: 0,
          width: 1,
          background: `rgba(92,126,128,0.10)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* The writing surface */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="begin here…"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: '16px 32px calc(env(safe-area-inset-bottom,0px) + 40px)',
            fontFamily: FF.aubade,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 18,
            color: AUBADE.ink,
            lineHeight: 1.8,
            letterSpacing: '-0.005em',
            fontFeatureSettings: '"opsz" 9',
            fontVariationSettings: '"opsz" 9, "wght" 300',
            caretColor: AUBADE.aubade,
            WebkitOverflowScrolling: 'touch',
            userSelect: 'text',
            WebkitUserSelect: 'text',
          } as React.CSSProperties}
        />
      </div>
    );
  }

  // ── SAVED VIEW — today's entry exists ───────────────────────────────────
  if (view === 'saved') {
    const todayEntry = entries.find(
      e => new Date(e.date).toDateString() === today.toDateString()
    );

    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`,
        display: 'flex', flexDirection: 'column',
        opacity: animIn ? 1 : 0,
        transition: 'opacity 600ms ease',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}>
        <BackButton onPress={() => router.push('/frost/canvas/sanctuary')} />

        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          padding: 'calc(env(safe-area-inset-top,0px) + 80px) 32px 40px',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>

          {/* Date */}
          <div style={{
            fontFamily: FF.aubade,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 15,
            color: AUBADE.inkSoft,
            marginBottom: 14,
            fontFeatureSettings: '"opsz" 9',
          }}>
            {dateLabel}
          </div>

          {/* Daily line */}
          <div style={{
            fontFamily: FF.aubade,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 17,
            color: AUBADE.nocturne,
            lineHeight: 1.5,
            marginBottom: 20,
            fontFeatureSettings: '"opsz" 9',
          }}>
            {dailyLine}
          </div>

          <div style={{ width: '100%', height: 1, background: AUBADE.line, marginBottom: 24 }} />

          {/* Today's entry */}
          {todayEntry && (
            <div
              onClick={() => handleReadEntry(todayEntry)}
              style={{ marginBottom: 40, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: todayEntry.moodColor,
                  boxShadow: `0 0 10px ${todayEntry.moodColor}`,
                }} />
                <div style={{
                  fontFamily: FF.mono, fontSize: 9,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: AUBADE.inkMute,
                }}>
                  {todayEntry.mood}
                </div>
              </div>
              <div style={{
                fontFamily: FF.aubade,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 17,
                color: AUBADE.inkSoft,
                lineHeight: 1.8,
                fontFeatureSettings: '"opsz" 9',
              }}>
                {todayEntry.text}
              </div>
            </div>
          )}

          {/* Past entries */}
          {entries.filter(e => new Date(e.date).toDateString() !== today.toDateString()).length > 0 && (
            <>
              <div style={{
                fontFamily: FF.mono, fontSize: 9,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: AUBADE.inkMute, marginBottom: 20,
              }}>
                Earlier pages
              </div>
              {entries
                .filter(e => new Date(e.date).toDateString() !== today.toDateString())
                .map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => handleReadEntry(entry)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '14px 0',
                      borderBottom: `1px solid ${AUBADE.line}`,
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: entry.moodColor, flexShrink: 0, marginTop: 5,
                    }} />
                    <div>
                      <div style={{
                        fontFamily: FF.mono, fontSize: 8.5,
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        color: AUBADE.inkMute, marginBottom: 4,
                      }}>
                        {entry.dateLabel} · {entry.mood}
                      </div>
                      <div style={{
                        fontFamily: FF.aubade, fontStyle: 'italic',
                        fontWeight: 300, fontSize: 15,
                        color: `rgba(239,233,221,0.45)`,
                        lineHeight: 1.5, fontFeatureSettings: '"opsz" 9',
                      }}>
                        {entry.preview}{entry.text.length > 60 ? '…' : ''}
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}

          {/* New entry button — if today already has one, allow another */}
          <div
            onClick={() => setView('mood')}
            style={{
              marginTop: 32,
              textAlign: 'center',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 16px)',
            }}
          >
            <div style={{
              fontFamily: FF.italianno,
              fontSize: 26,
              color: `rgba(239,233,221,0.28)`,
              marginBottom: 8,
            }}>
              another page?
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ── READING VIEW — one entry, full text ─────────────────────────────────
  if (view === 'reading' && readEntry) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`,
        display: 'flex', flexDirection: 'column',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}>
        <button
          onClick={() => setView(
            entries.some(e => new Date(e.date).toDateString() === today.toDateString())
              ? 'saved' : 'landing'
          )}
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top,0px) + 16px)',
            left: 22, zIndex: 20,
            background: 'none', border: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: FF.mono, fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: AUBADE.inkMute, cursor: 'pointer', padding: 0,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ color: AUBADE.aubade }}>←</span> Pages
        </button>

        <div style={{
          flex: 1,
          padding: 'calc(env(safe-area-inset-top,0px) + 80px) 32px calc(env(safe-area-inset-bottom,0px) + 40px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>

          <div style={{
            fontFamily: FF.aubade, fontStyle: 'italic',
            fontWeight: 300, fontSize: 15,
            color: AUBADE.inkSoft, marginBottom: 14,
            fontFeatureSettings: '"opsz" 9',
          }}>
            {readEntry.dateLabel}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: readEntry.moodColor,
              boxShadow: `0 0 10px ${readEntry.moodColor}`,
            }} />
            <div style={{
              fontFamily: FF.mono, fontSize: 9,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: AUBADE.inkMute,
            }}>
              {readEntry.mood}
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: AUBADE.line, marginBottom: 28 }} />

          {/* Faint margin line */}
          <div style={{
            position: 'absolute', left: 56,
            top: 'calc(env(safe-area-inset-top,0px) + 160px)', bottom: 0,
            width: 1, background: `rgba(92,126,128,0.10)`,
            pointerEvents: 'none',
          }} />

          <div style={{
            fontFamily: FF.aubade, fontStyle: 'italic',
            fontWeight: 300, fontSize: 18,
            color: AUBADE.ink, lineHeight: 1.8,
            letterSpacing: '-0.005em',
            fontFeatureSettings: '"opsz" 9',
            whiteSpace: 'pre-wrap',
          }}>
            {readEntry.text}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
