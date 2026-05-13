import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { TEMPLATE_LIBRARY, getTemplateByKeyword } from "@/lib/whatsapp-templates";

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

        if (process.env.META_APP_SECRET && signature) {
            const hmac = crypto.createHmac("sha256", process.env.META_APP_SECRET);
            const digest = "sha256=" + hmac.update(rawBody).digest("hex");
            
            if (signature !== digest) {
                console.error("Webhook signature verification failed");
                return new NextResponse("Unauthorized", { status: 401 });
            }
        }

        const body = JSON.parse(rawBody);
        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        
        if (message && message.type === "text") {
            const senderPhone = message.from;
            const keyword = message.text.body.trim().toLowerCase();

            console.log(`Received WhatsApp keyword: ${keyword} from ${senderPhone}`);

            const supabase = getSupabase();
            const normalizedPhone = senderPhone.startsWith('+') ? senderPhone : `+${senderPhone}`;
            
            const { data: user } = await supabase
                .from('users')
                .select('first_name')
                .eq('whatsapp_number', normalizedPhone)
                .single();

            if (!user) {
                const signupPrompt = "Welcome to SOR7ED! It looks like you haven't registered your number yet. Please sign up at https://www.sor7ed.com/signup to unlock your protocols.";
                await sendWhatsAppMessage(senderPhone, signupPrompt);
                return NextResponse.json({ status: "unregistered" });
            }

            const { data: protocol } = await supabase.from('protocols').select('*').eq('keyword', keyword.toUpperCase()).single();
            
            if (protocol) {
                const content = `Hi ${user.first_name}, here is your protocol for *${protocol.title}*:\n\n${protocol.tldr}\n\n*THE PROTOCOL:*\n${protocol.protocol}\n\n${protocol.cta}`;
                await sendWhatsAppMessage(senderPhone, content);
            } else {
                const { data: tool } = await supabase.from('tools').select('*').eq('keyword', keyword.toUpperCase()).single();
                
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

async function sendWhatsAppTemplate(to: string, keyword: string, token: string) {
    const templateName = `sor7ed_${keyword.toLowerCase()}_entry_v1`;
    const url = `https://graph.facebook.com/v18.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
    
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

async function sendWhatsAppMessage(to: string, text: string) {
    const url = `https://graph.facebook.com/v18.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
    
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
