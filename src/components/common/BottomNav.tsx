import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, AlertTriangle, BookOpen, MessageCircle, User } from 'lucide-react';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const items: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: t.nav.home, icon: <Home className="w-5 h-5" /> },
    { tab: 'sos', label: t.nav.sos, icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
    { tab: 'learn', label: t.nav.learn, icon: <BookOpen className="w-5 h-5" /> },
    { tab: 'chat', label: t.nav.ask, icon: <MessageCircle className="w-5 h-5" /> },
    { tab: 'profile', label: t.nav.profile, icon: <User className="w-5 h-5" /> },
  ];

  // Don't show bottom nav on welcome page or login page
  if (activeTab === 'welcome' || activeTab === 'login' || activeTab === 'signup') {
    return null;
  }

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[11px] font-semibold transition-all ${
                isActive
                  ? 'text-[#0A2E65] font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-blue-50' : ''}`}>
                {item.icon}
              </div>
              <span className="mt-0.5 leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
