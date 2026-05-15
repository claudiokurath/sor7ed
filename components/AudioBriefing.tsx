'use client';

export default function AudioBriefing({
  audioUrl,
  title,
  duration,
  branchColor,
  protocolSlug,
}: {
  audioUrl?: string;
  title: string;
  duration?: number;
  branchColor: string;
  protocolSlug?: string;
}) {
  if (!audioUrl) return null;

  const durationText = duration ? `${Math.round(duration / 60)} min` : 'Deep dive';
  const keyword = protocolSlug?.toUpperCase() ?? title.toUpperCase().replace(/\s+/g, '');

  return (
    <div className="my-8 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${branchColor}20` }}
        >
          <span className="text-2xl">🎧</span>
        </div>
        <div className="flex-1">
          <p
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-1"
            style={{ color: branchColor }}
          >
            Audio Deep Dive
          </p>
          <p className="text-sm text-white font-medium">
            {title} · {durationText}
          </p>
          <p className="text-xs text-white/40">AI-generated · NotebookLM</p>
        </div>
      </div>

      <audio
        controls
        className="w-full h-12 rounded-xl"
        style={{ colorScheme: 'dark', accentColor: branchColor }}
        preload="metadata"
      >
        <source src={audioUrl} type="audio/mpeg" />
        Your browser doesn't support audio playback.
      </audio>

      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <p className="text-xs text-white/30 mb-2">Prefer WhatsApp delivery?</p>
        <code
          className="text-xs px-2 py-1 rounded bg-white/5 font-mono"
          style={{ color: branchColor }}
        >
          Text: AUDIO {keyword}
        </code>
      </div>
    </div>
  );
}
