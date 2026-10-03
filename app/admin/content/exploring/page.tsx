'use client';
import ContentPage from '../../ContentPage';
export default function ExploringPage() {
  return <ContentPage cfg={{ title: 'Just exploring gallery', sub: 'Mood pictures for visitors who have not signed up', adminBase: '/api/v2/admin/exploring-photos', listKey: 'photos', folder: 'exploring_photos' }} />;
}
