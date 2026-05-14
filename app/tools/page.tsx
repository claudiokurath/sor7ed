import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import ToolList from "@/components/ToolList";

export const revalidate = 60;

export default async function ToolsPage() {
    const supabase = await createClient();

    const { data: tools, error } = await supabase
        .from('tools')
        .select('*')
        .neq('status', 'Draft')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching tools:", error);
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
            <div className="max-w-5xl mx-auto">
                
                {/* Premium Header */}
                <div className="flex justify-between items-center mb-16 pt-4">
                    <Link href="/">
                        <Image src="/Images/Logo2026.png" alt="SOR7ED" width={216} height={84} className="h-20 w-auto opacity-20 hover:opacity-50 transition-opacity" />
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
                            Dashboard
                        </Link>
                        <Link href="/signup" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
                            Sign In →
                        </Link>
                    </div>
                </div>

                <div className="max-w-2xl mb-16">
                    <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">Interactive Assessments</h1>
                    <p className="text-white/40 text-lg md:text-xl leading-relaxed">
                        High-value audits designed specifically for neurodivergent minds. Complete the assessment to unlock your personalized results and get the exact protocol you need on WhatsApp.
                    </p>
                </div>

                <ToolList initialTools={tools || []} />

                <div className="border-t border-white/10 mt-32 pt-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Want these protocols on WhatsApp?</h2>
                    <p className="text-white/40 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                        Sign up free, then text any keyword to receive personalized protocols instantly on your phone.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block bg-white text-black font-bold px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    >
                        Sign up for free protocols →
                    </Link>
                </div>

            </div>
        </main>
    );
}
