import {
  LucideIcon,
  Trophy,
  Code,
  BookOpen,
  Flame,
  Zap,
  Star,
} from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  xpReward: number;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  badges: string[]; // Array of badge IDs
  pagesVisited: number;
  codeRuns: number;
  streakDays: number;
  lastVisit: string; // ISO Date string
  history: string[]; // Array of visited paths to prevent spam
}

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000,
];

export const calculateLevel = (xp: number): number => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
};

export const BADGES: Badge[] = [
  {
    id: "hello-world",
    name: "Hello World",
    description: "Visited Javapedia for the first time.",
    icon: Star,
    xpReward: 50,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    condition: (_stats) => true, // Awarded immediately on init if not present
  },
  {
    id: "scholar-novice",
    name: "Novice Scholar",
    description: "Read 5 documentation pages.",
    icon: BookOpen,
    xpReward: 100,
    condition: (stats) => stats.pagesVisited >= 5,
  },
  {
    id: "scholar-expert",
    name: "Expert Scholar",
    description: "Read 20 documentation pages.",
    icon: BookOpen,
    xpReward: 500,
    condition: (stats) => stats.pagesVisited >= 20,
  },
  {
    id: "coder-novice",
    name: "Script Kiddie",
    description: "Ran code in the Playground 5 times.",
    icon: Code,
    xpReward: 150,
    condition: (stats) => stats.codeRuns >= 5,
  },
  {
    id: "coder-pro",
    name: "Java Developer",
    description: "Ran code in the Playground 25 times.",
    icon: Zap,
    xpReward: 600,
    condition: (stats) => stats.codeRuns >= 25,
  },
  {
    id: "streak-week",
    name: "Dedicated",
    description: "Maintained a 3-day learning streak.",
    icon: Flame,
    xpReward: 300,
    condition: (stats) => stats.streakDays >= 3,
  },
  {
    id: "level-5",
    name: "High Achiever",
    description: "Reached Level 5.",
    icon: Trophy,
    xpReward: 1000,
    condition: (stats) => stats.level >= 5,
  },
];

export const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  badges: [],
  pagesVisited: 0,
  codeRuns: 0,
  streakDays: 1,
  lastVisit: new Date().toISOString(),
  history: [],
};
