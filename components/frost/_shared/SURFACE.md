# The Sanctuary surface — one screen, nine files

TDW_13 · D-4 split six blooms out of `app/(frost)/frost/canvas/sanctuary/page.tsx`
into `components/frost/blooms/` and moved two shared helpers into
`components/frost/_shared/`. **The bride's Sanctuary did not change.** It is the
same screen; it is simply spread across nine files instead of one.

Any bench asking a question about *Sanctuary* — how many controls it carries,
whether a copy byte is intact, whether a capability is still reachable — must
read the **surface**, not the path:

```js
const SURFACE = [
  'app/(frost)/frost/canvas/sanctuary/page.tsx',
  ...fs.readdirSync('components/frost/blooms').map(f => `components/frost/blooms/${f}`),
  ...fs.readdirSync('components/frost/_shared').filter(f => /\.tsx?$/.test(f))
        .map(f => `components/frost/_shared/${f}`),
];
```

Read the directories; never hand-list the blooms. A written list is exactly how a
control escapes a census — add a file, name it nowhere, and the count still passes.

A bench that reads only the conductor after D-4 is answering a *path* question
when it was asked a *surface* question. That is the specific danger of extraction
and the reason six benches were amended in the same delivery that moved the code.
