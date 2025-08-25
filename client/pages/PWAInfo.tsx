import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Zap,
  Shield,
  Bell,
  Share2,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePWA } from "@/hooks/use-pwa";
import { PWAShareButton } from "@/components/PWABanner";

export default function PWAInfo() {
  const { isRTL } = useTheme();
  const {
    isInstallable,
    isInstalled,
    isStandalone,
    isOnline,
    installApp,
    requestNotificationPermission,
  } = usePWA();

  const features = [
    {
      icon: Zap,
      title: "سرعة فائقة",
      description: "يعمل التطبيق بسرعة البرق ويحمّل فوراً",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: WifiOff,
      title: "يعمل دون اتصال",
      description: "استخدم التطبيق حتى لو لم يكن لديك إنترنت",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Shield,
      title: "آمن ومحمي",
      description: "بياناتك محمية بأعلى معايير الأمان",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Bell,
      title: "إشعارات فورية",
      description: "احصل على إشعارات بآخر الأخبار والعروض",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Smartphone,
      title: "تجربة الهاتف الأصيلة",
      description: "يبدو ويتصرف مثل تطبيق هاتف حقيقي",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      icon: RefreshCw,
      title: "تحديثات تلقائية",
      description: "احصل على أحدث الميزات تلقائياً",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "انقر على زر التثبيت",
      description: 'ابحث عن زر "تثبيت التطبيق" في المتصفح أو في الإشعار',
      icon: Download,
    },
    {
      number: 2,
      title: 'اختر "إضافة إلى الشاشة الرئيسية"',
      description: "سيظهر لك خيار لإضافة التطبيق إلى الشاشة الرئيسية",
      icon: Smartphone,
    },
    {
      number: 3,
      title: "استمتع بالتطبيق",
      description: "افتح التطبيق من الشاشة الرئيسية واستمتع بالتجربة المحسنة",
      icon: CheckCircle,
    },
  ];

  const handleInstall = async () => {
    try {
      await installApp();
    } catch (error) {
      console.error("فشل في تثبيت التطبيق:", error);
    }
  };

  const handleNotificationRequest = async () => {
    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        alert("تم تفعيل الإشعارات بنجاح! 🎉");
      } else {
        alert(
          "تم رفض تفعيل الإشعارات. يمكنك تفعيلها لاحقاً من إعدادات المتصفح.",
        );
      }
    } catch (error) {
      console.error("فشل في طلب إذن الإشعارات:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 iphone:px-6 py-8 md:py-12">
        {/* Hero Section */}
        <div
          className={`text-center mb-12 md:mb-16 ${isRTL ? "text-right" : "text-center"}`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl mb-6 shadow-lg">
            <span className="text-white text-3xl md:text-4xl">🇸🇩</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 arabic">
            تطبيق البيت السوداني
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-6 arabic max-w-3xl mx-auto leading-relaxed">
            احصل على تجربة أفضل وأسرع مع تطبيق البيت السوداني. يعمل على جميع
            الأجهزة ويوفر ميزات متقدمة.
          </p>

          {/* Status Badges */}
          <div
            className={`flex flex-wrap gap-2 justify-center mb-8 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            {isInstalled && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                <CheckCircle className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                مثبت بنجاح
              </Badge>
            )}

            {isStandalone && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                <Smartphone className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                يعمل كتطبيق
              </Badge>
            )}

            <Badge
              variant="secondary"
              className={
                isOnline
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }
            >
              {isOnline ? (
                <>
                  <Wifi className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                  متصل
                </>
              ) : (
                <>
                  <WifiOff className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                  غير متصل
                </>
              )}
            </Badge>
          </div>

          {/* Install Button */}
          {isInstallable && !isInstalled && (
            <div className="mb-8">
              <Button
                onClick={handleInstall}
                size="lg"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-4 text-lg arabic shadow-lg"
              >
                <Download className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                تثبيت التطبيق الآن
              </Button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <h2
            className={`text-2xl md:text-3xl font-bold text-foreground mb-8 arabic ${isRTL ? "text-right" : "text-center"}`}
          >
            مميزات التطبيق
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon
                      className={`w-8 h-8 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}
                    />
                  </div>
                  <CardTitle
                    className={`text-lg font-bold arabic ${isRTL ? "text-right" : "text-center"}`}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={`${isRTL ? "text-right" : "text-center"}`}
                >
                  <p className="text-muted-foreground arabic leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Installation Steps */}
        {!isInstalled && (
          <section className="mb-16">
            <h2
              className={`text-2xl md:text-3xl font-bold text-foreground mb-8 arabic ${isRTL ? "text-right" : "text-center"}`}
            >
              كيفية التثبيت
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="w-8 h-8 mx-auto bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                      {step.number}
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 arabic">
                      {step.title}
                    </h3>

                    <p className="text-muted-foreground arabic leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Additional Actions */}
        <section className="text-center">
          <h2
            className={`text-2xl md:text-3xl font-bold text-foreground mb-8 arabic ${isRTL ? "text-right" : "text-center"}`}
          >
            إعدادات إضافية
          </h2>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? "sm:flex-row-reverse" : ""}`}
          >
            <Button
              onClick={handleNotificationRequest}
              variant="outline"
              className="px-6 py-3 arabic"
            >
              <Bell className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              تفعيل الإشعارات
            </Button>

            <PWAShareButton
              url={window.location.origin}
              title="البيت السوداني"
              text="منصة شاملة للخدمات والتجارة السودانية في الخليج والعالم"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
