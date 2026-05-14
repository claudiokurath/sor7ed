/*
  Unified 7‑branch taxonomy for the SOR7ED ecosystem.
  This file maps the current website branches (defined in lib/constants.ts) to the
  canonical branch names used across Lab, Concierge, and SonicGlue.
*/

export const SORTED_ECOSYSTEM_BRANCHES = {
  mind: {
    label: 'Mind',
    websiteMapping: 'Keep Going', // corresponds to slug "keep-going"
    conciergeScope: 'Planning, routines, decision support, therapy coordination',
    labTools: ['notification-detox', 'dopamine-menu', 'friction-finder'],
    sonicglueConnection: 'Creative block diagnosis, workflow optimization',
    color: '#3B82F6', // same as website branch color
  },
  body: {
    label: 'Body',
    websiteMapping: 'Feel Good', // slug "feel-good"
    conciergeScope: 'Health, energy, sleep, nutrition, sensory regulation',
    labTools: ['sleep-analyzer', 'energy-tracker', 'food-log'],
    sonicglueConnection: 'Audio‑visual wellness cues for creative flow',
    color: '#A855F7',
  },
  wealth: {
    label: 'Wealth',
    websiteMapping: 'Spend Smart', // slug "spend-smart"
    conciergeScope: 'Money admin, budgeting, bills, impulse‑spending control',
    labTools: ['budget‑insight', 'spending‑heatmap', 'subscription‑audit'],
    sonicglueConnection: 'Funding‑aware royalty & licensing recommendations',
    color: '#10B981',
  },
  connection: {
    label: 'Connection',
    websiteMapping: 'Be Connected', // slug "be-connected"
    conciergeScope: 'Relationships, communication, boundaries, social scripts',
    labTools: ['social‑pulse', 'boundary‑coach', 'communication‑audit'],
    sonicglueConnection: 'Collaboration‑room matchmaking for creators',
    color: '#F59E0B',
  },
  growth: {
    label: 'Growth',
    websiteMapping: 'Plan Ahead', // slug "plan-ahead"
    conciergeScope: 'Planning, executive function, systems that support personal growth',
    labTools: ['task‑mapper', 'goal‑tracker', 'system‑builder'],
    sonicglueConnection: 'Project‑timeline alignment for creative releases',
    color: '#06B6D4',
  },
  impression: {
    label: 'Impression',
    websiteMapping: 'Be Yourself', // slug "be-yourself"
    conciergeScope: 'Identity, self‑concept, emotional regulation, personal branding',
    labTools: ['identity‑mapper', 'emotion‑log', 'brand‑audit'],
    sonicglueConnection: 'Style‑guide & visual‑identity coaching for music/video assets',
    color: '#FB7185',
  },
  tech: {
    label: 'Tech',
    websiteMapping: 'Level Up', // slug "level-up"
    conciergeScope: 'Digital systems, automation, apps, setups, workflow tooling',
    labTools: ['automation‑advisor', 'app‑audit', 'integration‑wizard'],
    sonicglueConnection: 'AI‑enhanced production pipeline & plugin integration',
    color: '#6366F1',
  },
} as const;

// Export a type for safer usage elsewhere in the codebase.
export type EcosystemBranchKey = keyof typeof SORTED_ECOSYSTEM_BRANCHES;
