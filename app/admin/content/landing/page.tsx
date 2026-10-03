'use client';
import ContentPage from '../../ContentPage';
export default function LandingPage() {
  return <ContentPage cfg={{ title: 'Front page slideshow', sub: 'Full-screen pictures on the front page', adminBase: '/api/v2/admin/landing-photos', listKey: 'photos', folder: 'landing_photos' }} />;
}
