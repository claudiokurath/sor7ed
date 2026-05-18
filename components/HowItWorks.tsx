type Step = { num: string; title: string; description: string };

export default function HowItWorks({ steps }: { steps: Step[] }) {
  return (
    <section className="border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.num} className={`px-5 sm:px-8 md:px-12 py-10 ${i < steps.length - 1 ? 'border-b md:border-b-0 md:border-r border-black/10' : ''}`}>
              <div className="font-display text-6xl text-black/10 mb-4 leading-none">{step.num}</div>
              <h3 className="font-display uppercase text-sm tracking-wide text-black mb-3">{step.title}</h3>
              <p className="text-black/50 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
