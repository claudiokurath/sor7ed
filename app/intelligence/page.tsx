import { createClient } from "@/lib/supabase/server";
import IntelligenceGrid from "@/components/IntelligenceGrid";
import HowItWorks from "@/components/HowItWorks";

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Read the article',
    description: 'Understand the why behind your friction — what\'s actually happening in your brain, not just what it feels like.',
  },
  {
    num: '02',
    title: 'Take the assessment',
    description: 'Use the linked tool to identify your specific pattern and get a clear diagnosis.',
  },
  {
    num: '03',
    title: 'Get your protocol on WhatsApp',
    description: 'Receive the right steps for your exact situation, straight to your phone. No app. No login.',
  },
];

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
          <p className="label-yellow mb-4">Field Reads</p>
          <h1 className="display-xl text-ps-white mb-4">ARTICLES</h1>
          <p className="text-ps-white/50 text-base max-w-lg leading-relaxed">
            The context behind the protocol. These articles explain the <em>why</em> behind your friction — so you understand your brain, not just manage it.
          </p>
        </header>
        <IntelligenceGrid posts={posts || []} />
        <HowItWorks steps={HOW_IT_WORKS} />
      </div>
    </div>
  );
}
