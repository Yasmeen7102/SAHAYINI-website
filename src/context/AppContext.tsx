import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveTab,
  LanguageCode,
  ThemeMode,
  TextScale,
  UserProfile,
  EmergencyContact,
  NotificationItem,
} from '../types';
import { translations, TranslationDictionary, LANGUAGES } from '../i18n/translations';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  user: UserProfile | null;
  loginUser: (profile: UserProfile) => void;
  logoutUser: () => void;
  savedSchemeIds: string[];
  toggleSaveScheme: (schemeId: string) => void;
  contacts: EmergencyContact[];
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  deleteContact: (id: string) => void;
  completedLessonIds: string[];
  markLessonComplete: (lessonId: string) => void;
  quizScores: Record<string, number>;
  saveQuizScore: (topicId: string, score: number) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  isOffline: boolean;
  t: TranslationDictionary;
  resetAllData: () => void;
}

const defaultContacts: EmergencyContact[] = [
  { id: '1', name: 'National Emergency', phone: '112', relationship: 'Official Emergency Center', isPrimary: true },
  { id: '2', name: 'Women Helpline', phone: '1091', relationship: 'Toll-free 24x7 Women in Distress', isPrimary: true },
  { id: '3', name: 'Cyber Crime Helpline', phone: '1930', relationship: 'Financial Fraud Reporting', isPrimary: true },
  { id: '4', name: 'Mother / Home', phone: '9876543210', relationship: 'Family', isPrimary: false },
];

const defaultNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'NSP Scholarship Verification Alert',
    message: 'National Scholarship Portal application verification cycle is active. Ensure your Aadhaar is seeded.',
    type: 'info',
    time: '2 hours ago',
    read: false,
    actionTab: 'schemes',
  },
  {
    id: 'n2',
    title: 'Cyber Security Advisory: Digital Arrest',
    message: 'Police and CBI never conduct arrests over Skype or WhatsApp video calls. Report threats to 1930.',
    type: 'alert',
    time: '1 day ago',
    read: false,
    actionTab: 'scam',
  },
  {
    id: 'n3',
    title: 'Welcome to SAHAYINI',
    message: 'Explore digital lessons, government schemes, and instant emergency tools.',
    type: 'success',
    time: 'Just now',
    read: false,
    actionTab: 'learn',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state: Welcome page is initial route as requested
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const saved = localStorage.getItem('sahayini_active_tab');
    return (saved as ActiveTab) || 'welcome';
  });

  // Language state
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('sahayini_language');
    return (saved as LanguageCode) || 'en';
  });

  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sahayini_theme');
    return (saved as ThemeMode) || 'light';
  });

  // Text scale
  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    const saved = localStorage.getItem('sahayini_text_scale');
    return (saved as TextScale) || 'normal';
  });

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('sahayini_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Saved schemes
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sahayini_saved_schemes');
      return saved ? JSON.parse(saved) : ['pm-usha', 'beti-bachao-beti-padhao'];
    } catch {
      return ['pm-usha', 'beti-bachao-beti-padhao'];
    }
  });

  // Contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem('sahayini_contacts');
      return saved ? JSON.parse(saved) : defaultContacts;
    } catch {
      return defaultContacts;
    }
  });

  // Completed lessons
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sahayini_completed_lessons');
      return saved ? JSON.parse(saved) : ['lesson-1'];
    } catch {
      return ['lesson-1'];
    }
  });

  // Quiz scores
  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('sahayini_quiz_scores');
      return saved ? JSON.parse(saved) : { 'upi-payments': 100 };
    } catch {
      return { 'upi-payments': 100 };
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('sahayini_notifications');
      return saved ? JSON.parse(saved) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  // Online / Offline monitor
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update theme and textScale class on root document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-contrast');
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    } else if (theme === 'contrast') {
      root.classList.add('theme-contrast');
    }

    // Text scale classes for root
    root.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    root.classList.add(`text-scale-${textScale}`);
  }, [theme, textScale]);

  // Sync state changes to localStorage
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('sahayini_language', lang);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('sahayini_theme', mode);
  };

  const setTextScale = (scale: TextScale) => {
    setTextScaleState(scale);
    localStorage.setItem('sahayini_text_scale', scale);
  };

  const handleSetActiveTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    localStorage.setItem('sahayini_active_tab', tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('sahayini_user', JSON.stringify(profile));
    handleSetActiveTab('dashboard');
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('sahayini_user');
    handleSetActiveTab('welcome');
  };

  const toggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds((prev) => {
      const exists = prev.includes(schemeId);
      const updated = exists ? prev.filter((id) => id !== schemeId) : [...prev, schemeId];
      localStorage.setItem('sahayini_saved_schemes', JSON.stringify(updated));
      return updated;
    });
  };

  const addContact = (contactData: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contactData,
      id: Date.now().toString(),
    };
    setContacts((prev) => {
      const updated = [...prev, newContact];
      localStorage.setItem('sahayini_contacts', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('sahayini_contacts', JSON.stringify(updated));
      return updated;
    });
  };

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];
      localStorage.setItem('sahayini_completed_lessons', JSON.stringify(updated));
      return updated;
    });
  };

  const saveQuizScore = (topicId: string, score: number) => {
    setQuizScores((prev) => {
      const updated = { ...prev, [topicId]: score };
      localStorage.setItem('sahayini_quiz_scores', JSON.stringify(updated));
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem('sahayini_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem('sahayini_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const resetAllData = () => {
    localStorage.clear();
    setContacts(defaultContacts);
    setSavedSchemeIds(['pm-usha', 'beti-bachao-beti-padhao']);
    setCompletedLessonIds(['lesson-1']);
    setQuizScores({});
    setUser(null);
    setTheme('light');
    setTextScale('normal');
    setLanguage('en');
    setActiveTab('welcome');
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        language,
        setLanguage,
        theme,
        setTheme,
        textScale,
        setTextScale,
        user,
        loginUser,
        logoutUser,
        savedSchemeIds,
        toggleSaveScheme,
        contacts,
        addContact,
        deleteContact,
        completedLessonIds,
        markLessonComplete,
        quizScores,
        saveQuizScore,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        isOffline,
        t,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
