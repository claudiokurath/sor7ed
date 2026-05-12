import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BlogList from "@/components/BlogList";

export default async function BlogPage() {
    const supabase = await createClient();
    
    const { data: posts, error } = await supabase
        .from('protocols')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching protocols:', error);
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-20">
            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-12">
                    <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors">
                        ← Back to home
                    </Link>
                    <Link href="/signup" className="text-white/30 text-sm hover:text-white transition-colors uppercase tracking-widest font-medium">
                        Sign In
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4">Articles</h1>
                        <p className="text-white/50 text-lg max-w-xl">
                            Practical protocols for neurodivergent minds. Read the context, then text the keyword for the step-by-step guide.
                        </p>
                    </div>
                </div>

                <BlogList initialPosts={posts || []} />

                <div className="border-t border-white/10 mt-16 pt-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Want these protocols on WhatsApp?</h2>
                    <p className="text-white/50 mb-6 max-w-md mx-auto">
                        Sign up free, then text any keyword to receive the full protocol instantly.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300"
                    >
                        Sign up for free →
                    </Link>
                </div>

            </div>
        </main>
    );
}
