import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export function usePWA() {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isOnline: navigator.onLine,
    hasUpdate: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    // Check if already installed
    const isInstalled = localStorage.getItem('pwa-installed') === 'true' || isStandalone;

    setPWAState(prev => ({
      ...prev,
      isStandalone,
      isInstalled,
    }));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setPWAState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e,
      }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null,
      }));
      localStorage.setItem('pwa-installed', 'true');
    };

    // Listen for online/offline
    const handleOnline = () => {
      setPWAState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setPWAState(prev => ({ ...prev, isOnline: false }));
    };

    // Register event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setPWAState(prev => ({ ...prev, hasUpdate: true }));
      });

      // Check for updates periodically
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            registration.update();
          }
        } catch (error) {
          console.error('Error checking for updates:', error);
        }
      };

      // Check for updates every 30 minutes
      const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(updateInterval);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (pwaState.installPrompt) {
      try {
        await pwaState.installPrompt.prompt();
        const choiceResult = await pwaState.installPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User accepted the install prompt');
          setPWAState(prev => ({
            ...prev,
            isInstallable: false,
            installPrompt: null,
          }));
        } else {
          console.log('❌ User dismissed the install prompt');
        }
      } catch (error) {
        console.error('Error installing app:', error);
      }
    }
  };

  const dismissInstallPrompt = () => {
    setPWAState(prev => ({
      ...prev,
      isInstallable: false,
      installPrompt: null,
    }));
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const reloadForUpdate = () => {
    window.location.reload();
  };

  const shareApp = async (shareData?: ShareData) => {
    const defaultShareData = {
      title: 'البيت السوداني',
      text: 'منصة شاملة للخدمات والتجارة السودانية في الخليج والعالم',
      url: window.location.origin,
    };

    const dataToShare = { ...defaultShareData, ...shareData };

    try {
      if (navigator.share) {
        await navigator.share(dataToShare);
        return true;
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(dataToShare.url || window.location.href);
        return false; // Indicates fallback was used
      }
    } catch (error) {
      console.error('Error sharing:', error);
      throw error;
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const defaultOptions: NotificationOptions = {
        body: 'إشعار من البيت السوداني',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        dir: 'rtl',
        lang: 'ar',
        vibrate: [100, 50, 100],
        ...options,
      };

      return new Notification(title, defaultOptions);
    }
    return null;
  };

  return {
    ...pwaState,
    installApp,
    dismissInstallPrompt,
    reloadForUpdate,
    shareApp,
    requestNotificationPermission,
    showNotification,
  };
}

export default usePWA;
