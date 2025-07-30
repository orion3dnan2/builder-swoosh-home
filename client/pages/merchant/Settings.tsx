import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Settings,
  User,
  Store,
  Bell,
  Shield,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Save,
  Eye,
  EyeOff,
  Clock,
  Package,
  Star,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { ApiService } from "@/lib/apiService";

interface StoreSettings {
  storeName: string;
  description: string;
  category: string;
  storeType: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  logo: string;
  banner: string;
}

interface NotificationSettings {
  newOrders: boolean;
  orderUpdates: boolean;
  paymentReceived: boolean;
  lowStock: boolean;
  reviews: boolean;
  promotions: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  processingTime: string;
  shippingAreas: string[];
}

export default function MerchantSettings() {
  const { t, isRTL } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("store");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewMerchant, setIsNewMerchant] = useState(true);

  // تحديد إذا كان التاجر جديد
  useEffect(() => {
    if (user?.createdAt) {
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
      setIsNewMerchant(daysSinceCreation < 7);
    }
  }, [user]);

  // تحميل بيانات المتجر عند تحميل الصفحة
  useEffect(() => {
    const loadStoreData = async () => {
      if (!user?.id) return;

      try {
        // محاولة تحميل بيانات المتجر من الخادم
        const userStores = await ApiService.getStores();
        const existingStore = userStores.find(
          (store) => store.merchantId === user.id,
        );

        if (existingStore) {
          // تحديث البيانات بناءً على المتجر الموجود
          setStoreSettings({
            storeName: existingStore.name || "",
            description: existingStore.description || "",
            category: existingStore.category || "",
            phone: existingStore.phone || "",
            email: existingStore.email || "",
            address: existingStore.address || "",
            city: existingStore.city || "",
            workingHours: existingStore.workingHours || {
              start: "09:00",
              end: "17:00",
              days: [],
            },
            logo: existingStore.logo || "/placeholder.svg",
            banner: existingStore.banner || "/placeholder.svg",
          });

          if (existingStore.country) {
            setSelectedCountry(existingStore.country);
          }

          if (existingStore.notificationSettings) {
            setNotifications(existingStore.notificationSettings);
          }

          if (existingStore.shippingSettings) {
            setShipping(existingStore.shippingSettings);
          }

          setIsNewMerchant(false); // له متجر موجود
        } else {
          // محاولة تحميل البيانات المحفوظة محلياً
          const savedStoreSettings = localStorage.getItem("storeSettings");
          const savedNotifications = localStorage.getItem(
            "notificationSettings",
          );
          const savedShipping = localStorage.getItem("shippingSettings");

          if (savedStoreSettings) {
            const parsed = JSON.parse(savedStoreSettings);
            setStoreSettings(parsed);
            if (parsed.selectedCountry) {
              setSelectedCountry(parsed.selectedCountry);
            }
          }

          if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
          }

          if (savedShipping) {
            setShipping(JSON.parse(savedShipping));
          }
        }
      } catch (error) {
        console.error("خطأ في تحميل بيانات المتجر:", error);

        // الرجوع للبيانات المحفوظة محلياً في حالة الخطأ
        try {
          const savedStoreSettings = localStorage.getItem("storeSettings");
          const savedNotifications = localStorage.getItem(
            "notificationSettings",
          );
          const savedShipping = localStorage.getItem("shippingSettings");

          if (savedStoreSettings) {
            const parsed = JSON.parse(savedStoreSettings);
            setStoreSettings(parsed);
            if (parsed.selectedCountry) {
              setSelectedCountry(parsed.selectedCountry);
            }
          }

          if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
          }

          if (savedShipping) {
            setShipping(JSON.parse(savedShipping));
          }
        } catch (localError) {
          console.error("خطأ في تحميل البيانات المحلية:", localError);
        }
      }
    };

    loadStoreData();
  }, [user?.id]);

  // Store Settings State - فارغة للتجار الجدد
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: isNewMerchant
      ? user?.profile?.businessName || ""
      : "متجر الخير السوداني",
    description: isNewMerchant
      ? ""
      : "متجر متخصص في بيع المنتجات السودانية الأصيلة والطبيعية من عطور وأطعمة وحرف يدوية",
    category: isNewMerchant ? "" : "مواد غذائية وعطور",
    storeType: isNewMerchant ? "" : "restaurant",
    phone: isNewMerchant ? user?.profile?.phone || "" : "+249123456789",
    email: isNewMerchant ? user?.email || "" : "store@example.com",
    address: isNewMerchant ? "" : "شارع النيل، الخرطوم",
    city: isNewMerchant ? user?.profile?.city || "" : "الخرطوم",
    workingHours: {
      start: isNewMerchant ? "09:00" : "09:00",
      end: isNewMerchant ? "17:00" : "22:00",
      days: isNewMerchant
        ? []
        : ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    },
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
  });

  // Notification Settings State - إعدادات افتراضية للتجار الجدد
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newOrders: true,
    orderUpdates: true,
    paymentReceived: true,
    lowStock: true,
    reviews: true,
    promotions: false,
    smsNotifications: isNewMerchant ? false : true,
    emailNotifications: true,
  });

  // Shipping Settings State - قيم افتراضية للتجار الجدد
  const [shipping, setShipping] = useState<ShippingSettings>({
    freeShippingThreshold: isNewMerchant ? 100 : 200,
    standardShippingCost: isNewMerchant ? 15 : 25,
    expressShippingCost: isNewMerchant ? 30 : 50,
    processingTime: isNewMerchant ? "1-3 أيام عمل" : "1-2 أيام عمل",
    shippingAreas: isNewMerchant
      ? []
      : ["الخرطوم", "أمدرمان", "بحري", "مدني", "كسلا"],
  });

  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    loginNotifications: true,
  });

  // معالجة تغيير الشعار
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith("image/")) {
        alert("يرجى اختيار ملف صورة صالح (PNG, JPG, JPEG)");
        return;
      }

      // التحقق من حجم الملف (أقل من 5 ميجابايت)
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الصورة ��جب أن يكون أقل من 5 ميجابايت");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setStoreSettings({ ...storeSettings, logo: logoUrl });
        alert("تم تحديث شعار المتجر بنجاح! 🎉");
      };
      reader.onerror = () => {
        alert("فشل في قراءة الصورة. يرجى المحاولة مرة أخرى.");
      };
      reader.readAsDataURL(file);
    }
  };

  // معالجة تغيير الغلاف
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("يرجى اختيار ملف صورة صالح (PNG, JPG, JPEG, أو WebP)");
        return;
      }

      // التحقق من حجم الملف (أقل من 10 ميجابايت)
      if (file.size > 10 * 1024 * 1024) {
        alert("حجم الصورة يجب أن يكون أقل من 10 ميجابايت");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const bannerUrl = e.target?.result as string;
        setStoreSettings({ ...storeSettings, banner: bannerUrl });
        alert("تم تحديث غلاف المتجر بنجاح! 🎨");
      };
      reader.onerror = () => {
        alert("فشل في قراءة الصورة. يرجى ��لمحاولة مرة أخرى.");
      };
      reader.readAsDataURL(file);
    }
  };

  // حذف الشعار
  const handleRemoveLogo = () => {
    if (window.confirm("هل أنت متأكد ��ن حذف شعار المتجر؟")) {
      setStoreSettings({ ...storeSettings, logo: "/placeholder.svg" });
      alert("تم حذف الشعار بنجاح");
    }
  };

  // حذف الغلاف
  const handleRemoveBanner = () => {
    if (window.confirm("هل أنت متأكد من حذف غلاف المتجر؟")) {
      setStoreSettings({ ...storeSettings, banner: "/placeholder.svg" });
      alert("تم حذف الغلاف بنجاح");
    }
  };

  const handleSaveSettings = async () => {
    // التحقق من صحة البيانات
    if (!storeSettings.storeName.trim()) {
      alert("يرجى إدخال اسم المتجر");
      return;
    }

    if (!storeSettings.category) {
      alert("ي��جى اختيار نوع المتجر");
      return;
    }

    if (!storeSettings.phone.trim()) {
      alert("يرجى إدخال رقم الهاتف");
      return;
    }

    if (!storeSettings.email.trim()) {
      alert("يرجى إدخال البريد الإلكتروني");
      return;
    }

    if (!selectedCountry) {
      alert("يرجى اختيار الدولة");
      return;
    }

    if (!storeSettings.city) {
      alert("يرجى اختيار المدينة");
      return;
    }

    if (storeSettings.workingHours.days.length === 0) {
      alert("يرجى اختيار أيام العمل");
      return;
    }

    setIsSaving(true);

    try {
      // إرسال البيانات إلى الخادم
      const storeData = {
        name: storeSettings.storeName,
        description: storeSettings.description,
        category: storeSettings.category,
        phone: storeSettings.phone,
        email: storeSettings.email,
        address: storeSettings.address,
        city: storeSettings.city,
        country: selectedCountry,
        workingHours: storeSettings.workingHours,
        logo: storeSettings.logo,
        banner: storeSettings.banner,
        notificationSettings: notifications,
        shippingSettings: shipping,
      };

      // البحث عن متجر موجود للمستخدم أولاً
      try {
        const userStores = await ApiService.getStores();
        const existingStore = userStores.find(
          (store) => store.merchantId === user?.id,
        );

        if (existingStore) {
          // تحديث متجر موجود
          await ApiService.updateStore(existingStore.id, storeData);
        } else {
          // إنشاء متجر جديد
          await ApiService.createStore(storeData);
        }
      } catch (apiError: any) {
        // إذا فشل API، نست��دم التخزين المحلي كنسخة احتياطية
        console.warn(
          "فشل في حفظ البيانات في الخادم، سيتم الحفظ محلياً:",
          apiError,
        );

        // حفظ البيانات محلياً
        localStorage.setItem(
          "storeSettings",
          JSON.stringify({ ...storeSettings, selectedCountry }),
        );
        localStorage.setItem(
          "notificationSettings",
          JSON.stringify(notifications),
        );
        localStorage.setItem("shippingSettings", JSON.stringify(shipping));
      }

      // عرض رسالة نجاح
      alert(
        "🎉 تم حفظ إعدادات المتجر بنج��ح!\n\nتم تحديث جميع البيانات والإعدادات الخاصة بمتجرك.",
      );
    } catch (error) {
      alert(
        "❌ حدث خطأ أثناء حفظ الإعدادات.\n\nيرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
      );
      console.error("خطأ في حفظ الإعدادات:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "store", label: "بيانات المتجر", icon: Store },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "shipping", label: "الشحن والتوصيل", icon: Truck },
    { id: "account", label: "الحساب والأمان", icon: Shield },
  ];

  // أنواع المتاجر المحددة مسبقاً (يمكن تعديلها من قبل الإدارة)
  const predefinedCategories = [
    "مواد غذائية وأطعمة",
    "عطور ومستحضرات تجميل",
    "ملابس وأزياء",
    "إلكترونيات وتقنية",
    "منتجات منزلية",
    "كتب ومواد تعليمية",
    "صحة ورياضة",
    "حرف يدوية وتقليدية",
    "خدمات عامة",
    "أخرى (حدد النوع)",
  ];

  const workingDays = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  // قائمة الدول والمدن التابعة لها
  const countriesWithCities = {
    السودان: [
      "الخرطوم",
      "أمدرمان",
      "بحري",
      "مدني",
      "كسلا",
      "بورتسودان",
      "أتبرا",
      "الأبيض",
      "نيالا",
      "الفاشر",
      "القضارف",
      "سنار",
    ],
    "المملكة العربية السعودية": [
      "الرياض",
      "جدة",
      "الدمام",
      "مكة المكرمة",
      "المدينة المنورة",
      "الطائف",
      "الخبر",
      "الأحساء",
      "تبوك",
      "أبها",
      "جازان",
      "نجران",
    ],
    "الإمارات العربية المتحدة": [
      "دبي",
      "أبوظبي",
      "الشارقة",
      "عجمان",
      "رأس الخيمة",
      "الفجيرة",
      "أم القيوين",
    ],
    "دولة الكويت": [
      "مدينة الكويت",
      "الأحمدي",
      "الجهراء",
      "مبارك الكبير",
      "الفروانية",
      "حولي",
    ],
    "دولة قطر": ["الدوحة", "الريان", "الوكرة", "أم صلال", "الخور", "الشمال"],
    "مملكة البحرين": ["المنامة", "المحرق", "الرفاع", "حمد", "عيسى", "جدحفص"],
    "سلطنة عُمان": ["مسقط", "صلالة", "نزوى", "صور", "الرستاق", "صحار"],
    "جمهورية مصر العربية": [
      "القاهرة",
      "الإسكندرية",
      "ال��يزة",
      "الأقصر",
      "أسوان",
      "بورسعيد",
      "السويس",
    ],
    "المملكة الأردنية الهاشمية": [
      "عمان",
      "إربد",
      "الزرقاء",
      "العقبة",
      "السلط",
      "مادبا",
    ],
  };

  // إضافة حالات جديدة
  const [selectedCountry, setSelectedCountry] = useState<string>(
    isNewMerchant ? user?.profile?.country || "السودان" : "السودان",
  );
  const [customCategory, setCustomCategory] = useState<string>("");
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);

  // دالة لمعالجة تغيير نوع المتجر
  const handleCategoryChange = (value: string) => {
    if (value === "أخرى (حدد النوع)") {
      setShowCustomCategory(true);
      setStoreSettings({ ...storeSettings, category: "" });
    } else {
      setShowCustomCategory(false);
      setStoreSettings({ ...storeSettings, category: value });
    }
  };

  // دالة لمعالجة تغيير الدولة
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    // إعادة تعيين المدينة عند تغيير الدولة
    setStoreSettings({
      ...storeSettings,
      city: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center py-6 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex items-center space-x-4 space-x-reverse ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <Link to="/merchant/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  رجوع
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 arabic">
                  إعدادات المتجر
                </h1>
                <p className="text-gray-600 arabic">
                  إدارة معلومات وإعدادات متج��ك
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="arabic">
              متجر
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-right transition-colors ${
                        activeTab === tab.id
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "text-gray-600 hover:bg-gray-100"
                      } ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="arabic">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Store Information Tab */}
            {activeTab === "store" && (
              <Card>
                <CardHeader>
                  <CardTitle className="arabic text-right flex items-center">
                    <Store className="w-5 h-5 ml-2" />
                    بيانات المتجر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Store Logo & Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="arabic">شعار المتجر</Label>
                      <div className="mt-2 flex items-center space-x-4 space-x-reverse">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {storeSettings.logo &&
                          storeSettings.logo !== "/placeholder.svg" ? (
                            <img
                              src={storeSettings.logo}
                              alt="شعار المتجر"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Store className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="arabic"
                              onClick={() =>
                                document.getElementById("logo-upload")?.click()
                              }
                            >
                              <Camera className="w-4 h-4 ml-2" />
                              تغيير الشعار
                            </Button>
                            {storeSettings.logo !== "/placeholder.svg" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="arabic text-red-600 hover:bg-red-50"
                                onClick={handleRemoveLogo}
                              >
                                حذف
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 arabic">
                            PNG, JPG أو JPEG (أقل من 5 ميجا)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="arabic">غلاف المتجر</Label>
                      <div className="mt-2 flex items-center space-x-4 space-x-reverse">
                        <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {storeSettings.banner &&
                          storeSettings.banner !== "/placeholder.svg" ? (
                            <img
                              src={storeSettings.banner}
                              alt="غلاف المتجر"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id="banner-upload"
                            accept="image/*"
                            onChange={handleBannerChange}
                            className="hidden"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="arabic"
                              onClick={() =>
                                document
                                  .getElementById("banner-upload")
                                  ?.click()
                              }
                            >
                              <Camera className="w-4 h-4 ml-2" />
                              تغيير الغلاف
                            </Button>
                            {storeSettings.banner !== "/placeholder.svg" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="arabic text-red-600 hover:bg-red-50"
                                onClick={handleRemoveBanner}
                              >
                                حذف
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 arabic">
                            PNG, JPG أو JPEG (أقل من 10 ميجا)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="storeName" className="arabic">
                        اسم المتجر
                      </Label>
                      <Input
                        id="storeName"
                        value={storeSettings.storeName}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            storeName: e.target.value,
                          })
                        }
                        className="mt-1 text-right arabic"
                        placeholder="أدخل اسم متجرك"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="arabic">
                        فئة المتجر
                      </Label>
                      <select
                        id="category"
                        value={storeSettings.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-right arabic"
                      >
                        <option value="">اختر نوع المتجر</option>
                        {predefinedCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {showCustomCategory && (
                        <div className="mt-2">
                          <Input
                            value={storeSettings.category}
                            onChange={(e) =>
                              setStoreSettings({
                                ...storeSettings,
                                category: e.target.value,
                              })
                            }
                            className="text-right arabic"
                            placeholder="حدد نوع متجرك (مثال: صيدلية، محل حلويات، ورشة تصليح)"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="arabic">
                      وصف المتجر
                    </Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={storeSettings.description}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 text-right arabic"
                      placeholder="اكتب وصفاً مختصراً عن متجرك ومنتجاتك..."
                    />
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="arabic">
                        رقم الهاتف
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={storeSettings.phone}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            phone: e.target.value,
                          })
                        }
                        className="mt-1 text-right"
                        placeholder="+249 12 123 4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="arabic">
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            email: e.target.value,
                          })
                        }
                        className="mt-1 text-right"
                        placeholder="store@example.com"
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="country" className="arabic">
                        الدولة
                      </Label>
                      <select
                        id="country"
                        value={selectedCountry}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-right arabic"
                      >
                        <option value="">اختر الدولة</option>
                        {Object.keys(countriesWithCities).map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="city" className="arabic">
                        المدينة
                      </Label>
                      <select
                        id="city"
                        value={storeSettings.city}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            city: e.target.value,
                          })
                        }
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-right arabic"
                        disabled={!selectedCountry}
                      >
                        <option value="">اختر المدينة</option>
                        {selectedCountry &&
                          countriesWithCities[selectedCountry]?.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="address" className="arabic">
                        عنوان المتجر
                      </Label>
                      <Input
                        id="address"
                        value={storeSettings.address}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            address: e.target.value,
                          })
                        }
                        className="mt-1 text-right arabic"
                        placeholder="شارع النيل، الخرطوم"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Working Hours */}
                  <div>
                    <Label className="arabic">ساعات العمل</Label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="arabic text-sm">من الساعة</Label>
                        <Input
                          type="time"
                          value={storeSettings.workingHours.start}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              workingHours: {
                                ...storeSettings.workingHours,
                                start: e.target.value,
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="arabic text-sm">إلى الساعة</Label>
                        <Input
                          type="time"
                          value={storeSettings.workingHours.end}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              workingHours: {
                                ...storeSettings.workingHours,
                                end: e.target.value,
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="arabic text-sm">أيام العمل</Label>
                        <div className="mt-1 space-y-1">
                          {workingDays.map((day) => (
                            <label
                              key={day}
                              className={`flex items-center space-x-2 space-x-reverse ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <input
                                type="checkbox"
                                checked={storeSettings.workingHours.days.includes(
                                  day,
                                )}
                                onChange={(e) => {
                                  const newDays = e.target.checked
                                    ? [...storeSettings.workingHours.days, day]
                                    : storeSettings.workingHours.days.filter(
                                        (d) => d !== day,
                                      );
                                  setStoreSettings({
                                    ...storeSettings,
                                    workingHours: {
                                      ...storeSettings.workingHours,
                                      days: newDays,
                                    },
                                  });
                                }}
                                className="rounded"
                              />
                              <span className="text-sm arabic">{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="arabic text-right flex items-center">
                    <Bell className="w-5 h-5 ml-2" />
                    إعدادات الإشعارات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Notifications */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">
                      إشعارات الطلبات
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: "newOrders",
                          label: "طلبات جديدة",
                          desc: "إشعارات عند وصول طلبات جديدة",
                        },
                        {
                          key: "orderUpdates",
                          label: "تحديثات الطلبات",
                          desc: "إشع��رات عند تغيير حالة الطلبات",
                        },
                        {
                          key: "paymentReceived",
                          label: "استلام الدفعات",
                          desc: "إشعارات عند استلام المدفوعات",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div className={isRTL ? "text-right" : "text-left"}>
                            <div className="font-medium arabic">
                              {item.label}
                            </div>
                            <div className="text-sm text-gray-600 arabic">
                              {item.desc}
                            </div>
                          </div>
                          <Switch
                            checked={
                              notifications[
                                item.key as keyof NotificationSettings
                              ]
                            }
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                [item.key]: checked,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Inventory Notifications */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">
                      إشعارات المخزون
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: "lowStock",
                          label: "نفاد المخزون",
                          desc: "تنبيه عند انخفاض كمية المنتجات",
                        },
                        {
                          key: "reviews",
                          label: "المراجعات الجديدة",
                          desc: "إشعارات عند وصول مراجعات جديدة",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div className={isRTL ? "text-right" : "text-left"}>
                            <div className="font-medium arabic">
                              {item.label}
                            </div>
                            <div className="text-sm text-gray-600 arabic">
                              {item.desc}
                            </div>
                          </div>
                          <Switch
                            checked={
                              notifications[
                                item.key as keyof NotificationSettings
                              ]
                            }
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                [item.key]: checked,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Notification Methods */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">
                      طرق الإشعار
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: "smsNotifications",
                          label: "رسائل SMS",
                          desc: "استقبال الإشعارات عبر الرسائل النصية",
                        },
                        {
                          key: "emailNotifications",
                          label: "البريد الإلكتروني",
                          desc: "استقبال الإشعارات عبر البريد الإلكتروني",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div className={isRTL ? "text-right" : "text-left"}>
                            <div className="font-medium arabic">
                              {item.label}
                            </div>
                            <div className="text-sm text-gray-600 arabic">
                              {item.desc}
                            </div>
                          </div>
                          <Switch
                            checked={
                              notifications[
                                item.key as keyof NotificationSettings
                              ]
                            }
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                [item.key]: checked,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Tab */}
            {activeTab === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="arabic text-right flex items-center">
                    <Truck className="w-5 h-5 ml-2" />
                    إعدادات الشحن والتوصيل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Costs */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">
                      تكاليف الشحن
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="freeShipping" className="arabic">
                          الشحن المجاني عند
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="freeShipping"
                            type="number"
                            value={shipping.freeShippingThreshold}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                freeShippingThreshold: Number(e.target.value),
                              })
                            }
                            className="text-right"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            جنيه
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="standardShipping" className="arabic">
                          الشحن العادي
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="standardShipping"
                            type="number"
                            value={shipping.standardShippingCost}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                standardShippingCost: Number(e.target.value),
                              })
                            }
                            className="text-right"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            جنيه
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="expressShipping" className="arabic">
                          الشحن السريع
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="expressShipping"
                            type="number"
                            value={shipping.expressShippingCost}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                expressShippingCost: Number(e.target.value),
                              })
                            }
                            className="text-right"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            جنيه
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Processing Time */}
                  <div>
                    <Label htmlFor="processingTime" className="arabic">
                      مدة تحضير الطلب
                    </Label>
                    <Input
                      id="processingTime"
                      value={shipping.processingTime}
                      onChange={(e) =>
                        setShipping({
                          ...shipping,
                          processingTime: e.target.value,
                        })
                      }
                      className="mt-1 text-right arabic"
                      placeholder="مثال: 1-2 أيام عمل"
                    />
                  </div>

                  <Separator />

                  {/* Shipping Areas */}
                  <div>
                    <Label className="arabic">مناطق التوصيل</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        "الخرطوم",
                        "أمدرمان",
                        "بحري",
                        "مدني",
                        "كسلا",
                        "بورتسودان",
                        "أتبرا",
                        "الأبيض",
                        "نيالا",
                        "الفاشر",
                      ].map((area) => (
                        <label
                          key={area}
                          className={`flex items-center space-x-2 space-x-reverse p-2 border rounded-lg hover:bg-gray-50 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <input
                            type="checkbox"
                            checked={shipping.shippingAreas.includes(area)}
                            onChange={(e) => {
                              const newAreas = e.target.checked
                                ? [...shipping.shippingAreas, area]
                                : shipping.shippingAreas.filter(
                                    (a) => a !== area,
                                  );
                              setShipping({
                                ...shipping,
                                shippingAreas: newAreas,
                              });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm arabic">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account & Security Tab */}
            {activeTab === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle className="arabic text-right flex items-center">
                    <Shield className="w-5 h-5 ml-2" />
                    الحساب والأمان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Account Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">
                      معلومات الحساب
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="arabic">اسم المستخدم</Label>
                        <Input
                          value={user?.profile?.name || ""}
                          disabled
                          className="mt-1 text-right arabic bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label className="arabic">البريد الإلكتروني</Label>
                        <Input
                          value={user?.email || ""}
                          disabled
                          className="mt-1 text-right bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Password Change */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">
                      تغيير كلمة المرور
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword" className="arabic">
                          كلمة المرور الحالية
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={accountSettings.currentPassword}
                            onChange={(e) =>
                              setAccountSettings({
                                ...accountSettings,
                                currentPassword: e.target.value,
                              })
                            }
                            className="text-right pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newPassword" className="arabic">
                            كلمة المرور الجديدة
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={accountSettings.newPassword}
                            onChange={(e) =>
                              setAccountSettings({
                                ...accountSettings,
                                newPassword: e.target.value,
                              })
                            }
                            className="mt-1 text-right"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" className="arabic">
                            تأكيد كلمة المرور
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={accountSettings.confirmPassword}
                            onChange={(e) =>
                              setAccountSettings({
                                ...accountSettings,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="mt-1 text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Security Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">
                      إعدادات الأمان
                    </h3>
                    <div className="space-y-4">
                      <div
                        className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <div className="font-medium arabic">
                            المصادقة الثن��ئية
                          </div>
                          <div className="text-sm text-gray-600 arabic">
                            حماية إضافية لحسابك
                          </div>
                        </div>
                        <Switch
                          checked={accountSettings.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            setAccountSettings({
                              ...accountSettings,
                              twoFactorAuth: checked,
                            })
                          }
                        />
                      </div>
                      <div
                        className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <div className="font-medium arabic">
                            إشعارات تسجيل الدخول
                          </div>
                          <div className="text-sm text-gray-600 arabic">
                            تنبيه عند تسجيل دخول جديد
                          </div>
                        </div>
                        <Switch
                          checked={accountSettings.loginNotifications}
                          onCheckedChange={(checked) =>
                            setAccountSettings({
                              ...accountSettings,
                              loginNotifications: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="arabic bg-purple-600 hover:bg-purple-700"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الإعدادات
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
