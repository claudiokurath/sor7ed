export default function PrivacyPolicyPage() {
  return (
    <div className="pt-16">
      <div className="border-b border-border-subtle">
        <div className="page-container py-14 md:py-20">
          <p className="t-label text-accent mb-4">Legal</p>
          <h1 className="t-display mb-5">Privacy Policy</h1>
          <p className="t-body max-w-lg text-pretty">
            How we collect, use, and protect your data. Last updated: May 2026.
          </p>
        </div>
      </div>

      <div className="page-container py-16">
        <div className="max-w-3xl prose prose-neutral">
          <h2 className="t-title mb-4">1. Information We Collect</h2>
          <p className="t-body mb-6 text-pretty">
            We collect the information you provide to us directly, such as your phone number when you connect via WhatsApp, and the data you submit through our platform to deliver our tools and protocols.
          </p>

          <h2 className="t-title mb-4">2. How We Use Your Data</h2>
          <p className="t-body mb-6 text-pretty">
            Your data is primarily used to provide you with SOR7ED protocols and keep track of your saved tools. We never sell your personal information to third parties.
          </p>

          <h2 className="t-title mb-4">3. Data Retention and Deletion</h2>
          <p className="t-body mb-6 text-pretty">
            You can request to delete your account and all associated data at any time by contacting us. We will securely erase your information from our active databases.
          </p>

          <p className="t-small mt-12 text-ink-tertiary">
            This is a summary. For full legal details, please contact us at hello@sor7ed.com.
          </p>
        </div>
      </div>
    </div>
  );
}
