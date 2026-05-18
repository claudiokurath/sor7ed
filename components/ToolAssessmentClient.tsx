"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import ArticleCover from './ArticleCover';
import ResultsScreen from './ResultsScreen';
import SaveToPhoneButton from './SaveToPhoneButton';
import { calculateAcceleratedProgress } from "@/lib/progress-curve";
import { generateNarrative, getScoreLevel } from "@/lib/narrative-engine";
import { AssessmentResult, BranchSlug, NarrativeLayer, Recommendation, ProtocolStep, ScoreLevel } from "@/types/assessment";

type Question = {
  id: number;
  text: string;
  options: string[];
};

interface ToolAnalysis {
  score: number;
  priority: ScoreLevel;
  frictionType: string;
  headline: string;
  subheadline: string;
  insight: string;
  protocolKeyword: string;
}

function analyzeToolAnswers(
  toolSlug: string,
  answers: Record<number, string>,
  questions: Question[]
): ToolAnalysis | null {
  const r = questions.map(q => (answers[q.id] || '').toLowerCase());
  // r[0]=Q1, r[1]=Q2, r[2]=Q3, r[3]=Q4

  // ── MONEY RESET ──────────────────────────────────────────────
  if (toolSlug === 'money-reset-(4-accounts)') {
    const isAvoidance = r[0].includes('avoid') || r[0].includes('stress');
    const isChaos = r[0].includes('chaos') || r[0].includes('restart');
    const isImpulse = r[2].includes('impulse');
    const score = isChaos ? 86 : isAvoidance ? 78 : isImpulse ? 72 : 63;
    const priority: ScoreLevel = score >= 82 ? 'critical' : score >= 70 ? 'high' : 'medium';

    if (isAvoidance) return {
      score, priority, frictionType: 'ANXIETY_AVOIDANCE', protocolKeyword: '',
      headline: 'Financial Anxiety Avoidance',
      subheadline: 'Avoiding your accounts is making it worse, not better.',
      insight: 'The avoidance loop is real: not looking reduces short-term anxiety but increases long-term chaos. Your brain is trying to protect you, but it needs a system that removes the emotional charge from money decisions entirely.',
    };
    if (isChaos) return {
      score, priority, frictionType: 'FULL_RESET', protocolKeyword: '',
      headline: 'Full Financial System Reset Required',
      subheadline: 'You need a clean slate, not another tweak.',
      insight: 'Patching a broken system does not work. The 4-account reset gives your brain a simple, automatic structure — no willpower, no tracking, just money moving where it needs to go without you having to think about it.',
    };
    return {
      score, priority, frictionType: 'SYSTEM_FAILURE', protocolKeyword: '',
      headline: 'Money System Collapse',
      subheadline: 'You have a system. It just keeps breaking under pressure.',
      insight: 'The problem is not discipline — it is that your current system requires too many active decisions. The fix is automation: remove human judgment from as many money movements as possible and let the structure hold it for you.',
    };
  }

  // ── MELTDOWN FIRST AID ───────────────────────────────────────
  if (toolSlug === 'meltdown-first-aid') {
    const isDaysLong = r[3].includes('days');
    const isNextDay = r[3].includes('next day') || r[3].includes('bleed');
    const noSolution = r[2].includes('not found') || r[2].includes('nothing');
    const score = isDaysLong ? 91 : isNextDay ? 81 : noSolution ? 76 : 62;
    const priority: ScoreLevel = score >= 85 ? 'critical' : score >= 74 ? 'high' : 'medium';

    if (isDaysLong) return {
      score, priority, frictionType: 'SEVERE_SHUTDOWN', protocolKeyword: '',
      headline: 'Extended Shutdown Pattern',
      subheadline: 'Your nervous system is spending days in recovery mode.',
      insight: 'Multi-day shutdowns signal that your nervous system is running a chronic deficit. The meltdown is the symptom, not the cause. Your kit needs to focus on prevention windows — catching the early warning signs before the point of no return.',
    };
    if (noSolution) return {
      score, priority, frictionType: 'NO_TOOLKIT', protocolKeyword: '',
      headline: 'No De-escalation Toolkit Yet',
      subheadline: 'You are navigating meltdowns without a map.',
      insight: 'Not having a reliable de-escalation strategy is not a personal failure — it means you have not yet found your nervous system specific combination. The kit is built around systematic experimentation: identify your sensory profile, test interventions, and build a personalised first aid sequence.',
    };
    return {
      score, priority, frictionType: 'RECOVERY_GAP', protocolKeyword: '',
      headline: 'Recovery Window Too Long',
      subheadline: 'The meltdown itself is manageable. Recovery is not.',
      insight: 'Your body knows how to come back — but it is taking too long. This usually means the post-meltdown environment is not supporting recovery. Your kit needs a dedicated recovery protocol as much as a de-escalation one.',
    };
  }

  // ── MEMORY PALACE ────────────────────────────────────────────
  if (toolSlug === 'memory-palace-builder') {
    const nothingWorks = r[3].includes('tried everything') || r[3].includes('nothing works');
    const neverTried = r[3].includes('never found');
    const isVisual = r[1].includes('visual') || r[1].includes('place');
    const score = nothingWorks ? 82 : neverTried ? 68 : 61;
    const priority: ScoreLevel = score >= 78 ? 'high' : 'medium';

    if (nothingWorks) return {
      score, priority, frictionType: 'HIGH_NEED', protocolKeyword: '',
      headline: 'Every System Has Failed You',
      subheadline: 'Standard memory techniques are not built for your brain.',
      insight: 'Most memory techniques assume a neurotypical encoding process. If everything has failed, the issue is not your effort — it is the method. The memory palace works differently: it bypasses verbal encoding entirely and uses spatial memory, which tends to be significantly stronger in ADHD and autistic brains.',
    };
    if (isVisual) return {
      score, priority, frictionType: 'VISUAL_LEARNER', protocolKeyword: '',
      headline: 'Strong Visual Memory Foundation',
      subheadline: 'You already have the core skill. You just need the structure.',
      insight: 'The fact that visualisation and location help you remember is the exact mechanism memory palaces exploit. You are well-positioned to build a powerful system — the palace just formalises and scales what your brain already does naturally.',
    };
    return {
      score, priority, frictionType: 'CONSISTENCY_GAP', protocolKeyword: '',
      headline: 'Inconsistent Memory System',
      subheadline: 'You know what works. Keeping it going is the hard part.',
      insight: 'The consistency problem in memory systems is almost always about friction, not motivation. If reviewing your palace takes effort, you will not do it. The fix is reducing the activation cost to near zero — 60-second daily reviews beat hour-long weekly sessions every time.',
    };
  }

  // ── MEETING TRANSLATOR ───────────────────────────────────────
  if (toolSlug === 'meeting-translator') {
    const isMasking = r[0].includes('masking') || r[0].includes('perform');
    const isDrained = r[2].includes('drained') || r[2].includes('marathon');
    const isLargeGroup = r[1].includes('large group') || r[1].includes('many voices');
    const score = (isMasking && isDrained) ? 84 : isMasking ? 78 : isDrained ? 74 : isLargeGroup ? 70 : 62;
    const priority: ScoreLevel = score >= 80 ? 'high' : 'medium';

    if (isMasking && isDrained) return {
      score, priority, frictionType: 'MASKING_EXHAUSTION', protocolKeyword: '',
      headline: 'Masking-Induced Meeting Exhaustion',
      subheadline: 'You are doing two jobs in every meeting and getting paid for one.',
      insight: 'Masking in meetings doubles your cognitive load: you are processing the meeting content while simultaneously managing a performance. The translator addresses this by externalising memory and comprehension — so your working memory can focus on being present instead of trying to hold everything at once.',
    };
    if (isMasking) return {
      score, priority, frictionType: 'PERFORMANCE_LOAD', protocolKeyword: '',
      headline: 'High Cognitive Load from Social Performance',
      subheadline: 'Your brain is splitting attention between the meeting and the mask.',
      insight: 'When masking takes significant working memory, there is less available for actual processing. Transcription tools do not just help you catch what you missed — they free up cognitive bandwidth in real time, so you can be more present rather than frantically trying to keep up.',
    };
    return {
      score, priority, frictionType: 'PROCESSING_GAP', protocolKeyword: '',
      headline: 'Post-Meeting Processing Gap',
      subheadline: 'You are in the meeting but leaving without what you need.',
      insight: 'Your processing style may need more time than meetings allow. Real-time transcription gives you a record to process at your own pace afterwards — transforming meetings from one-shot comprehension tests into recoverable reference documents.',
    };
  }

  // ── FINANCIAL AUTOPILOT ──────────────────────────────────────
  if (toolSlug === 'financial-autopilot') {
    const isUrgent = r[2].includes('cover this month') || r[2].includes('bills');
    const isIrregular = r[1].includes('irregular') || r[1].includes('unpredictable') || r[1].includes('between');
    const isEmotional = r[0].includes('emotional') || r[0].includes('bypass');
    const score = isUrgent ? 88 : isIrregular ? 80 : isEmotional ? 76 : 65;
    const priority: ScoreLevel = score >= 84 ? 'critical' : score >= 74 ? 'high' : 'medium';

    if (isUrgent) return {
      score, priority, frictionType: 'CASH_FLOW_CRISIS', protocolKeyword: '',
      headline: 'Active Cash Flow Crisis',
      subheadline: 'This needs immediate structure, not long-term planning.',
      insight: 'When coverage is in question month to month, automation is not a nice-to-have — it is urgent. The autopilot protocol starts with survival accounts first: a bare-bones version that ensures essentials are covered before anything else gets touched.',
    };
    if (isEmotional) return {
      score, priority, frictionType: 'EMOTIONAL_SPENDING', protocolKeyword: '',
      headline: 'Emotional Spending Override',
      subheadline: 'Willpower cannot compete with your nervous system.',
      insight: 'Emotional spending is not a discipline problem — it is a regulation and friction problem. When your nervous system is in dysregulation, it seeks dopamine and relief. The fix is structural: make the spending you regret physically harder to do, and let automation handle the rest.',
    };
    return {
      score, priority, frictionType: 'IRREGULAR_INCOME', protocolKeyword: '',
      headline: 'Irregular Income Management',
      subheadline: 'Standard autopilot systems were not built for your income type.',
      insight: 'Fixed automation breaks with variable income. The protocol for irregular earners works differently: percentage-based allocations instead of fixed amounts, a buffer account that absorbs the peaks and troughs, and a simplified monthly reset rather than a set-and-forget approach.',
    };
  }

  // ── BODY DOUBLE MATCHMAKER ───────────────────────────────────
  if (toolSlug === 'body-double-matchmaker') {
    const cantStart = r[2].includes('cannot make myself start') || r[2].includes('can not make myself start');
    const isAvoidance = r[2].includes('other things') || r[2].includes('guilty');
    const wantsSilent = r[1].includes('silent') || r[1].includes('zero interaction');
    const score = cantStart ? 82 : isAvoidance ? 75 : 65;
    const priority: ScoreLevel = score >= 80 ? 'high' : 'medium';

    if (cantStart) return {
      score, priority, frictionType: 'START_BLOCK', protocolKeyword: '',
      headline: 'Initiation Block',
      subheadline: 'Your brain cannot generate the activation energy to begin alone.',
      insight: 'Task initiation is an executive function, not a motivation function. When it is impaired, no amount of wanting to start will produce starting. A body double provides external activation energy — the neurological equivalent of a push-start. The match protocol pairs you with someone whose presence alone lowers your start threshold.',
    };
    if (isAvoidance) return {
      score, priority, frictionType: 'AVOIDANCE_LOOP', protocolKeyword: '',
      headline: 'Avoidance and Guilt Loop',
      subheadline: 'The guilt is using more energy than the task would have.',
      insight: 'Avoidance followed by guilt is one of the most energy-expensive patterns in the ADHD experience. A body double breaks the loop by creating a low-stakes commitment structure — showing up for someone else is neurologically easier than showing up for yourself, and that is not a weakness.',
    };
    return {
      score, priority, frictionType: wantsSilent ? 'SILENT_PRESENCE' : 'ACCOUNTABILITY', protocolKeyword: '',
      headline: wantsSilent ? 'Silent Presence Required' : 'Accountability Structure Required',
      subheadline: wantsSilent ? 'You work best when observed, not coached.' : 'You need a check-in structure to stay on task.',
      insight: wantsSilent
        ? 'Your nervous system responds to social observation without needing interaction. This is one of the most effective body double configurations — shared silent space, no conversation, no distraction. The match protocol finds you someone else in the same mode.'
        : 'Structured accountability check-ins at the start and end of sessions have a significantly higher completion rate than open-ended working sessions. Your match will set a brief opening intent and a closing report — nothing more.',
    };
  }

  // ── SENSORY AUDIT ────────────────────────────────────────────
  if (toolSlug === 'sensory-audit') {
    const noSolution = r[3].includes('nothing reliable') || r[3].includes('looking for');
    const isMultiple = r[0].includes('multiple') || r[0].includes('compound');
    const isHomeUnsafe = r[1].includes('own home') || r[1].includes('no quiet');
    const isPhysical = r[2].includes('physical') || r[2].includes('headache') || r[2].includes('nausea');
    const score = (isMultiple && noSolution) ? 88 : noSolution ? 80 : isHomeUnsafe ? 84 : isPhysical ? 76 : 65;
    const priority: ScoreLevel = score >= 84 ? 'critical' : score >= 74 ? 'high' : 'medium';

    if (isHomeUnsafe) return {
      score, priority, frictionType: 'NO_SAFE_SPACE', protocolKeyword: '',
      headline: 'No Sensory Safe Space',
      subheadline: 'Constant exposure with no recovery zone is unsustainable.',
      insight: 'Sensory regulation requires periods of low-input recovery. Without a reliable safe space at home, your nervous system stays in a chronic state of mild to moderate overload — which compounds every other challenge. The audit starts by engineering a minimum viable sensory refuge, even in a shared or restricted environment.',
    };
    if (isMultiple && noSolution) return {
      score, priority, frictionType: 'MULTI_SENSORY_UNMANAGED', protocolKeyword: '',
      headline: 'Multi-Sensory Overload with No Management System',
      subheadline: 'You are carrying a full load with no off switch.',
      insight: 'Multi-sensory sensitivity without a management system means you are in a constant state of sensory debt. The audit maps exactly which inputs are hitting you and at what threshold, then builds a layered management plan — starting with the highest-impact interventions for your specific profile.',
    };
    if (noSolution) return {
      score, priority, frictionType: 'UNMANAGED_SENSITIVITY', protocolKeyword: '',
      headline: 'Unmanaged Sensory Sensitivity',
      subheadline: 'You know what overwhelms you. You just do not have a plan yet.',
      insight: 'Knowing your triggers without a management strategy is frustrating — you can see the problem but not the exit. The sensory audit turns your awareness into a personalised action plan: which environments to avoid, which to modify, and which tools give you the most relief per effort.',
    };
    return {
      score, priority, frictionType: 'PARTIAL_MANAGEMENT', protocolKeyword: '',
      headline: 'Partially Managed Sensory Profile',
      subheadline: 'You have some tools. You need a complete system.',
      insight: 'Having one or two interventions that work is a good start — it confirms your nervous system responds to management strategies. The audit builds on what already works and fills the gaps, creating a complete sensory load management system rather than a collection of individual fixes.',
    };
  }

  return null;
}

