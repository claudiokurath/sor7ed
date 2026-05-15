// lib/unified-branches.ts - FOUNDER VOICE EDITION
export type BranchKey = 
  | 'spend-smart' 
  | 'keep-going' 
  | 'be-yourself' 
  | 'plan-ahead' 
  | 'level-up' 
  | 'be-connected' 
  | 'feel-good';

export const SORTED_ECOSYSTEM_BRANCHES = {
  'spend-smart': {
    id: 'spend-smart',
    label: 'Spend Smart',
    color: '#F4D03F',
    tagline: "The ADHD tax is real. I've paid enough to fund a small country.",
    description: "I once found a subscription I'd been paying for so long I couldn't remember what it was for. Clicked the link. Still didn't know what it was. Let's find yours and quietly plug the leaks without the shame parade.",
    assessmentHook: "Be honest. How many subscriptions have you forgotten about?",
    whatsappKeyword: 'SPEND',
    protocolPromise: 'A clean financial system that runs without your constant attention'
  },
  'keep-going': {
    id: 'keep-going', 
    label: 'Keep Going',
    color: '#E74C3C',
    tagline: "My closet is a graveyard of 3-week hyperfixations.",
    description: "Two guitars I can't play, a Duolingo streak I murdered in cold blood, and approximately 400 Notion pages titled 'THE SYSTEM (FINAL)'. We're not lacking discipline—our brains just run out of dopamine halfway through. Let's build momentum systems that survive the inevitable crash.",
    assessmentHook: "Where does your momentum actually drop off?",
    whatsappKeyword: 'MOMENTUM',
    protocolPromise: 'A momentum system that survives bad days'
  },
  'be-yourself': {
    id: 'be-yourself',
    label: 'Be Yourself', 
    color: '#8B5CF6',
    tagline: "Pretending to be 'normal' requires a 3-hour nap afterward.",
    description: "I used to spend so much energy performing 'professional' in meetings that I'd come home and lie face-down on the floor for 45 minutes. Turns out that's called masking and it costs energy you don't have. Let's audit what it's costing you.",
    assessmentHook: "How much energy does showing up cost you?",
    whatsappKeyword: 'PRESENCE',
    protocolPromise: 'A presence that works for your brain, not against it'
  },
  'plan-ahead': {
    id: 'plan-ahead',
    label: 'Plan Ahead',
    color: '#3B82F6', 
    tagline: "I think taking a shower takes 2 minutes and writing an email takes 4 hours.",
    description: "Time blindness isn't a character flaw—it's how our brains work. When you experience time as 'now' or 'not now,' traditional calendars are useless. Let's build planning that accounts for how we actually perceive time.",
    assessmentHook: "How broken is your concept of time right now?",
    whatsappKeyword: 'PLAN',
    protocolPromise: 'A planning system that doesn\'t require constant maintenance'
  },
  'level-up': {
    id: 'level-up',
    label: 'Level Up',
    color: '#10B981',
    tagline: "Buying a domain name isn't a business plan. (I own 14.)",
    description: "Brilliant ideas, 47 open browser tabs, and a to-do list that makes you want to hide under a blanket. The boring steps between 'I want to' and 'I actually did it' are where dreams go to die. Let's clear the path.",
    assessmentHook: "What's actually blocking your next level?",
    whatsappKeyword: 'GROWTH', 
    protocolPromise: 'A growth system that compounds without burning out'
  },
  'be-connected': {
    id: 'be-connected',
    label: 'Be Connected',
    color: '#F97316',
    tagline: "Loving people and having energy to show up are different things.",
    description: "I love my friends deeply. I also left a voice note unlistened to for three months because I knew it would require a response. Social battery is real. Communication friction is real. Let's make it easier without the guilt.",
    assessmentHook: "How much energy does maintaining relationships actually cost you?",
    whatsappKeyword: 'CONNECT',
    protocolPromise: 'A social system that feels sustainable, not exhausting'
  },
  'feel-good': {
    id: 'feel-good',
    label: 'Feel Good',
    color: '#14B8A6',
    tagline: "Revenge bedtime procrastination: A memoir.",
    description: "I stayed up until 3 AM last Tuesday watching videos about a hobby I don't have yet. I know. I know. But when your whole day belongs to everyone else, this is the only time that's yours. Let's fix the day so you don't need to steal the night.",
    assessmentHook: "What's your wellbeing system actually running on?",
    whatsappKeyword: 'WELLBEING',
    protocolPromise: 'A wellbeing system that maintains itself'
  }
} as const;
