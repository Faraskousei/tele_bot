export interface BotFeature {
  id: string;
  name: string;
  description: string;
  category: BotCategory;
  enabled: boolean;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export enum BotCategory {
  EDUCATION = 'education',
  MANAGEMENT = 'management',
  ENTERTAINMENT = 'entertainment',
  BUSINESS = 'business',
  TECHNICAL = 'technical'
}

export interface BotUser {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  isBot: boolean;
  languageCode?: string;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface BotMessage {
  id: string;
  chatId: number;
  userId: number;
  messageId: number;
  text?: string;
  type: 'text' | 'photo' | 'document' | 'callback';
  data?: any;
  createdAt: Date;
}

export interface BotSession {
  id: string;
  userId: number;
  chatId: number;
  state: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoItem {
  id: string;
  userId: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseItem {
  id: string;
  userId: number;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  id: string;
  userId: number;
  featureId: string;
  progress: number;
  completed: boolean;
  data: Record<string, any>;
  updatedAt: Date;
}
