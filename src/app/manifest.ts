import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Space',
    short_name: 'Space',
    description:
      'A personal software workspace where I build and use the tools I need',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0a09',
    theme_color: '#0c0a09',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
