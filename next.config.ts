import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co", // Spotify covers
      },
      {
        protocol: "https",
        hostname: "**.sndcdn.com", // SoundCloud
      },
    ],
  },
};

export default nextConfig;