function getProtocolPreview(frictionType: string): ProtocolStep[] {
  const previews: Record<string, ProtocolStep[]> = {
    // Money Reset
    ANXIETY_AVOIDANCE: [
      { stepNumber: 1, title: "The one-look rule", description: "Open your account for 60 seconds only. No decisions, no judgment — just look. That is the whole task." },
      { stepNumber: 2, title: "Build the 4-account structure", description: "Separate your money into four named accounts: bills, spending, buffer, and future. The separation removes the emotional charge." },
    ],
    FULL_RESET: [
      { stepNumber: 1, title: "Zero-based restart", description: "List every regular outgoing first — rent, subscriptions, bills. That number is your floor. Everything else is negotiable." },
      { stepNumber: 2, title: "Automate on payday", description: "Set every transfer to fire on the day income lands. Before you can spend it, it is already gone to the right place." },
    ],
    SYSTEM_FAILURE: [
      { stepNumber: 1, title: "Remove decisions from the system", description: "Every step that requires you to actively choose is a failure point. Automate anything that can be automated." },
      { stepNumber: 2, title: "Build the minimum viable system", description: "One account for bills only. One for everything else. That is it for now — add complexity only when basics are stable." },
    ],
    // Meltdown First Aid
    SEVERE_SHUTDOWN: [
      { stepNumber: 1, title: "Map your early warning system", description: "Identify your 3 earliest physical signals — before the point of no return. These become your intervention triggers." },
      { stepNumber: 2, title: "Design a 5-minute prevention window", description: "When you spot an early signal, you have a brief window. Your kit goes here: one sensory input, one exit route, one safe phrase." },
    ],
    NO_TOOLKIT: [
      { stepNumber: 1, title: "Sensory input inventory", description: "Test five different sensory inputs this week — cold, pressure, rhythm, darkness, texture. Note which direction each pulls your nervous system." },
      { stepNumber: 2, title: "Build your sequence", description: "A kit is not one thing — it is a sequence. Something for de-escalation, something for recovery, something for re-entry. Build all three." },
    ],
    RECOVERY_GAP: [
      { stepNumber: 1, title: "Design a recovery environment", description: "Where you go after a meltdown matters as much as the de-escalation. Identify your minimum viable recovery space." },
      { stepNumber: 2, title: "Set a recovery time boundary", description: "Tell the people around you what recovery looks like and how long it takes. Interrupted recovery extends it significantly." },
    ],
    // Memory Palace
    HIGH_NEED: [
      { stepNumber: 1, title: "Build your first palace", description: "Choose a building you know perfectly — your childhood home, a route you walk. Place three things there. Walk it in your mind." },
      { stepNumber: 2, title: "60-second daily review", description: "Walk the palace in your head once per day. Thirty seconds in the morning. That is enough to cement it." },
    ],
    VISUAL_LEARNER: [
      { stepNumber: 1, title: "Scale what already works", description: "You already visualise well. The palace is just a structured container for that. Start with one room, five items, one topic." },
      { stepNumber: 2, title: "Add spaced repetition", description: "Review on day 1, day 3, day 7, then weekly. The spacing does the work — you do not need to review more, just at the right intervals." },
    ],
    CONSISTENCY_GAP: [
      { stepNumber: 1, title: "Reduce activation cost to zero", description: "Your review needs to happen without any friction. Same time, same trigger, same device. Make starting automatic." },
      { stepNumber: 2, title: "Shrink the review", description: "If reviewing takes more than 2 minutes, it will not happen consistently. Cut it down until it does." },
    ],
    // Meeting Translator
    MASKING_EXHAUSTION: [
      { stepNumber: 1, title: "Deploy transcription before the meeting", description: "Have your translation tool running before anyone speaks. When you know it is capturing everything, you can stop performing memory." },
      { stepNumber: 2, title: "Process after, not during", description: "Stop trying to hold meeting content in real time. Let the transcript hold it. Your job during the meeting is just to be there." },
    ],
    PERFORMANCE_LOAD: [
      { stepNumber: 1, title: "Use the transcript as your working memory", description: "You do not need to remember what was said 10 minutes ago — the transcript has it. This frees you to process what is happening now." },
      { stepNumber: 2, title: "Allow yourself a processing gap", description: "Tell one trusted person you process better when you can review. Even 5 minutes post-meeting changes the comprehension significantly." },
    ],
    PROCESSING_GAP: [
      { stepNumber: 1, title: "Capture first, review second", description: "Do not try to act on meeting content immediately. Capture everything, then review in your own time and at your own pace." },
      { stepNumber: 2, title: "Build a 24-hour response buffer", description: "If your environment allows it, delay non-urgent responses until after you have processed the transcript. Clarity improves significantly." },
    ],
    // Financial Autopilot
    CASH_FLOW_CRISIS: [
      { stepNumber: 1, title: "Essentials first — everything else waits", description: "Split your account immediately: one amount covers non-negotiables for the month. That money does not get touched for anything else." },
      { stepNumber: 2, title: "Build a 7-day buffer", description: "Even 50 in a separate account creates breathing room. The buffer means one bad week does not cascade into a bad month." },
    ],
    EMOTIONAL_SPENDING: [
      { stepNumber: 1, title: "Add friction to emotional spending", description: "Move discretionary money to a separate account with no card. The extra step breaks the automatic loop in the moment." },
      { stepNumber: 2, title: "Pre-commit your spending amount", description: "Decide in advance what the discretionary total is for the month. Once it is gone, it is gone — no transfers, no top-ups." },
    ],
    IRREGULAR_INCOME: [
      { stepNumber: 1, title: "Calculate your monthly floor", description: "What is the minimum you need to cover essentials? That number drives everything. Automate to cover floor first on every payment." },
      { stepNumber: 2, title: "Buffer account as the variable absorber", description: "All income goes into a buffer first. You pay yourself a fixed amount from the buffer each month regardless of what came in." },
    ],
    // Body Double
    START_BLOCK: [
      { stepNumber: 1, title: "Commit to 10 minutes only", description: "The match session starts with a 10-minute commitment. Not the task — just 10 minutes of starting. The rest usually follows." },
      { stepNumber: 2, title: "Use the opening check-in as your ignition", description: "Tell your body double exactly what you are starting with in one sentence. Saying it out loud is neurologically different from just thinking it." },
    ],
    AVOIDANCE_LOOP: [
      { stepNumber: 1, title: "Externalise the accountability", description: "Showing up for someone else bypasses the internal resistance. Your session starts with a shared intent — both of you state what you are working on." },
      { stepNumber: 2, title: "The guilt-free close", description: "Every session ends with a report of what happened — not what you planned. Partial progress counts. No guilt, just data." },
    ],
    SILENT_PRESENCE: [
      { stepNumber: 1, title: "Match with a deep-work partner", description: "Your ideal session: cameras on, no talking, someone also doing focused work. The shared space does the neurological work." },
      { stepNumber: 2, title: "90-minute silent blocks", description: "No check-ins, no prompts. Just two people in parallel. Set a shared timer and work until it ends." },
    ],
    ACCOUNTABILITY: [
      { stepNumber: 1, title: "The opening intent", description: "State what you are working on and how long it should take. Your body double mirrors back what they heard. That exchange is the activation." },
      { stepNumber: 2, title: "The 25-minute check", description: "At 25 minutes, a brief pause: still on task? Adjust if not. No judgment, just recalibration." },
    ],
    // Sensory Audit
    NO_SAFE_SPACE: [
      { stepNumber: 1, title: "Engineer a minimum viable refuge", description: "Even a corner with headphones and a specific light counts. Designate and protect it — this is not optional, it is infrastructure." },
      { stepNumber: 2, title: "Build a sensory reset ritual", description: "A 10-minute sequence that reliably brings your nervous system down. Same every time, same order — the predictability is part of what works." },
    ],
    MULTI_SENSORY_UNMANAGED: [
      { stepNumber: 1, title: "Audit your daily sensory load", description: "Map your average day hour by hour. Where is the input highest? Where are the natural gaps? You need 3 low-input windows per day minimum." },
      { stepNumber: 2, title: "Layer interventions by sense", description: "Address your highest-impact sense first. One change at a time — stacking too many interventions at once makes it impossible to know what worked." },
    ],
    UNMANAGED_SENSITIVITY: [
      { stepNumber: 1, title: "Identify your top three triggers", description: "Not everything — just the three inputs that cause the most disruption. Those get addressed first in your management plan." },
      { stepNumber: 2, title: "Build avoidance and mitigation options", description: "For each trigger: can you avoid it, or can you mitigate it? Both are valid strategies. Your plan needs at least one option per trigger." },
    ],
    PARTIAL_MANAGEMENT: [
      { stepNumber: 1, title: "Document what already works", description: "Write down exactly what helps and under what conditions. This is your foundation — build from what works, not from what should work." },
      { stepNumber: 2, title: "Identify the gaps", description: "Which environments or triggers still have no management strategy? Rank them by frequency of exposure. Those are next." },
    ],
  };

  return previews[frictionType] ?? [
    { stepNumber: 1, title: "Identify the core friction", description: "Notice exactly where and when the difficulty is highest for you specifically." },
    { stepNumber: 2, title: "Start with the smallest possible change", description: "The most sustainable systems begin with one modification that requires no willpower to maintain." },
  ];
}

