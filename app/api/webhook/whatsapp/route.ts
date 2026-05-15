import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { getTemplateByKeyword } from "@/lib/whatsapp-templates";

export const dynamic = "force-dynamic";

const getSupabase = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Meta Verification Handler (GET)
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
        console.log("Webhook verified successfully!");
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse("Forbidden", { status: 403 });
}

async function createWhatsAppSession(phone: string, toolSlug: string, keyword: string) {
    const supabase = getSupabase();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); 
    
    const targetUrl = `/tools/${toolSlug}`;
    
    const { error } = await supabase
        .from('whatsapp_sessions')
        .insert({
            phone,
            token,
            tool_slug: toolSlug,
            expires_at: expiresAt.toISOString(),
            source_keyword: keyword,
            target_url: targetUrl
        });

    if (error) {
        console.error('Failed to create WhatsApp session:', error);
        throw new Error('Session creation failed');
    }

    return { token, targetUrl };
}

// Meta Message Handler (POST)
export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-hub-signature-256");

        if (!process.env.META_APP_SECRET) {
            console.error("META_APP_SECRET is not set — rejecting webhook");
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!signature) {
            console.error("Webhook received without signature");
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const hmac = crypto.createHmac("sha256", process.env.META_APP_SECRET);
        const digest = "sha256=" + hmac.update(rawBody).digest("hex");
        if (signature !== digest) {
            console.error("Webhook signature verification failed");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        
        if (message && message.type === "text") {
            const senderPhone = message.from;
            const keyword = message.text.body.trim().toLowerCase();

            console.log(`Received WhatsApp keyword: ${keyword} from ${senderPhone}`);

            // Mark message as read (shows blue ticks)
            await markMessageRead(message.id);

            const supabase = getSupabase();
            const normalizedPhone = senderPhone.startsWith('+') ? senderPhone : `+${senderPhone}`;
            
            const { data: user } = await supabase
                .from('users')
                .select('first_name')
                .eq('whatsapp_number', normalizedPhone)
                .single();

            if (!user) {
                const signupPrompt = `Welcome to SOR7ED! It looks like you haven't registered your number yet. Please sign up at ${process.env.NEXT_PUBLIC_SITE_URL}/signup to unlock your protocols.`;
                await sendWhatsAppMessage(senderPhone, signupPrompt);
                return NextResponse.json({ status: "unregistered" });
            }

            // 1. Look up keyword in Notion BLOG database (WhatsApp Trigger field)
            const notionArticle = await lookupNotionArticle(keyword);

            if (notionArticle) {
                if (notionArticle.pdfUrl) {
                    await sendWhatsAppDocument(senderPhone, notionArticle.pdfUrl, notionArticle.title, notionArticle.excerpt || '');
                } else if (notionArticle.gammaUrl) {
                    const content = `Hi ${user.first_name}, here's your protocol: *${notionArticle.title}*\n\n${notionArticle.excerpt || ''}\n\n${notionArticle.gammaUrl}`;
                    await sendWhatsAppMessage(senderPhone, content);
                } else {
                    const content = `Hi ${user.first_name}, here's your protocol: *${notionArticle.title}*\n\n${notionArticle.excerpt || ''}`;
                    await sendWhatsAppMessage(senderPhone, content);
                }
            } else {
                // 2. Fall back to Supabase tools
                const { data: tool } = await supabase
                    .from('tools')
                    .select('*')
                    .ilike('keyword', keyword)
                    .single();

                if (tool) {
                    const { token } = await createWhatsAppSession(normalizedPhone, tool.slug, keyword);
                    const template = getTemplateByKeyword(keyword);

                    if (template) {
                        await sendWhatsAppTemplate(senderPhone, keyword, token);
                    } else {
                        const bridgeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/bridge?token=${token}`;
                        const content = `Hi ${user.first_name}, I've prepared your assessment for *${tool.name}*.\n\n${tool.tldr}\n\n*START ASSESSMENT:*\n${bridgeUrl}\n\n(This link expires in 30 minutes)`;
                        await sendWhatsAppMessage(senderPhone, content);
                    }
                } else {
                    const helpText = "Sorry, I don't recognize that keyword. Check SOR7ED.com for the list of available protocols!";
                    await sendWhatsAppMessage(senderPhone, helpText);
                }
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

async function lookupNotionArticle(keyword: string): Promise<{ title: string; excerpt: string; pdfUrl: string | null; gammaUrl: string | null } | null> {
    const databaseId = process.env.NOTION_BLOG_DATABASE_ID;
    const apiKey = process.env.NOTION_API_KEY;
    if (!databaseId || !apiKey) return null;

    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            filter: {
                property: "WhatsApp Trigger",
                rich_text: { equals: keyword },
            },
            page_size: 1,
        }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const page = data.results?.[0];
    if (!page) return null;

    const props = page.properties;
    const title = props["Title"]?.title?.[0]?.plain_text ?? "";
    const excerpt = props["Excerpt"]?.rich_text?.[0]?.plain_text ?? "";
    const gammaUrl = props["Gamma URL"]?.url ?? null;

    // Get fresh PDF URL from Gamma App File property
    const files = props["Gamma App File"]?.files ?? [];
    let pdfUrl: string | null = null;
    if (files.length > 0) {
        const file = files[0];
        pdfUrl = file.type === "external" ? file.external?.url : file.file?.url ?? null;
    }

    return { title, excerpt, pdfUrl, gammaUrl };
}

async function sendWhatsAppTemplate(to: string, keyword: string, token: string) {
    const templateName = `sor7ed_${keyword.toLowerCase()}_entry_v1`;
    const url = `https://graph.facebook.com/v25.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
                name: templateName,
                language: { code: "en" },
                components: [
                    {
                        type: "button",
                        sub_type: "url",
                        index: "0",
                        parameters: [
                            {
                                type: "text",
                                text: token
                            }
                        ]
                    }
                ]
            }
        }),
    });

    if (!response.ok) {
        console.warn(`Template ${templateName} failed or not approved. Falling back to plain text.`);
        await sendFallbackMessage(to, keyword, token);
    }
}

async function sendFallbackMessage(to: string, keyword: string, token: string) {
    const content = getTemplateByKeyword(keyword);
    if (!content) return;

    const bridgeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/bridge?token=${token}`;
    const fallbackText = `\`\`\`SYSTEM: ${content.systemAlert}\`\`\`\n\n${content.hookLine}\n\n*${content.assessmentName}*\nTime required: ${content.duration}.\n\n*START ASSESSMENT:*\n${bridgeUrl}`;

    await sendWhatsAppMessage(to, fallbackText);
}

async function markMessageRead(messageId: string) {
    const url = `https://graph.facebook.com/v25.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            status: "read",
            message_id: messageId,
        }),
    });
}

async function sendWhatsAppDocument(to: string, pdfUrl: string, filename: string, caption: string) {
    const url = `https://graph.facebook.com/v25.0/${process.env.META_PHONE_NUMBER_ID}/messages`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "document",
            document: {
                link: pdfUrl,
                filename: `${filename}.pdf`,
                caption,
            },
        }),
    });

    return await response.json();
}

async function sendWhatsAppMessage(to: string, text: string) {
    const url = `https://graph.facebook.com/v25.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "text",
            text: { body: text },
        }),
    });

    return await response.json();
}
