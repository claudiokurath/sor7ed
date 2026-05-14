// components/blog/AssessmentCTA.tsx
import { SORTED_ECOSYSTEM_BRANCHES } from '@/lib/unified-branches';

interface AssessmentCTAProps {
  branchKey: keyof typeof SORTED_ECOSYSTEM_BRANCHES;
  slug: string;
}

export function AssessmentCTA({ branchKey, slug }: AssessmentCTAProps) {
  const branch = SORTED_ECOSYSTEM_BRANCHES[branchKey];
  const color = branch.color;
  const label = branch.label;
  return (
    <div
      className="my-8 p-6 rounded-2xl bg-white/5 border border-white/10"
      style={{ borderLeftColor: color, borderLeftWidth: 3 }}
    >
      <h4 className="text-sm font-semibold text-white mb-2">Ready to diagnose your {label} friction?</h4>
      <p className="text-xs text-white/60 mb-4">
        Take the 3‑minute assessment that pinpoints the highest‑friction area in your life.
      </p>
      <a
        href={`/tools/${slug}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-black"
        style={{ backgroundColor: color }}
      >
        Run Diagnostic →
      </a>
    </div>
  );
}
