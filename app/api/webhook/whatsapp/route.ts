import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { getTemplateByKeyword } from "@/lib/whatsapp-templates";
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
                    `You reached out and that matters.\n\n` +
                    `SOR7ED is not a crisis service — please reach out to someone who can help right now:\n\n` +
                    `*999* — immediate danger\n` +
                    `*Text SHOUT to 85258* — free, 24/7\n` +
                    `*Samaritans: 116 123* — free, 24/7\n\n` +
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
                    `*All done.*\n\n` +
                    `You're unsubscribed from all SOR7ED messages.\n\n` +
                    `Text *START* any time to come back.\n` +
                    `To delete your data: hello@sor7ed.com`
                );
                return NextResponse.json({ status: "opted_out" });
            }

            if (keyword === 'start') {
                await supabase
                    .from('users')
                    .update({ whatsapp_opted_out: false })
                    .eq('whatsapp_number', normalizedPhone);
                await sendWhatsAppMessage(senderPhone,
                    `Welcome back.\n\nText *MENU* to see your 7 branches whenever you're ready.`
                );
                return NextResponse.json({ status: "opted_in" });
            }

            if (keyword === 'stopweekly') {
                await supabase
                    .from('users')
                    .update({ weekly_opted_in: false })
                    .eq('whatsapp_number', normalizedPhone);
                await sendWhatsAppMessage(senderPhone,
                    `*Weekly updates paused.*\n\n` +
                    `You'll still get protocols when you text keywords — that never stops.\n\n` +
                    `Text *STARTWEEKLY* to turn Tuesdays back on.`
                );
                return NextResponse.json({ status: "weekly_stopped" });
            }

            if (keyword === 'startweekly') {
                await supabase
                    .from('users')
                    .update({ weekly_opted_in: true, weekly_opted_in_at: new Date().toISOString() })
                    .eq('whatsapp_number', normalizedPhone);
                await sendWhatsAppMessage(senderPhone,
                    `*You're in for Tuesdays.*\n\n` +
                    `Every week — one useful thing, zero fluff. Lands right here.\n\n` +
                    `Text *STOPWEEKLY* any time to pause.`
                );
                return NextResponse.json({ status: "weekly_started" });
            }

            const { data: user } = await supabase
                .from('users')
                .select('id, user_id, first_name, whatsapp_onboarded, whatsapp_opted_out, weekly_opted_in')
                .eq('whatsapp_number', normalizedPhone)
                .single();

            if (!user) {
                await sendWhatsAppMessage(senderPhone, `${process.env.NEXT_PUBLIC_SITE_URL}/signup`, true);
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
                await sendWhatsAppMessage(senderPhone, `*${branch.name.toUpperCase()}*\n${branch.description}`, false);
                await new Promise(r => setTimeout(r, 400));
                await sendWhatsAppMessage(senderPhone, `${siteUrl}/${branch.slug}`, true);
                return NextResponse.json({ status: "ok" });
            }

            // ── CATEGORY SHORTCUTS ────────────────────────────────────────────
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
            const categoryRoutes: Record<string, { slug: string; label: string; tools: string }> = {
                focus:    { slug: 'keep-going',    label: 'Focus + Momentum',  tools: '*MEMORY* · *MOMENTUM* · *BREAKDOWN*' },
                body:     { slug: 'feel-good',     label: 'Body + Energy',     tools: '*BURNOUT* · *SENSORY* · *SLEEP*' },
                money:    { slug: 'spend-smart',   label: 'Money',             tools: '*RESET4* · *AUTOPILOT* · *AUDIT*' },
                people:   { slug: 'be-connected',  label: 'Relationships',     tools: '*AUDIT* · *FIRSTAID* · *TRANSLATE*' },
                work:     { slug: 'be-yourself',   label: 'Work + Identity',   tools: '*TRANSLATE* · *MATCH* · *MEMORY*' },
                sleep:    { slug: 'plan-ahead',    label: 'Planning + Safety', tools: '*FIRSTAID* · *MATCH*' },
                level:    { slug: 'level-up',      label: 'Growth + Skills',   tools: '*MATCH* · *MEMORY* · *MOMENTUM*' },
            };
            if (keyword in categoryRoutes) {
                const cat = categoryRoutes[keyword];
                await sendWhatsAppMessage(senderPhone,
                    `*${cat.label.toUpperCase()}*\n\n` +
                    `Text any keyword to get the protocol delivered here:\n\n` +
                    `${cat.tools}\n\n` +
                    `Or browse the full branch:`,
                    false
                );
                await new Promise(r => setTimeout(r, 400));
                await sendWhatsAppMessage(senderPhone, `${siteUrl}/${cat.slug}`, true);
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

            // 1. Look up keyword in Supabase protocols table
            const { data: protocol } = await supabase
                .from('protocols')
                .select('title, slug, protocol')
                .ilike('keyword', keyword)
                .eq('status', 'Published')
                .single();
            let contentDelivered = false;
            let contentId = keyword;

            if (protocol) {
                contentDelivered = true;
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';
                const articleUrl = `${siteUrl}/intelligence/${protocol.slug}`;
                const content =
                    `Hi ${user.first_name ?? 'there'} — your *${protocol.title}* protocol is ready:\n\n` +
                    `${articleUrl}`;
                await sendWhatsAppMessage(senderPhone, content, true);
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

                    // Check if this user has completed the assessment for this tool
                    const { data: lastAssessment } = await supabase
                        .from('assessment_history')
                        .select('score, level, friction_type, completed_at')
                        .eq('user_id', user.id)
                        .eq('tool_slug', tool.slug)
                        .order('completed_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (lastAssessment?.friction_type) {
                        // Deliver the personalized protocol based on their assessment
                        await sendPersonalizedProtocol(
                            senderPhone,
                            user.first_name ?? 'there',
                            tool.name,
                            lastAssessment.friction_type,
                            lastAssessment.score,
                            tool.slug,
                        );
                    } else {
                        // No assessment yet — send the bridge link to start one
                        const { token } = await createWhatsAppSession(normalizedPhone, tool.slug, keyword);
                        const template = getTemplateByKeyword(keyword);

                        if (template) {
                            await sendWhatsAppTemplate(senderPhone, keyword, token);
                        } else {
                            const bridgeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/bridge?token=${token}`;
                            const content =
                                `Hi ${user.first_name ?? 'there'}. To unlock your personalised protocol for *${tool.name}*, complete the 2-minute diagnostic first:\n\n` +
                                `${bridgeUrl}\n\n` +
                                `_(Link expires in 30 minutes)_`;
                            await sendWhatsAppMessage(senderPhone, content);
                        }
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
                    message_type: protocol?.protocol ? 'protocol' : 'tool',
                    content_id: contentId,
                });

                // Offer weekly opt-in after first content delivery (once only)
                if (!user.weekly_opted_in) {
                    await new Promise(r => setTimeout(r, 800));
                    await sendWhatsAppMessage(senderPhone,
                        `*Quick question —*\n\n` +
                        `Want one useful thing every Tuesday? One message, always actionable, easy to stop.\n\n` +
                        `Text *STARTWEEKLY* to get them, or ignore this and nothing changes.`
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

const PROTOCOL_STEPS: Record<string, { headline: string; steps: [string, string][] }> = {
    ANXIETY_AVOIDANCE:        { headline: 'Financial Anxiety Avoidance', steps: [['The one-look rule', 'Open your account for 60 seconds only. No decisions, no judgment — just look. That is the whole task.'], ['Build the 4-account structure', 'Separate your money into four named accounts: bills, spending, buffer, and future. The separation removes the emotional charge.']] },
    FULL_RESET:               { headline: 'Full Financial Reset', steps: [['Zero-based restart', 'List every regular outgoing first — rent, subscriptions, bills. That number is your floor. Everything else is negotiable.'], ['Automate on payday', 'Set every transfer to fire on the day income lands. Before you can spend it, it is already gone to the right place.']] },
    SYSTEM_FAILURE:           { headline: 'Money System Collapse', steps: [['Remove decisions from the system', 'Every step that requires you to actively choose is a failure point. Automate anything that can be automated.'], ['Build the minimum viable system', 'One account for bills only. One for everything else. Add complexity only when basics are stable.']] },
    SEVERE_SHUTDOWN:          { headline: 'Extended Shutdown Pattern', steps: [['Map your early warning system', 'Identify your 3 earliest physical signals — before the point of no return. These become your intervention triggers.'], ['Design a 5-minute prevention window', 'When you spot an early signal, you have a brief window. Your kit: one sensory input, one exit route, one safe phrase.']] },
    NO_TOOLKIT:               { headline: 'No De-escalation Toolkit', steps: [['Sensory input inventory', 'Test five different sensory inputs this week — cold, pressure, rhythm, darkness, texture. Note which direction each pulls your nervous system.'], ['Build your sequence', 'A kit is a sequence: something for de-escalation, something for recovery, something for re-entry. Build all three.']] },
    RECOVERY_GAP:             { headline: 'Recovery Window Too Long', steps: [['Design a recovery environment', 'Where you go after a meltdown matters as much as de-escalation. Identify your minimum viable recovery space.'], ['Set a recovery time boundary', 'Tell the people around you what recovery looks like and how long it takes. Interrupted recovery extends it significantly.']] },
    HIGH_NEED:                { headline: 'Every System Has Failed', steps: [['Build your first palace', 'Choose a building you know perfectly. Place three things there. Walk it in your mind.'], ['60-second daily review', 'Walk the palace in your head once per day. Thirty seconds in the morning. That is enough to cement it.']] },
    VISUAL_LEARNER:           { headline: 'Strong Visual Foundation', steps: [['Scale what already works', 'You already visualise well. Start with one room, five items, one topic.'], ['Add spaced repetition', 'Review on day 1, day 3, day 7, then weekly. The spacing does the work.']] },
    CONSISTENCY_GAP:          { headline: 'Inconsistent Memory System', steps: [['Reduce activation cost to zero', 'Same time, same trigger, same device. Make starting automatic.'], ['Shrink the review', 'If reviewing takes more than 2 minutes, it will not happen consistently. Cut it down.']] },
    MASKING_EXHAUSTION:       { headline: 'Masking-Induced Exhaustion', steps: [['Deploy transcription before the meeting', 'Have your tool running before anyone speaks. When you know it is capturing everything, you can stop performing memory.'], ['Process after, not during', 'Let the transcript hold it. Your job during the meeting is just to be there.']] },
    PERFORMANCE_LOAD:         { headline: 'High Cognitive Load', steps: [['Use the transcript as your working memory', 'You do not need to remember what was said 10 minutes ago — the transcript has it.'], ['Allow yourself a processing gap', 'Even 5 minutes post-meeting changes comprehension significantly.']] },
    PROCESSING_GAP:           { headline: 'Post-Meeting Processing Gap', steps: [['Capture first, review second', 'Do not try to act on meeting content immediately. Capture everything, then review at your own pace.'], ['Build a 24-hour response buffer', 'Delay non-urgent responses until after you have processed the transcript.']] },
    CASH_FLOW_CRISIS:         { headline: 'Active Cash Flow Crisis', steps: [['Essentials first — everything else waits', 'Split your account immediately: one amount covers non-negotiables for the month. That money does not get touched.'], ['Build a 7-day buffer', 'Even £50 in a separate account creates breathing room.']] },
    EMOTIONAL_SPENDING:       { headline: 'Emotional Spending Override', steps: [['Add friction to emotional spending', 'Move discretionary money to a separate account with no card. The extra step breaks the automatic loop.'], ['Pre-commit your spending amount', 'Decide in advance what the discretionary total is for the month. Once it is gone, it is gone.']] },
    IRREGULAR_INCOME:         { headline: 'Irregular Income', steps: [['Calculate your monthly floor', 'What is the minimum you need for essentials? Automate to cover floor first on every payment.'], ['Buffer account as the variable absorber', 'All income goes into a buffer first. Pay yourself a fixed amount from it each month.']] },
    START_BLOCK:              { headline: 'Initiation Block', steps: [['Commit to 10 minutes only', 'The match session starts with a 10-minute commitment. Not the task — just 10 minutes of starting.'], ['Use the opening check-in as your ignition', 'Tell your body double exactly what you are starting with in one sentence. Saying it out loud is neurologically different from thinking it.']] },
    AVOIDANCE_LOOP:           { headline: 'Avoidance and Guilt Loop', steps: [['Externalise the accountability', 'Showing up for someone else bypasses the internal resistance. Your session starts with a shared intent.'], ['The guilt-free close', 'Every session ends with a report of what happened — not what you planned. Partial progress counts.']] },
    SILENT_PRESENCE:          { headline: 'Silent Presence Required', steps: [['Match with a deep-work partner', 'Cameras on, no talking, someone also doing focused work. The shared space does the neurological work.'], ['90-minute silent blocks', 'No check-ins, no prompts. Just two people in parallel. Set a shared timer and work until it ends.']] },
    ACCOUNTABILITY:           { headline: 'Accountability Structure', steps: [['The opening intent', 'State what you are working on and how long it should take. Your body double mirrors back what they heard.'], ['The 25-minute check', 'At 25 minutes, a brief pause: still on task? Adjust if not. No judgment, just recalibration.']] },
    NO_SAFE_SPACE:            { headline: 'No Sensory Safe Space', steps: [['Engineer a minimum viable refuge', 'Even a corner with headphones and a specific light counts. Designate and protect it — this is not optional, it is infrastructure.'], ['Build a sensory reset ritual', 'A 10-minute sequence that reliably brings your nervous system down. Same every time, same order.']] },
    MULTI_SENSORY_UNMANAGED:  { headline: 'Multi-Sensory Overload', steps: [['Audit your daily sensory load', 'Map your average day hour by hour. Where is input highest? You need 3 low-input windows per day minimum.'], ['Layer interventions by sense', 'Address your highest-impact sense first. One change at a time.']] },
    UNMANAGED_SENSITIVITY:    { headline: 'Unmanaged Sensory Sensitivity', steps: [['Identify your top three triggers', 'Not everything — just the three inputs that cause the most disruption. Those get addressed first.'], ['Build avoidance and mitigation options', 'For each trigger: can you avoid it, or can you mitigate it? Your plan needs at least one option per trigger.']] },
    PARTIAL_MANAGEMENT:       { headline: 'Partially Managed Profile', steps: [['Document what already works', 'Write down exactly what helps and under what conditions. Build from what works, not from what should work.'], ['Identify the gaps', 'Which environments still have no management strategy? Rank by frequency of exposure. Those are next.']] },
};

async function sendPersonalizedProtocol(
    to: string,
    firstName: string,
    toolName: string,
    frictionType: string,
    score: number,
    toolSlug: string,
) {
    const protocol = PROTOCOL_STEPS[frictionType];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const toolUrl = `${siteUrl}/tools/${toolSlug}`;

    if (!protocol) {
        await sendWhatsAppMessage(to,
            `Here's your protocol for *${toolName}*, ${firstName}.\n\n` +
            `Your full assessment and personalised steps are at:\n${toolUrl}`
        , true);
        return;
    }

    const stepsText = protocol.steps
        .map(([title, desc], i) => `*Step ${i + 1}: ${title}*\n_${desc}_`)
        .join('\n\n');

    const scoreBand = score >= 70 ? 'high friction' : score >= 40 ? 'some friction' : 'well calibrated';

    const message =
        `*${protocol.headline.toUpperCase()}*\n` +
        `Score: ${score}/100 — ${scoreBand}\n\n` +
        `${stepsText}\n\n` +
        `━━━━━━━━\n` +
        `Full report + progress:\n${toolUrl}\n\n` +
        `_Text the keyword again any time to get this back._`;

    await sendWhatsAppMessage(to, message, true);
}

async function sendBranchMenu(to: string) {
    const exploreUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/explore`;
    await sendWhatsAppMessage(to, exploreUrl, true);
}

async function handleHelpCommand(to: string) {
    await sendWhatsAppMessage(to,
        `What's going on? Text any word below.\n\n` +
        `*OVERWHELMED · STUCK · FOCUS*\n` +
        `_Can't start, too much on your plate_\n\n` +
        `*EXHAUSTED · STRESSED · BODY*\n` +
        `_Energy, burnout, nervous system_\n\n` +
        `*BILLS · MONEY*\n` +
        `_Financial chaos, spending loops_\n\n` +
        `*ARGUMENT · PEOPLE*\n` +
        `_Relationships, hard conversations_\n\n` +
        `*SLEEP*\n` +
        `_Can't wind down_\n\n` +
        `━━━━━━━━\n` +
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
    await sendWhatsAppMessage(to,
        `*${firstName}, you're in.*\n\n` +
        `This thread is your intelligence file. No app. No inbox. Just this.\n\n` +
        `How it works:\n` +
        `1. Pick a branch below\n` +
        `2. Text any keyword to get the protocol\n` +
        `3. It lands right here, instantly\n\n` +
        `Your 7 branches:`
    );

    await new Promise(r => setTimeout(r, 700));

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
            const band = score === null ? '' : score >= 70 ? ' [high friction]' : score >= 40 ? ' [some friction]' : ' [calibrated]';
            return `*${h.tool_name}* — ${score ?? 'completed'}${band}`;
          }).join('\n')
        : '_No assessments yet. Text a keyword to start._';

    const recentLine = usage?.length
        ? `\n\n*Recent protocols:* ${usage.map(u => u.keyword.toUpperCase()).join(' · ')}`
        : '';

    const msg =
        `*${firstName.toUpperCase()}'S INTELLIGENCE FILE*\n\n` +
        assessmentLines +
        recentLine +
        `\n\n━━━━━━━━\n` +
        `*DASHBOARD* — full web view\n` +
        `*NEW* — latest protocol\n` +
        `*HISTORY* — all diagnostics\n` +
        `*PARK* — pause without guilt`;

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
        `*Parked.*\n\n` +
        `Everything stays exactly where you left it, ${firstName}.\n\n` +
        `No timers. No pressure. No guilt.\n\n` +
        `When you're ready — just say hi. I'll find you one tiny next step.`;
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
    const msg = `*Latest protocol for you, ${firstName}*\n\n*${protocol.title}*\n\n${protocol.excerpt || ''}${keywordHint}\n\n${url}`;
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
