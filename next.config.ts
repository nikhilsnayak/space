import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
