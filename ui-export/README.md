# واجهات التطبيق - UI Export

هذا الملف يحتوي على جميع واجهات الصفحات والمكونات المستخدمة في التطبيق.

## محتويات المجلد:

### 📄 الصفحات الرئيسية

- `pages/Index.tsx` - الصفحة الرئيسية
- `pages/Login.tsx` - صفحة تسجيل الدخول
- `pages/Register.tsx` - صفحة التسجيل
- `pages/Profile.tsx` - صفحة الملف الشخصي
- `pages/Products.tsx` - صفحة المنتجات
- `pages/Services.tsx` - صفحة الخدمات
- `pages/Jobs.tsx` - صفحة الوظائف
- `pages/Companies.tsx` - صفحة الشركات
- `pages/Marketplace.tsx` - صفحة السوق
- `pages/Ads.tsx` - صفحة الإعلانات
- `pages/Restaurants.tsx` - صفحة المطاعم
- `pages/StoreDetails.tsx` - تفاصيل المتجر
- `pages/StoreVisit.tsx` - زيارة المتجر
- `pages/ThemeShowcase.tsx` - عرض الثيمات

### 👑 صفحات الإدارة (Admin)

- `pages/admin/Dashboard.tsx` - لوحة تحكم الإدارة
- `pages/admin/Users.tsx` - إدارة المستخدمين
- `pages/admin/Stores.tsx` - إدارة المتاجر
- `pages/admin/Content.tsx` - إدارة المحتوى
- `pages/admin/Settings.tsx` - إعدادات النظام
- `pages/admin/Appearance.tsx` - إعدادات المظهر
- `pages/admin/Activity.tsx` - سجل الأنشطة
- `pages/admin/System.tsx` - معلومات النظام
- `pages/admin/DatabaseTest.tsx` - اختبار قاعدة البيانات

### 🏪 صفحات التاجر (Merchant)

- `pages/merchant/Dashboard.tsx` - لوحة تحكم التاجر
- `pages/merchant/Products.tsx` - إدارة المنتجات
- `pages/merchant/NewProduct.tsx` - إضافة منتج جديد
- `pages/merchant/Orders.tsx` - إدارة الطلبات
- `pages/merchant/Analytics.tsx` - التحليلات والإحصائيات
- `pages/merchant/Settings.tsx` - إعدادات التاجر

### 🧩 المكونات الأساسية

- `components/Layout.tsx` - تخطيط الصفحة الأساسي
- `components/ThemeToggle.tsx` - تبديل الثيمات
- `components/ProtectedRoute.tsx` - حماية المسارات
- `components/MobileIntegration.tsx` - تكامل الموبايل
- `components/NotificationsSettings.tsx` - إعدادات الإشعارات

### 🎨 مكونات واجهة المستخدم (UI Components)

جميع مكونات واجهة المستخدم المتقدمة مبنية على Radix UI و TailwindCSS:

- أكورديون، تنبيهات، أزرار، بطاقات، قوائم منسدلة
- نماذج، جداول، تبويبات، وأكثر من 40 مكون

### ⚛️ السياقات (Contexts)

- `contexts/AuthContext.tsx` - سياق المصادقة
- `contexts/ThemeContext.tsx` - سياق الثيمات

### 🪝 الخطافات (Hooks)

- `hooks/use-mobile.tsx` - خطاف للأجهزة المحمولة
- `hooks/use-new-merchant.tsx` - خطاف للتجار الجدد
- `hooks/use-toast.ts` - خطاف للإشعارات

### 🎨 الملفات التصميمية

- `App.tsx` - التطبيق الرئيسي وإعداد المسارات
- `global.css` - الأنماط العامة والثيمات

## تقنيات مستخدمة:

- **React 18** مع TypeScript
- **React Router 6** للتنقل
- **TailwindCSS 3** للتصميم
- **Radix UI** للمكونات المتقدمة
- **Framer Motion** للحركات والانتقالات
- **دعم كامل للغة العربية** مع الخطوط المناسبة

## ملاحظات:

- جميع المكونات تدعم الوضع الليلي (Dark Mode)
- تصميم متجاوب لجميع الأجهزة
- دعم كامل للاتجاه من اليمين لليسار (RTL)
- مصمم خصيصاً للثقافة السودانية مع ألوان مستوحاة من التراث
