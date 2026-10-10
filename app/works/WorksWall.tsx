// app/works/WorksWall.tsx · CE-47 · LAND-1 package 2 · the wall's element, one home. tdw.works renders it on the server
// with the wall the request drew; the sign-in screens render it in the browser (WorksBackdrop.tsx). The markup is
// lib/works/wall.ts; the look and the drift are works.css (.tdww .wall, .plane, .colm, .track).
export default function WorksWall({ html }: { html: string }) {
  return (
    <div className="wall" aria-hidden="true">
      <div className="plane" id="plane" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
