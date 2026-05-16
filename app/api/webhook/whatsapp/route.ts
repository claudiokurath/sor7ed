import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { getTemplateByKeyword } from "@/lib/whatsapp-templates";
import { cacheNotionFile } from "@/lib/notion-file-cache";
import { branches } from "@/lib/constants";

export const dynamic = "force-dynamic";

// Normalize incoming text: lowercase, trim, expand common misspellings
function normalizeKeyword(raw: string): string {
    const lower = raw.trim().toLowerCase();
    const ALIASES: Record<string, string> = {
        // Tool spelling variants
        'dopamin':    'dopamine',
        'dopamaine':  'dopamine',
        'burnot':     'burnout',
        'burn out':   'burnout',
        'firstaid':   'firstaid',
        'first aid':  'firstaid',
        'adhdtax':    'reset4',
        'adhd tax':   'reset4',
        'moneyreset': 'reset4',
        'memorypalace': 'memory',
        'sensoryaudit': 'audit',
        'bodydouble':   'match',
        'financialautopilot': 'autopilot',
        "let's get sorted": 'hi',
        // Universal entry points → category shortcuts
        'overwhelm':       'focus',
        'overwhelmed':     'focus',
        'stuck':           'focus',
        'cant start':      'focus',
        "can't start":     'focus',
        'procrastinate':   'focus',
        'procrastinating': 'focus',
        'too much':        'focus',
        'can\'t focus':    'focus',
        'cant focus':      'focus',
        'exhausted':       'body',
        'stressed':        'body',
        'stress':          'body',
        'tired':           'body',
        'no energy':       'body',
        'burnt out':       'body',
        'burned out':      'body',
        'argument':        'people',
        'conflict':        'people',
        'difficult conversation': 'people',
        'cant sleep':      'sleep',
        "can't sleep":     'sleep',
        'insomnia':        'sleep',
        'bills':           'money',
        'money problems':  'money',
        'money stress':    'money',
        'broke':           'money',
        'worried':         'body',
        'anxious':         'body',
        'anxiety':         'body',
    };
    return ALIASES[lower] ?? lower;
}

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
            const rawText = message.text.body.trim();
            const keyword = normalizeKeyword(rawText);

            console.log(`Received WhatsApp message: "${rawText}" → normalized: "${keyword}" from ${senderPhone}`);

            // ── CRISIS DETECTION — always first, no auth required ─────────────
            const CRISIS_PATTERNS = [
                /suicid/i, /kill myself/i, /end it all/i, /want to die/i,
                /cant go on/i, /can't go on/i, /hopeless/i, /hurt myself/i,
                /overdos/i, /no point/i,
            ];
            if (CRISIS_PATTERNS.some(p => p.test(rawText))) {
                await markMessageRead(message.id);
                await sendWhatsAppMessage(senderPhone,
                    `You reached out and that matters. 🤍\n\n` +
                    `SOR7ED is not a crisis service — please reach out to someone who can help right now:\n\n` +
                    `🆘 *999* — immediate danger\n` +
                    `💬 *Text SHOUT to 85258* — free, 24/7\n` +
                    `📞 *Samaritans: 116 123* — free, 24/7\n\n` +
                    `You don't need to explain yourself. Just reach out.`
                );
                return NextResponse.json({ status: "crisis_handled" });
            }

            // Mark message as read (shows blue ticks)
            await markMessageRead(message.id);

            const supabase = getSupabase();
            const normalizedPhone = senderPhone.startsWith('+') ? senderPhone : `+${senderPhone}`;

            // ── STOP / GDPR OPT-OUT — before user lookup ─────────────────────
            if (keyword === 'stop') {
                await supabase
                    .from('users')
                    .update({ whatsapp_opted_out: true, weekly_opted_in: false })
                    .eq('whatsapp_number', normalizedPhone);
                await sendWhatsAppMessage(senderPhone,
                    `You are unsubscribed from all SOR7ED messages.\n\n` +
                    `Text *START* to re-enable any time.\n` +
                    `To delete your data: hello@sor7ed.com`
                );
                return NextResponse.json({ status: "opted_out" });
            }

            if (keyword === 'start') {
                await supabase
                    .from('users')
                    .update({ whatsapp_opted_out: false })
                    .eq('whatsapp_number', normalizedPhone);
                await sendWhatsAppMessage(senderPhone, `Welcome back. Text *MENU* to see your branches.`);
                return NextResponse.json({ status: "opted_in" });
            }

            if (keyword === 'stopweekly') {
                await supabase
                    .from('users')
                    .update({ weekly_opted_in: false })
                    .eq('whatsapp_number', normalizedPhone);
                await sendWhatsAppMessage(senderPhone,
                    `Weekly updates stopped.\n\n` +
                    `You will still get responses when you text keywords.\n` +
                    `Text *STARTWEEKLY* to turn them back on.`
                );
                return NextResponse.json({ status: "weekly_stopped" });
            }

            if (keyword === 'startweekly') {
                await supabase
                    .from('users')
                    .update({ weekly_opted_in: true, weekly_opted_in_at: new Date().toISOString() })
                    .eq('whatsapp_number', normalizedPhone);
                await sendWhatsAppMessage(senderPhone,
                    `You are in for weekly updates — every Tuesday, one useful thing. 🤍\n\n` +
                    `Text *STOPWEEKLY* any time to turn them off.`
                );
                return NextResponse.json({ status: "weekly_started" });
            }

            const { data: user } = await supabase
                .from('users')
                .select('id, user_id, first_name, whatsapp_onboarded, whatsapp_opted_out, weekly_opted_in')
                .eq('whatsapp_number', normalizedPhone)
                .single();

            if (!user) {
                await sendWhatsAppMessage(senderPhone,
                    `Hey! You just found SOR7ED — practical tools for overwhelmed minds. 🤍\n\n` +
                    `Sign up free to unlock your intelligence file:\n` +
                    `${process.env.NEXT_PUBLIC_SITE_URL}/signup\n\n` +
                    `Once you're in, text what's wrong anytime and I'll send the right tool.`
                );
                return NextResponse.json({ status: "unregistered" });
            }

            if (user.whatsapp_opted_out) {
                return NextResponse.json({ status: "opted_out" });
            }

            // WhatsApp verification code — check before onboarding
            if (/^verify\s+\d{6}$/i.test(keyword)) {
                const code = keyword.split(/\s+/)[1];
                const { data: userRecord } = await supabase
                    .from('users')
                    .select('id, first_name, wa_verify_code, whatsapp_verified')
                    .eq('whatsapp_number', normalizedPhone)
                    .single();

                if (!userRecord) {
                    await sendWhatsAppMessage(senderPhone, `Code not recognised. Make sure you signed up at ${process.env.NEXT_PUBLIC_SITE_URL}/signup first.`);
                } else if (userRecord.whatsapp_verified) {
                    await sendWhatsAppMessage(senderPhone, `Your WhatsApp is already verified, ${userRecord.first_name ?? 'there'}. ✅`);
                } else if (userRecord.wa_verify_code === code) {
                    await supabase
                        .from('users')
                        .update({ whatsapp_verified: true, wa_verify_code: null })
                        .eq('id', userRecord.id);
                    await sendWhatsAppMessage(senderPhone,
                        `✅ WhatsApp verified, ${userRecord.first_name ?? 'there'}!\n\n` +
                        `Your intelligence file is ready. Text *MENU* to see your 7 branches, or start your first diagnostic:\n` +
                        `${process.env.NEXT_PUBLIC_SITE_URL}/tools`
                    );
                } else {
                    await sendWhatsAppMessage(senderPhone,
                        `That code doesn't match. Check your signup confirmation page for the right 6-digit code.`
                    );
                }
                return NextResponse.json({ status: "ok" });
            }

            // First message — send onboarding welcome sequence
            if (!user.whatsapp_onboarded) {
                await handleOnboarding(senderPhone, normalizedPhone, user.first_name ?? 'there');
                await supabase
                    .from('users')
                    .update({ whatsapp_onboarded: true, whatsapp_onboarded_at: new Date().toISOString() })
                    .eq('id', user.id);
                return NextResponse.json({ status: "onboarded" });
            }

            // Entry/greeting phrases — show compact help
            const entryPhrases = ['sor7ed', 'sorted', 'lets get sorted', 'hello', 'hi', 'hey'];
            if (entryPhrases.includes(keyword)) {
                await handleHelpCommand(senderPhone);
                return NextResponse.json({ status: "ok" });
            }

            if (keyword === 'help') {
                await handleHelpCommand(senderPhone);
                return NextResponse.json({ status: "ok" });
            }

            // Handle dashboard commands
            if (keyword === 'menu' || keyword === 'branches') {
                await sendBranchMenu(senderPhone);
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

            // ── CATEGORY SHORTCUTS ────────────────────────────────────────────
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
            const categoryRoutes: Record<string, { slug: string; label: string; tools: string }> = {
                focus:    { slug: 'keep-going',    label: 'Focus + Momentum',  tools: 'MEMORY • MOMENTUM • BREAKDOWN' },
                body:     { slug: 'feel-good',     label: 'Body + Energy',     tools: 'BURNOUT • SENSORY • SLEEP' },
                money:    { slug: 'spend-smart',   label: 'Money',             tools: 'RESET4 • AUTOPILOT • AUDIT' },
                people:   { slug: 'be-connected',  label: 'Relationships',     tools: 'AUDIT • FIRSTAID • TRANSLATE' },
                work:     { slug: 'be-yourself',   label: 'Work + Identity',   tools: 'TRANSLATE • MATCH • MEMORY' },
                sleep:    { slug: 'plan-ahead',    label: 'Planning + Safety', tools: 'FIRSTAID • MATCH' },
                level:    { slug: 'level-up',      label: 'Growth + Skills',   tools: 'MATCH • MEMORY • MOMENTUM' },
            };
            if (keyword in categoryRoutes) {
                const cat = categoryRoutes[keyword];
                await sendWhatsAppMessage(senderPhone,
                    `*${cat.label}* tools:\n\n${cat.tools}\n\nText any keyword to get it delivered here.\n\n${siteUrl}/${cat.slug}`,
                    true
                );
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
                await handleAudioRequest(senderPhone, normalizedPhone, baseKeyword, supabase);
                return NextResponse.json({ status: "ok" });
            }

            // 1. Look up keyword in Notion BLOG database (WhatsApp Trigger field)
            const notionArticle = await lookupNotionArticle(keyword);
            let contentDelivered = false;
            let contentId = keyword;

            if (notionArticle) {
                contentDelivered = true;
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
                    contentDelivered = true;
                    contentId = tool.slug;
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
                    await sendWhatsAppMessage(senderPhone,
                        `"${rawText}" is not a keyword I recognise.\n\n` +
                        `Text *HELP* to find what you need.\n` +
                        `Text *MENU* to browse your 7 branches.`
                    );
                }
            }

            // Log every content delivery for analytics/compliance
            if (contentDelivered) {
                await supabase.from('whatsapp_message_log').insert({
                    user_phone: normalizedPhone,
                    message_type: notionArticle ? 'protocol' : 'tool',
                    content_id: contentId,
                });

                // Offer weekly opt-in after first content delivery (once only)
                if (!user.weekly_opted_in) {
                    await new Promise(r => setTimeout(r, 800));
                    await sendWhatsAppMessage(senderPhone,
                        `Quick question — want one useful thing from SOR7ED every Tuesday?\n\n` +
                        `Just one message. Always actionable. Easy to stop.\n\n` +
                        `Text *STARTWEEKLY* to get them, or ignore this.`
                    );
                }
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

async function sendBranchMenu(to: string) {
    const exploreUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/explore`;
    await sendWhatsAppMessage(to, exploreUrl, true);
}

async function handleHelpCommand(to: string) {
    await sendWhatsAppMessage(to,
        `What's going on? Text any word below:\n\n` +
        `*OVERWHELMED* • *STUCK* • *FOCUS*\n` +
        `→ Can't start, too much to do\n\n` +
        `*EXHAUSTED* • *STRESSED* • *BODY*\n` +
        `→ Energy, burnout, recovery\n\n` +
        `*BILLS* • *MONEY*\n` +
        `→ Financial chaos\n\n` +
        `*ARGUMENT* • *PEOPLE*\n` +
        `→ Relationships, hard conversations\n\n` +
        `*SLEEP* — can't sleep\n\n` +
        `━━━━━━\n` +
        `*MENU* — all 7 branches\n` +
        `*STATUS* — your progress\n` +
        `*PARK* — pause without guilt\n` +
        `*DASHBOARD* — full web view\n\n` +
        `_Or just tell me what's wrong — I'll find the right tool._`
    );
}

async function handleOnboarding(
    to: string,
    normalizedPhone: string,
    firstName: string,
) {
    // Message 1: Welcome
    await sendWhatsAppMessage(to,
        `Hey ${firstName}. You just made it into SOR7ED. 🤍\n\n` +
        `This thread is your intelligence file. No app. No inbox. Just this.\n\n` +
        `Your dashboard is below — tap to open it, pick a branch, and find what fits. ` +
        `When you find a protocol you want, text the keyword and it arrives here.`
    );

    await new Promise(r => setTimeout(r, 700));

    // Message 2: Explore page with rich image preview
    await sendBranchMenu(to);
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

    const result = await response.json();
    if (!response.ok) {
        console.error("Meta API error:", JSON.stringify(result));
    }
    return result;
}
