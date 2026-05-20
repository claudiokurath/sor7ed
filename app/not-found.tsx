import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="page-container text-center py-20">
        <p className="font-display text-[8rem] font-medium leading-none text-ink-disabled mb-8">
          404
        </p>
        <h1 className="t-title mb-4">This page doesn't exist.</h1>
        <p className="t-body mb-10 max-w-sm mx-auto text-pretty">
          It might have moved, or the link might be wrong.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn btn-primary">Go home</Link>
          <Link href="/tools" className="btn btn-ghost">Browse tools</Link>
        </div>
      </div>
    </div>
  );
}
