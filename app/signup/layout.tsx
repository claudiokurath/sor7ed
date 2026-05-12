import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | SOR7ED',
  description: 'Create your free account and get step-by-step protocols delivered straight to your WhatsApp.',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
