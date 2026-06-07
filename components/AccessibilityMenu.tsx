"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type Settings = {
  highContrast: boolean;
  dyslexiaFont: boolean;
  largeText: boolean;
};

const STORAGE_KEY = "sor7ed-a11y";

const defaults: Settings = {
  highContrast: false,
  dyslexiaFont: false,
  largeText: false,
};

export default function AccessibilityMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaults);

  if (pathname?.startsWith("/statement")) return null;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings(JSON.parse(saved));
    } catch {}
  }, []);

  // Apply settings to <html> element
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("a11y-high-contrast", settings.highContrast);
    html.classList.toggle("a11y-dyslexia", settings.dyslexiaFont);
    html.classList.toggle("a11y-large-text", settings.largeText);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  function toggle(key: keyof Settings) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSettings(defaults);
  }

  return (
    <>
      {/* Burger button — bottom right */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Accessibility settings"
        className="fixed bottom-6 right-6 z-50 w-11 h-11 flex flex-col items-center justify-center gap-1.5 bg-black border border-white/20 hover:border-white transition-colors"
        style={{ borderRadius: 0 }}
      >
        <span className="block w-5 h-0.5 bg-white" />
        <span className="block w-5 h-0.5 bg-white" />
        <span className="block w-5 h-0.5 bg-white" />
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-50 w-64 bg-black border border-white/20 p-5"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">
              Accessibility
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-white/40 hover:text-white text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <Toggle
              label="High Contrast"
              description="Stronger colour contrast"
              active={settings.highContrast}
              onToggle={() => toggle("highContrast")}
            />
            <Toggle
              label="Dyslexia Font"
              description="OpenDyslexic typeface"
              active={settings.dyslexiaFont}
              onToggle={() => toggle("dyslexiaFont")}
            />
            <Toggle
              label="Larger Text"
              description="Increase body text size"
              active={settings.largeText}
              onToggle={() => toggle("largeText")}
            />
          </div>

          <button
            onClick={reset}
            className="mt-5 w-full text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors text-left"
          >
            Reset to defaults
          </button>
        </div>
      )}
    </>
  );
}

function Toggle({
  label,
  description,
  active,
  onToggle,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full group"
      aria-pressed={active}
    >
      <div className="text-left">
        <p className="text-xs font-bold text-white uppercase tracking-wide">{label}</p>
        <p className="text-[10px] text-white/40 font-mono">{description}</p>
      </div>
      <div
        className="w-10 h-5 relative flex-none transition-colors duration-200"
        style={{ background: active ? "#00C4C4" : "rgba(255,255,255,0.1)" }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 bg-white transition-all duration-200"
          style={{ left: active ? "calc(100% - 18px)" : "2px" }}
        />
      </div>
    </button>
  );
}
