// app/demo/vendor/[handle]/layout.tsx
// Shared layout wrapper for demo vendor experience.
// NO session checks. NO redirects. NO auth of any kind.

export default function DemoVendorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
