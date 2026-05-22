'use client';
import ContentPage from '../../ContentPage';
export default function MusePoolPage() {
  return <ContentPage cfg={{ title: 'Muse Pool', sub: 'Pre-seeded into every new bride\'s muse board on sign-up', adminBase: '/api/v2/admin/muse-pool', listKey: 'images', max: 20, folder: 'muse_pool' }} />;
}
