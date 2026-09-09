# R-41.139 · The Advisor page renders its own conversation · for the chair's veto

**Cut by** LE-D at dreamos-pwa `96b3ac7793d199aa2e4928b11d0d415bf458aa6b`.

**Status: PROPOSED — SHAPE ONLY.** Silence is not approval.

## What is being vetoed, and what is not

**Not the words.** Every string in the frame is already on the tree: `COPY.advisorTitle`, `COPY.advisorEmpty`, `COPY.advisorThreadNote`, and InputBar's own `Ask anything`. The founder ratified this page's header and intro at 06:12 and R-41.139 proposes **no word of them**.

**The veto asked for is the thread and the bar in place** — that `/vendor/advisor` stops being a page *about* a conversation and becomes the conversation.

| frame | what it shows |
|---|---|
| `A1-advisor-empty-374` | before the first message — header, intro and note stand; the page's own bar waits below |
| `A2-advisor-thread-374` | after the first message — the intro gives way, the thread fills the page |
| `A3-advisor-light-374` | Chalk, because the vendor lane carries both arms and he walks in whichever he last set (F-38.41) |

## The one thing worth looking at twice

**A1 and A2 differ in what happens to the intro.** The frame shows it giving way once a message exists — the page cannot carry a header, an intro, a note *and* a thread at 374 without the thread starting below the fold. **If the chair wants the intro to persist above the thread, say so and I redraw**; it is a real choice and the frame took a position on it.

## What is unmounted, and only here

On this route the shell's **AiDock button** and the **shared Ask TDW sheet** are not mounted — marked in the frame. Everywhere else they stay exactly as today and remain business. `variant='advisor'` is withdrawn.

## Three props die with it (the chair's three answers, recorded)

With the dock unmounted here, the room's old path — `WorklistShell → AiDock → AskSheet → useChat` — has no caller left. So `WorklistShell.room`, `AiDock.room` and `AskSheet.room` are all removed in the same cut.

**A prop nothing passes is how a later seat concludes the shared sheet may assert a room.** After this the only path to `room` in the estate is this page's own `useChat({ vendorId, room: 'advisor' })`, which is a stronger reading of *"the shared sheet sends nothing on any page"* than the prop chain ever was.

Four proof cells move with it, and the absence cell becomes stricter: **nothing** passes `room` to `WorklistShell`, `AiDock` or `AskSheet`; **only** `app/vendor/(shell)/advisor/page.tsx`'s `useChat` call carries it.

## Palette

Transcribed from `app/globals.css` — dark `--atelier-page-bg #141516` / `--atelier-ink #F0E6D2`, light `#F3F4F4` / `#0E1112`. Not a stand-in this time: these are the vendor lane's own tokens, which is the lane this page lives on. *(c-41.38 was the admin frames' Graphite standing in for `AdminUI.T`; that does not apply here.)*

## Asked for

1. **Keep or redraw** the thread-and-bar shape.
2. **A1 vs A2's intro** — does it give way, or persist above the thread?
3. Confirm the three prop removals ride the same cut.
