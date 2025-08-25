import React, { useEffect, useState } from "react";
import { usePWA } from "../hooks/use-pwa";

interface PWAManagerProps {
  children: React.ReactNode;
}

export function PWAManager({ children }: PWAManagerProps) {
  // Check for browser environment
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  // Wrap in try-catch to prevent crashes
  try {
    const { isInstalled, isStandalone } = usePWA();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // Initialize PWA features
      const initializePWA = async () => {
        try {
          // Register service worker if not already registered
          if ("serviceWorker" in navigator) {
            const registration =
              await navigator.serviceWorker.register("/sw.js");
            console.log("✅ PWA Manager: Service Worker registered");

            // Listen for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    console.log("🔄 PWA Manager: New content available");
                    // The PWAUpdateBanner component will handle showing update notification
                  }
                });
              }
            });

            // Check for updates immediately
            registration.update();
          }

          // Set up background sync if supported
          if (
            "serviceWorker" in navigator &&
            "sync" in window.ServiceWorkerRegistration.prototype
          ) {
            console.log("✅ PWA Manager: Background sync supported");
            // Note: Background sync registration is done when needed, not on initialization
          }

          // Set up periodic sync if supported
          if (
            "serviceWorker" in navigator &&
            "periodicSync" in window.ServiceWorkerRegistration.prototype
          ) {
            console.log("✅ PWA Manager: Periodic sync supported");
            try {
              // Request periodic background sync with proper error handling
              const registration = await navigator.serviceWorker.ready;

              // Check if registration exists and has periodicSync
              if (registration && (registration as any).periodicSync) {
                await (registration as any).periodicSync.register("sync", {
                  minInterval: 24 * 60 * 60 * 1000, // 24 hours
                });
                console.log(
                  "✅ PWA Manager: Periodic sync registered successfully",
                );
              }
            } catch (error) {
              console.log(
                "⚠️ PWA Manager: Periodic sync registration failed:",
                error,
              );
              // Fail silently - periodic sync is not critical for app functionality
            }
          }

          // Handle app updates
          window.addEventListener("appinstalled", () => {
            console.log("🎉 PWA Manager: App installed successfully");
            // Track installation analytics
            if (typeof gtag !== "undefined") {
              gtag("event", "pwa_installed", {
                event_category: "PWA",
                event_label: "App Installed",
              });
            }
          });

          // Handle visibility changes for better performance
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
              // App became visible, check for updates
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker
                  .getRegistration()
                  .then((registration) => {
                    if (registration) {
                      registration.update();
                    }
                  });
              }
            }
          });

          setIsReady(true);
        } catch (error) {
          console.error("❌ PWA Manager: Initialization failed:", error);
          setIsReady(true); // Still allow app to work
        }
      };

      initializePWA();
    }, []);

    useEffect(() => {
      // Add PWA-specific classes to body
      try {
        if (isInstalled) {
          document.body.classList.add("pwa-installed");
        }

        if (isStandalone) {
          document.body.classList.add("pwa-standalone");
        }

        return () => {
          document.body.classList.remove("pwa-installed", "pwa-standalone");
        };
      } catch (error) {
        console.error("Error managing PWA classes:", error);
      }
    }, [isInstalled, isStandalone]);

    useEffect(() => {
      // Handle PWA-specific styles and behaviors
      try {
        const handlePWAStyles = () => {
          // Add custom CSS variables for PWA
          const root = document.documentElement;

          if (isStandalone) {
            // Adjust layout for standalone mode
            root.style.setProperty(
              "--pwa-safe-area-top",
              "env(safe-area-inset-top)",
            );
            root.style.setProperty(
              "--pwa-safe-area-bottom",
              "env(safe-area-inset-bottom)",
            );
            root.style.setProperty(
              "--pwa-safe-area-left",
              "env(safe-area-inset-left)",
            );
            root.style.setProperty(
              "--pwa-safe-area-right",
              "env(safe-area-inset-right)",
            );
          }
        };

        handlePWAStyles();
      } catch (error) {
        console.error("Error handling PWA styles:", error);
      }
    }, [isStandalone]);

    // Show loading while PWA is initializing
    if (!isReady) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white text-2xl">🇸🇩</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 arabic">
              البيت السوداني
            </h2>
            <p className="text-muted-foreground arabic">
              جاري تحميل التطبيق...
            </p>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  } catch (error) {
    console.error("❌ PWA Manager: Critical error:", error);
    // Fallback: return children without PWA functionality
    return <>{children}</>;
  }
}

// Hook for PWA-specific features
export function usePWAFeatures() {
  // Check for browser environment
  if (typeof window === "undefined") {
    return {
      canInstall: false,
      isUpdateAvailable: false,
      installApp: async () => {},
      updateApp: () => {},
    };
  }

  try {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

    useEffect(() => {
      try {
        // Handle install prompt
        const handleBeforeInstallPrompt = (e: any) => {
          e.preventDefault();
          setDeferredPrompt(e);
        };

        // Handle app installed
        const handleAppInstalled = () => {
          setDeferredPrompt(null);
        };

        // Handle service worker updates
        const handleServiceWorkerUpdate = () => {
          setIsUpdateAvailable(true);
        };

        window.addEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
        window.addEventListener("appinstalled", handleAppInstalled);

        // Listen for service worker updates
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            handleServiceWorkerUpdate,
          );
        }

        return () => {
          window.removeEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt,
          );
          window.removeEventListener("appinstalled", handleAppInstalled);

          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.removeEventListener(
              "controllerchange",
              handleServiceWorkerUpdate,
            );
          }
        };
      } catch (error) {
        console.error("Error in usePWAFeatures useEffect:", error);
      }
    }, []);

    const installApp = async () => {
      if (deferredPrompt) {
        try {
          await deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;

          if (choiceResult.outcome === "accepted") {
            console.log("✅ User accepted install prompt");
            setDeferredPrompt(null);
          }
        } catch (error) {
          console.error("Error installing app:", error);
        }
      }
    };

    const updateApp = () => {
      try {
        if (isUpdateAvailable) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error updating app:", error);
      }
    };

    return {
      canInstall: !!deferredPrompt,
      isUpdateAvailable,
      installApp,
      updateApp,
    };
  } catch (error) {
    console.error("❌ usePWAFeatures: Critical error:", error);
    return {
      canInstall: false,
      isUpdateAvailable: false,
      installApp: async () => {},
      updateApp: () => {},
    };
  }
}

export default PWAManager;
