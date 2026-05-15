import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { getTemplateByKeyword } from "@/lib/whatsapp-templates";
import { cacheNotionFile } from "@/lib/notion-file-cache";
import { branches } from "@/lib/constants";

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
                .select('id, user_id, first_name')
                .eq('whatsapp_number', normalizedPhone)
                .single();

            if (!user) {
                const signupPrompt = `Welcome to SOR7ED! It looks like you haven't registered your number yet. Please sign up at ${process.env.NEXT_PUBLIC_SITE_URL}/signup to unlock your protocols.`;
                await sendWhatsAppMessage(senderPhone, signupPrompt);
                return NextResponse.json({ status: "unregistered" });
            }

            // First message — send onboarding welcome sequence
            if (!user.whatsapp_onboarded) {
                await handleOnboarding(senderPhone, normalizedPhone, user.first_name ?? 'there', supabase);
                await supabase
                    .from('users')
                    .update({ whatsapp_onboarded: true, whatsapp_onboarded_at: new Date().toISOString() })
                    .eq('id', user.id);
                return NextResponse.json({ status: "onboarded" });
            }

            // Handle dashboard commands
            if (keyword === 'menu' || keyword === 'branches') {
                await sendBranchMenu(senderPhone, normalizedPhone);
                return NextResponse.json({ status: "ok" });
            }
            // Branch number shortcuts: 1–7
            if (/^[1-7]$/.test(keyword)) {
                const branch = branches[parseInt(keyword) - 1];
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
                await sendWhatsAppMessage(senderPhone, `${branch.icon} *${branch.name}*\n${branch.description}`, false);
                await new Promise(r => setTimeout(r, 400));
                await sendWhatsAppMessage(senderPhone, `${siteUrl}/${branch.slug}`, true);
                return NextResponse.json({ status: "ok" });
            }
            if (keyword === 'help') {
                await handleHelpCommand(senderPhone);
                return NextResponse.json({ status: "ok" });
            }
            if (keyword === 'status') {
                await handleStatusCommand(senderPhone, user.id, user.first_name ?? 'there', supabase);
                return NextResponse.json({ status: "ok" });
            }
            if (keyword === 'dashboard') {
                await handleDashboardCommand(senderPhone, normalizedPhone);
                return NextResponse.json({ status: "ok" });
            }
            if (keyword === 'park') {
                await handleParkCommand(senderPhone, user.first_name ?? 'there');
                return NextResponse.json({ status: "ok" });
            }
            if (keyword === 'new') {
                await handleNewCommand(senderPhone, user.first_name ?? 'there', supabase);
                return NextResponse.json({ status: "ok" });
            }
            if (keyword === 'history') {
                await handleHistoryCommand(senderPhone, user.id, user.first_name ?? 'there', supabase);
                return NextResponse.json({ status: "ok" });
            }

            // Handle AUDIO [keyword] requests
            if (keyword.startsWith('audio ')) {
                const baseKeyword = keyword.slice(6).trim();
                await handleAudioRequest(senderPhone, normalizedPhone, baseKeyword, user.first_name ?? 'there', supabase);
                return NextResponse.json({ status: "ok" });
            }

            // 1. Look up keyword in Notion BLOG database (WhatsApp Trigger field)
            const notionArticle = await lookupNotionArticle(keyword);

            if (notionArticle) {
                if (notionArticle.pdfUrl) {
                    await sendWhatsAppDocument(senderPhone, notionArticle.pdfUrl, notionArticle.title, notionArticle.excerpt || '');
                } else if (notionArticle.gammaUrl) {
                    const content = `Hi ${user.first_name ?? 'there'}, here's your protocol: *${notionArticle.title}*\n\n${notionArticle.excerpt || ''}\n\n${notionArticle.gammaUrl}`;
                    await sendWhatsAppMessage(senderPhone, content);
                } else {
                    const content = `Hi ${user.first_name ?? 'there'}, here's your protocol: *${notionArticle.title}*\n\n${notionArticle.excerpt || ''}`;
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
                        const content = `Hi ${user.first_name ?? 'there'}, I've prepared your assessment for *${tool.name}*.\n\n${tool.tldr}\n\n*START ASSESSMENT:*\n${bridgeUrl}\n\n(This link expires in 30 minutes)`;
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

async function sendBranchMenu(to: string, normalizedPhone: string) {
    await sendWhatsAppMessage(to, `Here's your dashboard — tap to open:`);
    await new Promise(r => setTimeout(r, 400));
    await handleDashboardCommand(to, normalizedPhone);
}

async function handleHelpCommand(to: string) {
    await sendWhatsAppMessage(to,
        `*SOR7ED commands:*\n\n` +
        `*MENU* — your 7 branch dashboard\n` +
        `*1–7* — open a specific branch\n` +
        `*STATUS* — your progress file\n` +
        `*NEW* — latest protocol\n` +
        `*HISTORY* — past diagnostics\n` +
        `*DASHBOARD* — full web view\n` +
        `*PARK* — pause without guilt\n` +
        `*AUDIO [keyword]* — audio version of any protocol\n\n` +
        `_Or text any keyword (like SPEND, MOMENTUM) to get a protocol delivered here._`
    );
}

async function handleOnboarding(
    to: string,
    normalizedPhone: string,
    firstName: string,
    supabase: ReturnType<typeof getSupabase>
) {
    // Message 1: Welcome
    await sendWhatsAppMessage(to,
        `Hey ${firstName}. You just made it into SOR7ED. 🤍\n\n` +
        `This thread is your intelligence file. No app. No inbox. Just this.\n\n` +
        `Your dashboard is below — tap to open it, pick a branch, and find what fits. ` +
        `When you find a protocol you want, text the keyword and it arrives here.`
    );

    await new Promise(r => setTimeout(r, 700));

    // Message 2: Personal dashboard bridge link (auto-logs them in)
    await handleDashboardCommand(to, normalizedPhone);
}

async function handleStatusCommand(
    to: string,
    userId: string,
    firstName: string,
    supabase: ReturnType<typeof getSupabase>
) {
    const { data: history } = await supabase
        .from('assessment_history')
        .select('tool_name, score, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(5);

    const { data: usage } = await supabase
        .from('protocol_usage')
        .select('keyword, used_at')
        .eq('user_id', userId)
        .order('used_at', { ascending: false })
        .limit(3);

    const assessmentLines = history?.length
        ? history.map(h => {
            const score = h.score ?? null;
            const emoji = score === null ? '⬜' : score >= 70 ? '🔴' : score >= 40 ? '🟡' : '🟢';
            return `${emoji} *${h.tool_name}* — ${score ?? 'Completed'}`;
          }).join('\n')
        : '⬜ No assessments yet';

    const recentLine = usage?.length
        ? `\n\n*Recent protocols:* ${usage.map(u => u.keyword).join(', ')}`
        : '';

    const msg =
        `\`\`\`YOUR INTELLIGENCE FILE\`\`\`\n\n` +
        `Hi ${firstName}. Here's where you stand:\n\n` +
        assessmentLines +
        recentLine +
        `\n\n━━━━━━━━\n` +
        `🔴 High friction  🟡 Some  🟢 Well calibrated\n\n` +
        `*Commands:*\n` +
        `DASHBOARD — full web view\n` +
        `NEW — latest protocol\n` +
        `HISTORY — all diagnostics\n` +
        `PARK — pause without guilt`;

    await sendWhatsAppMessage(to, msg);
}

async function handleDashboardCommand(to: string, normalizedPhone: string) {
    const supabase = getSupabase();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await supabase.from('whatsapp_sessions').insert({
        phone: normalizedPhone,
        token,
        tool_slug: 'dashboard',
        expires_at: expiresAt.toISOString(),
        source_keyword: 'dashboard',
        target_url: '/dashboard',
    });

    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/bridge?token=${token}&redirect=/dashboard`;
    await sendWhatsAppMessage(to, dashboardUrl, true);
}

async function handleParkCommand(to: string, firstName: string) {
    const msg =
        `PARKED. 🤍\n\n` +
        `Everything stays exactly where you left it, ${firstName}.\n\n` +
        `No timers. No pressure. No guilt.\n\n` +
        `When you have the headspace, just say hi and I'll give you one tiny next step.`;
    await sendWhatsAppMessage(to, msg);
}

async function handleNewCommand(
    to: string,
    firstName: string,
    supabase: ReturnType<typeof getSupabase>
) {
    const { data: protocol } = await supabase
        .from('protocols')
        .select('title, slug, excerpt, keyword')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (!protocol) {
        await sendWhatsAppMessage(to, 'No new protocols yet — check back soon!');
        return;
    }

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/protocols/${protocol.slug}`;
    const keywordHint = protocol.keyword ? `\n\nText *${protocol.keyword.toUpperCase()}* to get the protocol delivered here.` : '';
    const msg = `🆕 *Latest protocol for you, ${firstName}*\n\n*${protocol.title}*\n\n${protocol.excerpt || ''}${keywordHint}\n\n${url}`;
    await sendWhatsAppMessage(to, msg, true);
}

async function handleHistoryCommand(
    to: string,
    userId: string,
    firstName: string,
    supabase: ReturnType<typeof getSupabase>
) {
    const { data: history } = await supabase
        .from('assessment_history')
        .select('tool_name, score, level, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10);

    if (!history?.length) {
        await sendWhatsAppMessage(to, `No diagnostics on record yet, ${firstName}. Start one at ${process.env.NEXT_PUBLIC_SITE_URL}/tools`);
        return;
    }

    const lines = history.map(h => {
        const date = new Date(h.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const score = h.score !== null ? ` — ${h.score}` : '';
        return `• ${h.tool_name}${score} _(${date})_`;
    }).join('\n');

    await sendWhatsAppMessage(to, `\`\`\`DIAGNOSTIC RECORD\`\`\`\n\n${lines}`);
}

async function handleAudioRequest(
    senderPhone: string,
    normalizedPhone: string,
    keyword: string,
    firstName: string,
    supabase: ReturnType<typeof getSupabase>
) {
    const { data: protocol } = await supabase
        .from('protocols')
        .select('title, slug, audio_url, audio_status')
        .ilike('slug', keyword)
        .single();

    if (!protocol) {
        await sendWhatsAppMessage(senderPhone,
            `Couldn't find audio for "${keyword}". Text HELP for available options.`);
        return;
    }

    if (protocol.audio_status === 'ready' && protocol.audio_url) {
        await sendWhatsAppAudio(senderPhone, protocol.audio_url);
        return;
    }

    // Log the request for demand intelligence
    await supabase.from('audio_requests').insert({
        phone: normalizedPhone,
        protocol_slug: protocol.slug,
    });

    await sendWhatsAppMessage(senderPhone,
        `🎧 *Audio requested: ${protocol.title}*\n\nI haven't recorded this one yet, but I'll prioritise it. You'll receive it in this thread when it's ready.`
    );
}

async function sendWhatsAppAudio(to: string, audioUrl: string) {
    const url = `https://graph.facebook.com/v25.0/${process.env.META_PHONE_NUMBER_ID}/messages`;

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "audio",
            audio: { link: audioUrl },
        }),
    });
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

    // Get PDF URL from Gamma App File property — cache via Supabase to avoid 1-hour Notion expiry
    const files = props["Gamma App File"]?.files ?? [];
    let pdfUrl: string | null = null;
    if (files.length > 0) {
        const file = files[0];
        const rawUrl = file.type === "external" ? file.external?.url : file.file?.url ?? null;
        if (rawUrl) {
            const pageId = page.id.replace(/-/g, '');
            pdfUrl = await cacheNotionFile(rawUrl, pageId, "application/pdf");
        }
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

async function sendWhatsAppMessage(to: string, text: string, previewUrl = false) {
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
            text: { body: text, preview_url: previewUrl },
        }),
    });

    return await response.json();
}
