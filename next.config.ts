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
      // Notion-hosted temporary image URLs (fallback while cron hasn't re-hosted yet)
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.notion.so',
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
