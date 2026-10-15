export type LanguageCode =
  | 'en'
  | 'ta'
  | 'hi'
  | 'te'
  | 'mr'
  | 'ml'
  | 'gu'
  | 'kn';

export type ThemeMode = 'light' | 'dark' | 'contrast';

export type TextScale = 'normal' | 'large' | 'xlarge';

export type ActiveTab =
  | 'welcome'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'sos'
  | 'schemes'
  | 'chat'
  | 'learn'
  | 'scam'
  | 'complaint'
  | 'profile'
  | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  role: 'student' | 'public' | 'senior' | 'woman' | 'other';
  state: string;
  district?: string;
  preferredLanguage: LanguageCode;
  joinedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
}

export interface SchemeItem {
  id: string;
  title: string;
  nativeTitle?: Record<LanguageCode, string>;
  category: 'central' | 'state' | 'education' | 'scholarship' | 'women' | 'employment' | 'health' | 'agriculture' | 'housing' | 'finance';
  stateName?: string;
  tags: string[];
  summary: string;
  benefits: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationProcess: string[];
  sourceName: string;
  officialUrl: string;
  deadline?: string;
}

export interface LessonItem {
  id: string;
  topicId: string;
  number: number;
  title: string;
  description: string;
  readTime: string;
  audioDuration: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      body: string;
      tips?: string[];
      warning?: string;
    }[];
    summary: string[];
  };
  audioScript: string;
  /** Set when the lesson text is only available in one language (it is read aloud with that voice) */
  contentLanguage?: LanguageCode;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sahayini';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'knowledge_engine' | 'offline_cache' | 'local_fallback' | 'offline_no_match' | 'error';
  /** Why a non-live answer was shown (only for source 'local_fallback' / 'offline_cache') */
  fallbackReason?: 'no_api_key' | 'ai_error' | 'ai_empty' | 'server_unreachable' | 'offline';
  /** For source 'error': what went wrong, and the question to resend when the user taps Retry */
  errorKind?: 'not_configured' | 'unsupported_model' | 'rate_limit' | 'busy' | 'network';
  errorDetail?: string;
  retryText?: string;
  isAudioPlaying?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success';
  time: string;
  read: boolean;
  actionTab?: ActiveTab;
}
