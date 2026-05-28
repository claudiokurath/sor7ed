export type BranchSlug = 
  | 'keep-going' 
  | 'feel-good' 
  | 'spend-smart' 
  | 'be-connected' 
  | 'plan-ahead' 
  | 'be-yourself' 
  | 'level-up';

export type ScoreLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ProtocolStep {
  stepNumber: number;
  title: string;
  description: string;
  duration?: string;
}

export interface Recommendation {
  title: string;
  description: string;
  branch: BranchSlug;
  branchColor: string;
  href: string;
  type: 'tool' | 'protocol' | 'intelligence';
}

export interface NarrativeLayer {
  headline: string;
  subheadline: string;
  insight: string;
  urgency: ScoreLevel;
}

export interface DeepDive {
  why: string;
  mistakes: string[];
  timeline: string;
}

export interface AssessmentResult {
  score: number;
  normalizedScore: number;
  branch: BranchSlug;
  level: ScoreLevel;
  narrative: NarrativeLayer;
  recommendations: Recommendation[];
  protocolPreview: ProtocolStep[];
  deepDive?: DeepDive;
  protocolId?: string;
  whatsappKeyword: string;
}
