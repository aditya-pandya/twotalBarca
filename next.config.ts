import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  allowedDevOrigins: [
    "192.168.1.233",
    "totalbarca-preview.adityapandya.com",
  ],
};

export default nextConfig;
