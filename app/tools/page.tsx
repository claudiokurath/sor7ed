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
    <div className="min-h-screen bg-ps-black px-5 sm:px-8 md:px-16 pt-12 md:pt-0 pb-8">
      <div className="max-w-6xl mx-auto">
        <header className="pt-8 pb-10 border-b-2 border-ps-white mb-10">
          <p className="label-yellow mb-4">Assessments</p>
          <h1 className="display-xl text-ps-white mb-4">TOOLS</h1>
          <p className="text-ps-white/50 text-base max-w-lg leading-relaxed">
            High-value audits designed for neurodivergent minds. Complete the assessment to unlock your personalised protocol on WhatsApp.
          </p>
        </header>
        <ToolList initialTools={tools || []} />
      </div>
    </div>
  );
}