function computeScore(): number {
  return Math.floor(Math.random() * 40) + 40;
}

type Tool = {
  id: string;
  slug: string;
  name: string;
  branch: string;
  color: string;
  keyword: string;
  tldr: string;
  description: string;
  long_description: string;
  cover_image: string;
  questions: Question[];
};

const supabase = createClient();

export default function ToolAssessmentClient({ tool, whatsappContext }: {
  tool: Tool,
  whatsappContext?: { sourceKeyword: string, entryTime: string } | null
}) {
  const [currentStep, setCurrentStep] = useState(whatsappContext ? 0 : -1); // Auto-start if from WhatsApp
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setIsSaved] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showFullResults, setShowFullResults] = useState(false);

  useEffect(() => {
    if (whatsappContext && tool.questions.length === 0) {
      handleAssessmentComplete();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('item_slug', tool.slug)
          .eq('user_id', user.id)
          .single();
        if (data) setIsSaved(true);
      }
    }
    checkUser();
  }, [tool.slug]);

  const saveHistory = async (result: AssessmentResult, frictionType?: string) => {
    if (!user) return;

    await supabase.from('assessment_history').insert({
      user_id: user.id,
      tool_slug: tool.slug,
      tool_name: tool.name,
      score: result.score,
      level: result.level,
      answers: answers,
      friction_type: frictionType ?? null,
    });
  };

  const handleAssessmentComplete = async () => {
    setIsAnalyzing(true);

    try {
      const branchSlug = tool.branch.toLowerCase().replace(/\s+/g, '-') as BranchSlug;

      const analysis = tool.questions.length > 0
        ? analyzeToolAnswers(tool.slug, answers, tool.questions)
        : null;

      const score = analysis?.score ?? computeScore();

      const narrative: NarrativeLayer = analysis
        ? { headline: analysis.headline, subheadline: analysis.subheadline, insight: analysis.insight, urgency: analysis.priority }
        : generateNarrative(score, branchSlug);

      const protocolPreview: ProtocolStep[] = analysis
        ? getProtocolPreview(analysis.frictionType)
        : [
            { stepNumber: 1, title: "Identify the trigger", description: "Notice exactly when the compulsion starts." },
            { stepNumber: 2, title: "The 30-second pause", description: "Create a micro-gap between urge and action." },
          ];

      const { data: recTools } = await supabase
        .from('tools')
        .select('name, short_description, tldr, branch, color, slug')
        .eq('branch', tool.branch)
        .neq('slug', tool.slug)
        .neq('status', 'Draft')
        .limit(2);

      const { data: recProtocols } = await supabase
        .from('protocols')
        .select('title, excerpt, summary, branch, color, slug')
        .eq('branch', tool.branch)
        .eq('status', 'Published')
        .limit(2);

      const recommendations: Recommendation[] = [
        ...(recTools || []).map(t => ({
          title: t.name,
          description: t.short_description || t.tldr || '',
          branch: t.branch as BranchSlug,
          branchColor: t.color,
          href: `/tools/${t.slug}`,
          type: 'tool' as const
        })),
        ...(recProtocols || []).map(p => ({
          title: p.title,
          description: p.excerpt || p.summary || '',
          branch: p.branch as BranchSlug,
          branchColor: p.color || tool.color,
          href: `/intelligence/${p.slug}`,
          type: 'protocol' as const
        }))
      ];

      const result: AssessmentResult = {
        score,
        normalizedScore: score,
        branch: branchSlug,
        level: getScoreLevel(score),
        narrative,
        recommendations,
        protocolPreview,
        whatsappKeyword: (analysis?.protocolKeyword || tool.keyword),
      };

      setAssessmentResult(result);
      if (user) await saveHistory(result, analysis?.frictionType);
    } catch (_err) {
      // Ensure completion screen always shows even if analysis fails
      setAssessmentResult({
        score: 70,
        normalizedScore: 70,
        branch: tool.branch.toLowerCase().replace(/\s+/g, '-') as BranchSlug,
        level: 'high',
        narrative: { headline: tool.name, subheadline: 'Assessment complete.', insight: '', urgency: 'high' },
        recommendations: [],
        protocolPreview: [],
        whatsappKeyword: tool.keyword,
      });
    }

    setTimeout(() => setIsAnalyzing(false), 2500);
  };

  const handleAnswer = (questionId: number, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    if (currentStep < tool.questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setCurrentStep(tool.questions.length);
      handleAssessmentComplete();
    }
  };

  const displayProgress = calculateAcceleratedProgress(currentStep, tool.questions.length);
  const toolColor = tool.color || "#ffffff";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto w-full min-h-screen flex flex-col justify-center px-4">

        {/* Progress Bar */}
        {currentStep >= 0 && currentStep < tool.questions.length && (
          <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-[60]">
            <motion.div 
              className="h-full"
              style={{ backgroundColor: toolColor }}
              initial={{ width: 0 }}
              animate={{ width: `${displayProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* INTRO SCREEN */}
          {currentStep === -1 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 max-w-sm mx-auto shadow-2xl">
                <ArticleCover
                  keyword={tool.keyword}
                  branch={tool.branch}
                  color={tool.color || "#ffffff"}
                  title={tool.name}
                  imageUrl={tool.cover_image || undefined}
                />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight px-4">
                {tool.name}
              </h1>

              <p className="text-white/40 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed px-4">
                {tool.long_description || tool.tldr || tool.description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest mb-12 px-4">
                <span>{tool.questions.length} questions</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>2 minutes</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Personalized Result</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  onClick={() => {
                    setCurrentStep(0);
                    if (tool.questions.length === 0) handleAssessmentComplete();
                  }}
                  className="w-full sm:w-auto bg-white text-black font-black px-12 py-5 rounded-full transition-all duration-300"
                  style={{ boxShadow: `0 0 50px ${toolColor}40` }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Assessment →
                </motion.button>
                {user && (
                  <SaveToPhoneButton
                    title={tool.name}
                    summary={tool.tldr || undefined}
                    size="md"
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* QUESTION SCREENS */}
          {currentStep >= 0 && currentStep < tool.questions.length && (
            <motion.div 
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-black border border-white/5 rounded-[40px] p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl"
            >
              <div 
                className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-[100px] pointer-events-none"
                style={{ backgroundColor: toolColor, transform: 'translate(30%, -30%)' }}
              />
              
              <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                Question {currentStep + 1} of {tool.questions.length}
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 leading-tight tracking-tight">
                {tool.questions[currentStep].text}
              </h2>
              
              <div className="space-y-4">
                {tool.questions[currentStep].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(tool.questions[currentStep].id, option)}
                    className="w-full text-left px-6 py-6 rounded-2xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300 group flex items-start gap-5 text-base md:text-lg"
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span 
                        className="shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-black mt-0.5 group-hover:border-white/30 transition-colors"
                        style={{ color: toolColor }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed font-medium">{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ANALYZING SCREEN */}
          {currentStep === tool.questions.length && isAnalyzing && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-20 h-20 border-4 border-white/5 rounded-full mx-auto mb-10"
                style={{ borderTopColor: toolColor }}
              />
              <h2 className="text-3xl font-black mb-4 tracking-tight">Analyzing your responses</h2>
              <motion.p 
                className="text-white/30 text-lg uppercase tracking-widest font-bold"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Building Intelligence Report...
              </motion.p>
            </motion.div>
          )}

          {/* COMPLETION SCREEN */}
          {currentStep === tool.questions.length && !isAnalyzing && assessmentResult && !showFullResults && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="py-16 flex flex-col items-center text-center"
            >
              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-ps-yellow border-2 border-ps-black flex items-center justify-center mb-6"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12L10 18L20 6" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              <p className="label-yellow mb-3">Assessment complete</p>
              <h2 className="font-display uppercase text-ps-white text-xl sm:text-2xl leading-tight mb-3 px-4">
                {assessmentResult.narrative.headline}
              </h2>
              <p className="text-ps-white/50 text-sm max-w-sm leading-relaxed mb-10 px-4">
                {assessmentResult.narrative.subheadline}
              </p>

              {/* Primary CTA — WhatsApp */}
              <a
                href={`https://wa.me/447591922247?text=${encodeURIComponent(assessmentResult.whatsappKeyword || tool.keyword || tool.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-yellow flex items-center justify-center gap-3 px-8 py-4 w-full max-w-sm text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send results to my WhatsApp
              </a>

              <button
                onClick={() => setShowFullResults(true)}
                className="mt-5 text-ps-white/40 text-[10px] font-display uppercase tracking-widest hover:text-ps-white transition-colors"
              >
                See full analysis →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FULL RESULTS — outside AnimatePresence to avoid conflict */}
      {showFullResults && assessmentResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100]"
        >
          <ResultsScreen
            result={assessmentResult}
            isAuthenticated={!!user}
          />
        </motion.div>
      )}
    </div>
  );
}
