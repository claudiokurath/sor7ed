"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const ADHDTaxCalculator = dynamic(() => import("@/components/tool-os/ADHDTaxCalculator"), { ssr: false });
const FinancialAutopilot = dynamic(() => import("@/components/tool-os/FinancialAutopilot"), { ssr: false });
const DecisionParalysisSolver = dynamic(() => import("@/components/tool-os/DecisionParalysisSolver"), { ssr: false });
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import ArticleCover from './ArticleCover';
import ResultsScreen from './ResultsScreen';
import SaveToPhoneButton from './SaveToPhoneButton';
import { calculateAcceleratedProgress } from "@/lib/progress-curve";
import { generateNarrative, getScoreLevel } from "@/lib/narrative-engine";
import { AssessmentResult, BranchSlug, NarrativeLayer, Recommendation, ProtocolStep, ScoreLevel, DeepDive } from "@/types/assessment";

type Question = {
  id: string;
  text: string;
  type: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue?: any;
  placeholder?: string;
  required?: boolean;
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
  answers: Record<string, any>,
  questions: Question[]
): ToolAnalysis | null {
  const r = questions.map(q => (String(answers[q.id] ?? '')).toLowerCase());
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
    // ── MONEY RESET ──────────────────────────────────────────────
    ANXIETY_AVOIDANCE: [
      { stepNumber: 1, title: "The one-look rule", duration: "60 seconds", description: "Open your bank app and look at the balance. That is the entire task. No decisions, no judgment, no action — just observe the number. Do this once today. The goal is breaking the pattern of complete avoidance, not fixing anything yet." },
      { stepNumber: 2, title: "Subscription audit", duration: "20 minutes", description: "Go to your bank statements and highlight every recurring charge you did not actively decide to pay this month. These are the silent leaks that make the balance feel wrong. Cancel anything you cannot name a reason for." },
      { stepNumber: 3, title: "Open your 4 accounts", duration: "30 minutes", description: "Open four accounts with clear names: Bills, Spending, Buffer, and Future. Monzo and Starling both allow instant sub-accounts or pots at no cost. The names matter — they replace willpower with structure." },
      { stepNumber: 4, title: "Set payday automations", duration: "15 minutes", description: "On payday, money moves automatically: Bills gets your fixed outgoings total, Buffer gets 10%, Future gets 10%, Spending gets the rest. Set standing orders for the day after payday so the system runs without you." },
      { stepNumber: 5, title: "The weekly 3-minute check", duration: "3 minutes, weekly", description: "Every Monday, open only your Spending account. Is it on track for the week? That is the only number you need to think about. Bills and Buffer are automated — they do not need your attention." },
    ],
    FULL_RESET: [
      { stepNumber: 1, title: "List every fixed outgoing", duration: "30 minutes", description: "Write every regular payment: rent, subscriptions, utilities, insurance, debt repayments. Add them up. That total is your financial floor — the minimum you need every month before any lifestyle spending. This number drives everything else." },
      { stepNumber: 2, title: "Cancel what you cannot justify", duration: "20 minutes", description: "Go through your subscription list. For each one, ask: did I use this in the last 30 days? If not, cancel it now. Most people are paying for 3-5 things they have completely forgotten about. That money becomes buffer." },
      { stepNumber: 3, title: "Open your accounts today", duration: "30 minutes", description: "Open four accounts: Bills (receives your floor amount on payday), Spending (your day-to-day card), Buffer (your safety net — minimum one month's floor), Future (savings, investment, irregular goals). Monzo Pots or Starling Spaces work perfectly for this." },
      { stepNumber: 4, title: "Set the automations on payday", duration: "20 minutes", description: "Create standing orders that fire on payday: floor amount to Bills, 10% to Buffer, remainder split between Spending and Future as you choose. Your spending card never sees the full amount — so overspending structurally cannot happen." },
      { stepNumber: 5, title: "The first week — expect friction", duration: "Ongoing", description: "Your first week will feel restrictive. That feeling is the system working. Check only your Spending account balance. If it reaches zero before the week is out, that is data — adjust the split next month, not the system." },
    ],
    SYSTEM_FAILURE: [
      { stepNumber: 1, title: "Identify where the system breaks", duration: "15 minutes", description: "When does money go wrong? Is it the first week after payday (impulse)? The last week (ran out)? A specific category (food, socialising)? Name the failure point precisely — the fix targets that specific moment, not your general relationship with money." },
      { stepNumber: 2, title: "Remove the decision", duration: "20 minutes", description: "Whatever the failure point is, the fix is automation — making it impossible to make the wrong decision in that moment. Impulsive spending? Remove the card from your wallet, pay from a low-balance account. Running out? Automate a weekly spending limit transfer." },
      { stepNumber: 3, title: "Build the minimum viable system", duration: "30 minutes", description: "Two accounts only: Bills (only direct debits, no card attached) and Spending (your daily card). Your entire budget lives in the difference. This is enough structure to stop most system failures without being so complex it breaks again." },
      { stepNumber: 4, title: "Add Buffer after 30 days", duration: "One month later", description: "Once the two-account system is running without thought, add a Buffer account and start directing 5-10% there on payday. The Buffer catches the irregular expenses that always surprised you — car costs, dental, gifts — without touching Bills." },
      { stepNumber: 5, title: "Review and iterate monthly", duration: "10 minutes, monthly", description: "At the end of each month: did the system hold? If yes, leave it alone. If it broke, identify the single point of failure and add one automation to address it. Never overhaul — adjust one thing at a time." },
    ],
    // ── MELTDOWN FIRST AID ───────────────────────────────────────
    SEVERE_SHUTDOWN: [
      { stepNumber: 1, title: "Map your early warning signals", duration: "This week", description: "Before the next meltdown, write down the physical sensations that appear 10-15 minutes before things become unmanageable. Common ones: jaw tension, change in hearing quality, throat tightening, sudden temperature sensitivity. These are your intervention triggers — catch them here and the protocol can work." },
      { stepNumber: 2, title: "Design your 5-minute prevention window", duration: "Today", description: "When you detect early signals, you have a narrow window. Choose one sensory intervention (cold water on wrists, weighted blanket, noise-cancelling headphones), one exit route (a phrase you can say to leave a situation without explanation), and one environment (a specific room or space you can always access)." },
      { stepNumber: 3, title: "Build your de-escalation sequence", duration: "This week", description: "A sequence, not a single tool. Start with the fastest-acting sensory input for your nervous system (temperature change is usually fastest). Follow with something that slows breathing (4-count in, 6-count out, no apps needed). End with reduced input: dark, quiet, horizontal if possible." },
      { stepNumber: 4, title: "Design your recovery environment", duration: "This week", description: "The space you go to after a meltdown matters as much as the de-escalation itself. It needs: low light, minimal sound, no demands, familiar sensory input (a specific blanket, scent, or texture). This is not luxury — it is infrastructure. Interrupted recovery significantly extends total recovery time." },
      { stepNumber: 5, title: "Tell one person the protocol", duration: "One conversation", description: "Choose one person in your life and tell them: what your early signals look like, what you need them to do (usually: give you space, do not ask questions, do not touch unless invited), and what recovery looks like. Their understanding reduces the social cost of the meltdown significantly." },
    ],
    NO_TOOLKIT: [
      { stepNumber: 1, title: "Sensory input experiment — week one", duration: "7 days", description: "Test one sensory input per day across these categories: temperature (cold water on face/wrists), pressure (weighted blanket, tight compression), rhythm (metronome, white noise, heartbeat sounds), darkness (blackout curtains, eye mask), texture (specific fabric, smooth stone). Note: calming or activating?" },
      { stepNumber: 2, title: "Identify your early warning signs", duration: "This week", description: "You cannot intervene if you do not know when to intervene. Keep a simple note: when did you feel things starting to escalate today? What were the first physical sensations? After one week you will have a personal early warning map." },
      { stepNumber: 3, title: "Build your de-escalation kit — 3 items only", duration: "This weekend", description: "Choose the three sensory tools that moved your nervous system most effectively. These become your kit. Physical, accessible, kept in the same place. Do not add more until you have tested these consistently for two weeks." },
      { stepNumber: 4, title: "Design your recovery space", duration: "This weekend", description: "Identify where in your environment you can recover after a meltdown. It needs to be: reliably accessible, low-input, and associated only with recovery (not work, screens, or demands). Even a corner with a specific blanket counts — the designation is what makes it work." },
      { stepNumber: 5, title: "Write your re-entry protocol", duration: "30 minutes", description: "After a meltdown, returning to normal is a distinct phase that needs its own plan. Write down: how long recovery usually takes, what signals mean you are ready to re-engage, and what the first low-demand task after recovery should be. Do not skip this — re-entry without a plan extends the total disruption." },
    ],
    RECOVERY_GAP: [
      { stepNumber: 1, title: "Audit your current recovery", duration: "This week", description: "After your next meltdown: where do you go? What do you do? How long before you feel functional again? What interrupts recovery? This is not self-criticism — it is data. You are mapping what currently happens so you can change one variable at a time." },
      { stepNumber: 2, title: "Design your recovery environment", duration: "This weekend", description: "Name and prepare your recovery space: specific room or corner, controlled light (warm, dimmable), minimal sound or specific noise, something physically comforting (blanket, pillow, specific texture). The space should require zero decision-making to access when you are already overwhelmed." },
      { stepNumber: 3, title: "Set a recovery time boundary with one person", duration: "One conversation", description: "Tell one person who is regularly present during your recovery: what the process looks like, how long it typically takes, and what they should and should not do during it. Interrupted recovery — demands, questions, check-ins — significantly extends total recovery time." },
      { stepNumber: 4, title: "Build a re-entry ladder", duration: "This week", description: "Create a list of tasks ordered by cognitive demand, from easiest to hardest. After recovery, start with the bottom of the ladder — one low-demand task. This prevents the second failure point: jumping back into high-demand situations before your system is actually ready." },
      { stepNumber: 5, title: "Log recovery time for 30 days", duration: "Ongoing", description: "After each meltdown, note: what triggered it, how long recovery took, what helped most. After 30 days you will see patterns — specific triggers with longer recovery, specific interventions that genuinely shorten it. This becomes your personalised protocol." },
    ],
    // ── MEMORY PALACE ────────────────────────────────────────────
    HIGH_NEED: [
      { stepNumber: 1, title: "Choose your first palace", duration: "10 minutes", description: "Pick a physical space you know in complete detail — your childhood bedroom, your current flat, the route from your front door to the nearest shop. You need to be able to walk it mentally without effort. This is your palace. You will use this same space for all initial practice." },
      { stepNumber: 2, title: "Place your first three items", duration: "15 minutes", description: "Choose three things to remember. In your mind, walk to three distinct locations in your palace and place one vivid, unusual image at each location. The image must be absurd, exaggerated, or moving — static normal images fade. Practice walking to each location and seeing the image clearly." },
      { stepNumber: 3, title: "Walk the palace out loud", duration: "5 minutes", description: "Immediately after placing items, describe the walk aloud: 'I walk in the front door and there is a giant purple penguin doing a handstand on the coat rack.' Saying it out loud creates an additional memory encoding. Do this once after placement, then once before sleep." },
      { stepNumber: 4, title: "The 60-second morning review", duration: "60 seconds, daily", description: "Every morning, walk your palace in your head before you look at your phone. Thirty seconds is enough. The goal is not deep recall — it is activation. Accessing the memory early in the day keeps the encoding strong. No app, no timer — just close your eyes and walk." },
      { stepNumber: 5, title: "Add a new palace after 2 weeks", duration: "2 weeks in", description: "Once your first palace is solid — you can walk it without thinking — build a second palace for a different category. Most effective setup: one palace per topic area (passwords, people's names, work knowledge, academic content). Keep palaces separated by topic to prevent interference." },
    ],
    VISUAL_LEARNER: [
      { stepNumber: 1, title: "Formalise what you already do", duration: "20 minutes", description: "You already visualise and associate locations with memories naturally. The palace is just a deliberate, organised version of that. Pick your first palace: a space you know perfectly. Mentally draw a map of it, noting 10 distinct locations in a walking order. These become your slots." },
      { stepNumber: 2, title: "One palace, one topic", duration: "This week", description: "Assign your first palace to one specific category of things you want to remember — could be a subject you are studying, a set of names, or a list of tasks. Keeping one palace per topic prevents your strong visual memory from creating interference between categories." },
      { stepNumber: 3, title: "Make images absurd and specific", duration: "Practice", description: "Your natural visualisation likely produces normal images. For memory palace use, images need to be exaggerated, bizarre, or physically impossible — a cat playing piano, a door melting like chocolate. The stranger the image, the stronger the encoding. This is the technique's core mechanism." },
      { stepNumber: 4, title: "Add spaced repetition timing", duration: "Ongoing", description: "Review your palace on day 1, day 3, day 7, then weekly. This spacing matches the brain's consolidation pattern — reviewing too frequently wastes time, reviewing too rarely loses the memory. The schedule does the work; you just need to show up for the review." },
      { stepNumber: 5, title: "Scale to 3 palaces across different spaces", duration: "Month 2", description: "After your first palace is automatic, build two more in different locations (work, a favourite place, a childhood space). Three palaces cover most memory needs. Expand only when each palace is well-established — rushing this reduces effectiveness." },
    ],
    CONSISTENCY_GAP: [
      { stepNumber: 1, title: "Attach review to an existing habit", duration: "Today", description: "Your review needs a trigger or it will not happen. Choose a habit you already do without thinking — making coffee, brushing teeth, getting into bed — and attach your 60-second palace walk to it. The existing habit pulls the new behaviour along." },
      { stepNumber: 2, title: "Shrink the review to 60 seconds maximum", duration: "This week", description: "If your palace walk takes more than 60 seconds, it is too big. Split it into smaller sections or reduce what is stored. A review you actually do every day beats a thorough review that happens occasionally. Consistency creates retention; completeness does not." },
      { stepNumber: 3, title: "Use the same trigger, device, location", duration: "This week", description: "Same time of day, same physical position, same habit trigger. Reducing decision-making about when and how to review reduces the activation energy to near zero. You should not have to decide to do the review — it should just happen when the trigger occurs." },
      { stepNumber: 4, title: "Remove friction from the start", duration: "Today", description: "What is the one thing that makes starting the review slightly harder? That thing is breaking your consistency. If it is opening an app, stop using the app and do it mentally. If it is finding a quiet moment, change the time of day. Identify and remove the single biggest friction point." },
      { stepNumber: 5, title: "Track a 21-day streak", duration: "3 weeks", description: "Keep a simple visual streak: an X on a calendar for every day you reviewed, even briefly. The streak becomes a motivator in its own right. Missing one day is allowed — missing two in a row triggers a reset to ensure you rebuild the habit before it is fully lost." },
    ],
    // ── MEETING TRANSLATOR ───────────────────────────────────────
    MASKING_EXHAUSTION: [
      { stepNumber: 1, title: "Set up transcription before the meeting starts", duration: "2 minutes pre-meeting", description: "Open your transcription tool (Otter.ai, Whisper, or your phone's built-in voice memo) before anyone speaks. Start it running. Knowing it is capturing everything allows your brain to stop the exhausting work of holding what was said. You are not supposed to be the recording device." },
      { stepNumber: 2, title: "Reduce masking load during the meeting", duration: "During meeting", description: "Choose one masking behaviour to drop during this meeting — sustained eye contact, constant nodding, or mirroring body language. Not all of them at once. Just one. Notice whether anyone reacts. Most of the time, they do not. This builds evidence against the belief that full performance is required." },
      { stepNumber: 3, title: "Process the transcript — not during, after", duration: "30 minutes post-meeting", description: "Do not try to process meeting content in real time. Immediately after the meeting, open the transcript and go through it once while your memory is still fresh. Highlight the three most important points and the one action you are responsible for. Nothing else needs your attention right now." },
      { stepNumber: 4, title: "Build a 2-hour post-meeting buffer", duration: "Scheduling", description: "When possible, leave 30 minutes of nothing after every meeting. This is not wasted time — it is processing time. Masking and performance work leave a cognitive debt that needs to be discharged before you can function effectively again. Treating this as essential time protects your output for the rest of the day." },
      { stepNumber: 5, title: "Tell one person what the transcript is for", duration: "One conversation", description: "Explain to one colleague or manager that you use transcription to process more accurately, not because you are not paying attention. Most people respond positively when the reason is framed around quality of output. This removes the social anxiety of using the tool visibly in meetings." },
    ],
    PERFORMANCE_LOAD: [
      { stepNumber: 1, title: "Use transcription as your external working memory", duration: "Every meeting", description: "Start your transcription tool (Otter.ai, Fireflies, or built-in phone tools) at the beginning of every meeting. This removes the need to hold content in working memory. Your working memory is then free to process what is happening now — which is its actual function." },
      { stepNumber: 2, title: "One thing to contribute per meeting", duration: "During meeting", description: "Before each meeting, identify the one point you want to make or the one question you want to ask. That is your performance obligation — one thing. Everything else is optional. This reduces the performance pressure significantly without reducing your actual contribution." },
      { stepNumber: 3, title: "Allow yourself a processing gap before responding", duration: "Post-meeting", description: "Tell one person you work with that you tend to respond to meeting content more usefully after a brief review period. Even a 2-hour delay produces significantly better responses than an immediate reply driven by incomplete processing." },
      { stepNumber: 4, title: "Skim the transcript for your action items", duration: "15 minutes post-meeting", description: "After the meeting, search the transcript for your name and any variations of 'action', 'can you', 'will you'. Extract these into a single list. That is the only output from the transcript you need — your personal commitments, clearly stated, no interpretation required." },
      { stepNumber: 5, title: "Reduce meeting frequency where possible", duration: "This month", description: "The most effective intervention for high cognitive load from meetings is fewer meetings. Audit your calendar: which recurring meetings are you in where your presence is not essential? Request to be removed or replaced with a brief written update. Each meeting removed reduces total masking load significantly." },
    ],
    PROCESSING_GAP: [
      { stepNumber: 1, title: "Capture everything — interpret nothing in the room", duration: "During meeting", description: "Your job during the meeting is only to capture. Use transcription, a voice memo, or rapid written notes with no concern for structure. Do not try to understand, connect, or evaluate what is being said as it happens. That work happens after, when you have all the information and processing time." },
      { stepNumber: 2, title: "Build a post-meeting review structure", duration: "30 minutes post-meeting", description: "Within 2 hours of every meeting, sit with your notes or transcript and do one pass: what was decided, what was agreed, what I need to do. Three lists, no more. Do not try to capture everything — just those three categories. This produces actionable output without requiring full recall." },
      { stepNumber: 3, title: "Build a 24-hour response buffer into expectations", duration: "One communication", description: "Tell your team or manager that your responses and contributions to meeting content will often come through in the 24 hours following a meeting, and that they will be higher quality for the delay. Frame it as accuracy over speed. Most professional environments respond well to this." },
      { stepNumber: 4, title: "Use asynchronous communication where possible", duration: "This week", description: "Many meetings are information transfers that could be a written document or a voice note. For meetings where you have input but not real-time decision-making responsibilities, request asynchronous formats. Loom (video), voice notes, or written updates give you processing time and produce better contribution." },
      { stepNumber: 5, title: "Create a meeting template for your processing", duration: "Today", description: "Build a simple note template: Meeting name, Date, Key decisions, My actions, Questions I still have. Open this before every meeting and fill it in from the transcript afterwards. Having a consistent structure removes the cognitive load of deciding how to process each time." },
    ],
    // ── FINANCIAL AUTOPILOT ──────────────────────────────────────
    CASH_FLOW_CRISIS: [
      { stepNumber: 1, title: "Separate essentials immediately", duration: "Today", description: "Today: transfer the exact amount needed for this month's non-negotiables (rent, utilities, food, minimum debt payments) to a separate account with no debit card. This money cannot be spent by accident. If you do not have a second account, open a Monzo or Starling account — it takes 10 minutes." },
      { stepNumber: 2, title: "Identify your financial floor", duration: "30 minutes", description: "Add up every fixed obligation for the month — the total that needs to exist regardless of anything else. This is your floor. Everything above the floor is negotiable. Everything at or below it is protected by the new structure." },
      { stepNumber: 3, title: "Build a 7-day buffer — start with £50", duration: "This month", description: "Even £50 in a separate untouched account creates breathing room. It means one unexpected expense does not become a cascade. The buffer does not need to be large — it needs to exist and stay untouched. Set a standing order for a small amount on payday until the buffer reaches one week's floor." },
      { stepNumber: 4, title: "Automate essentials on payday", duration: "20 minutes", description: "Set a standing order to move your floor amount to your Bills account on the day your income lands. Before any discretionary spending is possible, essentials are already protected. You never have to decide whether to pay the bills — the structure makes that decision automatically." },
      { stepNumber: 5, title: "Weekly cash flow check — 5 minutes only", duration: "Weekly", description: "Every Monday: how much is in Spending? Is it enough for the week? If yes, close the app. If no, identify the shortfall — is it a one-off or a structural problem? One-offs come from Buffer. Structural problems mean adjusting next month's split. Do not extend beyond 5 minutes." },
    ],
    EMOTIONAL_SPENDING: [
      { stepNumber: 1, title: "Add structural friction to emotional spending", duration: "Today", description: "Move your discretionary money to a separate account with no debit card attached, or a card kept in a drawer (not your wallet). To spend emotionally, you now need to take an active step to access the money. This gap — however small — interrupts the automatic loop in the moment." },
      { stepNumber: 2, title: "Identify your triggers", duration: "This week", description: "After each spending episode in the next week, note: what was the emotion or situation immediately before? You are looking for the pattern — is it stress, boredom, social anxiety, celebration? Knowing the trigger makes the intervention specific rather than general." },
      { stepNumber: 3, title: "Pre-commit your monthly discretionary total", duration: "Start of each month", description: "On the first of the month, decide the total available for discretionary spending. Transfer only that amount to your Spending account. When it is gone, it is gone — no transfers from Bills or Buffer, no top-ups mid-month. This limit is not punishment; it is your agreement with yourself, made when you are calm." },
      { stepNumber: 4, title: "Create a 24-hour rule for non-essential purchases over £30", duration: "Ongoing", description: "For any purchase over £30 that is not planned: wait 24 hours. Put it in a note titled 'Pending'. If you still want it tomorrow, you can buy it. Most emotional purchases disappear completely within 24 hours. This is not deprivation — it is giving your rational brain time to catch up with your emotional brain." },
      { stepNumber: 5, title: "Build a regulation alternative", duration: "This week", description: "Emotional spending often regulates something. Identify what it is regulating — stress relief, dopamine, a sense of control — and build one alternative that addresses the same need. It does not need to replace all spending, just create a competing option in the moment of impulse." },
    ],
    IRREGULAR_INCOME: [
      { stepNumber: 1, title: "Calculate your monthly floor", duration: "30 minutes", description: "List every non-negotiable outgoing: rent/mortgage, utilities, food, insurance, minimum debt payments, transport. Add them up. This is your floor — the number that must be covered regardless of what came in. Everything else is discretionary until the floor is guaranteed." },
      { stepNumber: 2, title: "Open a Buffer account today", duration: "10 minutes", description: "All income enters the Buffer first — not your current account, not your Bills account. You pay yourself a fixed 'salary' from Buffer each month, regardless of what came in. In high months, the buffer builds. In low months, the buffer covers the gap. This is how you create predictability from variability." },
      { stepNumber: 3, title: "Set your fixed monthly salary", duration: "20 minutes", description: "Calculate your average monthly income over the last 6 months. Set your monthly salary at 80% of that average. The 20% discount builds the buffer in good months without you having to think about it. The salary amount stays fixed for 3 months at a time — reassess quarterly." },
      { stepNumber: 4, title: "Automate from Buffer on a fixed date", duration: "20 minutes", description: "On the same date each month, Buffer automatically sends: your floor amount to Bills, your spending amount to Spending. You do not decide these transfers — they happen automatically on a date you chose when things were calm. Irregular income becomes predictable lifestyle." },
      { stepNumber: 5, title: "Tax and irregular expenses — separate them immediately", duration: "Every payment received", description: "Every time income arrives in Buffer, immediately transfer: your tax percentage (25-30% if self-employed) to a separate Tax account, and a fixed amount to Irregular (annual bills, car, medical, gifts). These two are the ones that destroy irregular earners — removing them the moment money arrives means they cannot be accidentally spent." },
    ],
    // ── BODY DOUBLE MATCHMAKER ───────────────────────────────────
    START_BLOCK: [
      { stepNumber: 1, title: "Commit to 10 minutes — not the task", duration: "Session start", description: "The most effective body double session starts with a 10-minute commitment, not a task commitment. 'I will be here for 10 minutes' is easier to agree to than 'I will finish this report.' Once the session starts, the activation energy problem usually solves itself. The commitment gets you in the chair; presence does the rest." },
      { stepNumber: 2, title: "State one specific opening task out loud", duration: "30 seconds", description: "Tell your body double exactly what you are opening with — not what you hope to finish, just the first thing. 'I am going to open the document and read the last paragraph I wrote.' Saying it out loud creates a neurological commitment that thinking it does not. This is the ignition." },
      { stepNumber: 3, title: "Use a shared visible timer", duration: "During session", description: "Both participants run the same timer — a shared Pomofocus session, a video call with a visible countdown, or simply agreeing on the end time. A visible shared timer externalises time awareness, which is often the mechanism behind start blocks — not laziness, but difficulty perceiving future time as real." },
      { stepNumber: 4, title: "The 5-minute extension rule", duration: "At session end", description: "When the timer ends, decide: 5 more minutes or close? Often the session ending is a natural completion point. But sometimes you are in flow — the 5-minute extension acknowledges this without removing the structure entirely. You always have the choice to stop; you just do not have to." },
      { stepNumber: 5, title: "The closing report — what happened, not what you planned", duration: "2 minutes", description: "End every session with a brief verbal report to your body double: what did you actually do? Not what you planned. Not judgment. Just: 'I got through 3 sections and answered 2 emails.' This closes the session cleanly and gives you accurate data on your actual output — which is almost always more than you feel like you did." },
    ],
    AVOIDANCE_LOOP: [
      { stepNumber: 1, title: "Externalise the first commitment", duration: "Session start", description: "The avoidance loop feeds on internal commitment, which your nervous system has learned to override. Saying your intention out loud to another person — even a stranger in a body double session — creates a different type of commitment. Showing up for someone else is neurologically easier than showing up for yourself. This is not weakness; it is leverage." },
      { stepNumber: 2, title: "Make the session shorter than feels necessary", duration: "Session planning", description: "Book 25 minutes. Not 90. Short sessions reduce the dread that feeds avoidance — knowing you only have to show up for 25 minutes removes most of the resistance. You can always extend. You cannot un-avoid a 90-minute session that felt impossible to start." },
      { stepNumber: 3, title: "The opening exchange — both states", duration: "2 minutes", description: "Start every session with: 'I am working on X and I am feeling Y about it.' Your body double does the same. Naming how you feel about the task before starting it separates the emotion from the task itself. Avoidance often collapses when the feeling is acknowledged rather than pushed through." },
      { stepNumber: 4, title: "The guilt-free close", duration: "Session end", description: "End every session with a report of what actually happened — not what you planned to do. Partial progress is progress. Avoidance that broke after 10 minutes is still a win compared to full avoidance. No guilt, no self-criticism — just an honest account of what happened." },
      { stepNumber: 5, title: "Reduce the task before the session starts", duration: "Pre-session", description: "Before each session, spend 2 minutes making the task smaller. Not 'write the report' — 'write the opening paragraph.' Not 'clean the flat' — 'clear the kitchen counter.' The body double provides activation energy; the smaller task ensures that energy is enough to actually start." },
    ],
    SILENT_PRESENCE: [
      { stepNumber: 1, title: "Match with a deep-work partner specifically", duration: "Setup", description: "You need someone who is also doing focused, silent work — not someone who wants to chat or check in. Look for body double communities where silent co-working is the default: Focusmate (filter for silent sessions), Discord study servers, or a trusted colleague who also benefits from company without conversation." },
      { stepNumber: 2, title: "Agree the session format before starting", duration: "2 minutes", description: "Before the session begins: confirm the length, confirm no talking except at start and end, confirm cameras on or off based on preference. Having this agreed removes the social ambiguity that might otherwise interrupt focus. The structure is what makes silence comfortable rather than awkward." },
      { stepNumber: 3, title: "Cameras on, even if you do not look", duration: "During session", description: "The neurological effect of body doubling comes from the awareness of another human presence. Cameras on — even if you rarely look at the screen — maintains this. The knowledge that someone is there is what produces the effect. You do not need to interact; you just need to not be alone." },
      { stepNumber: 4, title: "90-minute blocks with a natural break point", duration: "Session structure", description: "Silent body double sessions work well at 90 minutes — long enough to reach deep focus, structured enough to have an end point. Plan sessions around a natural break in your work, not an arbitrary time limit. Ending mid-flow is more disruptive than it needs to be." },
      { stepNumber: 5, title: "Brief closing — work done, not performance", duration: "2 minutes", description: "At the end: a 60-second exchange of what each person accomplished. No pressure to have finished everything. This closes the session and provides the social signal that the work period is over — which helps the transition out of focus mode, which can otherwise be abrupt and disorientating." },
    ],
    ACCOUNTABILITY: [
      { stepNumber: 1, title: "The opening intent — specific, not vague", duration: "2 minutes", description: "State your intention for the session in one sentence, as specifically as possible: 'I am going to draft the first two sections of the proposal' rather than 'I am going to work on the proposal.' Your body double repeats back what they heard. This exchange — speaking and being heard — is the activation mechanism." },
      { stepNumber: 2, title: "The 25-minute check-in", duration: "During session", description: "At 25 minutes: a brief check — are you on task? If yes, continue. If not, what happened and what is the next concrete step? No judgment, no extended discussion. The check-in is 60 seconds, then you continue. This prevents drift from becoming a full derailment." },
      { stepNumber: 3, title: "Agreed consequence for off-task time", duration: "Session start", description: "Pre-agree with your body double: if either person notices they have been off-task for more than 5 minutes without the check-in, they name it. Not to shame — to surface it. The agreement makes naming it easier than hiding it, which removes the guilt spiral that usually follows distraction." },
      { stepNumber: 4, title: "The closing report — data, not judgment", duration: "5 minutes", description: "End with: what did you work on, what did you complete, what is the next step you are taking tomorrow? Three questions, brief answers. This gives you a completion signal, a record of output, and a clear next step — which reduces the re-entry friction for the next session significantly." },
      { stepNumber: 5, title: "Book the next session before ending this one", duration: "2 minutes", description: "Before the session closes, agree when the next one is. Booking immediately means you do not have to fight the activation barrier again — the commitment is already made while you are still in the productive mindset. Consistent sessions accumulate; sporadic ones do not." },
    ],
    // ── SENSORY AUDIT ────────────────────────────────────────────
    NO_SAFE_SPACE: [
      { stepNumber: 1, title: "Engineer a minimum viable refuge — today", duration: "Today", description: "You do not need a dedicated room. You need a corner, a specific chair, a set of conditions — that you can access reliably. Define it: this is my sensory refuge. It has: [specific light setting], [specific sound or silence], [specific physical comfort item]. No one else uses it for work or demands. Start with what you can do today, not what you wish you had." },
      { stepNumber: 2, title: "Negotiate the space with whoever shares it", duration: "One conversation", description: "If you share your home, you need one person to understand that this space is not optional — it is your recovery infrastructure. Explain what happens to your functioning without it. Most people respond to 'this is how my nervous system works' better than 'I need more space.' Propose the specific arrangement you need." },
      { stepNumber: 3, title: "Build a sensory reset ritual for that space", duration: "This week", description: "A 10-minute sequence that reliably brings your nervous system down when you are in the refuge: specific light, specific sound (or silence), specific physical input (blanket, temperature, pressure). Do the same sequence every time. The predictability and repetition are part of what makes it work — your nervous system learns that this sequence means safety." },
      { stepNumber: 4, title: "Identify your highest-load daily moments", duration: "This week", description: "Map your day: where is sensory input highest? Commuting, open-plan offices, shared kitchens, evenings with family? Knowing your peak load moments allows you to schedule pre-emptive use of your refuge — before the overload, not only during. Prevention is significantly more effective than rescue." },
      { stepNumber: 5, title: "Create a portable sensory kit for outside the home", duration: "This weekend", description: "Your home refuge cannot come with you. Build a portable version: noise-cancelling headphones or earplugs, a specific scent (familiar and calming), sunglasses for visual reduction, a small tactile object. These create a sensory bubble in public spaces when your home refuge is unavailable." },
    ],
    MULTI_SENSORY_UNMANAGED: [
      { stepNumber: 1, title: "Audit your daily sensory load — hour by hour", duration: "One day", description: "Tomorrow: keep a note of sensory input at each hour. What are you hearing, seeing, feeling, smelling? Rate each hour's total input 1-10. By the end of the day you will have a sensory map — the high-load periods, the natural gaps, and the moments where load is already low. This is your baseline." },
      { stepNumber: 2, title: "Identify your highest-impact sense", duration: "This week", description: "For most people with multi-sensory sensitivity, one sense causes disproportionate load. Is it sound (the most common)? Light? Touch (clothing, textures)? Smell? Identify your primary driver. Addressing this sense first produces the most relief per intervention — do not spread effort across all senses simultaneously." },
      { stepNumber: 3, title: "One intervention per sense — test sequentially", duration: "This month", description: "Choose one intervention for your highest-impact sense. Use it consistently for one week. Note the effect. Then add one intervention for your second sense. Stacking multiple interventions simultaneously makes it impossible to know what worked. Sequential testing gives you reliable data on what actually moves your nervous system." },
      { stepNumber: 4, title: "Schedule 3 low-input windows per day", duration: "Today", description: "Block three periods in your day where sensory input is deliberately reduced: morning (before demands start), midday (break from peak activity), evening (before sleep). Even 10-minute windows of reduced input allow partial nervous system recovery. Without scheduled recovery, load compounds across the day." },
      { stepNumber: 5, title: "Build a sensory emergency protocol", duration: "This week", description: "Define exactly what you do when sensory overload is happening and you cannot leave: noise-cancelling headphones on, sunglasses on, find the least-stimulating wall to face, reduce eye contact to zero. Having a pre-decided protocol removes the need to think when you are already overwhelmed — which is when thinking is hardest." },
    ],
    UNMANAGED_SENSITIVITY: [
      { stepNumber: 1, title: "Identify your top three triggers", duration: "This week", description: "You know your sensory sensitivities — now rank them. Which three cause the most disruption to your daily functioning? These get your attention first. Write them as: [sense] + [specific input] + [impact]. Example: 'Sound — background chatter — cannot process speech or read.' Specificity makes the plan actionable." },
      { stepNumber: 2, title: "Build avoidance and mitigation options for each", duration: "This week", description: "For each trigger: can you avoid it or mitigate it? Avoidance means removing the input (different commute route, different seating in a restaurant). Mitigation means reducing it (headphones, sunglasses, specific clothing). Both are valid and often used in combination. Build at least one option per trigger." },
      { stepNumber: 3, title: "Address clothing and touch sensitivity first if relevant", duration: "This week", description: "If tactile sensitivity is in your top three, it is often the most constantly present. Audit your wardrobe: remove any item that causes discomfort, regardless of practicality. Invest in seamless socks, soft fabrics, tagless clothing. The constant low-level discomfort of wrong clothing compounds every other sensitivity throughout the day." },
      { stepNumber: 4, title: "Create a sensory-aware daily routine", duration: "This month", description: "Build your day to front-load high-demand sensory environments (if unavoidable) and protect the second half for lower-input activities. Most people's nervous systems have more capacity in the morning — high sensory load later in the day hits a more depleted system. Where you can control the sequence, control it." },
      { stepNumber: 5, title: "Communicate one accommodation to one person", duration: "One conversation", description: "Identify one sensory need that would significantly improve your daily life if met — and ask for it from one person (colleague, partner, housemate). 'I focus much better without background music — could we use headphones instead?' Most people respond positively when the request is specific and the reason is clear." },
    ],
    PARTIAL_MANAGEMENT: [
      { stepNumber: 1, title: "Document what works and exactly why", duration: "This week", description: "Write down every sensory intervention that already helps you — not vaguely ('sometimes headphones help') but specifically ('Sony WH-1000XM5 on noise-cancelling mode reduces kitchen sounds enough to focus'). The specificity matters because you are building a replicable system, not a collection of vague impressions." },
      { stepNumber: 2, title: "Identify the gaps by environment", duration: "This week", description: "Go through your regular environments: home, work, transport, social settings. For each: does your current toolkit work here? Where does it fail? The gaps in coverage are your next targets. Prioritise by how often you are exposed to each environment and how severe the impact is when your tools are insufficient." },
      { stepNumber: 3, title: "Build a portable kit for your highest-gap environment", duration: "This weekend", description: "Your home toolkit likely already works at home. The gap is usually the outside world. Build a portable kit for your highest-gap environment: compact noise-cancelling earbuds, tinted glasses, specific scent for grounding, a small tactile anchor. Everything fits in a small pouch you always carry." },
      { stepNumber: 4, title: "Create a sensory load tracking log for 2 weeks", duration: "2 weeks", description: "Each evening: rate your sensory load for the day 1-10, note any significant exposure events, note what tools you used. After 2 weeks you will see patterns — specific days or activities that consistently push load higher, and which interventions reliably bring it back down. This turns anecdotal impressions into reliable data." },
      { stepNumber: 5, title: "Review and expand the system quarterly", duration: "Every 3 months", description: "Sensory sensitivity can shift over time — with seasons, stress levels, hormonal changes, and life circumstances. Set a quarterly review: is what worked still working? Are there new triggers? Have any existing tools become less effective? Keeping the system current means it stays useful rather than gradually becoming irrelevant." },
    ],
  };

  return previews[frictionType] ?? [
    { stepNumber: 1, title: "Identify the core friction", duration: "This week", description: "Notice exactly where and when the difficulty is highest for you specifically. Keep a brief log for 7 days — just the moment, the situation, and the impact. You need specific data before you can build a specific solution." },
    { stepNumber: 2, title: "Start with the smallest possible change", duration: "This week", description: "The most sustainable systems begin with one modification that requires no willpower to maintain. Identify the single smallest change that would reduce friction at the point you identified. Implement only that — nothing else until it is automatic." },
    { stepNumber: 3, title: "Remove decisions from the process", duration: "Week 2", description: "Every active choice is a potential failure point. Once you have identified your smallest change, look for anything in the process that requires a decision. Automate it, pre-decide it, or remove it. The goal is a system that runs without relying on your willpower or executive function." },
    { stepNumber: 4, title: "Add the next layer after 2 weeks", duration: "Week 3+", description: "Wait until your first change is happening without conscious effort before adding anything else. Adding layers too quickly creates a system that is too complex to maintain. The compound effect of consistent simple changes outperforms ambitious systems that collapse after 10 days." },
  ];
}

