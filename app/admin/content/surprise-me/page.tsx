'use client';
import ContentPage from '../../ContentPage';
export default function SurpriseMePage() {
  return <ContentPage cfg={{ title: 'Taste quiz pictures', sub: 'The Surprise me quiz, up to 100 pictures', adminBase: '/api/v2/admin/surprise-pool', listKey: 'images', max: 100, folder: 'surprise_pool' }} />;
}
