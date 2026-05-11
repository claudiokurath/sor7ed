import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ToolList from "@/components/ToolList";

export default async function ToolsPage() {
    const supabase = await createClient();
    
    const { data: tools, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tools:', error);
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-20">
            <div className="max-w-6xl mx-auto">

                <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors block mb-12">
                    ← Back to home
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter">Tools & Templates</h1>
                        <p className="text-white/40 text-lg max-w-xl leading-relaxed">
                            Ready-to-use Notion templates, digital systems, and PDF guides. Text the keyword to get the direct download link on WhatsApp.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl hidden md:block">
                        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Total Tools</p>
                        <p className="text-2xl font-black">{tools?.length || 0}</p>
                    </div>
                </div>

                <ToolList initialTools={tools || []} />

                <section className="mt-32 p-12 md:p-20 bg-white text-black rounded-[3rem] text-center overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
                        Get all tools instantly<br />on your phone.
                    </h2>
                    <p className="text-black/60 text-lg mb-10 max-w-lg mx-auto">
                        Join 2,000+ neurodivergent adults using these systems to reclaim their focus and energy.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block bg-black text-white font-bold px-10 py-5 rounded-full hover:scale-105 transition-transform"
                    >
                        Create Free Account →
                    </Link>
                </section>

            </div>
        </main>
    );
}
