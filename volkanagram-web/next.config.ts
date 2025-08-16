import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'volkanagram-api',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.4.124',
        port: '5001',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
