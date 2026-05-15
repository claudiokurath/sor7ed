import { createClient } from "@supabase/supabase-js";

const BUCKET = "notion-files";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Given a Notion file URL (which expires in ~1 hour), downloads the file
 * and caches it permanently in Supabase Storage. Returns the permanent URL.
 *
 * - Pass a stable `cacheKey` (e.g. Notion page ID + property name) so the
 *   file is only downloaded once.
 * - If the cached file already exists the Notion URL is never fetched.
 */
export async function cacheNotionFile(
  notionUrl: string,
  cacheKey: string,
  contentType: "application/pdf" | "audio/mpeg" = "application/pdf"
): Promise<string | null> {
  if (!notionUrl) return null;

  const ext = contentType === "audio/mpeg" ? "mp3" : "pdf";
  const fileName = `${cacheKey}.${ext}`;
  const supabase = getSupabase();

  // Check if already cached
  const { data: existing } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  if (existing?.publicUrl) {
    // Quick HEAD check to verify the file actually exists in the bucket
    try {
      const check = await fetch(existing.publicUrl, { method: "HEAD" });
      if (check.ok) return existing.publicUrl;
    } catch {
      // Fall through to re-download
    }
  }

  // Download from Notion (temporary URL)
  let fileBuffer: ArrayBuffer;
  try {
    const res = await fetch(notionUrl);
    if (!res.ok) {
      console.error(`Failed to download Notion file: ${res.status}`);
      return null;
    }
    fileBuffer = await res.arrayBuffer();
  } catch (err) {
    console.error("Notion file download error:", err);
    return null;
  }

  // Upload to Supabase Storage permanently
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, fileBuffer, { contentType, upsert: true });

  if (error) {
    console.error("Supabase storage upload error:", error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return publicUrl;
}
