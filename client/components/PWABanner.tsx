import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { usePWA } from '../hooks/use-pwa';
import { useTheme } from '../contexts/ThemeContext';

export function PWAInstallBanner() {
  const { isRTL } = useTheme();
  const { isInstallable, isInstalled, installApp, dismissInstallPrompt } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    setIsDismissed(dismissed === 'true');
    
    if (isInstallable && !isInstalled && !isDismissed) {
      // Show banner after a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isDismissed]);

  const handleInstall = async () => {
    try {
      await installApp();
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to install app:', error);
    }
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible || !isInstallable || isInstalled || isDismissed) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up ${
        isRTL ? 'md:left-4 md:right-auto' : ''
      }`}
    >
      <Card className="border-2 border-primary-200 shadow-lg dark:border-primary-800 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950">
        <CardContent className="p-4">
          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🇸🇩</span>
              </div>
            </div>
            
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <h3 className="font-bold text-foreground text-sm">البيت السوداني</h3>
                <Badge variant="secondary" className="text-xs">تطبيق</Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed arabic">
                قم بتثبيت التطبيق للحصول على تجربة أسرع وإمكانية العمل دون اتصال
              </p>
              
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white text-xs px-3 py-1 h-auto"
                >
                  <Download className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  تثبيت
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-xs px-2 py-1 h-auto text-muted-foreground hover:text-foreground"
                >
                  لاحقاً
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 h-auto text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PWAUpdateBanner() {
  const { isRTL } = useTheme();
  const { hasUpdate, reloadForUpdate } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hasUpdate) {
      setIsVisible(true);
    }
  }, [hasUpdate]);

  const handleUpdate = () => {
    reloadForUpdate();
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !hasUpdate) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-down ${
        isRTL ? 'md:left-4 md:right-auto' : ''
      }`}
    >
      <Card className="border-2 border-green-200 shadow-lg dark:border-green-800 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardContent className="p-4">
          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="font-bold text-foreground text-sm mb-1">تحديث متاح</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed arabic">
                يتوفر إصدار جديد من التطبيق مع تحسينات وميزات جديدة
              </p>
              
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xs px-3 py-1 h-auto"
                >
                  <RefreshCw className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  تحديث الآن
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-xs px-2 py-1 h-auto text-muted-foreground hover:text-foreground"
                >
                  لاحقاً
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 h-auto text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PWAConnectionStatus() {
  const { isRTL } = useTheme();
  const { isOnline } = usePWA();
  const [showStatus, setShowStatus] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(isOnline);

  useEffect(() => {
    // Show status when connection changes
    if (previousStatus !== isOnline) {
      setShowStatus(true);
      setPreviousStatus(isOnline);
      
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, previousStatus]);

  if (!showStatus) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down`}
    >
      <Card
        className={`border-2 shadow-lg ${
          isOnline
            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950'
            : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950'
        }`}
      >
        <CardContent className="p-3">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
            
            <span
              className={`text-sm font-medium ${
                isOnline
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              } arabic`}
            >
              {isOnline ? 'تم الاتصال بالإنترنت' : 'انقطع الاتصال بالإنترنت'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PWAShareButton({ url, title, text }: { url?: string; title?: string; text?: string }) {
  const { isRTL } = useTheme();
  const { shareApp } = usePWA();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const shareData = {
        url: url || window.location.href,
        title: title || 'البيت السوداني',
        text: text || 'منصة شاملة للخدمات والتجارة السودانية في الخليج والعالم',
      };
      
      const usedNativeShare = await shareApp(shareData);
      
      if (!usedNativeShare) {
        // Show a message that link was copied to clipboard
        alert('تم نسخ الرابط إلى الحافظة');
      }
    } catch (error) {
      console.error('Failed to share:', error);
      alert('فشل في مشاركة المحتوى');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      disabled={isSharing}
      className="text-muted-foreground hover:text-foreground"
    >
      <Share2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
      {isSharing ? 'جاري المشاركة...' : 'مشاركة'}
    </Button>
  );
}
