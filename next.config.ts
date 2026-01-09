import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    inlineCss: true,
    viewTransition: true,
  },
};

export default nextConfig;
