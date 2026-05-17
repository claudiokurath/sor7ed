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
    <div className="min-h-screen px-5 sm:px-8 md:px-16 pt-12 md:pt-0 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="pt-8 pb-8">
          <p className="text-label mb-3">Field Intelligence</p>
          <h1 className="font-display text-text-primary mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            INTELLIGENCE
          </h1>
          <p className="text-text-secondary text-base max-w-lg leading-relaxed">
            The context behind the protocol. These briefings explain the <em>why</em> behind your friction — so you understand your brain, not just manage it.
          </p>
        </div>

        <IntelligenceGrid posts={posts || []} />
      </div>
    </div>
  );
}
