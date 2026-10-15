import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { OfflineStatusBanner } from './components/common/OfflineStatusBanner';
import { WelcomeView } from './components/views/WelcomeView';
import { AuthView } from './components/views/AuthView';
import { DashboardView } from './components/views/DashboardView';
import { SosView } from './components/views/SosView';
import { SchemesView } from './components/views/SchemesView';
import { AskSahayiniView } from './components/views/AskSahayiniView';
import { LearnView } from './components/views/LearnView';
import { ScamProtectionView } from './components/views/ScamProtectionView';
import { ComplaintSupportView } from './components/views/ComplaintSupportView';
import { ProfileSettingsView } from './components/views/ProfileSettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, theme, textScale } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine root styling based on text scaling and theme
  const scaleClass =
    textScale === 'xlarge'
      ? 'text-lg leading-relaxed'
      : textScale === 'large'
      ? 'text-base leading-normal'
      : 'text-sm leading-normal';

  const themeContainerClass =
    theme === 'dark'
      ? 'bg-slate-900 text-slate-100'
      : theme === 'contrast'
      ? 'bg-black text-white'
      : 'bg-slate-50/70 text-slate-900';

  // If on Welcome or Auth screens, render dedicated focused view
  if (activeTab === 'welcome') {
    return (
      <div className={`min-h-screen ${themeContainerClass} ${scaleClass} flex flex-col font-sans`}>
        <Header onToggleSidebar={() => {}} isSidebarOpen={false} />
        <OfflineStatusBanner />
        <main className="flex-1">
          <WelcomeView />
        </main>
      </div>
    );
  }

  if (activeTab === 'login' || activeTab === 'signup') {
    return (
      <div className={`min-h-screen ${themeContainerClass} ${scaleClass} flex flex-col font-sans`}>
        <Header onToggleSidebar={() => {}} isSidebarOpen={false} />
        <OfflineStatusBanner />
        <main className="flex-1">
          <AuthView initialMode={activeTab} />
        </main>
      </div>
    );
  }

  // Dashboard & other authenticated/main views with Sidebar matching Image 2 & 5
  return (
    <div className={`min-h-screen ${themeContainerClass} ${scaleClass} flex flex-col font-sans`}>
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <OfflineStatusBanner />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop permanent, Mobile drawer) matching Image 2 */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'sos' && <SosView />}
          {activeTab === 'schemes' && <SchemesView />}
          {activeTab === 'chat' && <AskSahayiniView />}
          {activeTab === 'learn' && <LearnView />}
          {activeTab === 'scam' && <ScamProtectionView />}
          {activeTab === 'complaint' && <ComplaintSupportView />}
          {activeTab === 'profile' && <ProfileSettingsView />}
          {activeTab === 'settings' && <ProfileSettingsView />}
        </main>
      </div>

      {/* Bottom Navigation for Mobile matching Image 5 */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
