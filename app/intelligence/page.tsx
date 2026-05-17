import { createClient } from "@/lib/supabase/server";
import IntelligenceGrid from "@/components/IntelligenceGrid";

export default async function IntelligencePage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('protocols')
    .select('*')
    .eq('status', 'Published')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-ps-black px-5 sm:px-8 md:px-16 pt-12 md:pt-0 pb-8">
      <div className="max-w-6xl mx-auto">
        <header className="pt-8 pb-10 border-b-2 border-ps-white mb-10">
          <p className="label-yellow mb-4">Field Intelligence</p>
          <h1 className="display-xl text-ps-white mb-4">INTELLIGENCE</h1>
          <p className="text-ps-white/50 text-base max-w-lg leading-relaxed">
            The context behind the protocol. These briefings explain the <em>why</em> behind your friction — so you understand your brain, not just manage it.
          </p>
        </header>
        <IntelligenceGrid posts={posts || []} />
      </div>
    </div>
  );
}
