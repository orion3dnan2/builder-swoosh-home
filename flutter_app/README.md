# البيت السوداني - تطبيق Flutter

تطبيق جوال أصلي مبني بـ Flutter لسوق الخدمات والشركات السودانية في الخليج والعالم.

## الميزات الرئيسية

- ✅ تطبيق جوال أصلي (Native Mobile App)
- ✅ دعم كامل للغة العربية مع RTL
- ✅ نظام ألوان وثيم قابل للتخصيص
- ✅ إدارة حالة متقدمة باستخدام Riverpod
- ✅ تنقل سلس مع Go Router
- ✅ تصميم Material Design 3
- ✅ رسوم متحركة سلسة
- ✅ دعم الأوضاع الفاتحة والداكنة

## الصفحات المتوفرة

### صفحات عامة
- 🏠 **الصفحة الرئيسية** - عرض الخدمات والإ��صائيات
- 🛍️ **السوق** - تصفح المنتجات والخدمات
- 📦 **المنتجات** - كتالوج المنتجات
- 🏢 **الشركات** - دليل الشركات السودانية
- 💼 **الوظائف** - فرص العمل المتاحة
- 🛠️ **الخدمات** - خدمات متنوعة
- 📢 **الإعلانات** - إعلانات مبوبة

### صفحات المستخدم
- 👤 **الملف الشخصي** - معلومات المستخدم
- ⚙️ **الإعدادات** - تخصيص التطبيق
- 🔑 **تسجيل الدخول** - المصادقة
- 📝 **إنشاء حساب** - تسجيل جديد

### لوحة الإدارة
- 📊 **لوحة التحكم** - إحصائيات ومراقبة
- 👥 **إدارة المستخدمين** - تحكم في الحسابات
- 🏪 **إدارة المتاجر** - إدارة الشركات
- ⚙️ **إعدادات النظام** - تكوين التطبيق

### لوحة التاجر
- 📈 **لوحة التاجر** - إدارة الأعمال
- 📦 **إدارة المنتجات** - كتالوج المنتجات
- 📊 **التحليلات** - تقارير المبيعات

## متطلبات النظام

- Flutter SDK: >=3.13.0
- Dart SDK: >=3.1.0
- Android Studio أو VS Code
- Xcode (لتطوير iOS)
- Java JDK 17+

## التثبيت والتشغيل

### 1. تثبيت Flutter
```bash
# تحميل Flutter SDK
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

# التحقق من التثبيت
flutter doctor
```

### 2. استنساخ المشروع
```bash
git clone <repository-url>
cd flutter_app
```

### 3. تثبيت التبعيات
```bash
flutter pub get
```

### 4. إنشاء ملفات مولدة
```bash
flutter packages pub run build_runner build
```

### 5. تشغيل التطبيق
```bash
# لتشغيل على محاكي
flutter run

# لتشغيل على جهاز معين
flutter run -d <device-id>

# لعرض الأجهزة المتاحة
flutter devices
```

## بناء التطبيق للإنتاج

### Android (APK)
```bash
# بناء APK للإصدار
flutter build apk --release

# بناء App Bundle (موصى به للـ Play Store)
flutter build appbundle --release
```

### iOS (IPA)
```bash
# بناء IPA للإصدار
flutter build ios --release

# أو بناء من Xcode
open ios/Runner.xcworkspace
```

## هيكل المشروع

```
flutter_app/
├── lib/
│   ├── core/                 # الأساسيات
│   │   ├── constants/        # الثواب��
│   │   ├── localization/     # الترجمة
│   │   ├── models/           # نماذج البيانات
│   │   ├── router/           # التنقل
│   │   └── theme/            # الثيم والألوان
│   ├── features/             # الميزات
│   │   ├── home/             # الصفحة الرئيسية
│   │   ├── auth/             # المصادقة
│   │   ├── marketplace/      # السوق
│   │   ├── products/         # المنتجات
│   │   ├── companies/        # الشركات
│   │   ├── jobs/             # الوظائف
│   │   ├── services/         # الخدمات
│   │   ├── ads/              # الإعلانات
│   │   ├── profile/          # الملف الشخصي
│   │   ├── settings/         # الإعدادات
│   │   ├── admin/            # لوحة الإدارة
│   │   └── merchant/         # لوحة التاجر
│   ├── shared/               # مكونات مشتركة
│   │   └── widgets/          # Widgets عامة
│   └── main.dart             # نقطة البداية
├── assets/                   # الملفات المرفقة
│   ├── images/              # الصور
│   ├── icons/               # الأيقونات
│   ├── fonts/               # الخطوط
│   └── lottie/              # رسوم متحركة
├── android/                  # إعدادات Android
├── ios/                      # إعدادات iOS
└── pubspec.yaml             # التبعيات والإعدادات
```

## المكتبات المستخدمة

### UI والتصميم
- `google_fonts` - خطوط Google
- `lucide_icons` - مجموعة أيقونات
- `cached_network_image` - عرض الصور
- `lottie` - رسوم متحركة

### إدارة الحالة والتنقل
- `flutter_riverpod` - إدارة الحالة
- `go_router` - نظام التنقل

### التخزين والبيانات
- `hive` - قاعدة بيانات محلية
- `shared_preferences` - تخزين الإعدادات
- `dio` - طلبات HTTP

### الترجمة والتدويل
- `flutter_localizations` - دعم الترجمة
- `intl` - تنسيق التواريخ والأرقام

## التخصيص

### تغيير الألوان
يمكن تخصيص ألوان التطبيق من خلال:
```dart
// في AppColors
static const Color primaryBlue = Color(0xFF2563EB);
static const Color secondaryOrange = Color(0xFFF59E0B);
```

### إضافة خطوط جديدة
1. إضافة ملفات الخط في `assets/fonts/`
2. تحديث `pubspec.yaml`
3. إضافة الخط في `AppSettings.availableFonts`

### إضافة ترجمات جديدة
1. تحديث `AppLocalizations` abstract class
2. إضافة الترجمات في `AppLocalizationsAr`
3. إضافة الترجمات في `AppLocalizationsEn`

## نشر التطبيق

### Google Play Store
1. إنشاء حساب مطور
2. بناء App Bundle: `flutter build appbundle --release`
3. رفع الملف في Play Console
4. ملء معلومات التطبيق
5. نشر التطبيق

### Apple App Store
1. إنشاء حساب مطور Apple
2. إعداد App Store Connect
3. بناء التطبيق: `flutter build ios --release`
4. رفع باستخدام Xcode أو Transporter
5. مراجعة Apple ونشر التطبيق

## الدعم والمساهمة

- 📧 البريد الإلكتروني: support@bayt-al-sudani.com
- 🐛 الإبلاغ عن مشاكل: [GitHub Issues]
- 📖 الوثائق: [Documentation]
- 💬 المجتمع: [Discord/Telegram]

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

**تم تطويره بـ ❤️ للمجتمع السوداني في الخليج والعالم**
