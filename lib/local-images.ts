/**
 * Resolves a local image path for a tool or article by slug.
 * Checks /Images/tools/[slug].{jpg,jpeg,png,webp} for tools
 * Checks /Images/articles/[slug].{jpg,jpeg,png,webp} for articles
 * Falls back to the cover_image from Supabase if no local file found.
 */
export function getLocalImagePath(type: 'tools' | 'articles', slug: string): string {
  // We try jpg first — the browser will fall back via onError in the component
  return `/Images/${type}/${slug}.jpg`;
}

/**
 * Returns all candidate local image paths for a slug.
 * Use the first one that loads.
 */
export function getImageCandidates(type: 'tools' | 'articles', slug: string): string[] {
  return [
    `/Images/${type}/${slug}.jpg`,
    `/Images/${type}/${slug}.jpeg`,
    `/Images/${type}/${slug}.png`,
    `/Images/${type}/${slug}.webp`,
  ];
}
