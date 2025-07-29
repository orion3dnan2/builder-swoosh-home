// إعداد الربط العميق بين الموقع والتطبيق الجوال

export class DeepLinkingService {
  private static APP_SCHEME = 'sudanapp';
  private static WEB_DOMAIN = 'baytsudani.com';

  // إنشاء رابط عميق للتطبيق الجوال
  static createMobileLink(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.APP_SCHEME}://${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  // إنشاء رابط للويب
  static createWebLink(path: string, params?: Record<string, string>): string {
    const url = new URL(`https://${this.WEB_DOMAIN}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  // إنشاء رابط ذكي يتكيف مع المنصة
  static createSmartLink(path: string, params?: Record<string, string>): {
    web: string;
    mobile: string;
    universal: string;
  } {
    const webLink = this.createWebLink(path, params);
    const mobileLink = this.createMobileLink(path, params);
    
    // رابط عالمي يتجه للويب افتراضياً مع إمكانية فتح التطبيق
    const universalLink = `${webLink}?app=${encodeURIComponent(mobileLink)}`;

    return {
      web: webLink,
      mobile: mobileLink,
      universal: universalLink
    };
  }

  // روابط محددة للكيانات
  static getProductLinks(productId: string) {
    return this.createSmartLink('/products', { id: productId });
  }

  static getCompanyLinks(companyId: string) {
    return this.createSmartLink('/companies', { id: companyId });
  }

  static getJobLinks(jobId: string) {
    return this.createSmartLink('/jobs', { id: jobId });
  }

  static getStoreLinks(storeId: string) {
    return this.createSmartLink('/stores', { id: storeId });
  }

  // مشاركة المحتوى
  static async shareContent(type: 'product' | 'company' | 'job' | 'store', id: string, title: string) {
    let links;
    
    switch (type) {
      case 'product':
        links = this.getProductLinks(id);
        break;
      case 'company':
        links = this.getCompanyLinks(id);
        break;
      case 'job':
        links = this.getJobLinks(id);
        break;
      case 'store':
        links = this.getStoreLinks(id);
        break;
      default:
        return;
    }

    const shareData = {
      title: `${title} - البيت السوداني`,
      text: `شاهد هذا المحتوى على البيت السوداني`,
      url: links.universal
    };

    if (navigator.share && this.isMobileDevice()) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        this.fallbackShare(links.universal);
      }
    } else {
      this.fallbackShare(links.universal);
    }
  }

  // مشاركة بديلة
  private static fallbackShare(url: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('تم نسخ الرابط');
      });
    } else {
      // إنشاء حقل نص مؤقت للنسخ
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('تم نسخ الرابط');
    }
  }

  // فحص إذا كان الجهاز محمول
  private static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // فحص إذا كان التطبيق مثبت (للويب)
  static async isAppInstalled(): Promise<boolean> {
    if (this.isMobileDevice()) {
      try {
        // محاولة فتح التطبيق
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 1000)
        );
        
        const appOpened = new Promise((resolve) => {
          const link = document.createElement('a');
          link.href = this.createMobileLink('/');
          link.click();
          setTimeout(() => resolve(true), 500);
        });

        await Promise.race([timeout, appOpened]);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  // توجيه المستخدم للتطبيق أو المتجر
  static async redirectToApp(fallbackUrl?: string) {
    const isInstalled = await this.isAppInstalled();
    
    if (isInstalled) {
      // فتح التطبيق
      window.location.href = this.createMobileLink('/');
    } else {
      // توجيه لمتجر التطبيقات
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        window.location.href = 'https://apps.apple.com/app/sudan-house';
      } else if (isAndroid) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.sudanhouse.app';
      } else if (fallbackUrl) {
        window.location.href = fallbackUrl;
      }
    }
  }
}

// مكون React للتحكم في الروابط الذكية
import React from 'react';
import { Button } from '@/components/ui/button';

interface SmartLinkButtonProps {
  type: 'product' | 'company' | 'job' | 'store';
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SmartLinkButton: React.FC<SmartLinkButtonProps> = ({
  type,
  id,
  title,
  children,
  className
}) => {
  const handleClick = () => {
    DeepLinkingService.shareContent(type, id, title);
  };

  return (
    <Button onClick={handleClick} className={className}>
      {children}
    </Button>
  );
};

// مكون banner للتطبيق الجوال
export const AppPromoBanner: React.FC = () => {
  const [showBanner, setShowBanner] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = async () => {
      if (DeepLinkingService['isMobileDevice']()) {
        const isInstalled = await DeepLinkingService.isAppInstalled();
        if (!isInstalled && !localStorage.getItem('app_banner_dismissed')) {
          setShowBanner(true);
        }
      }
    };

    checkMobile();
  }, []);

  const handleInstallApp = () => {
    DeepLinkingService.redirectToApp();
    setShowBanner(false);
  };

  const dismissBanner = () => {
    localStorage.setItem('app_banner_dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 fixed bottom-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xl">🇸🇩</span>
          </div>
          <div>
            <div className="font-bold text-sm">البيت السوداني</div>
            <div className="text-xs opacity-90">احصل على التطبيق</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={handleInstallApp}
            className="text-xs"
          >
            تحميل
          </Button>
          <button 
            onClick={dismissBanner}
            className="text-white/70 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};