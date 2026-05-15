export interface TemplateContent {
  systemAlert: string;      // The "SYSTEM:" status line
  hookLine: string;         // Main psychological insight
  assessmentName: string;   // Formal tool name
  duration: string;         // Time commitment
  ctaButtonText: string;    // Button label
  postScript?: string;      // Optional footer context
}

export const TEMPLATE_LIBRARY: Record<string, TemplateContent> = {
  spend: {
    systemAlert: "MONEY LEAK DETECTED",
    hookLine: "I just found a subscription I've been paying for since 2022. Please tell me your financial architecture is better than mine right now.",
    assessmentName: "Spend Smart Diagnostic",
    duration: "3 minutes",
    ctaButtonText: "Find the leaks →",
    postScript: "No judgment, just useful information about what's actually going on."
  },
  momentum: {
    systemAlert: "MOMENTUM DROP IDENTIFIED",
    hookLine: "I have two guitars I can't play and a Duolingo streak I murdered. Let's figure out what's actually killing your momentum.",
    assessmentName: "Keep Going Diagnostic",
    duration: "4 minutes",
    ctaButtonText: "Map the pattern →",
    postScript: "Build momentum systems that survive the inevitable crash."
  },
  wellbeing: {
    systemAlert: "SLEEP REVENGE DETECTED",
    hookLine: "Staying up too late because it's the only time that's yours is something I completely understand and also need to stop doing.",
    assessmentName: "Feel Good Diagnostic",
    duration: "4 minutes",
    ctaButtonText: "Sort the baseline →",
    postScript: "Let's fix the day so you don't need to steal the night."
  },
  detox: {
    systemAlert: "ATTENTION HARVEST ALERT",
    hookLine: "I used to check my phone 400 times a day. Turns out my attention was being harvested. Let's measure the damage.",
    assessmentName: "Notification Detox Diagnostic",
    duration: "3 minutes",
    ctaButtonText: "Stop the harvest →",
    postScript: "Built for how your brain actually works."
  }
};

export function getTemplateByKeyword(keyword: string): TemplateContent | null {
  const k = keyword.toLowerCase().trim();
  if (TEMPLATE_LIBRARY[k]) return TEMPLATE_LIBRARY[k];
  return null;
}
