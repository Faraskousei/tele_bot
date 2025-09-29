export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  type: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message: TelegramMessage;
  data: string;
}

export interface BotFeature {
  id: string;
  name: string;
  description: string;
  category: BotCategory;
  enabled: boolean;
  settings: Record<string, unknown>;
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
  data: Record<string, unknown>;
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
  data: Record<string, unknown>;
  updatedAt: Date;
}
