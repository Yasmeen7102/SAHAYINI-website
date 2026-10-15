import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { LANGUAGES } from '../../i18n/translations';
import {
  Bell,
  Sun,
  Moon,
  Eye,
  LogOut,
  User as UserIcon,
  Globe,
  WifiOff,
  Menu,
  X,
  ShieldAlert,
  HardDrive,
  Download,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineSafetyKitModal } from './OfflineSafetyKitModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    theme,
    setTheme,
    user,
    logoutUser,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    isOffline,
    t,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left Side: Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          {activeTab !== 'welcome' && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => setActiveTab(user ? 'dashboard' : 'welcome')}
            className="flex items-center gap-2 group text-left focus:outline-hidden cursor-pointer"
          >
            <Logo
              size="sm"
              showText={true}
              showSubtitle={true}
              showTagline={true}
              className="max-w-[280px] sm:max-w-none"
            />
          </button>
        </div>

        {/* Center / Offline Banner or Kit Trigger */}
        <div className="hidden md:flex items-center gap-2">
          {isOffline ? (
            <button
              onClick={() => setShowOfflineModal(true)}
              className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-xs rounded-full font-medium hover:bg-amber-500/20 transition cursor-pointer"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode Active • Tap for Offline Kit</span>
            </button>
          ) : (
            <button
              onClick={() => setShowOfflineModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition cursor-pointer"
              title="View cached emergency numbers and schemes for offline access"
            >
              <HardDrive className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Offline Safety Kit</span>
            </button>
          )}
        </div>

        {/* Right Side: Install Button, Language Switcher, Notifications, Theme, User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" />

          {/* Offline Kit Icon for Mobile */}
          <button
            onClick={() => setShowOfflineModal(true)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
            title="Offline Safety Kit"
            aria-label="Offline Safety Kit"
          >
            <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-[#0A2E65] bg-slate-100 hover:bg-slate-200/80 rounded-full transition-colors border border-slate-200/60"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0A2E65]" />
              <span>{currentLangObj.nativeName}</span>
              <span className="text-[10px] text-slate-500">▼</span>
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Choose Language / மொழி
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as LanguageCode);
                          setShowLangMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left hover:bg-slate-50 transition-colors ${
                          language === lang.code
                            ? 'font-bold text-[#0A2E65] bg-blue-50/60'
                            : 'text-slate-700'
                        }`}
                      >
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-xs text-slate-400">({lang.name})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              if (theme === 'light') setTheme('dark');
              else if (theme === 'dark') setTheme('contrast');
              else setTheme('light');
            }}
            title={`Current Theme: ${theme.toUpperCase()} (Click to change)`}
            className="p-2 text-slate-600 hover:text-[#0A2E65] hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Toggle theme mode"
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === 'contrast' && <Eye className="w-4 h-4 text-emerald-600 font-bold" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLangMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-[#0A2E65] hover:bg-slate-100 rounded-full transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#0A2E65]" />
                      <span className="text-xs font-bold text-slate-800">Alerts & Announcements</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-[#0A2E65] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications at this time.
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            markNotificationRead(item.id);
                            if (item.actionTab) {
                              setActiveTab(item.actionTab);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !item.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">
                              {item.type === 'alert' && (
                                <ShieldAlert className="w-4 h-4 text-red-600" />
                              )}
                              {item.type === 'info' && (
                                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1" />
                              )}
                              {item.type === 'success' && (
                                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-slate-800">{item.title}</p>
                              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                {item.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {item.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile / Auth State Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1 text-left rounded-lg hover:bg-slate-100 transition-colors"
                title="View Profile"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0A2E65] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[90px]">
                    {user.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                </div>
              </button>

              <button
                onClick={logoutUser}
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title={t.nav.logout}
                aria-label={t.nav.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1">
              <button
                onClick={() => setActiveTab('login')}
                className="px-3 py-1.5 text-xs font-semibold text-[#0A2E65] hover:bg-slate-100 rounded-full transition-colors"
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0A2E65] hover:bg-[#072344] rounded-full shadow-xs transition-colors"
              >
                {t.nav.signup}
              </button>
            </div>
          )}
          {/* Indian Flag Waving Banner with Ashoka Chakra matching Image 4 */}
          <div className="hidden lg:flex items-center pl-2 border-l border-slate-200">
            <div className="flex items-center">
              {/* Ashoka Chakra */}
              <div className="w-6 h-6 text-[#0A2E65] relative z-10 drop-shadow-2xs">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
                  <circle cx="50" cy="50" r="10" fill="currentColor" />
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                      stroke="currentColor"
                      strokeWidth="2.8"
                    />
                  ))}
                </svg>
              </div>

              {/* Dynamic Waving Tricolor Ribbon */}
              <svg viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-7 -ml-1.5">
                <path d="M 0,8 C 25,-2 50,18 100,5" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
                <path d="M 0,17 C 25,7 50,27 100,14" stroke="#FFFFFF" strokeWidth="4.5" />
                <path d="M 0,26 C 25,16 50,36 100,23" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <OfflineSafetyKitModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
      />
    </header>
  );
};
