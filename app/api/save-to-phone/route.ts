import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const getAdmin = () => createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Sign in to save to WhatsApp." }, { status: 401 });
        }

        // Look up WhatsApp number from users table
        const admin = getAdmin();
        const { data: profile } = await admin
            .from("users")
            .select("whatsapp_number, first_name, whatsapp_verified")
            .eq("user_id", user.id)
            .single();

        if (!profile?.whatsapp_number) {
            return NextResponse.json({ error: "No WhatsApp number on your account." }, { status: 400 });
        }
        if (!profile.whatsapp_verified) {
            return NextResponse.json({ error: "Verify your WhatsApp number first." }, { status: 403 });
        }

        const { title, pageUrl, coverImageUrl, protocol } = await req.json() as {
            title: string;
            pageUrl: string;
            coverImageUrl?: string;
            protocol?: string;
        };

        if (!title || !pageUrl) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const to = profile.whatsapp_number.replace(/^\+/, "");
        const apiUrl = `https://graph.facebook.com/v25.0/${process.env.META_PHONE_NUMBER_ID}/messages`;
        const headers = {
            "Authorization": `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        };

        // Send cover image first if available
        if (coverImageUrl) {
            await fetch(apiUrl, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to,
                    type: "image",
                    image: { link: coverImageUrl, caption: title },
                }),
            });
            await new Promise(r => setTimeout(r, 400));
        }

        // Send the page link — URL first so WhatsApp generates rich preview
        const linkBody = `${pageUrl}\n\n📌 *${title}*\n\nSaved to your thread, ${profile.first_name ?? "there"}.`;
        const textRes = await fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "text",
                text: { body: linkBody, preview_url: true },
            }),
        });

        if (!textRes.ok) {
            const err = await textRes.json();
            console.error("Meta API error:", err);
            return NextResponse.json({ error: "Failed to send to WhatsApp." }, { status: 502 });
        }

        // Send protocol text as a follow-up message if provided
        if (protocol?.trim()) {
            await new Promise(r => setTimeout(r, 400));
            await fetch(apiUrl, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to,
                    type: "text",
                    text: { body: `*Your Protocol*\n\n${protocol.trim()}`, preview_url: false },
                }),
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("save-to-phone error:", err);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
