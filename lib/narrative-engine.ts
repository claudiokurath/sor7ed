import { BranchSlug, ScoreLevel, NarrativeLayer } from '../types/assessment';

interface NarrativeTemplate {
  headline: (score: number) => string;
  subheadline: (score: number) => string;
  insight: (score: number) => string;
}

const BRANCH_NARRATIVES: Record<BranchSlug, Record<ScoreLevel, NarrativeTemplate>> = {
  'level-up': {
    critical: {
      headline: (score) => `Your digital life is ${score}% noise.`,
      subheadline: () => `Your attention is being harvested by default.`,
      insight: () => `Every notification, phantom vibration, and infinite scroll is a system working exactly as designed—against you. It's time to reclaim the signal.`
    },
    high: {
      headline: (score) => `${100 - score}% of your focus is being leaked.`,
      subheadline: () => `You're reactive, not proactive.`,
      insight: () => `You've noticed the pull. The compulsive checks and the digital restlessness. This isn't a lack of discipline; it's a lack of architecture.`
    },
    medium: {
      headline: (score) => `You've achieved ${score}% signal clarity.`,
      subheadline: () => `A solid foundation with a visible ceiling.`,
      insight: () => `You have more control than most, but specific friction points are still bleeding focus. The next level isn't about trying harder—it's about automating the resistance.`
    },
    low: {
      headline: (score) => `Digital Sovereignty: ${score}% achieved.`,
      subheadline: () => `Your environment works for you.`,
      insight: () => `You've built real attentional boundaries. This isn't about fixing problems anymore; it's about expanding your capacity for deep work.`
    }
  },
  'feel-good': {
    critical: {
      headline: (score) => `Energy system running at ${score}%. Accumulating debt.`,
      subheadline: () => `Sensory and nervous system overload detected.`,
      insight: () => `You're not "lazy" or "tired"—you're overstimulated and under-recovered. The cost of pushing through is measurable cognitive and emotional burnout.`
    },
    high: {
      headline: (score) => `Your battery is draining ${100 - score}% faster than it charges.`,
      subheadline: () => `You're running on adrenaline, not energy.`,
      insight: () => `You've learned to ignore the early warning signs of sensory overwhelm. By the time you feel it, the damage to your nervous system is already done.`
    },
    medium: {
      headline: (score) => `${score}% regulation achieved. A fragile balance.`,
      subheadline: () => `You're managing, but at a high maintenance cost.`,
      insight: () => `You have tools that work, but they aren't yet integrated. You're still spending too much executive function on basic survival.`
    },
    low: {
      headline: (score) => `Resilience Index: ${score}%. High calibration.`,
      subheadline: () => `A well-regulated nervous system.`,
      insight: () => `You've identified your sensory triggers and built a recovery rhythm that works. You're operating from a place of surplus, not deficit.`
    }
  },
  // Add other branches as needed, using fallbacks for now
  'keep-going': {
    critical: {
      headline: (score) => `Momentum stalled at ${score}%. Friction is winning.`,
      subheadline: () => `Execution failure is a system issue, not a character flaw.`,
      insight: () => `The gap between intention and action has become a chasm. We need to reduce the "activation energy" required to start.`
    },
    high: { headline: (s) => `Momentum: ${s}%`, subheadline: () => `Struggling to maintain speed.`, insight: () => `You start strong but the middle is where the friction accumulates.` },
    medium: { headline: (s) => `Momentum: ${s}%`, subheadline: () => `Steady but slow.`, insight: () => `You have consistent output, but it feels harder than it should.` },
    low: { headline: (s) => `Momentum: ${s}%`, subheadline: () => `Elite execution.`, insight: () => `You've mastered the art of the start.` }
  },
  'spend-smart': {
    critical: { headline: (s) => `Financial Clarity: ${s}%`, subheadline: () => `Impulse is driving the bus.`, insight: () => `The dopamine hit of the purchase is masking the long-term friction of the cost.` },
    high: { headline: (s) => `Financial Clarity: ${s}%`, subheadline: () => `Aware but leaking.`, insight: () => `You see the bills, but the systems to stop the leaks aren't in place.` },
    medium: { headline: (s) => `Financial Clarity: ${s}%`, subheadline: () => `Balanced but manual.`, insight: () => `You're in control, but it takes too much mental energy to stay there.` },
    low: { headline: (s) => `Financial Clarity: ${s}%`, subheadline: () => `Automated Wealth.`, insight: () => `Your money moves where it needs to without you thinking about it.` }
  },
  'be-connected': {
    critical: { headline: (s) => `Connection Index: ${s}%`, subheadline: () => `Social battery depleted.`, insight: () => `The cost of interaction is exceeding your current energy supply. Masking is exhausting.` },
    high: { headline: (s) => `Connection Index: ${s}%`, subheadline: () => `Transactional relationships.`, insight: () => `You're connecting, but it feels like work rather than support.` },
    medium: { headline: (s) => `Connection Index: ${s}%`, subheadline: () => `Meaningful but taxing.`, insight: () => `You have deep roots, but the daily maintenance is a struggle.` },
    low: { headline: (s) => `Connection Index: ${s}%`, subheadline: () => `Sustainable Support.`, insight: () => `Your circle energizes you rather than draining you.` }
  },
  'plan-ahead': {
    critical: { headline: (s) => `Systems Index: ${s}%`, subheadline: () => `Time is a blur.`, insight: () => `Without external scaffolding, your internal clock is unreliable. Chaos is the default.` },
    high: { headline: (s) => `Systems Index: ${s}%`, subheadline: () => `Planning in the moment.`, insight: () => `You're good at fires, but you're tired of being the firefighter.` },
    medium: { headline: (s) => `Systems Index: ${s}%`, subheadline: () => `Consistent Scaffolding.`, insight: () => `You have a calendar, but you don't always trust it.` },
    low: { headline: (s) => `Systems Index: ${s}%`, subheadline: () => `Future-Proofed.`, insight: () => `Your systems handle the details so your brain can handle the ideas.` }
  },
  'be-yourself': {
    critical: { headline: (s) => `Authenticity: ${s}%`, subheadline: () => `The mask is permanent.`, insight: () => `You've forgotten where the mask ends and you begin. Shame is driving the performance.` },
    high: { headline: (s) => `Authenticity: ${s}%`, subheadline: () => `Selective masking.`, insight: () => `You know who you are, but you're afraid the world won't like it.` },
    medium: { headline: (s) => `Authenticity: ${s}%`, subheadline: () => `Unapologetic identity.`, insight: () => `You're starting to show the edges, and it feels terrifying but right.` },
    low: { headline: (s) => `Authenticity: ${s}%`, subheadline: () => `Radical Acceptance.`, insight: () => `You are your own primary caregiver. No mask required.` }
  }
};

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high'; 
  if (score >= 25) return 'medium';
  return 'low';
}

export function generateNarrative(score: number, branch: BranchSlug): NarrativeLayer {
  const level = getScoreLevel(score);
  const template = BRANCH_NARRATIVES[branch]?.[level];
  
  if (!template) {
    return {
      headline: `Assessment Complete: ${score}%`,
      subheadline: `You've identified your current pattern.`,
      insight: `This score reflects your current state in the ${branch} branch. Use it as a baseline for improvement.`,
      urgency: level
    };
  }
  
  return {
    headline: template.headline(score),
    subheadline: template.subheadline(score), 
    insight: template.insight(score),
    urgency: level
  };
}
