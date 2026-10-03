'use client';
import ContentPage from '../../ContentPage';
export default function HeroesPage() {
  return <ContentPage cfg={{ title: 'Discover top pictures', sub: 'Shown at the top of Discover in the Dreamers\' app. Being replaced by Vendors of the week.', adminBase: '/api/v2/admin/discover-heroes', listKey: 'heroes', folder: 'discover_heroes' }} />;
}