function getDeepDive(frictionType: string) {
  const dives: Record<string, { why: string; mistakes: string[]; timeline: string }> = {
    // ── MONEY RESET ──────────────────────────────────────────────
    ANXIETY_AVOIDANCE: {
      why: "Avoidance of financial information is a dopamine regulation response, not a character flaw. When looking at accounts has previously produced negative emotion (shame, panic, overwhelm), the brain learns to avoid that stimulus entirely. The longer the avoidance, the stronger the avoidance pattern — because the uncertainty of not knowing becomes preferable to the pain of knowing. The 4-account structure works because it removes the emotional charge from the information itself: each account has one purpose, so looking at any one of them cannot produce overwhelm.",
      mistakes: [
        "Trying to 'face everything at once' — doing a full financial audit on day one triggers the exact response you are trying to break",
        "Using a single account for everything and trying to mentally track categories — this requires constant emotional contact with a number that represents all problems simultaneously",
        "Setting unrealistic automation amounts — if the split is too aggressive, the system fails in week one and confirms the belief that you cannot manage money",
      ],
      timeline: "Most people feel differently about their money within 2 weeks of the 4-account structure being in place. The emotional charge typically reduces within a month. The full anxiety response to checking accounts usually disappears within 2-3 months of consistent operation.",
    },
    FULL_RESET: {
      why: "A money system that requires constant active management will eventually fail for ADHD brains — not because of poor intentions but because active management competes with executive function resources that are already limited. The 4-account reset works by removing active management from the equation: money moves automatically, accounts have single purposes, and the only ongoing active decision is the weekly spending check. Automation does not require working memory or willpower to maintain.",
      mistakes: [
        "Starting with too many accounts or too complex a split — the system needs to run without thought, and complexity prevents that",
        "Keeping the same spending card — old spending patterns are attached to the old card; a new card for each account creates a physical separation that reinforces the mental separation",
        "Not accounting for irregular annual expenses — car insurance, Christmas, annual subscriptions all break month-to-month systems if they are not built into the Buffer from day one",
      ],
      timeline: "The system setup takes one afternoon. The first month is the hardest — it requires trusting automation and not making manual adjustments when it feels wrong. By month 3, the system runs without thought. By month 6, most people report that money has stopped being a source of anxiety.",
    },
    SYSTEM_FAILURE: {
      why: "Systems that repeatedly fail for ADHD brains usually fail at a specific point — not everywhere at once. Identifying that point and addressing only that point is more effective than overhauling everything. Executive function deficits mean that active decision-making in the system is the most common failure mechanism: any step that requires you to actively choose, remember, or calculate creates a potential collapse. The minimum viable system works because it reduces active decision points to near zero.",
      mistakes: [
        "Overhauling the entire system after each failure — repeated total restarts prevent you from learning which specific element is actually breaking",
        "Adding complexity to solve complexity — the instinct is to track more carefully, but more tracking requires more executive function, which is the resource that is already depleted",
        "Treating the system failure as a character failure — this creates the shame-avoidance cycle that prevents you from engaging with the system at all",
      ],
      timeline: "With the minimum viable two-account system, most people stabilise within 4-6 weeks. The key is resisting the urge to add features before the base is solid. Once the two-account system is running automatically — usually 6-8 weeks — you can add the Buffer layer.",
    },
    // ── MELTDOWN FIRST AID ───────────────────────────────────────
    SEVERE_SHUTDOWN: {
      why: "Multi-day shutdowns are a sign that the nervous system's regulatory capacity has been chronically exceeded — not just acutely overwhelmed. The shutdown is the body's forced recovery: it is shutting down non-essential functions to prioritise homeostasis. The duration of shutdown is proportional to the depth of the deficit that preceded it. Prevention is therefore significantly more effective than intervention: catching the early signals before the point of no return is the mechanism that changes the pattern. The body always provides early warnings — they just need to be identified and acted upon.",
      mistakes: [
        "Trying to push through the early signals — 'just 10 more minutes' at the early warning stage eliminates the prevention window entirely",
        "Relying on self-will to de-escalate — at high arousal levels, the prefrontal cortex (rational decision-making) is offline; you cannot think your way out of a meltdown, only respond with pre-decided physical protocols",
        "Inadequate recovery time — returning to full demand too quickly after a meltdown depletes the still-recovering system and accelerates the next meltdown",
      ],
      timeline: "With consistent early intervention, most people see both the frequency and duration of meltdowns reduce within 4-6 weeks. Building the early warning system and the prevention protocol takes 1-2 weeks. The shift from reactive to preventive takes about a month of consistent practice.",
    },
    NO_TOOLKIT: {
      why: "The absence of a reliable de-escalation toolkit is not a failure of effort — it reflects that generic advice (breathing exercises, mindfulness, journaling) is not calibrated to your specific nervous system. Neurodivergent nervous systems often have different sensory profiles and different regulatory mechanisms than the general population. The kit needs to be built empirically: test specific inputs, measure their effects on your state, and keep only what moves the needle. One person's calming input can be another's activating one.",
      mistakes: [
        "Using techniques that work for others rather than testing what works for you specifically — sensory profiles are highly individual",
        "Building a kit but not keeping it physically accessible — a kit that requires searching for or preparing cannot be used during a meltdown",
        "Focusing only on de-escalation and not building a recovery protocol — the time after the meltdown is equally important and often neglected",
      ],
      timeline: "The sensory input experiment takes one week. Building a working kit from the results takes 2-3 weeks of iteration. Most people have a reliable 3-item kit within a month. The kit continues to be refined as you collect more data — expect to adjust it over the first 6 months.",
    },
    RECOVERY_GAP: {
      why: "The post-meltdown period is a distinct physiological state — the nervous system is still elevated and still consuming significant resources to return to baseline. Interrupting this process (with demands, questions, or social expectations) does not just slow recovery; it can re-trigger activation before baseline is reached, which compounds the total recovery time significantly. The gap between meltdown and functional re-engagement needs to be protected as infrastructure, not treated as downtime.",
      mistakes: [
        "Returning to demands before recovery is actually complete — the felt sense of 'being okay' often arrives before full regulatory capacity has returned",
        "Using screens during recovery — most screens are cognitively and sensory demanding in ways that prevent genuine nervous system recovery",
        "Not communicating recovery needs to people around you — unexpected interruptions during recovery are disproportionately disruptive",
      ],
      timeline: "Once the recovery environment is established and the people around you understand the protocol, most people see average recovery time reduce by 30-50% within a month. The social and relationship dimension of recovery improvement often takes 2-3 months to fully stabilise.",
    },
    // ── MEMORY PALACE ────────────────────────────────────────────
    HIGH_NEED: {
      why: "Standard memory techniques (repetition, written notes, apps) rely primarily on verbal and procedural memory systems — both of which show significant variability in ADHD and autistic brains. Spatial memory, by contrast, tends to be significantly stronger in neurodivergent individuals. The memory palace exploits this by encoding information in spatial locations rather than as abstract verbal content. It works with the architecture of your memory rather than against it — which is why it succeeds where other techniques have failed.",
      mistakes: [
        "Starting with too much information in the first palace — begin with 3-5 items maximum to establish the technique before scaling",
        "Using realistic, static images — the encoding mechanism depends on vivid, bizarre, exaggerated imagery; ordinary images fade quickly",
        "Reviewing too infrequently at first — the first week requires daily review to cement the spatial encoding; spacing increases only after the associations are solid",
      ],
      timeline: "Most people can place and reliably recall 3-5 items after one practice session. A functional first palace with 10-15 items typically takes 2 weeks to establish. The technique becomes automatic — requiring no conscious effort to apply — after about 6-8 weeks of consistent use.",
    },
    VISUAL_LEARNER: {
      why: "Strong visual-spatial memory is not just a learning style preference — it reflects an actual architectural difference in how information is encoded and retrieved. The memory palace formalises and systematises what your brain already does naturally with location and visualisation, turning an ad-hoc strength into a reliable, scalable system. The key upgrade is applying deliberate structure (specific palaces, specific routes, specific image conventions) to the spontaneous visual encoding you already do, rather than relying on it happening automatically.",
      mistakes: [
        "Not using sufficiently bizarre imagery — your strong visual memory may make ordinary images feel vivid enough, but they fade faster than absurd ones",
        "Mixing topics within a single palace — interference between categories weakens both; keep one palace per topic area",
        "Skipping the spaced repetition schedule — even with strong visual memory, encoding without proper spacing leads to fade at the same timeline as anyone else",
      ],
      timeline: "Given your existing visual memory strength, you should be able to place and recall 10+ items in a palace within your first week. A fully functional multi-palace system with proper spaced repetition typically takes 3-4 weeks to establish and about 2 months to run automatically.",
    },
    CONSISTENCY_GAP: {
      why: "Inconsistency in memory system maintenance is almost always a friction and activation energy problem, not a motivation problem. When accessing a system requires any active decision — when to do it, how to do it, on which device — that decision becomes a barrier on days when executive function is lower. Systems that are automatically triggered by existing habits, that take 60 seconds or less, and that require zero setup are the ones that persist. The goal is reducing the activation energy to start the review to near zero.",
      mistakes: [
        "Relying on reminders or alarms — reminders can be dismissed, snoozed, or ignored on low-function days; habit attachment is far more robust",
        "Reviewing when you have time rather than on a fixed schedule — 'when I have time' is never a real schedule, it is permission to defer indefinitely",
        "Trying to review everything at once rather than smaller frequent reviews — 60-second daily reviews retain information far more effectively than weekly comprehensive sessions",
      ],
      timeline: "The habit attachment typically stabilises within 3 weeks — the standard period for a new behaviour to become automatic when attached to an existing anchor. Consistency improvements are usually felt within the first week; the return of information that had been fading typically happens within 2-3 weeks of restored regular review.",
    },
    // ── MEETING TRANSLATOR ───────────────────────────────────────
    MASKING_EXHAUSTION: {
      why: "Masking in social and professional settings is a learned protective behaviour that has a real neurological cost. It occupies working memory, requires sustained attention to social signals, and maintains a parallel cognitive process (the performance) alongside the primary task (the meeting content). This doubles the total cognitive load of every meeting. Transcription tools address this by offloading one of the two jobs — the job of holding what was said — so working memory can focus entirely on being present. The performance still happens, but it competes with less.",
      mistakes: [
        "Trying to both transcribe and take notes — this doubles the cognitive load rather than halving it; let the tool do the transcription",
        "Attempting to process the transcript immediately after a high-masking meeting before the cognitive debt has been discharged",
        "Using the transcript as a substitute for re-engaging with content — the transcript should trigger your memory, not replace it",
      ],
      timeline: "The immediate effect of running transcription is felt in the first session — knowing the transcript is running reduces real-time anxiety. The full benefit of processing transcripts rather than trying to recall from memory typically emerges after 2-3 weeks of consistent use. Masking exhaustion itself requires broader changes and usually takes 1-3 months to reduce meaningfully.",
    },
    PERFORMANCE_LOAD: {
      why: "When a significant portion of cognitive capacity is allocated to social performance, proportionally less is available for the actual content of the interaction. This is not a concentration problem — it is a resource allocation problem. Working memory is finite and in meetings that require performance, the budget is already partially spent before the content even begins. External transcription changes the budget: it removes the 'hold what was said' item from working memory, freeing that capacity for present-moment processing. Less performance means more presence — the same resource freed from social monitoring is now available for understanding.",
      mistakes: [
        "Waiting until after a difficult meeting to use the transcript — deploy it from the first meeting, not only when you feel you need it",
        "Reviewing the transcript the same day as a high-load meeting — the cognitive state post-meeting reduces the quality of the review; next-day review is often more effective",
        "Using the transcript as evidence of what you missed rather than a tool for supplementing your recall",
      ],
      timeline: "Most people notice reduced in-meeting anxiety within the first week of using transcription consistently. The full workflow of capture-then-process typically becomes fluent after 2-3 weeks. The broader shift in how you experience meetings — from performance events to information exchanges — tends to happen over 4-6 weeks.",
    },
    PROCESSING_GAP: {
      why: "Some processing styles require more time than real-time interaction allows. This is not a deficit — it is a different temporal profile for comprehension. Real-time pressure to respond, decide, or demonstrate understanding before processing is complete produces incomplete outputs that do not reflect actual capability. Transcription changes the timeline: it separates the input phase (the meeting) from the processing phase (the review), which allows each to happen on its natural schedule. The result is typically more accurate, more considered contribution — just not at the speed the meeting required.",
      mistakes: [
        "Trying to respond immediately to meeting content before having processed it fully — this produces outputs that feel inadequate and compounds the sense of underperformance",
        "Not building an explicit processing window into your schedule — without protected time, the review does not happen and the information is lost",
        "Treating delayed response as a weakness rather than a quality process — the framing to others matters; 'I will come back to you after I have reviewed my notes' is professional, not evasive",
      ],
      timeline: "The immediate effect of adopting a capture-then-process approach is reduced in-meeting anxiety (within the first week). The quality of your contributions from meetings typically improves noticeably within 2-3 weeks as the workflow becomes established. Building the social expectation of delayed response with your environment usually takes 4-6 weeks of consistent implementation.",
    },
    // ── FINANCIAL AUTOPILOT ──────────────────────────────────────
    CASH_FLOW_CRISIS: {
      why: "Cash flow crises in ADHD brains are almost always structural, not behavioural. The problem is not overspending in isolation — it is that money arrives, sits in a single account, and gets spent before essential obligations are covered. This happens because a single account presents money as 'available' rather than 'allocated.' The autopilot protocol changes the structure on payday: essentials are separated immediately, before any spending decisions occur. Once separated, they cannot be accidentally spent — the structural constraint replaces the need for ongoing willpower.",
      mistakes: [
        "Starting with Buffer before the essentials are secured — Buffer is only useful when the floor is already covered; prioritise essentials account first",
        "Using the same bank account with separate mental categories — mental categories require active maintenance and collapse under stress",
        "Setting the automation for the wrong day — standing orders must fire on payday, not on a fixed date that may not align with when income arrives",
      ],
      timeline: "The structural relief is immediate — once money is in a separate Bills account, the anxiety about covering essentials typically reduces within the first week. A meaningful cash flow buffer (enough to cover one irregular expense without crisis) usually takes 2-3 months to build at 5-10% per month.",
    },
    EMOTIONAL_SPENDING: {
      why: "Emotional spending is a regulation mechanism — it provides dopamine, a sense of control, or sensory stimulation at a moment when the nervous system is seeking relief. Willpower-based approaches fail because they attempt to override a regulatory need rather than meet it differently. The structural approach works by adding friction (making the spending physically harder to access) and by pre-committing to amounts when in a calm, regulated state — so that the rule was set by a version of you with full executive function, not the dysregulated version who needs to override it.",
      mistakes: [
        "Trying to stop emotional spending through shame or self-criticism — this adds negative emotion to an already dysregulated state, which often increases spending",
        "Setting a discretionary budget that is too restrictive — inadequate spending allowance creates the deprivation feeling that triggers compensatory overspending",
        "Not addressing the underlying regulation need — the spending is solving something; without an alternative solution for that same thing, the behaviour will return",
      ],
      timeline: "The friction-addition intervention works quickly — most people notice a reduction in impulse purchases in the first week. The 24-hour rule typically reduces non-essential purchases by 40-60% within 2 weeks. The deeper pattern of emotional spending usually takes 2-3 months to shift meaningfully, as it requires building alternative regulation strategies alongside the structural constraints.",
    },
    IRREGULAR_INCOME: {
      why: "Standard financial systems were built for fixed monthly income — the same amount arriving on the same day, every month. This structure is fundamentally incompatible with irregular income without modification. The buffer account is the modification: it acts as a normaliser, accepting the variability of incoming cash and outputting a fixed, predictable salary. This single structural change transforms irregular income into a predictable lifestyle. Without it, every high month creates the illusion of abundance and every low month creates crisis — both of which produce poor decisions.",
      mistakes: [
        "Spending in proportion to what came in rather than a fixed salary — high-income months need to fund low-income months, not high-income lifestyles",
        "Not separating tax immediately — self-employed people who commingle tax money with operating funds consistently face tax bills they cannot pay",
        "Setting the fixed salary too high initially — start conservative and increase only after the buffer is consistently growing",
      ],
      timeline: "Setting up the buffer account structure takes one afternoon. The first 2-3 months are the adjustment period — it feels counterintuitive to spend less than what came in during a good month. After 3 months, the buffer typically provides enough stability to stop feeling anxious in low-income months. Full financial stability for irregular earners usually takes 6-12 months of consistent system operation.",
    },
    // ── BODY DOUBLE MATCHMAKER ───────────────────────────────────
    START_BLOCK: {
      why: "Task initiation failure is an executive function deficit, not a motivation deficit. The mechanism is a failure of the brain's salience network to generate sufficient activation energy to begin a task, even when the person fully intends to do it. External presence provides what the internal process cannot: the social signal of being observed activates different neurological circuits than solo work. This is why body doubling works consistently even when the other person is a stranger doing completely different work — the presence itself is the mechanism, not the relationship or the task similarity.",
      mistakes: [
        "Using body doubling only for tasks you already find easy — the most valuable application is for the tasks you cannot start alone",
        "Trying to find the perfect body double before starting — any human presence in the same space provides some benefit; perfectionism about the match prevents using the tool at all",
        "Ending sessions as soon as the timer ends rather than when the work has a natural break — abrupt endings increase re-entry difficulty",
      ],
      timeline: "The effect is immediate — most people start tasks with a body double that they have been avoiding solo for days or weeks. Consistent body doubling typically produces a meaningful shift in overall task initiation within 2-3 weeks. The longer-term benefit is the reduction of avoidance anxiety around difficult tasks, which usually takes 4-6 weeks of regular practice to notice.",
    },
    AVOIDANCE_LOOP: {
      why: "The avoidance-guilt loop is particularly energy-expensive because it keeps the task cognitively active (through guilt and rumination) while preventing actual engagement with it. The task is always present in working memory, consuming attention, while simultaneously producing negative emotion — the worst of both worlds. Body doubling breaks the loop by creating an external commitment structure that is easier to honour than the internal one, and by ending sessions with guilt-free reporting rather than judgment. The loop is interrupted at both ends: the external commitment makes starting easier, and the non-judgmental close removes the guilt fuel that perpetuates it.",
      mistakes: [
        "Choosing body doubles who comment on progress or offer advice — this converts the session from presence-based activation to performance and judgment",
        "Using body doubling for tasks you feel you should be able to do alone — this preserves the shame dimension of avoidance rather than removing it",
        "Ending sessions by itemising what was not done — this reloads the guilt that the guilt-free close is designed to discharge",
      ],
      timeline: "The avoidance-guilt loop typically weakens within 1-2 weeks of consistent body doubling with guilt-free closes. The residual guilt after incomplete sessions usually reduces significantly within a month. The broader shift from avoidance as a default to engagement as a default typically takes 2-3 months of regular practice.",
    },
    SILENT_PRESENCE: {
      why: "The regulatory effect of social presence does not require interaction to function. The neurological mechanism is awareness of another person — the mirror neuron and social attention systems activate in the presence of others regardless of whether communication occurs. For people who need presence without the added cognitive load of interaction (common in autism and AuDHD), silent body doubling provides the activation benefit without the social processing cost. It is precisely calibrated to the way your nervous system responds to others.",
      mistakes: [
        "Using audio-only sessions — cameras on provides a stronger presence signal than audio alone; the visual element is where most of the regulatory effect comes from",
        "Pairing with someone who periodically initiates conversation — even brief exchanges break the silent working state and increase re-entry time",
        "Treating silent sessions as a lesser version of interactive sessions — for your specific profile, silence is not the compromise; it is the optimal configuration",
      ],
      timeline: "Silent body doubling typically produces the activation effect immediately — within the first session. The quality of focus during silent sessions usually improves over the first 2 weeks as you become comfortable with the format. Most people who work best in silent presence find that 3-4 sessions per week produces a significant change in overall productivity within the first month.",
    },
    ACCOUNTABILITY: {
      why: "Accountability structures work for ADHD brains because they externalise the temporal and motivational signals that the brain's internal systems struggle to generate reliably. Telling someone what you are going to do and knowing you will report on it creates a form of time-binding — making the future moment of reporting feel real and proximate rather than abstract. The opening intent and closing report also provide the kind of discrete, clear endpoints that ADHD brains typically find easier to work within than open-ended work periods.",
      mistakes: [
        "Using accountability with someone who responds to missed goals with disappointment or frustration — negative social consequence increases anxiety without improving performance",
        "Making commitments that are too large for one session — overpromising sets up a failure scenario that removes the accountability tool's benefit",
        "Skipping the opening intent and going straight to working — the intent-stating exchange is the activation mechanism; without it, the accountability structure loses most of its effect",
      ],
      timeline: "The immediate effect of accountability sessions is typically felt from the first one — people consistently report starting and completing work they had been unable to do alone. The broader habit of task completion — carrying the structured approach into solo work — usually develops after 4-6 weeks of regular accountability sessions.",
    },
    // ── SENSORY AUDIT ────────────────────────────────────────────
    NO_SAFE_SPACE: {
      why: "Chronic sensory exposure without recovery is equivalent to chronic physical stress without rest — the nervous system cannot maintain baseline regulation without periods of low-input relief. Unlike physical fatigue, sensory accumulation is often invisible until it reaches the point of meltdown or shutdown. A designated recovery space is not a luxury or a preference; it is the mechanism that allows the nervous system to discharge accumulated load. Without it, baseline regulation gradually deteriorates throughout the day, and the threshold for overwhelm progressively lowers.",
      mistakes: [
        "Sharing the safe space with other functions — using it for work, for screens, or for difficult conversations removes the nervous system's ability to associate it with safety and recovery",
        "Not protecting the space from interruption — a safe space that can be entered by others or used for demands cannot function as a regulatory anchor",
        "Waiting until overwhelm is severe before using it — preventive use (accessing the space before reaching overload) is significantly more effective than rescue use",
      ],
      timeline: "The effect of a properly established safe space is typically felt within the first week of consistent use. The nervous system's association between the space and recovery deepens over the first month. Meaningful reduction in overall daily overload usually takes 4-6 weeks of integrated use alongside other load management strategies.",
    },
    MULTI_SENSORY_UNMANAGED: {
      why: "Multi-sensory sensitivity without a management system creates a chronic cumulative load problem: each individual input may be within tolerance, but the combination across a full day exceeds the nervous system's regulatory capacity. This is why the experience can feel confusing — individually none of the inputs seems unbearable, yet by evening the system is overwhelmed. The audit approach addresses this by mapping the total load pattern rather than targeting individual inputs. Once the pattern is visible, the intervention becomes strategic — reducing load at the highest-impact points rather than trying to address every input everywhere.",
      mistakes: [
        "Trying to manage all senses simultaneously from the start — multi-pronged interventions before individual effects are understood produce unclear results",
        "Addressing only the inputs you can control and ignoring others — a partial management plan that leaves major load sources unaddressed provides limited relief",
        "Not scheduling low-input recovery windows — management without recovery is reduction, not resolution",
      ],
      timeline: "The mapping phase takes one week. The first intervention (addressing the highest-impact sense) typically produces noticeable relief within 1-2 weeks. Building a complete multi-sensory management system — one that covers all significant inputs — usually takes 2-3 months of sequential testing and refinement.",
    },
    UNMANAGED_SENSITIVITY: {
      why: "Sensory sensitivity awareness without a management system produces a particular kind of frustration: you know what causes the problem but feel unable to address it. This often happens because the interventions needed are not intuitively obvious, require changes that feel demanding or impractical, or involve asking for accommodations that feel uncomfortable. The audit approach makes the interventions specific and ranked, reducing the decision load of 'what do I do first' and providing a framework for requesting accommodations in ways that are more likely to be received positively.",
      mistakes: [
        "Accepting unnecessary sensory burden because changing it seems socially difficult — most environments can accommodate sensory needs more than people initially assume",
        "Targeting low-impact inputs first because they are easier to change — prioritise by impact, not by ease",
        "Managing in isolation rather than communicating needs — self-management alone has a ceiling; environments modified by others' awareness have significantly more capacity",
      ],
      timeline: "Identifying and addressing the top three triggers typically produces noticeable daily difference within 2-3 weeks. Building avoidance and mitigation options for each takes 2-4 weeks. A functioning personal sensory management plan — one that covers most common situations — is usually in place within 6-8 weeks.",
    },
    PARTIAL_MANAGEMENT: {
      why: "Partial sensory management — having some tools that work in some situations — is a more sophisticated position than having nothing, but it often creates its own frustration: you know management is possible, so the gaps feel more acute. The gap-filling process is also more complex than initial system building, because it requires identifying specific situations where existing tools fail rather than addressing sensitivity in general. This is why documentation of what works and what does not, combined with environment-by-environment gap analysis, produces more progress than continuing to add tools without a system map.",
      mistakes: [
        "Assuming current tools will work in new environments without testing — a tool that works at home may not work in a different sensory context",
        "Adding new tools before fully exploiting existing ones in all contexts — often the gap is deployment rather than toolkit",
        "Not tracking what changed when — without documentation, interventions and effects become confused and patterns are invisible",
      ],
      timeline: "Gap-filling from a partial management baseline typically takes 4-6 weeks to achieve meaningfully broader coverage. The quarterly review cycle, once established, prevents the common pattern of systems that work initially and then gradually stop being used as circumstances change.",
    },
  };

  return dives[frictionType] ?? {
    why: "Neurodivergent brains often experience friction in ways that standard approaches do not address — not because of lack of effort, but because the tools were built for different cognitive architectures. The protocol is built around your specific friction type, targeting the mechanism that is actually causing the difficulty rather than the symptom it produces.",
    mistakes: [
      "Expecting immediate change — systems need 2-3 weeks of consistent operation before their effects are clear",
      "Abandoning the system at the first difficulty rather than adjusting one element at a time",
      "Adding too many changes simultaneously — one adjustment at a time produces clearer results and more sustainable systems",
    ],
    timeline: "Initial effects are usually noticeable within 1-2 weeks. A functioning system typically takes 4-6 weeks to establish. Meaningful long-term change in the underlying pattern usually takes 2-3 months of consistent practice.",
  };
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
  // ── Tool OS routing — priority tools use new results system ──
  const TOOL_OS_SLUGS: Record<string, React.ComponentType<{ isPaid?: boolean }>> = {
    "adhd-tax-calculator":      ADHDTaxCalculator,
    "financial-autopilot":      FinancialAutopilot,
    "decision-paralysis-solver": DecisionParalysisSolver,
  };
  const ToolOSComponent = TOOL_OS_SLUGS[tool.slug];

  const [currentStep, setCurrentStep] = useState(whatsappContext ? 0 : -1); // Auto-start if from WhatsApp
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentVal, setCurrentVal] = useState<any>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setIsSaved] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showFullResults, setShowFullResults] = useState(false);

  useEffect(() => {
    if (ToolOSComponent) return;
    if (currentStep >= 0 && currentStep < tool.questions.length) {
      const q = tool.questions[currentStep];
      const stored = answers[q.id];
      if (stored !== undefined) {
        setCurrentVal(stored);
      } else {
        setCurrentVal(q.defaultValue !== undefined ? q.defaultValue : "");
      }
    }
  }, [currentStep, answers, tool.questions]);

  useEffect(() => {
    if (ToolOSComponent) return;
    if (whatsappContext && tool.questions.length === 0) {
      handleAssessmentComplete();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ToolOSComponent) return;
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

  if (ToolOSComponent) {
    return (
      <div className="page-container py-12">
        <ToolOSComponent isPaid={false} />
      </div>
    );
  }

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

      const deepDive: DeepDive | undefined = analysis
        ? getDeepDive(analysis.frictionType)
        : undefined;

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
        deepDive,
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

  const handleAnswer = (questionId: string | number, answer: any, skipDelay = false) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    if (currentStep < tool.questions.length - 1) {
      if (skipDelay) {
        setCurrentStep(prev => prev + 1);
      } else {
        setTimeout(() => setCurrentStep(prev => prev + 1), 300);
      }
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
              className="bg-black border border-white/5 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl"
            >
              <div 
                className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-[100px] pointer-events-none transform-gpu"
                style={{ backgroundColor: toolColor, transform: 'translate(30%, -30%)' }}
              />
              
              <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                Question {currentStep + 1} of {tool.questions.length}
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 leading-tight tracking-tight">
                {tool.questions[currentStep].text}
              </h2>
              
              <div className="space-y-4">
                {(() => {
                  const q = tool.questions[currentStep];
                  if (!q) return null;

                  if (q.type === 'slider') {
                    return (
                      <div className="space-y-8 py-4">
                        <div className="text-center">
                          <span className="text-5xl font-extrabold tracking-tight font-mono" style={{ color: toolColor }}>
                            {currentVal ?? q.min ?? 0}
                          </span>
                          {q.placeholder && (
                            <p className="text-white/40 text-sm mt-2">{q.placeholder}</p>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min={q.min ?? 0}
                            max={q.max ?? 10}
                            step={q.step ?? 1}
                            value={currentVal ?? q.min ?? 0}
                            onChange={(e) => setCurrentVal(Number(e.target.value))}
                            className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-current [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-current [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-current [&::-moz-range-thumb]:border-0"
                            style={{ color: toolColor }}
                          />
                          <div className="flex justify-between text-xs text-white/30 font-mono mt-2">
                            <span>{q.min ?? 0}</span>
                            <span>{q.max ?? 10}</span>
                          </div>
                        </div>
                        <div className="pt-4">
                          <motion.button
                            onClick={() => handleAnswer(q.id, currentVal ?? q.min ?? 0, true)}
                            className="w-full py-4 rounded-xl text-black font-black text-center transition-all"
                            style={{ backgroundColor: toolColor }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Continue
                          </motion.button>
                        </div>
                      </div>
                    );
                  }

                  if (q.type === 'toggle') {
                    const opts = q.options && q.options.length > 0 ? q.options : ["Yes", "No"];
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        {opts.map((opt) => (
                          <motion.button
                            key={opt}
                            onClick={() => handleAnswer(q.id, opt, false)}
                            className="px-6 py-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center font-bold text-lg hover:bg-white/[0.05] transition-all"
                            whileTap={{ scale: 0.95 }}
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    );
                  }

                  if (q.type === 'number') {
                    return (
                      <div className="space-y-8 py-4">
                        <div className="flex items-center justify-center gap-6">
                          <button
                            type="button"
                            onClick={() => setCurrentVal((prev: any) => Math.max((q.min ?? -Infinity), (Number(prev) || 0) - (q.step ?? 1)))}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-xl font-bold hover:bg-white/5 active:scale-95"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={q.min}
                            max={q.max}
                            step={q.step}
                            value={currentVal ?? ""}
                            onChange={(e) => {
                              const val = e.target.value === "" ? "" : Number(e.target.value);
                              setCurrentVal(val);
                            }}
                            placeholder={q.placeholder || "0"}
                            className="w-32 bg-transparent border-b-2 border-white/20 focus:border-white text-center text-4xl font-extrabold font-mono focus:outline-none py-2"
                            style={{ color: toolColor }}
                          />
                          <button
                            type="button"
                            onClick={() => setCurrentVal((prev: any) => Math.min((q.max ?? Infinity), (Number(prev) || 0) + (q.step ?? 1)))}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-xl font-bold hover:bg-white/5 active:scale-95"
                          >
                            +
                          </button>
                        </div>
                        <div className="pt-4">
                          <motion.button
                            onClick={() => handleAnswer(q.id, currentVal === "" ? (q.min ?? 0) : currentVal, true)}
                            className="w-full py-4 rounded-xl text-black font-black text-center transition-all"
                            style={{ backgroundColor: toolColor }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Continue
                          </motion.button>
                        </div>
                      </div>
                    );
                  }

                  if (q.type === 'text' || q.type === 'textarea') {
                    return (
                      <div className="space-y-6 py-4">
                        {q.type === 'textarea' ? (
                          <textarea
                            value={currentVal ?? ""}
                            onChange={(e) => setCurrentVal(e.target.value)}
                            placeholder={q.placeholder || "Type your response..."}
                            rows={4}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none text-lg"
                          />
                        ) : (
                          <input
                            type="text"
                            value={currentVal ?? ""}
                            onChange={(e) => setCurrentVal(e.target.value)}
                            placeholder={q.placeholder || "Type your response..."}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all text-lg"
                          />
                        )}
                        <div className="pt-4">
                          <motion.button
                            onClick={() => handleAnswer(q.id, currentVal ?? "", true)}
                            disabled={q.required && !String(currentVal ?? "").trim()}
                            className="w-full py-4 rounded-xl text-black font-black text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: toolColor }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Continue
                          </motion.button>
                        </div>
                      </div>
                    );
                  }

                  // Default / Select / Options
                  const options = q.options || [];
                  return (
                    <div className="space-y-4">
                      {options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => handleAnswer(q.id, option, false)}
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
                  );
                })()}
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
