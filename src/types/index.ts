export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface PersonalityResult {
  id: string;
  userId: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  completedAt: string;
  profile: string;
  description: string;
}

export interface MemoryResult {
  id: string;
  userId: string;
  shortTerm: number;
  longTerm: number;
  working: number;
  overall: number;
  completedAt: string;
  strengths: string[];
  improvements: string[];
}

export interface SpeechResult {
  id: string;
  userId: string;
  clarity: number;
  pace: number;
  confidence: number;
  bodyLanguage: number;
  overall: number;
  completedAt: string;
  feedback: string[];
  videoUrl?: string;
}

export interface ImprovementPlan {
  id: string;
  userId: string;
  personalityGoals: WeeklyGoal[];
  memoryGoals: WeeklyGoal[];
  speechGoals: WeeklyGoal[];
  createdAt: string;
  duration: number; // days
}

export interface WeeklyGoal {
  week: number;
  title: string;
  description: string;
  exercises: string[];
  completed: boolean;
}

export interface Assessment {
  id: string;
  type: 'personality' | 'memory' | 'speech';
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}