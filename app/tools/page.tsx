import { createClient } from "@/lib/supabase/server";
import ToolList from "@/components/ToolList";

export const revalidate = 60;

export default async function ToolsPage() {
  const supabase = await createClient();

  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .neq('status', 'Draft')
    .order('featured', { ascending: false });

  return (
    <div className="min-h-screen px-5 sm:px-8 md:px-16 pt-12 md:pt-0 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="pt-8 pb-8">
          <p className="text-label mb-3">Assessments</p>
          <h1 className="font-display text-text-primary mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            TOOLS
          </h1>
          <p className="text-text-secondary text-base max-w-lg leading-relaxed">
            High-value audits designed for neurodivergent minds. Complete the assessment to unlock your personalised protocol on WhatsApp.
          </p>
        </div>

        <ToolList initialTools={tools || []} />
      </div>
    </div>
  );
}
