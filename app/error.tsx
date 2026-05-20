"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="page-container text-center py-20">
        <p className="font-display text-[8rem] font-medium leading-none text-ink-disabled mb-8">
          500
        </p>
        <h1 className="t-title mb-4">Something went wrong.</h1>
        <p className="t-body mb-10 max-w-sm mx-auto text-pretty">
          An unexpected error occurred. If this keeps happening, let us know.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={reset} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-ghost">Go home</Link>
        </div>
      </div>
    </div>
  );
}
