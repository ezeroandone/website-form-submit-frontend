import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All API calls go to the Cloudflare Worker
  async rewrites() {
    return [];
  },
};

export default nextConfig;
