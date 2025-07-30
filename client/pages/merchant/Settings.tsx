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
  RefreshCw
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface StoreSettings {
  storeName: string;
  description: string;
  category: string;
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

  // Store Settings State - فارغة للتجار الجدد
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: isNewMerchant ? (user?.profile?.businessName || "") : "متجر الخير السوداني",
    description: isNewMerchant ? "" : "متجر متخصص في بيع المنتجات السودانية الأصيلة والطبيعية من عطور وأطعمة وحرف يدوية",
    category: isNewMerchant ? "" : "مواد غذائية وعطور",
    phone: isNewMerchant ? (user?.profile?.phone || "") : "+966501234567",
    email: isNewMerchant ? (user?.email || "") : "store@alkhair-sudani.com",
    address: isNewMerchant ? "" : "شارع الملك فهد، حي النرجس",
    city: isNewMerchant ? (user?.profile?.city || "") : "الرياض، المملكة العربية السعودية",
    workingHours: {
      start: isNewMerchant ? "09:00" : "09:00",
      end: isNewMerchant ? "17:00" : "22:00",
      days: isNewMerchant ? [] : ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"]
    },
    logo: "/placeholder.svg",
    banner: "/placeholder.svg"
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
    emailNotifications: true
  });

  // Shipping Settings State - قيم افتراضية للتجار الجدد
  const [shipping, setShipping] = useState<ShippingSettings>({
    freeShippingThreshold: isNewMerchant ? 100 : 200,
    standardShippingCost: isNewMerchant ? 15 : 25,
    expressShippingCost: isNewMerchant ? 30 : 50,
    processingTime: isNewMerchant ? "1-3 أيام عمل" : "1-2 أيام عمل",
    shippingAreas: isNewMerchant ? [] : ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة"]
  });

  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    loginNotifications: true
  });

  // معالجة تغيير الشعار
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
      }

      // التحقق من حجم الملف (أقل من 5 ميجابايت)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setStoreSettings({...storeSettings, logo: logoUrl});
      };
      reader.readAsDataURL(file);
    }
  };

  // معالجة تغيير الغلاف
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
      }

      // التحقق من حجم الملف (أقل من 10 ميجابايت)
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 10 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const bannerUrl = e.target?.result as string;
        setStoreSettings({...storeSettings, banner: bannerUrl});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    
    // Show success message
    alert("تم حفظ الإعدادات بنجاح! ✅");
  };

  const tabs = [
    { id: "store", label: "بيانات المتجر", icon: Store },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "shipping", label: "الشحن والتوصيل", icon: Truck },
    { id: "account", label: "الحساب والأمان", icon: Shield }
  ];

  const categories = [
    "مواد غذائية وعطور",
    "ملابس وأقمشة",
    "حرف يدوية",
    "مستحضرات تجميل",
    "أدوات منزلية",
    "كتب ومواد ثقافية",
    "إلكترونيات",
    "رياضة وترفيه"
  ];

  const cities = [
    "الرياض�� المملكة العربية السعودية",
    "جدة، المملكة العربية السعودية", 
    "الدمام، المملكة العربية السعودية",
    "مكة المكرمة، المملكة العربية السعودية",
    "المدينة المنورة، المملكة العربية السعودية",
    "الطائف، المملكة العربية السعودية",
    "الخبر، المملكة العربية السعودية",
    "الأحساء، المملكة العربية السعودية"
  ];

  const workingDays = [
    "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex items-center space-x-4 space-x-reverse ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Link to="/merchant/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  {t('common.back')}
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 arabic">إعدادات المتجر</h1>
                <p className="text-gray-600 arabic">إدارة معلومات وإعدادات متجرك</p>
              </div>
            </div>
            <Badge variant="secondary" className="arabic">متجر</Badge>
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
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'text-gray-600 hover:bg-gray-100'
                      } ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
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
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Store className="w-8 h-8 text-gray-400" />
                        </div>
                        <Button variant="outline" size="sm" className="arabic">
                          <Camera className="w-4 h-4 ml-2" />
                          تغيير الشعار
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="arabic">غلاف المتجر</Label>
                      <div className="mt-2 flex items-center space-x-4 space-x-reverse">
                        <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <Button variant="outline" size="sm" className="arabic">
                          <Camera className="w-4 h-4 ml-2" />
                          تغيير الغلاف
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="storeName" className="arabic">اسم المتجر</Label>
                      <Input
                        id="storeName"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                        className="mt-1 text-right arabic"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="arabic">��ئة المتجر</Label>
                      <select
                        id="category"
                        value={storeSettings.category}
                        onChange={(e) => setStoreSettings({...storeSettings, category: e.target.value})}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-right arabic"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="arabic">وصف المتجر</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={storeSettings.description}
                      onChange={(e) => setStoreSettings({...storeSettings, description: e.target.value})}
                      className="mt-1 text-right arabic"
                      placeholder="اكتب وصفاً مختصراً عن متجرك ومنتجاتك..."
                    />
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="arabic">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                        className="mt-1 text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="arabic">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                        className="mt-1 text-right"
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="address" className="arabic">عنوان المتجر</Label>
                      <Input
                        id="address"
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                        className="mt-1 text-right arabic"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="arabic">المدينة</Label>
                      <select
                        id="city"
                        value={storeSettings.city}
                        onChange={(e) => setStoreSettings({...storeSettings, city: e.target.value})}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-right arabic"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
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
                          onChange={(e) => setStoreSettings({
                            ...storeSettings, 
                            workingHours: {...storeSettings.workingHours, start: e.target.value}
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="arabic text-sm">إلى الساعة</Label>
                        <Input
                          type="time"
                          value={storeSettings.workingHours.end}
                          onChange={(e) => setStoreSettings({
                            ...storeSettings, 
                            workingHours: {...storeSettings.workingHours, end: e.target.value}
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="arabic text-sm">أيام العمل</Label>
                        <div className="mt-1 space-y-1">
                          {workingDays.map((day) => (
                            <label key={day} className={`flex items-center space-x-2 space-x-reverse ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                              <input
                                type="checkbox"
                                checked={storeSettings.workingHours.days.includes(day)}
                                onChange={(e) => {
                                  const newDays = e.target.checked 
                                    ? [...storeSettings.workingHours.days, day]
                                    : storeSettings.workingHours.days.filter(d => d !== day);
                                  setStoreSettings({
                                    ...storeSettings,
                                    workingHours: {...storeSettings.workingHours, days: newDays}
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
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">إشعارات الطلبات</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'newOrders', label: 'طلبات جديدة', desc: 'اشعارات عند وصول طلبات جديدة' },
                        { key: 'orderUpdates', label: 'تحديثات الطلبات', desc: 'اشعارات عند تغيير حالة الطلبات' },
                        { key: 'paymentReceived', label: 'استلام الدفعات', desc: 'اشعارات عند استلام المدفوعات' }
                      ].map((item) => (
                        <div key={item.key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="font-medium arabic">{item.label}</div>
                            <div className="text-sm text-gray-600 arabic">{item.desc}</div>
                          </div>
                          <Switch
                            checked={notifications[item.key as keyof NotificationSettings]}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, [item.key]: checked})
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Inventory Notifications */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">إشعارات المخزون</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'lowStock', label: 'نفاد المخزون', desc: 'تنبيه عند انخفاض كمية المنتجات' },
                        { key: 'reviews', label: 'المراجعات الجديدة', desc: 'اشعارات عند وصول مراجعات جديدة' }
                      ].map((item) => (
                        <div key={item.key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="font-medium arabic">{item.label}</div>
                            <div className="text-sm text-gray-600 arabic">{item.desc}</div>
                          </div>
                          <Switch
                            checked={notifications[item.key as keyof NotificationSettings]}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, [item.key]: checked})
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Notification Methods */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">طرق الإشعار</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'smsNotifications', label: 'رسائل SMS', desc: 'استقبال الإشعارات عبر الرسائل النصية' },
                        { key: 'emailNotifications', label: 'البريد الإلكتروني', desc: 'استقبال الإش���ارات عبر البريد الإلكتروني' }
                      ].map((item) => (
                        <div key={item.key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="font-medium arabic">{item.label}</div>
                            <div className="text-sm text-gray-600 arabic">{item.desc}</div>
                          </div>
                          <Switch
                            checked={notifications[item.key as keyof NotificationSettings]}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, [item.key]: checked})
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
                    إ����دادات الشحن والتوصيل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Costs */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">تكاليف الشحن</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="freeShipping" className="arabic">الشحن المجاني عند</Label>
                        <div className="mt-1 relative">
                          <Input
                            id="freeShipping"
                            type="number"
                            value={shipping.freeShippingThreshold}
                            onChange={(e) => setShipping({...shipping, freeShippingThreshold: Number(e.target.value)})}
                            className="text-right"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ر.س</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="standardShipping" className="arabic">الشحن العادي</Label>
                        <div className="mt-1 relative">
                          <Input
                            id="standardShipping"
                            type="number"
                            value={shipping.standardShippingCost}
                            onChange={(e) => setShipping({...shipping, standardShippingCost: Number(e.target.value)})}
                            className="text-right"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ر.س</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="expressShipping" className="arabic">الشحن السريع</Label>
                        <div className="mt-1 relative">
                          <Input
                            id="expressShipping"
                            type="number"
                            value={shipping.expressShippingCost}
                            onChange={(e) => setShipping({...shipping, expressShippingCost: Number(e.target.value)})}
                            className="text-right"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ر.س</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Processing Time */}
                  <div>
                    <Label htmlFor="processingTime" className="arabic">مدة تحضير الطلب</Label>
                    <Input
                      id="processingTime"
                      value={shipping.processingTime}
                      onChange={(e) => setShipping({...shipping, processingTime: e.target.value})}
                      className="mt-1 text-right arabic"
                      placeholder="مثال: 1-2 أيام عمل"
                    />
                  </div>

                  <Separator />

                  {/* Shipping Areas */}
                  <div>
                    <Label className="arabic">مناطق التوصيل</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "الطائف", "الخبر", "الأحساء", "تبوك", "أبها"].map((area) => (
                        <label key={area} className={`flex items-center space-x-2 space-x-reverse p-2 border rounded-lg hover:bg-gray-50 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <input
                            type="checkbox"
                            checked={shipping.shippingAreas.includes(area)}
                            onChange={(e) => {
                              const newAreas = e.target.checked 
                                ? [...shipping.shippingAreas, area]
                                : shipping.shippingAreas.filter(a => a !== area);
                              setShipping({...shipping, shippingAreas: newAreas});
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
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">معلومات الحساب</h3>
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
                          value={user?.profile?.email || ""}
                          disabled
                          className="mt-1 text-right bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Password Change */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">تغيير كلمة المرور</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword" className="arabic">كلمة المرور الحالية</Label>
                        <div className="mt-1 relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={accountSettings.currentPassword}
                            onChange={(e) => setAccountSettings({...accountSettings, currentPassword: e.target.value})}
                            className="text-right pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newPassword" className="arabic">كلمة المرور الجديدة</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={accountSettings.newPassword}
                            onChange={(e) => setAccountSettings({...accountSettings, newPassword: e.target.value})}
                            className="mt-1 text-right"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" className="arabic">تأكيد كلمة المرور</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={accountSettings.confirmPassword}
                            onChange={(e) => setAccountSettings({...accountSettings, confirmPassword: e.target.value})}
                            className="mt-1 text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Security Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 arabic">إعدادات الأمان</h3>
                    <div className="space-y-4">
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="font-medium arabic">المصادقة الثنائية</div>
                          <div className="text-sm text-gray-600 arabic">حماية إضافية لحسابك</div>
                        </div>
                        <Switch
                          checked={accountSettings.twoFactorAuth}
                          onCheckedChange={(checked) => 
                            setAccountSettings({...accountSettings, twoFactorAuth: checked})
                          }
                        />
                      </div>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="font-medium arabic">إشعارات تسجيل الدخول</div>
                          <div className="text-sm text-gray-600 arabic">تنبيه عند تسجيل دخول جديد</div>
                        </div>
                        <Switch
                          checked={accountSettings.loginNotifications}
                          onCheckedChange={(checked) => 
                            setAccountSettings({...accountSettings, loginNotifications: checked})
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
