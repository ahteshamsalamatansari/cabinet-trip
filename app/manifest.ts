import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cabinet Trip 2026',
    short_name: 'CabinetTrip',
    description: 'Expense calculator for Cabinet Trip 2026',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1e',
    theme_color: '#f59e0b',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
