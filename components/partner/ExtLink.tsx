// components/partner/ExtLink.tsx · CE-47 · PTN-A1 app · THE FOUNDER'S RULE: every Instagram handle and every website is a
// link. The server sends READY https addresses; this only draws them: a new tab, rel noopener noreferrer. With no address
// it draws nothing (never a dead link, never the bare text standing in for one).
export function ExtLink({ href, children, className }: { href: string | null | undefined; children: React.ReactNode; className?: string }) {
  if (!href || !/^https?:\/\//i.test(href)) return null;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} data-ext-link="" style={{ color: 'var(--atelier-accent-text)', textDecoration: 'underline', textUnderlineOffset: 3 }}>{children}</a>;
}
