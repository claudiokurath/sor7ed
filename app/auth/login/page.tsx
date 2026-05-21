import Link from "next/link";

export const metadata = { title: "Login — SOR7ED" };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center page-container py-20">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <Link href="/" className="flex items-center gap-0 mb-8">
            <span className="font-display text-2xl tracking-widest text-[#f0ede8] uppercase">SOR</span>
            <span className="font-display text-2xl tracking-widest text-[#00C4C4] uppercase">7</span>
            <span className="font-display text-2xl tracking-widest text-[#f0ede8] uppercase">ED</span>
          </Link>
          <h1 className="t-title mb-2">Sign in</h1>
          <p className="t-small">Access your dashboard and saved tools.</p>
        </div>

        <form className="flex flex-col gap-4" action="/auth/login" method="POST">
          <div className="flex flex-col gap-1">
            <label className="t-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" className="input" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="t-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" className="input" />
          </div>
          <button type="submit" className="btn btn-accent mt-2">Sign in →</button>
        </form>

        <div className="rule mt-8 pt-6">
          <p className="t-small text-center">
            No account?{" "}
            <Link href="/signup" className="text-[#00C4C4] hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
