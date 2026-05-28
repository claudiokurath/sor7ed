export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';
export const DEFAULT_OG_IMAGE = '/Images/banners/landing%20banner.png';

/**
 * Resolves raw image URLs to absolute paths compatible with social media scrapers.
 * Midjourney CDN URLs expire and are NOT used — falls back to default.
 * Supabase storage images are rendered via the render API for reliability.
 * Local/relative paths are made absolute.
 */
export function resolveOgImageUrl(
  rawUrl: string | null | undefined,
  fallback = DEFAULT_OG_IMAGE
): string {
  if (!rawUrl) return `${SITE_URL}${fallback}`;

  // Midjourney CDN URLs expire — never use them for OG images
  if (rawUrl.includes('cdn.midjourney.com')) {
    return `${SITE_URL}${fallback}`;
  }

  // Supabase Storage — use render API for reliable social media compatibility
  if (rawUrl.includes('/storage/v1/object/public/notion-files/')) {
    return rawUrl
      .replace(
        '/storage/v1/object/public/notion-files/',
        '/storage/v1/render/image/public/notion-files/'
      )
      + '?width=1200&height=630&resize=cover&quality=80&format=jpeg';
  }

  // Supabase Storage (other buckets) — use as-is if absolute
  if (rawUrl.includes('supabase') && rawUrl.startsWith('http')) {
    return rawUrl;
  }

  // External URLs — use as-is
  if (rawUrl.startsWith('http')) {
    return rawUrl;
  }

  // Local/relative images — ensure absolute URL for social scrapers
  const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  return `${SITE_URL}${cleanPath}`;
}
