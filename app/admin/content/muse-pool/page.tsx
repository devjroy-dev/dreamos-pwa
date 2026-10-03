'use client';
import ContentPage from '../../ContentPage';
export default function MusePoolPage() {
  return <ContentPage cfg={{ title: 'Starter mood board', sub: 'Added to every new Dreamer\'s mood board when they sign up', adminBase: '/api/v2/admin/muse-pool', listKey: 'images', max: 20, folder: 'muse_pool' }} />;
}
