'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');
        body { background: #F8F7F5; margin: 0; }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#F8F7F5', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Back */}
        <div style={{ padding: '16px 20px 0' }}>
          <button onClick={() => router.push('/vendor/studio')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} color="#888580" />
            <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, color: '#888580', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Studio</span>
          </button>
        </div>
        {/* Header */}
        <div style={{ padding: '24px 20px 0' }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, color: '#888580', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>YOUR STUDIO</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 28, color: '#111111', margin: '0 0 4px' }}>Team</h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 11, color: '#888580', margin: 0 }}>Manage your crew</p>
        </div>
        {/* Coming soon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', padding: '0 40px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: '#888580', margin: '0 0 8px', lineHeight: 1.4 }}>Coming soon — your data is safe with us.</p>
        </div>
      </div>
    </>
  );
}
