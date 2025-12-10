import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedEnv: true,
    viewTransition: true,
  },
};

export default nextConfig;
