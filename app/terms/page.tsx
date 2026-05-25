import PageBanner from "@/components/PageBanner";

export default function TermsOfServicePage() {
  return (
    <>
      <PageBanner src="/Images/banners/landing banner.png" />
      <div className="border-b border-border-subtle">
        <div className="page-container py-14 md:py-20">
          <p className="t-label text-accent mb-4">Legal</p>
          <h1 className="t-display mb-5">Terms of Service</h1>
          <p className="t-body max-w-lg text-pretty">
            The rules and guidelines for using SOR7ED. Last updated: May 2026.
          </p>
        </div>
      </div>

      <div className="page-container py-16">
        <div className="max-w-3xl prose prose-neutral">
          <h2 className="t-title mb-4">1. Acceptance of Terms</h2>
          <p className="t-body mb-6 text-pretty">
            By accessing or using SOR7ED, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
          </p>

          <h2 className="t-title mb-4">2. Medical Disclaimer</h2>
          <p className="t-body mb-6 text-pretty">
            <strong className="text-ink">SOR7ED is not a medical or therapy service.</strong> The content provided is for informational and organizational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>

          <h2 className="t-title mb-4">3. WhatsApp Integration</h2>
          <p className="t-body mb-6 text-pretty">
            By initiating contact with our WhatsApp bot, you consent to receiving messages from us via the WhatsApp platform. Standard messaging rates may apply depending on your carrier.
          </p>

          <p className="t-small mt-12 text-ink-tertiary">
            This is a summary. For full legal details, please contact us at hello@sor7ed.com.
          </p>
        </div>
      </div>
    </>
  );
}
