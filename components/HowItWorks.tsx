type Step = {
  num: string;
  title: string;
  description: string;
};

interface HowItWorksProps {
  steps: Step[];
}

export default function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section className="border-t-2 border-ps-white mt-12 pt-12 pb-4">
      <p className="label-yellow mb-6">How It Works</p>
      <div className="flex flex-col md:flex-row gap-0">
        {steps.map((step, i) => (
          <div key={step.num} className="flex flex-row md:flex-col flex-1">
            {/* Step block */}
            <div className="flex flex-col md:flex-row items-start md:items-stretch flex-1">
              <div className="border-2 border-ps-white p-5 flex-1 bg-ps-black hover:border-ps-yellow transition-colors group">
                <div className="font-display text-4xl text-ps-yellow mb-4 leading-none">{step.num}</div>
                <h3 className="font-display uppercase text-ps-white text-sm tracking-wide leading-tight mb-2 group-hover:text-ps-yellow transition-colors">
                  {step.title}
                </h3>
                <p className="text-ps-white/50 text-xs leading-relaxed">{step.description}</p>
              </div>
              {/* Connector arrow between steps (not after last) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-8 shrink-0 text-ps-white/30">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </div>
            {/* Mobile: vertical connector */}
            {i < steps.length - 1 && (
              <div className="flex md:hidden items-center justify-center h-8 text-ps-white/30 ml-5">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(90deg)' }}>
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
