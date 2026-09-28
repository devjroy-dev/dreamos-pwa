# docs/review/tools/compose.py · the before/after boards and palette boards the report shows (Pillow).
# Every output is quantised and kept under 400 KB.
import json, os, glob
from PIL import Image, ImageDraw, ImageFont
R = os.path.join(os.path.dirname(__file__), '..')
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(sz, bold=False): return ImageFont.truetype(FB if bold else F, sz)
def thumb(p, w):
    im = Image.open(os.path.join(R, p)).convert('RGB'); return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
def save(im, rel):
    out = os.path.join(R, rel); os.makedirs(os.path.dirname(out), exist_ok=True)
    for colors in (256, 128, 64):
        im.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(out, optimize=True)
        if os.path.getsize(out) < 400 * 1024: break
    print(rel, os.path.getsize(out) // 1024, 'KB')
def board(title, rows, rel, w=200):
    gap, pad, lab = 10, 20, 70
    ims = [[(thumb(p, w), cap) for p, cap in r['shots']] for r in rows]
    width = pad * 2 + max(len(r) * (w + gap) for r in ims)
    heights = [max(i.height for i, _ in r) + lab + 40 for r in ims]
    im = Image.new('RGB', (max(width, 900), sum(heights) + 70), (246, 246, 244)); d = ImageDraw.Draw(im)
    d.text((pad, 18), title, fill=(20, 22, 24), font=font(26, True))
    y = 70
    for r, row in zip(rows, ims):
        d.text((pad, y), r['label'], fill=r.get('color', (20, 22, 24)), font=font(20, True))
        x = pad
        for i, (t, cap) in enumerate(row):
            im.paste(t, (x, y + 36)); d.rectangle([x - 1, y + 35, x + t.width, y + 36 + t.height], outline=(190, 190, 190))
            d.text((x, y + 42 + t.height), f'{i + 1}. {cap}', fill=(60, 64, 68), font=font(13))
            x += w + gap
        y += max(t.height for t, _ in row) + lab + 40
    save(im, rel)

FL = 'screenshots/flows'
def fl(task, n): return sorted(glob.glob(os.path.join(R, FL, task, f'dark-ios-{n:02d}-*.png')))[0][len(R) + 1:]
RED, GREEN = (170, 40, 30), (20, 110, 70)
board('Check whether a date is free (14 Feb 2027)', [
  {'label': 'Today: 8 taps, 4 screens, and the day sheet never says "free"', 'color': RED, 'shots': [(fl('b-check-a-date', 1), 'Home'), (fl('b-check-a-date', 2), 'Rooms'), (fl('b-check-a-date', 3), 'Calendar'), (fl('b-check-a-date', 4), 'Next month x5'), (fl('b-check-a-date', 5), 'Tap 14: day sheet')]},
  {'label': 'Proposed: 2 taps, one sheet, a plain answer', 'color': GREEN, 'shots': [('mocks/after/dark-today.png', 'Tap Check a date'), ('mocks/after/dark-date.png', 'Pick 14 Feb: Free'), ('mocks/after/dark-calendar.png', 'Or: Calendar, tap the month')]},
], 'mocks/flow-b-check-a-date.png')
board('Turn an enquiry into a booked client with a package', [
  {'label': 'Today: 7 taps and 3 stacked sheets to book; 9 to see the client; the invoice and the functions are still separate jobs', 'color': RED, 'shots': [(fl('c-enquiry-to-booked-client', i), c) for i, c in [(1, 'Home'), (2, 'Enquiry sheet'), (3, 'Attach package'), (4, 'Pick package'), (5, 'Attached'), (6, 'Booking confirmed'), (7, 'Confirm booking'), (9, 'Rooms, Clients')]]},
  {'label': 'Proposed: 4 taps; booking makes the invoice and puts the functions in the calendar', 'color': GREEN, 'shots': [('mocks/after/dark-today.png', 'Tap the enquiry'), ('mocks/after/dark-lead.png', 'Tap Book'), ('mocks/after/dark-book.png', 'Pick package, Book'), ('mocks/after/dark-client.png', 'The client page')]},
], 'mocks/flow-c-enquiry-to-booked-client.png')
board("See today's and this week's events with their crew", [
  {'label': 'Today: Home shows no crew; 4 taps per event to see it; the week view shows initials only', 'color': RED, 'shots': [(fl('e-today-and-week-with-crew', i), c) for i, c in [(1, 'Home'), (2, 'Events, no crew'), (3, 'Event sheet, no crew'), (4, 'Rooms'), (5, 'Calendar'), (6, 'Tap today'), (7, 'Crew, one event'), (8, 'Weddings view')]]},
  {'label': 'Proposed: crew on the Home cards (0 taps); the week in 1 tap; the event page in 1 tap', 'color': GREEN, 'shots': [('mocks/after/dark-today.png', 'Home with crew'), ('mocks/after/dark-week.png', 'This week'), ('mocks/after/dark-event.png', 'Event with crew')]},
], 'mocks/flow-e-today-and-week-with-crew.png')
board('Reply to a new enquiry', [
  {'label': 'Today: 2 taps and a scroll; the message is below the fold of the sheet', 'color': RED, 'shots': [(fl('a-reply-to-enquiry', i), c) for i, c in [(1, 'Home'), (2, 'Enquiry sheet'), (3, 'Scroll to messages'), (4, 'WhatsApp')]]},
  {'label': 'Proposed: the last message on Home; 2 taps, no scroll; quick replies', 'color': GREEN, 'shots': [('mocks/after/dark-today.png', 'Home shows the message'), ('mocks/after/dark-lead.png', 'Conversation first, Reply')]},
], 'mocks/flow-a-reply-to-enquiry.png')
board('Send an invoice and see who still owes money', [
  {'label': 'Today: 8 taps, the client name typed by hand, owed money 2 taps deep', 'color': RED, 'shots': [(fl('d-send-invoice-and-see-who-owes', i), c) for i, c in [(1, 'Home'), (2, 'Rooms'), (3, 'Invoices'), (4, 'New invoice'), (5, 'Type name, amount'), (6, 'Open invoice'), (7, 'Send on WhatsApp')]]},
  {'label': 'Proposed: Money is a tab (1 tap to who owes); send from the client in 3 taps', 'color': GREEN, 'shots': [('mocks/after/dark-money.png', 'Money tab'), ('mocks/after/dark-client.png', 'Client: Send reminder'), ('mocks/after/dark-invoice.png', 'Send on WhatsApp')]},
], 'mocks/flow-d-send-invoice.png')

pal = json.load(open(os.path.join(R, 'palettes/palettes.json')))['palettes']
for key, p in pal.items():
    board(f"{p['name']}: {p['line']}", [
      {'label': 'Dark', 'shots': [(f'mocks/palettes/{key}-dark-{s}.png', n) for s, n in [('today', 'Today'), ('leads', 'Enquiries'), ('client', 'A client')]]},
      {'label': 'Light', 'shots': [(f'mocks/palettes/{key}-light-{s}.png', n) for s, n in [('today', 'Today'), ('leads', 'Enquiries'), ('client', 'A client')]]},
    ], f'palettes/{key}.png', w=260)

# the swatches: each palette's core values, both modes, with the text drawn in its own ink
KEYS = [('page', 'Page'), ('card', 'Card'), ('ink', 'Text'), ('mute', 'Hint'), ('accent', 'Link'), ('primary', 'Button'), ('positive', 'Paid'), ('caution', 'Due'), ('critical', 'Overdue'), ('metal', 'Gold')]
sw, sh = 104, 76
im = Image.new('RGB', (40 + sw * len(KEYS), 70 + 6 * (sh + 56)), (246, 246, 244)); d = ImageDraw.Draw(im)
d.text((20, 18), 'Proposed palettes: core values (every token in palettes.json)', fill=(20, 22, 24), font=font(22, True))
y = 64
for key, p in pal.items():
    for mode in ('dark', 'light'):
        c = p['core'][mode]
        d.text((20, y), f"{p['name']}, {mode}", fill=(20, 22, 24), font=font(15, True)); y += 24
        for i, (k, lab) in enumerate(KEYS):
            x = 20 + i * sw; d.rectangle([x, y, x + sw - 6, y + sh], fill=c[k], outline=(180, 180, 180))
            ink = c['onPrimary'] if k == 'primary' else (c['ink'] if k in ('page', 'card') else c['page'])
            if k in ('ink', 'mute', 'accent', 'positive', 'caution', 'critical', 'metal'): d.rectangle([x, y, x + sw - 6, y + sh], fill=c['page'], outline=(180, 180, 180)); d.rectangle([x + 8, y + 8, x + 26, y + 26], fill=c[k]); ink = c[k]
            d.text((x + 8, y + 32), lab, fill=ink, font=font(14, True)); d.text((x + 8, y + 52), c[k], fill=ink, font=font(12))
        y += sh + 32
save(im, 'palettes/swatches.png')

board('Type: today, option A (Inter everywhere), option B (IBM Plex Sans, serif kept for the TDW name)', [
  {'label': "The phone's default text size", 'shots': [('mocks/type/current-dm-sans-lead.png', 'Today: DM Sans'), ('mocks/type/a-inter-lead.png', 'A: Inter'), ('mocks/type/b-plex-serif-name-lead.png', 'B: Plex + serif name')]},
  {'label': 'Large text (130 percent)', 'shots': [('mocks/type/current-dm-sans-lead-large-text.png', 'Today: DM Sans'), ('mocks/type/a-inter-lead-large-text.png', 'A: Inter'), ('mocks/type/b-plex-serif-name-lead-large-text.png', 'B: Plex + serif name')]},
], 'mocks/type-options.png', w=260)
