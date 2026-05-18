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
    <div className="min-h-screen bg-white">
      {/* Header — black */}
      <section className="bg-black border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-10">
          <p className="label-yellow mb-4">Articles</p>
          <h1 className="font-display uppercase text-white leading-none mb-4" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', letterSpacing: '-0.01em' }}>ARTICLES</h1>
          <p className="text-white/50 text-base max-w-lg leading-relaxed">
            The context behind the protocol. These articles explain the <em>why</em> behind your friction — so you understand your brain, not just manage it.
          </p>
        </div>
      </section>

      {/* How it works — yellow */}
      <HowItWorks steps={HOW_IT_WORKS} variant="yellow" />

      {/* Articles list — white */}
      <section className="bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 pb-24">
          <IntelligenceGrid posts={posts || []} />
        </div>
      </section>
    </div>
  );
}
