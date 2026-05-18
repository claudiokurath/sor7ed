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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-10">
          <p className="label-yellow mb-4">Assessments</p>
          <h1 className="font-display uppercase text-black leading-none mb-4" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', letterSpacing: '-0.01em' }}>TOOLS</h1>
          <p className="text-black/50 text-base max-w-lg leading-relaxed">
            High-value audits designed for neurodivergent minds. Complete the assessment to unlock your personalised protocol on WhatsApp.
          </p>
        </div>
      </section>

      <HowItWorks steps={HOW_IT_WORKS} />

      {/* Tool list */}
      <section className="border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 pb-24">
          <ToolList initialTools={tools || []} />
        </div>
      </section>
    </div>
  );
}
