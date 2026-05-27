import Link from "next/link";

export const metadata = { title: "Login — SOR7ED" };

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/banners/sign in banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">ACCOUNT</p>
          <h1
            className="font-display font-black uppercase text-white leading-none max-w-2xl"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}
          >
            Sign In
          </h1>
        </div>
      </section>

      <div className="flex items-center justify-center page-container py-20">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <Link href="/" className="flex items-center gap-0 mb-8">
              <span className="font-display text-2xl tracking-widest text-[#f0ede8] uppercase">SOR</span>
              <span className="font-display text-2xl tracking-widest text-[#00C4C4] uppercase">7</span>
              <span className="font-display text-2xl tracking-widest text-[#f0ede8] uppercase">ED</span>
            </Link>
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
      </div>
    </main>
  );
}
