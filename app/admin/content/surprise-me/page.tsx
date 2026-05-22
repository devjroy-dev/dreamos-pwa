'use client';
import ContentPage from '../../ContentPage';
export default function SurpriseMePage() {
  return <ContentPage cfg={{ title: 'Surprise Me', sub: 'Taste quiz image pool — up to 100 images', adminBase: '/api/v2/admin/surprise-pool', listKey: 'images', max: 100, folder: 'surprise_pool' }} />;
}
