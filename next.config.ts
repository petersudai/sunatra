import type { NextConfig } from "next";

/*
  NEXTAUTH_URL resolution order:
  1. NEXTAUTH_URL env var — set explicitly in .env.local (dev) or Vercel dashboard (prod)
  2. VERCEL_URL — auto-injected by Vercel on every deployment (preview + production)
  3. localhost:3000 fallback for local dev without .env.local

  For the canonical production domain (sunatra.vercel.app or a custom domain),
  set NEXTAUTH_URL=https://sunatra.vercel.app in the Vercel project → Settings → Environment Variables.
  Mark it as "Production" only so preview branches use VERCEL_URL automatically.
*/
const nextAuthUrl =
  process.env.NEXTAUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: nextAuthUrl,
  },
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
