export interface TemplateContent {
  systemAlert: string;      // The "SYSTEM:" status line
  hookLine: string;         // Main psychological insight
  assessmentName: string;   // Formal tool name
  duration: string;         // Time commitment
  ctaButtonText: string;    // Button label
  postScript?: string;      // Optional footer context
}

export const TEMPLATE_LIBRARY: Record<string, TemplateContent> = {
  detox: {
    systemAlert: "SIGNAL DEGRADATION DETECTED",
    hookLine: "Your attention is being harvested. Time to measure the damage and rebuild your focus architecture.",
    assessmentName: "Notification Detox Diagnostic",
    duration: "3 minutes",
    ctaButtonText: "Initiate Diagnostic",
    postScript: "Results include your personalized protocol."
  },
  sleep: {
    systemAlert: "RECOVERY PROTOCOL INITIATED", 
    hookLine: "Sleep debt compounds faster than financial debt. Your recovery system needs auditing.",
    assessmentName: "Sleep Architecture Analysis",
    duration: "4 minutes",
    ctaButtonText: "Run Analysis",
    postScript: "Custom sleep protocol generated from your results."
  },
  dopamine: {
    systemAlert: "REWARD CIRCUIT CHECK",
    hookLine: "Your dopamine system is either working for you or against you. Time to find out which.",
    assessmentName: "Dopamine Menu Builder",
    duration: "5 minutes", 
    ctaButtonText: "Map My System",
    postScript: "Builds your personalized dopamine menu automatically."
  },
  friction: {
    systemAlert: "RESISTANCE PATTERNS IDENTIFIED",
    hookLine: "Every system has hidden friction points bleeding your energy. The Friction Finder locates yours.",
    assessmentName: "Friction Finder Analysis",
    duration: "4 minutes",
    ctaButtonText: "Find My Friction",
    postScript: "Most users identify 3-5 invisible blockers."
  }
};

export function getTemplateByKeyword(keyword: string): TemplateContent | null {
  const k = keyword.toLowerCase().trim();
  // Check direct match
  if (TEMPLATE_LIBRARY[k]) return TEMPLATE_LIBRARY[k];
  
  // Fuzzy match or default
  return null;
}
