export type Role = 'USER' | 'LEADER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  churchId: string;
  role: Role;
  avatarUrl?: string;
  level: number;
  totalXP: number;
  currentXpBase: number; // XP at start of level
  nextLevelXP: number; // XP to reach next level
  monthlyTrophies: number;
  history: EventAction[];
  badges: string[];
}

export interface Church {
  id: string;
  name: string;
}

export type EventType = 'PARTICIPATION' | 'PUNCTUALITY' | 'GUEST' | 'GAME_WON' | 'MVP' | 'BIBLE_ANSWER' | 'CUSTOM';

export interface EventAction {
  id: string;
  type: EventType;
  description: string;
  xpAwarded: number;
  trophiesAwarded: number;
  timestamp: Date;
  activityName?: string; // e.g. "Charadas", "Impostor"
}

// Utility to calculate level curve
export const calculateNextLevelXP = (level: number) => {
  return 100 * Math.pow(level, 2);
}
