import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  swcMinify: true,
  // Configure Turbopack properly as it can't be disabled
  turbopack: {
    // Turbopack configuration options
  }
};

export default nextConfig;
