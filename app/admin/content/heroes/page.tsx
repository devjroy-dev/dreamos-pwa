'use client';
import ContentPage from '../../ContentPage';
export default function HeroesPage() {
  return <ContentPage cfg={{ title: 'Discover Heroes', sub: 'Hero images shown at top of bride\'s discover feed', adminBase: '/api/v2/admin/discover-heroes', listKey: 'heroes', folder: 'discover_heroes' }} />;
}
