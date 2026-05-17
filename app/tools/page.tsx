import { createClient } from "@/lib/supabase/server";
import ToolList from "@/components/ToolList";
import HowItWorks from "@/components/HowItWorks";

export const revalidate = 60;

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Take the assessment',
    description: 'Answer a short set of targeted questions designed to surface exactly what\'s driving your friction.',
  },
  {
    num: '02',
    title: 'Understand your pattern',
    description: 'Get a clear read on the specific block — not a generic label, but the actual mechanism.',
  },
  {
    num: '03',
    title: 'Get your protocol on WhatsApp',
    description: 'Receive a personalised step-by-step protocol straight to your phone. No app. No login.',
  },
];

export default async function ToolsPage() {
  const supabase = await createClient();
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'Published')
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
        <HowItWorks steps={HOW_IT_WORKS} />
      </div>
    </div>
  );
}
