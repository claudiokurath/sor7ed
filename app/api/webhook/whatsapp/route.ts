import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
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

// Meta Message Handler (POST)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Check if it's a message event
        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        
        if (message && message.type === "text") {
            const senderPhone = message.from;
            const text = message.text.body.trim().toUpperCase();

            console.log(`Received WhatsApp keyword: ${text} from ${senderPhone}`);

            // 1. Search for a matching protocol
            const { data: protocol } = await supabase
                .from('protocols')
                .select('*')
                .eq('keyword', text)
                .single();

            // 2. Search for a matching tool if no protocol found
            let content = "";
            let title = "";

            if (protocol) {
                title = protocol.title;
                content = `*${protocol.title}*\n\n${protocol.tldr}\n\n*THE PROTOCOL:*\n${protocol.protocol}\n\n${protocol.cta}`;
            } else {
                const { data: tool } = await supabase
                    .from('tools')
                    .select('*')
                    .eq('keyword', text)
                    .single();
                
                if (tool) {
                    title = tool.name;
                    content = `*${tool.name}*\n\n${tool.tldr}\n\n*ACCESS TOOL:*\n${tool.description}\n\n(Keyword: ${tool.keyword})`;
                }
            }

            if (content) {
                // Send the protocol back via Meta API
                await sendWhatsAppMessage(senderPhone, content);
            } else {
                // Handle unknown keyword
                const helpText = "Sorry, I don't recognize that keyword. Check SOR7ED.com for the list of available protocols!";
                await sendWhatsAppMessage(senderPhone, helpText);
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
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

    const result = await response.json();
    if (!response.ok) {
        console.error("Error sending WhatsApp message:", result);
    }
    return result;
}
