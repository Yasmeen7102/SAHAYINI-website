import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { offlineStorage } from './services/offlineStorage';

// Register service worker for offline precaching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content available, auto-updating...');
  },
  onOfflineReady() {
    console.log('App ready to work offline.');
  },
});

// Precache critical safety and government schemes into local storage
offlineStorage.ensureInitialized();

createRoot(document.getElementById('root')!).render(<App />);

