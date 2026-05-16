import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const getSupabase = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    // Vercel cron authenticates with CRON_SECRET in the Authorization header
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();

    // Fetch this week's featured article from Notion
    const featured = await fetchFeaturedNotionArticle();
    if (!featured) {
        console.log("Weekly broadcast: no featured content found, skipping.");
        return NextResponse.json({ skipped: true, reason: "No featured content marked in Notion" });
    }

    // Get all opted-in, non-opted-out users
    const { data: users, error } = await supabase
        .from("users")
        .select("id, whatsapp_number, first_name")
        .eq("weekly_opted_in", true)
        .eq("whatsapp_opted_out", false)
        .eq("whatsapp_verified", true)
        .not("whatsapp_number", "is", null);

    if (error || !users?.length) {
        console.log("Weekly broadcast: no opted-in users or DB error", error);
        return NextResponse.json({ skipped: true, reason: "No opted-in users" });
    }

    const apiUrl = `https://graph.facebook.com/v25.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
    const headers = {
        "Authorization": `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
    };

    let sent = 0;
    let failed = 0;
    const now = new Date().toISOString();

    // Send in batches of 20 with a 1s gap to respect Meta rate limits
    const BATCH = 20;
    for (let i = 0; i < users.length; i += BATCH) {
        const batch = users.slice(i, i + BATCH);

        await Promise.all(batch.map(async (user) => {
            const to = user.whatsapp_number.replace(/^\+/, "");
            const name = user.first_name ?? "there";

            const body =
                `This week from SOR7ED — for you, ${name}:\n\n` +
                `*${featured.title}*\n\n` +
                `${featured.excerpt ? featured.excerpt + "\n\n" : ""}` +
                `${featured.articleUrl}\n\n` +
                (featured.keyword ? `Text *${featured.keyword.toUpperCase()}* to get the full protocol.\n\n` : "") +
                `Text *STOPWEEKLY* to turn these off.`;

            try {
                const res = await fetch(apiUrl, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to,
                        type: "text",
                        text: { body, preview_url: true },
                    }),
                });

                if (res.ok) {
                    sent++;
                    // Log the send
                    await supabase.from("whatsapp_message_log").insert({
                        user_phone: user.whatsapp_number,
                        message_type: "weekly",
                        content_id: featured.slug,
                        sent_at: now,
                    });
                    // Update last sent timestamp on user
                    await supabase
                        .from("users")
                        .update({ last_weekly_sent_at: now })
                        .eq("id", user.id);
                } else {
                    failed++;
                    const err = await res.json();
                    console.error(`Weekly broadcast failed for ${user.whatsapp_number}:`, err);
                }
            } catch (err) {
                failed++;
                console.error(`Weekly broadcast exception for ${user.whatsapp_number}:`, err);
            }
        }));

        // Rate-limit gap between batches
        if (i + BATCH < users.length) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    console.log(`Weekly broadcast complete: ${sent} sent, ${failed} failed — "${featured.title}"`);
    return NextResponse.json({ sent, failed, title: featured.title });
}

interface FeaturedArticle {
    title: string;
    slug: string;
    excerpt: string;
    keyword: string;
    articleUrl: string;
}

async function fetchFeaturedNotionArticle(): Promise<FeaturedArticle | null> {
    const databaseId = process.env.NOTION_BLOG_DB_ID || process.env.NOTION_BLOG_DATABASE_ID;
    const apiKey = process.env.NOTION_API_KEY;
    if (!databaseId || !apiKey) return null;

    try {
        const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filter: {
                    and: [
                        { property: "Weekly Featured", checkbox: { equals: true } },
                        { property: "Weekly Sent", checkbox: { equals: false } },
                        { property: "Status", select: { equals: "Published" } },
                    ],
                },
                sorts: [{ property: "Created", direction: "descending" }],
                page_size: 1,
            }),
        });

        if (!res.ok) return null;
        const data = await res.json();
        const page = data.results?.[0];
        if (!page) return null;

        const props = page.properties;
        const title = props["Title"]?.title?.[0]?.plain_text ?? "";
        const slug = props["Slug"]?.rich_text?.[0]?.plain_text ?? "";
        const excerpt = props["Excerpt"]?.rich_text?.[0]?.plain_text ?? "";
        const keyword = props["WhatsApp Trigger"]?.rich_text?.[0]?.plain_text ?? "";

        if (!title || !slug) return null;

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sor7ed.com";

        // Mark as sent in Notion so it does not go out again next week
        await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                properties: { "Weekly Sent": { checkbox: true } },
            }),
        });

        return { title, slug, excerpt, keyword, articleUrl: `${siteUrl}/intelligence/${slug}` };
    } catch {
        return null;
    }
}
