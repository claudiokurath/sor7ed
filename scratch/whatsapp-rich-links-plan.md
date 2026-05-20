# WhatsApp Rich Links Implementation Plan

Based on the Perplexity search results, here is the plan to implement branded rich preview links for WhatsApp.

## 1. Database Schema

Create a migration or run SQL to create the following tables:

### `rich_links`
- `id`: UUID (Primary Key)
- `slug`: Text (Unique, used in URL)
- `title`: Text
- `description`: Text
- `target_url`: Text (Where to redirect)
- `image_url`: Text (Optional, for custom image)
- `created_at`: Timestamp

### `rich_link_clicks`
- `id`: UUID (Primary Key)
- `link_id`: UUID (Foreign Key to `rich_links`)
- `clicked_at`: Timestamp
- `user_agent`: Text (Optional)

## 2. Next.js Routes

### Dynamic Route for Redirect & Preview
File: `app/r/[slug]/page.tsx`
This page will serve the Open Graph tags for WhatsApp and then redirect the user to the target URL (or show a "Redirecting" message if JS is disabled).

### Dynamic OG Image
File: `app/r/[slug]/opengraph-image.tsx`
This will generate a dynamic image using Next.js Edge runtime and `@vercel/og` if we want dynamic previews.

## 3. WhatsApp Webhook Integration

Update the WhatsApp webhook to:
1. Detect a keyword or condition.
2. Generate or fetch a `rich_link` entry.
3. Send the URL `https://sor7ed.com/r/[slug]` to the user.

---

## Next Steps

1. **Task 3:** Fix the 404 error on `/intelligence/relapse-recovery-spiral`.
2. **Task 2:** Implement the database schema for Rich Links.
3. **Task 2:** Create the dynamic route and OG image generator.
