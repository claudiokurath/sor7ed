type Step = { num: string; title: string; description: string };
type Variant = 'white' | 'black' | 'yellow';

const styles: Record<Variant, { section: string; border: string; label: string; num: string; title: string; body: string }> = {
  white:  { section: 'bg-white',      border: 'border-black/10',  label: 'label',                               num: 'text-black/10',  title: 'text-black',      body: 'text-black/50'  },
  black:  { section: 'bg-black',      border: 'border-white/10',  label: 'label',                               num: 'text-white/10',  title: 'text-white',      body: 'text-white/40'  },
  yellow: { section: 'bg-ps-yellow',  border: 'border-black/15',  label: 'label',                               num: 'text-black/15',  title: 'text-black',      body: 'text-black/60'  },
};

export default function HowItWorks({ steps, variant = 'white' }: { steps: Step[]; variant?: Variant }) {
  const s = styles[variant];
  return (
    <section className={`${s.section} border-b-2 border-black`}>
      <div className="max-w-6xl mx-auto">
        <div className={`px-5 sm:px-8 md:px-12 py-4 border-b ${s.border}`}>
          <p className={s.label}>How it works</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.num} className={`px-5 sm:px-8 md:px-12 py-10 ${i < steps.length - 1 ? `border-b md:border-b-0 md:border-r ${s.border}` : ''}`}>
              <div className={`font-display text-6xl mb-4 leading-none ${s.num}`}>{step.num}</div>
              <h3 className={`font-display uppercase text-sm tracking-wide mb-3 ${s.title}`}>{step.title}</h3>
              <p className={`text-sm leading-relaxed ${s.body}`}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
