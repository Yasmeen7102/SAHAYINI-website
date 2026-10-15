import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  AlertTriangle,
  Landmark,
  MessageCircle,
  BookOpen,
  ShieldCheck,
  FileText,
  User,
  Settings,
  X,
  LogOut,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { TricolorWave } from './TricolorWave';
import { AccessibilityQuickPanel } from './AccessibilityQuickPanel';
import { getComplaintStrings } from '../../i18n/complaintStrings';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, t, user, logoutUser, language } = useApp();

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; color?: string }[] = [
    { tab: 'dashboard', label: t.nav.home, icon: <Home className="w-5 h-5" /> },
    { tab: 'sos', label: t.nav.sos, icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
    { tab: 'schemes', label: t.nav.schemes, icon: <Landmark className="w-5 h-5 text-[#0A2E65]" /> },
    { tab: 'chat', label: t.nav.ask, icon: <MessageCircle className="w-5 h-5 text-blue-600" /> },
    { tab: 'learn', label: t.nav.learn, icon: <BookOpen className="w-5 h-5 text-orange-600" /> },
    { tab: 'scam', label: t.nav.scam, icon: <ShieldCheck className="w-5 h-5 text-sky-600" /> },
    { tab: 'complaint', label: getComplaintStrings(language).sidebarLabel, icon: <FileText className="w-5 h-5 text-[#123A70]" /> },
    { tab: 'profile', label: t.nav.profile, icon: <User className="w-5 h-5 text-slate-600" /> },
    { tab: 'settings', label: t.nav.settings, icon: <Settings className="w-5 h-5 text-slate-600" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Section */}
        <div className="flex flex-col gap-1">
          {/* Mobile close button header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              // Specific styling matching Image 2 for active Learn or active item
              const activeClass =
                item.tab === 'learn' && isActive
                  ? 'bg-[#F97316] text-white shadow-xs font-bold'
                  : isActive
                  ? 'bg-[#0A2E65] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium';

              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    if (onClose) onClose();
                  }}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 text-left ${activeClass}`}
                >
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Persistent Accessibility Quick-Settings Panel */}
        <div className="my-3">
          <AccessibilityQuickPanel />
        </div>

        {/* Bottom Slogan and Tricolor Wave (matches Image 2 bottom-left!) */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          {user && (
            <button
              onClick={logoutUser}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-4"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.nav.logout}</span>
            </button>
          )}

          <div className="px-2">
            <p className="text-xs font-medium text-slate-600 leading-snug">
              {t.slogan}
            </p>
            <div className="mt-2">
              <TricolorWave variant="wave" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
