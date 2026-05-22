'use client';
import ContentPage from '../../ContentPage';
export default function ExploringPage() {
  return <ContentPage cfg={{ title: 'Exploring Photos', sub: '"Just Exploring" mood gallery for anonymous visitors', adminBase: '/api/v2/admin/exploring-photos', listKey: 'photos', folder: 'exploring_photos' }} />;
}
