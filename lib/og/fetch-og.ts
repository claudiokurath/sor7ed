export async function fetchExternalOg(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { title: url };
    const html = await res.text();
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) || html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) || html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    return {
      title: titleMatch ? titleMatch[1] : undefined,
      description: descMatch ? descMatch[1] : undefined,
      image: imgMatch ? imgMatch[1] : undefined,
    };
  } catch (error) {
    return { title: url };
  }
}
