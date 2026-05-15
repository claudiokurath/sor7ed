// lib/verdict-engine.ts
export type ScoreLevel = 'low' | 'medium' | 'high' | 'critical';

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return 'critical';
  if (score >= 70) return 'high'; 
  if (score >= 40) return 'medium';
  return 'low';
}

export function getHonestVerdict(score: number, branch: string) {
  const level = getScoreLevel(score);

  const verdicts = {
    low: {
      title: "This one's actually working for you.",
      body: "Whatever you're doing in this part of life is matching how your brain works. That's genuinely worth celebrating.\n\nKeep an eye on it when life gets chaotic, but right now you're sorted."
    },
    medium: {
      title: "It works... but it's heavier than it looks.",
      body: "You're managing this area, but it's quietly eating more energy than it needs to. Nothing's on fire, but there's friction.\n\nSmoothing this out will give you back more capacity than you think."
    },
    high: {
      title: "No wonder this feels hard.",
      body: "You're doing a lot of invisible work just to keep this from falling over. From the outside it might look 'fine', but your nervous system knows the truth.\n\nThis isn't you being bad at life. This is a system that doesn't fit how your brain actually runs."
    },
    critical: {
      title: "Okay. This part is genuinely a lot.",
      body: "If this area of life feels overwhelming or impossible right now, these numbers are why. It's not in your head—the load here is actually heavy.\n\nThe good news: when something is this misaligned, even small changes pay off fast. We don't need perfection. We just need to stop your system fighting you every step."
    }
  };

  return verdicts[level];
}
