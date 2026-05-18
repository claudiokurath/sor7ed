type Step = { num: string; title: string; description: string };

export default function HowItWorks({ steps }: { steps: Step[] }) {
  return (
    <section className="border-b border-ps-white/10 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ps-white/10">
        {steps.map((step, i) => (
          <div key={step.num} className="bg-ps-black p-6">
            <div className="font-display text-3xl text-ps-yellow mb-3 leading-none">{step.num}</div>
            <h3 className="font-display uppercase text-ps-white text-xs tracking-widest mb-2">{step.title}</h3>
            <p className="text-ps-white/40 text-xs leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
