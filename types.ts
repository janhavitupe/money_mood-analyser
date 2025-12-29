
export interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  category: TransactionCategory;
  description: string;
}

export type TransactionCategory = 
  | 'Food & Dining'
  | 'Shopping'
  | 'Transportation'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Health'
  | 'Subscriptions'
  | 'Misc';

export interface MoodInsight {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  tag: 'Impulse' | 'Post-Payday' | 'Weekend' | 'Late-Night' | 'Subscription' | 'General';
}

export interface BehavioralProfile {
  score: number; // 0-100 (100 is high discipline)
  primaryTrait: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  summary: string;
}

export interface AnalysisResult {
  insights: MoodInsight[];
  profile: BehavioralProfile;
  psychologicalProfile: string;
}
