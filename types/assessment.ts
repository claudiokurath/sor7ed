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
  type: 'tool' | 'protocol';
}

export interface NarrativeLayer {
  headline: string;
  subheadline: string;
  insight: string;
  urgency: ScoreLevel;
}

export interface AssessmentResult {
  score: number;
  normalizedScore: number;
  branch: BranchSlug;
  level: ScoreLevel;
  narrative: NarrativeLayer;
  recommendations: Recommendation[];
  protocolPreview: ProtocolStep[];
  protocolId?: string;
  whatsappKeyword: string;
}
