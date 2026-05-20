export const DEFAULT_OG_IMAGE = '/Images/og-explore.png';

/**
 * Resolves raw image URLs to absolute paths compatible with social media scrapers.
 * Optimizes Supabase storage images and ensures local/relative paths are absolute.
 */
export function resolveOgImageUrl(
  rawUrl: string | null | undefined, 
  siteUrl: string
): string {
  if (!rawUrl) return `${siteUrl}${DEFAULT_OG_IMAGE}`;

  // External URLs (not Supabase storage) - use as-is
  if (rawUrl.startsWith('http') && 
      !rawUrl.includes('/storage/v1/object/public/notion-files/')) {
    return rawUrl;
  }

  // Supabase Storage - use render API for reliable social media compatibility and optimization
  if (rawUrl.includes('/storage/v1/object/public/notion-files/')) {
    return rawUrl
      .replace(
        '/storage/v1/object/public/notion-files/',
        '/storage/v1/render/image/public/notion-files/'
      )
      + '?width=1200&height=630&resize=cover&quality=80&format=jpeg';
  }

  // Local/relative images - ensure absolute URL for social scrapers
  const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  return `${siteUrl}${cleanPath}`;
}
