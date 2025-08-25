import React, { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
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
  // Add safety check for browser environment
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isInstallable: false,
      isInstalled: false,
      isStandalone: false,
      isOnline: true,
      hasUpdate: false,
      installPrompt: null,
      installApp: async () => {},
      dismissInstallPrompt: () => {},
      reloadForUpdate: () => {},
      shareApp: async () => false,
      requestNotificationPermission: async () => false,
      showNotification: () => null,
    };
  }

  // Wrap everything in try-catch for maximum safety
  try {
    const [pwaState, setPWAState] = useState<PWAState>({
      isInstallable: false,
      isInstalled: false,
      isStandalone: false,
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      hasUpdate: false,
      installPrompt: null,
    });

    useEffect(() => {
      try {
        // Check if running as PWA
        const isStandalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as any).standalone ||
          document.referrer.includes("android-app://");

        // Check if already installed
        const isInstalled =
          localStorage.getItem("pwa-installed") === "true" || isStandalone;

        setPWAState((prev) => ({
          ...prev,
          isStandalone,
          isInstalled,
        }));

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
          try {
            e.preventDefault();
            setPWAState((prev) => ({
              ...prev,
              isInstallable: true,
              installPrompt: e,
            }));
          } catch (error) {
            console.error("Error handling before install prompt:", error);
          }
        };

        // Listen for app installed
        const handleAppInstalled = () => {
          try {
            setPWAState((prev) => ({
              ...prev,
              isInstalled: true,
              isInstallable: false,
              installPrompt: null,
            }));
            localStorage.setItem("pwa-installed", "true");
          } catch (error) {
            console.error("Error handling app installed:", error);
          }
        };

        // Listen for online/offline
        const handleOnline = () => {
          try {
            setPWAState((prev) => ({ ...prev, isOnline: true }));
          } catch (error) {
            console.error("Error handling online event:", error);
          }
        };

        const handleOffline = () => {
          try {
            setPWAState((prev) => ({ ...prev, isOnline: false }));
          } catch (error) {
            console.error("Error handling offline event:", error);
          }
        };

        // Register event listeners
        window.addEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt as EventListener,
        );
        window.addEventListener("appinstalled", handleAppInstalled);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Check for service worker updates
        if ("serviceWorker" in navigator) {
          try {
            navigator.serviceWorker.addEventListener("controllerchange", () => {
              try {
                setPWAState((prev) => ({ ...prev, hasUpdate: true }));
              } catch (error) {
                console.error("Error setting hasUpdate state:", error);
              }
            });

            // Check for updates periodically
            const checkForUpdates = async () => {
              try {
                const registration =
                  await navigator.serviceWorker.getRegistration();
                if (registration) {
                  registration.update();
                }
              } catch (error) {
                console.error("Error checking for updates:", error);
              }
            };

            // Check for updates every 30 minutes
            const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

            return () => {
              try {
                window.removeEventListener(
                  "beforeinstallprompt",
                  handleBeforeInstallPrompt as EventListener,
                );
                window.removeEventListener("appinstalled", handleAppInstalled);
                window.removeEventListener("online", handleOnline);
                window.removeEventListener("offline", handleOffline);
                clearInterval(updateInterval);
              } catch (error) {
                console.error("Error removing event listeners:", error);
              }
            };
          } catch (error) {
            console.error("Error setting up service worker updates:", error);
          }
        }

        return () => {
          try {
            window.removeEventListener(
              "beforeinstallprompt",
              handleBeforeInstallPrompt as EventListener,
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
          } catch (error) {
            console.error("Error in cleanup:", error);
          }
        };
      } catch (error) {
        console.error("❌ usePWA useEffect error:", error);
      }
    }, []);

    const installApp = async () => {
      try {
        if (pwaState.installPrompt) {
          await pwaState.installPrompt.prompt();
          const choiceResult = await pwaState.installPrompt.userChoice;

          if (choiceResult.outcome === "accepted") {
            console.log("✅ User accepted the install prompt");
            setPWAState((prev) => ({
              ...prev,
              isInstallable: false,
              installPrompt: null,
            }));
          } else {
            console.log("❌ User dismissed the install prompt");
          }
        }
      } catch (error) {
        console.error("Error installing app:", error);
      }
    };

    const dismissInstallPrompt = () => {
      try {
        setPWAState((prev) => ({
          ...prev,
          isInstallable: false,
          installPrompt: null,
        }));
        localStorage.setItem("pwa-install-dismissed", "true");
      } catch (error) {
        console.error("Error dismissing install prompt:", error);
      }
    };

    const reloadForUpdate = () => {
      try {
        window.location.reload();
      } catch (error) {
        console.error("Error reloading for update:", error);
      }
    };

    const shareApp = async (shareData?: ShareData) => {
      try {
        const defaultShareData = {
          title: "البيت السوداني",
          text: "منصة شاملة للخدمات والتجارة السودانية في الخليج والعالم",
          url: window.location.origin,
        };

        const dataToShare = { ...defaultShareData, ...shareData };

        if (navigator.share) {
          await navigator.share(dataToShare);
          return true;
        } else {
          // Fallback to clipboard
          await navigator.clipboard.writeText(
            dataToShare.url || window.location.href,
          );
          return false; // Indicates fallback was used
        }
      } catch (error) {
        console.error("Error sharing:", error);
        throw error;
      }
    };

    const requestNotificationPermission = async () => {
      try {
        if ("Notification" in window) {
          const permission = await Notification.requestPermission();
          return permission === "granted";
        }
        return false;
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        return false;
      }
    };

    const showNotification = (title: string, options?: NotificationOptions) => {
      try {
        if ("Notification" in window && Notification.permission === "granted") {
          const defaultOptions: NotificationOptions = {
            body: "إشعار من البيت السوداني",
            icon: "/icons/icon-192x192.png",
            badge: "/icons/badge-72x72.png",
            dir: "rtl",
            lang: "ar",
            vibrate: [100, 50, 100],
            ...options,
          };

          return new Notification(title, defaultOptions);
        }
        return null;
      } catch (error) {
        console.error("Error showing notification:", error);
        return null;
      }
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
  } catch (error) {
    console.error("❌ usePWA: Critical error:", error);
    // Return safe fallback
    return {
      isInstallable: false,
      isInstalled: false,
      isStandalone: false,
      isOnline: true,
      hasUpdate: false,
      installPrompt: null,
      installApp: async () => {},
      dismissInstallPrompt: () => {},
      reloadForUpdate: () => {},
      shareApp: async () => false,
      requestNotificationPermission: async () => false,
      showNotification: () => null,
    };
  }
}

export default usePWA;
