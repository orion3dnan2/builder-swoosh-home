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
  ShoppingCart,
  MessageSquare,
  Users,
  Car,
  Navigation,
  WhatsApp,
  Check,
  X,
  Plus,
  Edit,
  Trash2,
  DollarSign,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrencySafe } from "@/contexts/CurrencyContext";
import { ApiService } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { cleanArabicText } from "@/lib/textUtils";
import {
  useRegions,
  useCountries,
  useRegionsByCountry,
} from "@/hooks/use-regions";

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

interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  area: string;
  rating: number;
  isActive: boolean;
  vehicle: string;
  speciality: string[];
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  processingTime: string;
  shippingAreas: string[];
  deliveryDrivers: DeliveryDriver[];
  trackingEnabled: boolean;
  autoAssignDrivers: boolean;
}

export default function MerchantSettings() {
  const { t, isRTL } = useTheme();
  const { user } = useAuth();
  const { updateCurrencyByCountry } = useCurrencySafe();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("store");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewMerchant, setIsNewMerchant] = useState(true);

  // تحديد إذا كان الت��جر جديد
  useEffect(() => {
    if (user?.createdAt) {
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
      setIsNewMerchant(daysSinceCreation < 7);
    }
  }, [user]);

  // دالة لتحميل البيانات المحفوظة محلياً
  const loadLocalData = () => {
    try {
      const savedStoreSettings = localStorage.getItem("storeSettings");
      const savedNotifications = localStorage.getItem("notificationSettings");
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
    } catch (error) {
      console.error("خطأ في تحميل الب��انات المحلية:", error);
    }
  };

  // تحميل بيانات المتجر عند تحميل ا��صفحة
  useEffect(() => {
    const loadStoreData = async () => {
      if (!user?.id) return;

      setLoadingState({
        isLoading: true,
        hasError: false,
        isOffline: false,
        retryCount: 0,
      });

      try {
        // تحقق من وجود token المصادقة
        const token = ApiService.getToken();
        if (!token) {
          console.log("لا يوجد token للمصادقة، استخدام البيانات المحلية");
          loadLocalData();
          return;
        }

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
            storeType: existingStore.storeType || "",
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
          setLoadingState({
            isLoading: false,
            hasError: false,
            isOffline: false,
            retryCount: 0,
          });
        } else {
          // تحميل البيانات المحفوظة محلياً إذا لم يكن هناك متجر موجود
          loadLocalData();
          setLoadingState({
            isLoading: false,
            hasError: false,
            isOffline: false,
            retryCount: 0,
          });
        }
      } catch (error) {
        console.error("خطأ في تحميل بيانات المتجر:", error);

        // عرض رسالة للمستخدم في حالة عدم وج��د اتصال أو مشكلة في المص��دقة
        if (
          error.message?.includes("Failed to fetch") ||
          error.message?.includes("TypeError")
        ) {
          // تجاهل الخطأ واستخدم البيانات المحلية
          console.log("استخدام البيانات المحفوظة محلياً...");
          toast({
            title: "وضع غير متصل",
            description:
              "تم تحميل البيانات المحفوظة محلياً. ستتم مزامنة التغييرات عند استعادة الاتصال.",
            variant: "default",
          });
        }

        // الرجوع للبيانات المحفوظة محلياً في حالة الخطأ
        loadLocalData();
      }
    };

    loadStoreData();
  }, [user?.id]);

  // Store Settings State - فارغة للتجار ��لجدد
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: isNewMerchant
      ? user?.profile?.businessName || ""
      : "متجر الخير السوداني",
    description: isNewMerchant
      ? ""
      : "متجر متخصص في بيع المنتجات السود��نية الأصيلة والطبيعية من عطور وأطعمة وحرف يدوية",
    category: isNewMerchant ? "" : "مواد غذائية وعطور",
    storeType: isNewMerchant ? "" : "restaurant",
    phone: isNewMerchant ? user?.profile?.phone || "" : "+249123456789",
    email: isNewMerchant ? user?.email || "" : "store@example.com",
    address: isNewMerchant ? "" : "شارع النيل�� الخرطوم",
    city: isNewMerchant ? user?.profile?.city || "" : "الخرطوم",
    workingHours: {
      start: isNewMerchant ? "09:00" : "09:00",
      end: isNewMerchant ? "17:00" : "22:00",
      days: isNewMerchant
        ? []
        : ["الس��ت", "الأحد", "الاثنين", "ا��ثلاثا��", "الأربعاء", "الخميس"],
    },
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
  });

  // Notification Settings State - إع��ادات افتراضية للتجار الجدد
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

  // Shipping Settings State - قيم افتراضية للتجار ال��دد
  const [shipping, setShipping] = useState<ShippingSettings>({
    freeShippingThreshold: isNewMerchant ? 100 : 200,
    standardShippingCost: isNewMerchant ? 15 : 25,
    expressShippingCost: isNewMerchant ? 30 : 50,
    processingTime: isNewMerchant ? "30" : "45",
    shippingAreas: isNewMerchant
      ? []
      : ["الخرطوم", "أمدرمان", "بحري", "مدني", "����سلا"],
  });

  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    loginNotifications: true,
  });

  // Delivery Drivers State
  const [deliveryDrivers, setDeliveryDrivers] = useState<DeliveryDriver[]>(
    isNewMerchant
      ? []
      : [
          {
            id: "driver1",
            name: "أحمد محمد الطيب",
            phone: "+966501234567",
            area: "ال��ياض",
            rating: 4.8,
            isActive: true,
            vehicle: "سيارة صالون",
            speciality: ["طلبات سريعة", "أطعمة"],
          },
          {
            id: "driver2",
            name: "فاطمة ��بدالله",
            phone: "+971501234567",
            area: "دبي",
            rating: 4.9,
            isActive: true,
            vehicle: "دراجة نارية",
            speciality: ["طلبات صغيرة", "مستن��ات"],
          },
          {
            id: "driver3",
            name: "��ثمان عبدالرحمن",
            phone: "+96550123456",
            area: "ال��ويت",
            rating: 4.7,
            isActive: true,
            vehicle: "شاحنة صغيرة",
            speciality: ["طلبات كبيرة", "أثاث"],
          },
        ],
  );

  // Tracking Settings
  const [trackingSettings, setTrackingSettings] = useState({
    trackingEnabled: !isNewMerchant,
    autoAssignDrivers: !isNewMerchant,
    realTimeUpdates: !isNewMerchant,
    customerNotifications: !isNewMerchant,
  });

  // حالة تحميل البيانات
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    hasError: false,
    isOffline: false,
    retryCount: 0,
  });

  // دالة لفتح الواتساب
  const openWhatsApp = (phone: string, driverName: string) => {
    const message = encodeURIComponent(
      `��لسلام عليكم ${driverName}، أريد التواصل معك بخصوص توصيل طلب من متجر ${storeSettings.storeName}.`,
    );
    const whatsappUrl = `https://wa.me/${phone.replace("+", "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  // دالة لتتبع الطلب
  const trackOrder = (orderId: string, driverPhone: string) => {
    const message = encodeURIComponent(
      `مرحباً، أريد متابعة حالة الطلب رقم: ${orderId}`,
    );
    const whatsappUrl = `https://wa.me/${driverPhone.replace("+", "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  // معالجة تغ��ير الشعار
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع المل��
      if (!file.type.startsWith("image/")) {
        alert("يرجى اختيا�� ملف صورة صالح (PNG, JPG, JPEG)");
        return;
      }

      // التحقق من حجم الملف (أقل من 5 ميجابايت)
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
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

      // التحق�� م�� حجم الملف (أقل من 10 م��جابايت)
      if (file.size > 10 * 1024 * 1024) {
        alert("حجم ال��و��ة يجب أن يكون أقل من 10 ميجابايت");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const bannerUrl = e.target?.result as string;
        setStoreSettings({ ...storeSettings, banner: bannerUrl });
        alert("تم تحديث غلاف المتجر بنجاح! 🎨");
      };
      reader.onerror = () => {
        alert("فشل في قراءة الصورة. يرجى المحاولة مرة أخرى.");
      };
      reader.readAsDataURL(file);
    }
  };

  // حذف الشعار
  const handleRemoveLogo = () => {
    if (window.confirm("هل أنت متأكد من حذف شعار الم��جر؟")) {
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
    // التحقق من تسجيل الدخول
    if (!user) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }

    if (user.role !== "merchant") {
      alert("يجب أن تكون تاجراً لحفظ إعدادات المتجر");
      return;
    }

    // التحقق من وجود رمز المصادقة
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى");
      return;
    }

    console.log("🔐 Authentication check passed:", {
      userId: user.id,
      userRole: user.role,
      hasToken: !!token
    });

    // التحقق من صحة البي��نا��
    if (!storeSettings.storeName.trim()) {
      alert("يرجى إدخ��ل اسم المتجر");
      return;
    }

    if (!storeSettings.category) {
      alert("يرجى اختيار فئة المتجر");
      return;
    }

    if (!storeSettings.storeType) {
      alert("يرجى اختيار نوع المتجر");
      return;
    }

    if (!storeSettings.phone.trim()) {
      alert("يرجى إدخا�� رقم اله��تف");
      return;
    }

    if (!storeSettings.email.trim()) {
      alert("يرجى إدخ��ل ا���بريد ا��إلكتروني");
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
        name: storeSettings.storeName.trim(),
        description: storeSettings.description.trim(),
        category: storeSettings.category.trim(),
        storeType: storeSettings.storeType.trim(),
        phone: storeSettings.phone.trim(),
        email: storeSettings.email.trim(),
        address: storeSettings.address.trim(),
        city: storeSettings.city.trim(),
        country: selectedCountry.trim(),
        workingHours: storeSettings.workingHours,
        logo: storeSettings.logo,
        banner: storeSettings.banner,
        notificationSettings: notifications,
        shippingSettings: shipping,
      };

      // التحقق من البيانات قبل الإرسال
      console.log("Store data being sent:", storeData);

      // التأكد من أن جميع ال��قول المطلوبة موجودة
      const requiredFields = ['name', 'category', 'phone', 'email', 'city'];
      const missingFields = requiredFields.filter(field => {
        const value = storeData[field];
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (missingFields.length > 0) {
        throw new Error(`الحقول التالية مطلوبة: ${missingFields.join(', ')}`);
      }

      // البحث عن متجر موجود للمستخدم أولاً
      try {
        const userStores = await ApiService.getStores();
        const existingStore = userStores.find(
          (store) => store.merchantId === user?.id,
        );

        if (existingStore) {
          // تحديث متجر موجود
          console.log("🔄 Updating existing store:", existingStore.id);
          await ApiService.updateStore(existingStore.id, storeData);
        } else {
          // إنشاء متجر جديد
          console.log("➕ Creating new store");
          await ApiService.createStore(storeData);
        }
      } catch (apiError: any) {
        // إذا فشل API، نستخدم ��لتخزين المحلي كنس��ة احتياطية
        // طباعة تفاصيل الخطأ للتشخيص
        console.error("API Error details:", {
          message: apiError.message,
          error: apiError,
          status: apiError.status,
          errorData: apiError.errorData,
          storeData: storeData
        });

        // Log the full error object for debugging
        console.error("Full API Error:", JSON.stringify(apiError, null, 2));

        // Check for specific error conditions
        if (apiError.message.includes("لديك متجر بنفس الاسم بالفعل")) {
          throw new Error("لديك متجر بنفس الاسم بالفعل. يرجى اختيار اسم مختلف للمتجر.");
        }

        // If it's a validation error, don't save locally - show the error
        if (apiError.status === 400 && apiError.errorData?.error) {
          throw new Error(apiError.errorData.error);
        }

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
        "🎉 تم حفظ إعدادات المتجر بنجاح!\n\nتم تحديث جميع البيانات والإعدادات ا��خاصة بمتجرك.",
      );
    } catch (error) {
      alert(
        "❌ حدث خطأ أثناء حفظ الإعدا��ات.\n\nيرجى ��لتحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
      );
      console.error("خطأ في حفظ الإعدادات:", {
        message: error.message,
        stack: error.stack,
        storeSettings,
        selectedCountry
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "store", label: "بيانات الم��جر", icon: Store },
    { id: "notifications", label: "الإشعارا��", icon: Bell },
    { id: "shipping", label: "الشحن والتوصيل", icon: Truck },
    { id: "account", label: "الحساب والأمان", icon: Shield },
  ];

  // أنواع المتاجر المحددة مسبقاً (يمكن تعديلها من قبل الإدارة)
  const predefinedCategories = [
    "مواد غذائ��ة وأطعمة",
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
    "ال����حد",
    "الاثنين",
    "الثلاثاء",
    "��لأربعاء",
    "الخميس",
    "الجمعة",
  ];

  // قائمة ال��ول والمدن التابعة لها
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
    "ا��مملكة العربية السعودية": [
      "الرياض",
      "جدة",
      "الدمام",
      "��كة المكرمة",
      "المدينة المنورة",
      "الطائف",
      "الخبر",
      "الأحساء",
      "تبوك",
      "أبها",
      "جا��ان",
      "نجران",
    ],
    "الإمارات العربية المتحدة": [
      "��بي",
      "أبوظبي",
      "الشارقة",
      "عجمان",
      "��أس الخيمة",
      "الفجيرة",
      "أم القيوين",
    ],
    "دولة الكويت": [
      "مدينة الكويت",
      "الأحمدي",
      "الجهراء",
      "��بارك الكبير",
      "الفروانية",
      "حولي",
    ],
    "دولة قطر": ["الدوحة", "الريان", "الوكرة", "أ�� صلال", "الخور", "الشمال"],
    "م��لكة البحرين": ["ا��منامة", "المحرق", "الرفاع", "حمد", "عيسى", "جدحفص"],
    "سلطنة عُمان": ["مسقط", "صلالة", "نزوى", "صور", "الرست��ق", "صحار"],
    "جمهورية مصر العربية": [
      "القاهرة",
      "ال��س��ندرية",
      "الجيزة",
      "الأقصر",
      "أسوان",
      "بورسعيد",
      "السويس",
    ],
    "المملكة الأردنية ال��اشمية": [
      "عمان",
      "إربد",
      "الزرقاء",
      "العقبة",
      "السلط",
      "مادبا",
    ],
  };

  // إ��افة حالات جديدة
  const [selectedCountry, setSelectedCountry] = useState<string>(
    isNewMerchant ? user?.profile?.country || "السودان" : "الس��دان",
  );
  const [customCategory, setCustomCategory] = useState<string>("");
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);

  // إدارة ا��مناطق من النظام الإداري
  const {
    regions: availableRegions,
    isLoading: regionsLoading,
    hasRegions,
  } = useRegions();

  // دال�� لمعا��جة تغيير نوع المتجر
  const handleCategoryChange = (value: string) => {
    if (value === "أخرى (حدد النوع)") {
      setShowCustomCategory(true);
      setStoreSettings({ ...storeSettings, category: "" });
    } else {
      setShowCustomCategory(false);
      setStoreSettings({ ...storeSettings, category: value });
    }
  };

  // دالة لمعالجة تغي��ر الدولة
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    // إعادة تعيين المدينة عند تغيير الدولة
    setStoreSettings({
      ...storeSettings,
      city: "",
    });

    // تحديث العملة حس�� الدولة المختارة
    updateCurrencyByCountry(country);

    // إظهار رسالة تأكيد للمستخدم
    toast({
      title: "تم تحديث العملة",
      description: `تم تحديث عملة المتجر لتتناسب مع ${country}`,
    });
  };

  // عرض loading عند الت��ميل الأ��لي
  if (loadingState.isLoading && !loadingState.isOffline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow-lg rounded-xl text-white bg-gradient-to-r from-primary-500 to-secondary-500">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            جاري تحميل بيانات المتجر...
          </div>
          <p className="mt-4 text-gray-600 arabic">
            يتم تحميل إعدادات ��تجرك، يرجى الانت��ار...
          </p>
        </div>
      </div>
    );
  }

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
                  إ��دادات المتجر
                </h1>
                <p className="text-gray-600 arabic">
                  إدارة معلومات وإعدادات متجرك
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
        {/* Connection Status Banner */}
        {loadingState.isOffline && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full ml-3 animate-pulse"></div>
                <div>
                  <span className="text-sm font-medium text-yellow-800 arabic">
                    وضع غير متصل
                  </span>
                  <p className="text-xs text-yellow-700 arabic mt-1">
                    تعمل بالبيانات المحفوظة محلياً. ستتم مزامنة التغييرات عند
                    استعادة الاتصال.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.reload()}
                className="text-xs arabic"
              >
                🔄 إعادة الاتصال
              </Button>
            </div>
          </div>
        )}

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
                              alt="غلا�� المت��ر"
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
                                ��ذف
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
                            placeholder="حدد نوع متجرك (مثال: صيدلية، محل حلويات، ورشة ��صليح)"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Store Type */}
                  <div>
                    <Label htmlFor="storeType" className="arabic">
                      نوع المتجر
                    </Label>
                    <select
                      id="storeType"
                      value={storeSettings.storeType}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          storeType: e.target.value,
                        })
                      }
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-right arabic"
                    >
                      <option value="">اختر نوع المتجر</option>
                      <option value="restaurant">مطعم</option>
                      <option value="company">شركة</option>
                      <option value="store">متجر عا��</option>
                      <option value="service">خدمات</option>
                      <option value="pharmacy">صيدلية</option>
                      <option value="supermarket">سوبر ماركت</option>
                      <option value="bakery">مخبز/حلويات</option>
                      <option value="electronics">إلكترونيات</option>
                      <option value="clothing">ملابس</option>
                      <option value="beauty">تجميل وعناية</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1 arabic">
                      يحدد نوع المت��ر مكان ظهوره في الموقع (صفحة المطاعم،
                      الشركات، أو المت��جر)
                    </p>
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
                      placeholder="اكتب وصفاً مختصراً عن متج��ك ��منتجات��..."
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
                        <option value="">��ختر المدينة</option>
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
                        placeholder="شارع ال��يل، الخرطوم"
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
                <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b">
                  <CardTitle className="arabic text-right flex items-center text-xl font-bold text-primary-700">
                    <div className="bg-primary-100 p-2 rounded-lg ml-3">
                      <Bell className="w-5 h-5 text-primary-600" />
                    </div>
                    إعدادات الإشعارات
                  </CardTitle>
                  <p className="text-sm text-gray-600 arabic text-right mt-2">
                    تحكم في إشعاراتك واختر الطريقة المناسبة لتل����ي التحديثات
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Notifications */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-2 rounded-lg ml-3">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 arabic text-lg">
                          إشعارات الطلب��ت
                        </h3>
                        <p className="text-sm text-gray-600 arabic">
                          تلقى تحديثات حول طلباتك ومبيعاتك
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          key: "newOrders",
                          label: "طلبات جديدة",
                          desc: "إشعارات عند وصول طلبات جديدة",
                          icon: "🛒",
                          color:
                            "bg-green-50 border-green-200 hover:bg-green-100",
                        },
                        {
                          key: "orderUpdates",
                          label: "تحديثات الطلبات",
                          desc: "إشعارات عند تغيير حالة الطل��ات",
                          icon: "📦",
                          color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
                        },
                        {
                          key: "paymentReceived",
                          label: "استلام الدفعات",
                          desc: "إشعارات عند استلام المدفوعات",
                          icon: "💰",
                          color:
                            "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${item.color} ${isRTL ? "flex-row-reverse" : "flex-row"} flex items-center justify-between`}
                        >
                          <div
                            className={`flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <div className="text-2xl ml-3">{item.icon}</div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <div className="font-semibold arabic text-gray-900">
                                {item.label}
                              </div>
                              <div className="text-sm text-gray-600 arabic mt-1">
                                {item.desc}
                              </div>
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
                            className="data-[state=checked]:bg-primary-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inventory Notifications */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center mb-6">
                      <div className="bg-orange-100 p-2 rounded-lg ml-3">
                        <Package className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 arabic text-lg">
                          إشعارات المخزون
                        </h3>
                        <p className="text-sm text-gray-600 arabic">
                          تنبيهات حول مستوى المخزون والمراجعات
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          key: "lowStock",
                          label: "نفاد المخزون",
                          desc: "تنبيه عند انخفاض كمية المنتجات",
                          icon: "⚠️",
                          color: "bg-red-50 border-red-200 hover:bg-red-100",
                        },
                        {
                          key: "reviews",
                          label: "المراجعات الجديدة",
                          desc: "إشعارات عند وصول مراجعات جديدة",
                          icon: "⭐",
                          color:
                            "bg-purple-50 border-purple-200 hover:bg-purple-100",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${item.color} ${isRTL ? "flex-row-reverse" : "flex-row"} flex items-center justify-between`}
                        >
                          <div
                            className={`flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <div className="text-2xl ml-3">{item.icon}</div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <div className="font-semibold arabic text-gray-900">
                                {item.label}
                              </div>
                              <div className="text-sm text-gray-600 arabic mt-1">
                                {item.desc}
                              </div>
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
                            className="data-[state=checked]:bg-primary-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification Methods */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-6">
                      <div className="bg-green-100 p-2 rounded-lg ml-3">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 arabic text-lg">
                          طرق الإشعار
                        </h3>
                        <p className="text-sm text-gray-600 arabic">
                          اختر كيفية تلقي الإ��عارات
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          key: "smsNotifications",
                          label: "رسائل SMS",
                          desc: "استقبال الإشعارات عبر الرسائل النصية",
                          icon: "📱",
                          color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
                        },
                        {
                          key: "emailNotifications",
                          label: "البريد الإلكتروني",
                          desc: "استقبال ا��إشعارات عبر ا��بريد الإلكتروني",
                          icon: "📧",
                          color:
                            "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${item.color} ${isRTL ? "flex-row-reverse" : "flex-row"} flex items-center justify-between`}
                        >
                          <div
                            className={`flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <div className="text-2xl ml-3">{item.icon}</div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <div className="font-semibold arabic text-gray-900">
                                {item.label}
                              </div>
                              <div className="text-sm text-gray-600 arabic mt-1">
                                {item.desc}
                              </div>
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
                            className="data-[state=checked]:bg-primary-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <h3 className="font-bold arabic text-lg mb-1">
                          حفظ الإعدادات
                        </h3>
                        <p className="text-primary-100 arabic text-sm">
                          تأكد من حفظ تغ��يراتك
                        </p>
                      </div>
                      <Button
                        size="lg"
                        className="bg-white text-primary-600 hover:bg-gray-50 font-bold arabic px-8 shadow-lg"
                        onClick={() => {
                          // Handle save notifications
                          toast({
                            title: "تم الحفظ",
                            description: "تم حفظ إعدادات الإشعارات بنجاح",
                          });
                        }}
                      >
                        💾 حفظ التغييرات
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Tab */}
            {activeTab === "shipping" && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <CardTitle className="arabic text-right flex items-center text-xl font-bold text-gray-800">
                    <div className="flex items-center ml-3 bg-primary/10 p-2 rounded-lg">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    إعدادات الشحن والتوصيل
                  </CardTitle>
                  <p className="text-gray-600 arabic text-sm text-right mt-2">
                    قم بتخصيص أسعار الشحن وأوقات التحضير لمتجرك
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Shipping Costs */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">
                      ��كاليف الشحن
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="group">
                        <Label
                          htmlFor="freeShipping"
                          className="arabic font-semibold text-gray-700 mb-2 block"
                        >
                          الشحن المجاني عند
                        </Label>
                        <div className="relative">
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
                            className="text-right pl-12 pr-4 h-12 border-2 border-gray-200 focus:border-primary transition-colors group-hover:border-gray-300"
                            placeholder="أدخل المبلغ"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                            <span className="text-gray-500 font-medium">
                              جنيه
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 arabic mt-2">
                          عند تجاوز هذا المبلغ س��كون الشحن مجاني
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="standardShipping" className="arabic">
                          الش��ن العادي
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
                      مدة تحضير الطلب (بالدقائق)
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                        id="processingTime"
                        type="number"
                        value={shipping.processingTime}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            processingTime: e.target.value,
                          })
                        }
                        className="text-right"
                        placeholder="مثال: 30"
                        min="5"
                        max="480"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        دقيقة
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 arabic mt-1">
                      ����لحد الأدنى: 5 دقائق - الحد الأقصى: 8 ساعات (480 دقيقة)
                    </p>
                  </div>

                  <Separator />

                  {/* Shipping Areas - مخفي حسب طلب المستخدم */}
                  <div className="hidden">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="arabic">مناطق ال����وصيل</Label>
                      <div className="text-xs text-gray-500 arabic">
                        {regionsLoading
                          ? "جارٍ التحميل..."
                          : `(${availableRegions.length} منطقة متاحة)`}
                      </div>
                    </div>

                    {regionsLoading ? (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <RefreshCw className="w-8 h-8 mx-auto mb-2 text-gray-300 animate-spin" />
                        <p className="arabic text-sm">جارٍ تحميل المناطق...</p>
                      </div>
                    ) : !hasRegions ? (
                      <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                        <p className="arabic text-sm text-orange-600 font-medium">
                          لا توجد مناطق متاحة حالياً
                        </p>
                        <p className="arabic text-xs text-orange-500 mt-1">
                          يجب على مدير النظام إضافة مناطق التوصيل أولاً
                        </p>
                        <p className="arabic text-xs text-orange-500">
                          تواصل مع الدعم الفني لإضافة مناطق جديدة
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableRegions.map((area) => (
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
                    )}

                    {availableRegions.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <p className="text-sm text-blue-700 arabic">
                            المناطق المتاحة يديرها مدير النظام. للتواصل حول
                            ��ضافة منطقة جديدة تواصل مع الدعم الفني.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Delivery Drivers Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg ml-3">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 arabic text-lg">
                            السائ��ون ومؤسسات التوصيل
                          </h3>
                          <p className="text-sm text-gray-600 arabic">
                            إدارة شبكة السائقي�� المتاحين لتوصيل طلباتك
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="arabic"
                        onClick={() => {
                          const newDriver: DeliveryDriver = {
                            id: `driver${Date.now()}`,
                            name: "سائق جديد",
                            phone: "+966500000000",
                            area: "منطقة جدي��ة",
                            rating: 0,
                            isActive: false,
                            vehicle: "سي��رة",
                            speciality: [],
                          };
                          setDeliveryDrivers([...deliveryDrivers, newDriver]);
                        }}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة سائق
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {deliveryDrivers.map((driver) => (
                        <div
                          key={driver.id}
                          className={`bg-white p-4 rounded-lg border-2 transition-all duration-200 ${
                            driver.isActive
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  driver.isActive
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <Car className="w-5 h-5" />
                              </div>
                              <div className="mr-3">
                                <h4 className="font-semibold arabic text-sm">
                                  {driver.name}
                                </h4>
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-500 ml-1" />
                                  <span className="text-xs text-gray-600">
                                    {driver.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className={`w-3 h-3 rounded-full ${
                                driver.isActive ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-xs text-gray-600">
                              <MapPin className="w-3 h-3 ml-1" />
                              <span className="arabic">{driver.area}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Car className="w-3 h-3 ml-1" />
                              <span className="arabic">{driver.vehicle}</span>
                            </div>
                            {driver.speciality.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {driver.speciality.map((spec, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full arabic"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 arabic text-xs"
                              onClick={() =>
                                openWhatsApp(driver.phone, driver.name)
                              }
                            >
                              📱 وا��ساب
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 arabic text-xs"
                              onClick={() => trackOrder("ORD123", driver.phone)}
                            >
                              📍 تتبع
                            </Button>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500 arabic text-center">
                              {driver.phone}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Tracking & Automation Settings */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-6">
                      <div className="bg-purple-100 p-2 rounded-lg ml-3">
                        <Navigation className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 arabic text-lg">
                          إعدادات التتبع والأتمتة
                        </h3>
                        <p className="text-sm text-gray-600 arabic">
                          تف��يل خيارات التت��ع المباشر وتوزيع الطلبات التلقائي
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          key: "trackingEnabled",
                          title: "تتبع الطلبات المباشر",
                          desc: "تمكين العملاء من تتبع طلباتهم مباشرة",
                          icon: "🗺️",
                        },
                        {
                          key: "autoAssignDrivers",
                          title: "توز��ع تلقائي للطلبات",
                          desc: "توزيع الطلبات ��لقائياً على أقرب سائق متاح",
                          icon: "🤖",
                        },
                        {
                          key: "realTimeUpdates",
                          title: "التحديثات المباشرة",
                          desc: "إرسال تحديثات مباشرة عن حالة التوصيل",
                          icon: "⚡",
                        },
                        {
                          key: "customerNotifications",
                          title: "إشعارات العملاء",
                          desc: "إشعار العملا�� عند ��ل مرحلة من التوصيل",
                          icon: "🔔",
                        },
                      ].map((setting) => (
                        <div
                          key={setting.key}
                          className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-2xl ml-3">
                                {setting.icon}
                              </div>
                              <div>
                                <div className="font-semibold arabic text-sm">
                                  {setting.title}
                                </div>
                                <div className="text-xs text-gray-600 arabic mt-1">
                                  {setting.desc}
                                </div>
                              </div>
                            </div>
                            <Switch
                              checked={
                                trackingSettings[
                                  setting.key as keyof typeof trackingSettings
                                ]
                              }
                              onCheckedChange={(checked) =>
                                setTrackingSettings({
                                  ...trackingSettings,
                                  [setting.key]: checked,
                                })
                              }
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Integration Info */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-lg ml-3">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 arabic text-lg">
                          تكامل الواتساب للتوصيل
                        </h3>
                        <p className="text-sm text-gray-600 arabic">
                          تواصل مبا��ر مع السائقين وتتبع الطلبات عبر الواتساب
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <h4 className="font-semibold arabic text-sm mb-2">
                            ��واصل ف��ري
                          </h4>
                          <p className="text-xs text-gray-600 arabic">
                            تواصل مع السائقين مباشرة عبر الواتساب
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📍</div>
                          <h4 className="font-semibold arabic text-sm mb-2">
                            تتبع مباشر
                          </h4>
                          <p className="text-xs text-gray-600 arabic">
                            تتبع موقع الطلب والحصول على تحديثات فورية
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="text-center">
                          <div className="text-2xl mb-2">���</div>
                          <h4 className="font-semibold arabic text-sm mb-2">
                            توصيل سريع
                          </h4>
                          <p className="text-xs text-gray-600 arabic">
                            شبكة واسعة من ال��ائقين لضمان التوصيل السريع
                          </p>
                        </div>
                      </div>
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
                          كلم�� المرور الحالية
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
                            المصادق�� الثنائية
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
                            ت��بيه عند ��سجيل دخول جديد
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
