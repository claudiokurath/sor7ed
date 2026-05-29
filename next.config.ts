import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (cover images persisted by sync-notion cron)
      {
        protocol: 'https',
        hostname: 'wyxvbzbqbznqjftbgcxc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Supabase Render API (image transformations)
      {
        protocol: 'https',
        hostname: 'wyxvbzbqbznqjftbgcxc.supabase.co',
        pathname: '/storage/v1/render/**',
      },
      // Notion-hosted temporary image URLs (fallback while cron hasn't re-hosted yet)
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.notion.so',
      },
      // Midjourney CDN (direct cover image URLs from Notion properties)
      {
        protocol: 'https',
        hostname: 'cdn.midjourney.com',
      },
      // External image hosts commonly used in Notion pages
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
// deploy 1780015940
// deploy 1780015940
