import React from 'react';
// app/(auth)/layout.tsx — Passthrough for PIN/login/onboarding.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
