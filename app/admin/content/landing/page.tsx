'use client';
import ContentPage from '../../ContentPage';
export default function LandingPage() {
  return <ContentPage cfg={{ title: 'Landing Photos', sub: 'Full-bleed slideshow on the landing page', adminBase: '/api/v2/admin/landing-photos', listKey: 'photos', folder: 'landing_photos' }} />;
}
