import React, { createContext, useContext, useEffect, useState } from "react";

// Types for theme and language
export type Theme = "light" | "dark";
export type Language = "ar" | "en";
export type ArabicFontFamily = "amiri" | "cairo" | "tajawal" | "noto-kufi" | "ibm-plex" | "lateef" | "almarai" | "markazi" | "kufi-standard";
export type EnglishFontFamily = "inter" | "roboto" | "poppins" | "montserrat" | "open-sans";

interface ThemeContextType {
  theme: Theme;
  language: Language;
  arabicFont: ArabicFontFamily;
  englishFont: EnglishFontFamily;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setArabicFont: (font: ArabicFontFamily) => void;
  setEnglishFont: (font: EnglishFontFamily) => void;
  t: (key: string) => string;
  isRTL: boolean;
  getCurrentFont: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.marketplace": "السوق",
    "nav.products": "المنتجات",
    "nav.companies": "الشركات",
    "nav.jobs": "الوظائف",
    "nav.services": "الخدمات",
    "nav.ads": "الإعلانات",

    // Common
    "common.search": "ابحث في البيت السوداني...",
    "common.login": "تسجيل الدخول",
    "common.logout": "تسجيل الخروج",
    "common.register": "تسجيل",
    "common.welcome": "مرحباً بكم في البيت السوداني",
    "common.users_count": "+100 ألف سوداني في البيت",
    "common.notifications": "الإشعارات",
    "common.messages": "الرسائل",
    "common.back": "العودة",
    "common.close": "إغلاق",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
    "common.save": "حفظ",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.view": "عرض",
    "common.details": "التفاصيل",
    "common.more": "المزيد",
    "common.loading": "جاري التحميل...",
    "common.success": "تم بنجاح",
    "common.error": "حدث خطأ",

    // Branding
    "brand.name": "البيت السوداني",
    "brand.tagline": "سوق وخدمات السودان",
    "brand.description":
      "منصة شاملة للخدمات والتجارة السودانية في الخليج والعالم",

    // Homepage
    "home.hero.title": "البيت السوداني",
    "home.hero.subtitle": "سوق وخدمات وشركات السودان في الخليج والعالم",
    "home.hero.explore_market": "استكشف السوق",
    "home.hero.join_us": "انضم إلينا",
    "home.services.title": "خدماتنا",
    "home.services.subtitle":
      "مجموعة شاملة من الخدمات المصممة خصيصاً للمجتمع السوداني في الخليج والعالم",
    "home.services.marketplace": "السوق التجاري",
    "home.services.marketplace_desc":
      "اكتشف منتجات سودانية أصيلة من تجار موثوقين",
    "home.services.companies": "دليل الشركات",
    "home.services.companies_desc":
      "تواصل مع الشركات والمؤسسات السودانية في الخليج",
    "home.services.jobs": "لوحة الوظائف",
    "home.services.jobs_desc": "ابحث عن فرص عمل مناسبة أو أعلن عن وظائف شاغرة",
    "home.services.professional": "الخدمات ا��مهنية",
    "home.services.professional_desc":
      "احصل على خدمات مهنية متخصصة من خبراء سودانيين",
    "home.services.ads": "الإعلانات",
    "home.services.ads_desc": "روج لأعمالك وخدماتك للمجتمع السوداني",
    "home.services.discover": "اكتشف المزيد",
    "home.testimonials.title": "آراء عملائنا",
    "home.testimonials.subtitle": "ماذا يقول عملاؤنا عن تجربتهم معنا",
    "home.cta.title": "ابدأ رحلتك معنا اليوم",
    "home.cta.subtitle":
      "انضم إلى آلاف السودانيين الذين يستخدمون البيت السوداني لتنمية أعمالهم وخدماتهم",
    "home.cta.create_account": "إنشاء حساب مجاني",
    "home.stats.users": "مستخدم نشط",
    "home.stats.companies": "شركة مسجلة",
    "home.stats.products": "منتج متوفر",
    "home.stats.jobs": "فرصة عمل",

    // Footer
    "footer.services": "الخدمات",
    "footer.business": "الأعمال",
    "footer.contact": "تواصل معنا",
    "footer.email": "البريد الإلكتروني",
    "footer.phone": "الهاتف",
    "footer.rights": "جميع الحقوق محفوظة",

    // Theme Settings
    "theme.light": "الوضع النهاري",
    "theme.dark": "الوضع الليلي",
    "theme.toggle": "تبديل الثيم",
    "language.toggle": "تبديل اللغة",

    // Dashboard
    "dashboard.admin": "لوحة إدارة التطبيق",
    "dashboard.merchant": "لوحة إدارة المتجر",
    "dashboard.welcome": "مرحباً",
    "dashboard.overview": "نظرة عامة",
    "dashboard.analytics": "الإحصائيات",
    "dashboard.settings": "الإعدادات",
    "dashboard.quick_actions": "الإجراءات السريعة",
    "dashboard.recent_activity": "النشاط الأخير",
    "dashboard.quick_stats": "إحصائيات سريعة",
    "dashboard.view_all_activities": "عرض جميع الأنشطة",
    "dashboard.view_detailed_reports": "عرض التقارير التفصيلية",
    "dashboard.total_users": "إجمالي المستخدمين",
    "dashboard.registered_stores": "المتاجر المسجلة",
    "dashboard.total_products": "إجمالي المنتجات",
    "dashboard.monthly_revenue": "إيرادات الشهر",
    "dashboard.active_stores": "المتاجر النشطة",
    "dashboard.pending_approvals": "طلبات الاعتماد",
    "dashboard.new_registrations": "تسجيلات جديدة",
    "dashboard.total_orders": "إجمالي الطلبات",
    "dashboard.app_settings": "إعدادات التطبيق",
    "dashboard.app_settings_desc": "تخصيص المظهر والألوان والخطوط",
    "dashboard.user_management": "إدارة المستخدمين",
    "dashboard.user_management_desc": "عرض وإدارة حسابات المستخدمين",
    "dashboard.store_management": "إدارة المتاجر",
    "dashboard.store_management_desc": "مراجعة وإدارة المتاجر المسجلة",
    "dashboard.appearance": "تخصيص المظهر",
    "dashboard.appearance_desc": "تغيير الألوان والصور والخلفيات",
    "dashboard.system_settings": "إعدادات النظام",
    "dashboard.system_settings_desc": "صلاحيات وإعدادات الأمان",
    "dashboard.content_management": "إدارة المحتوى",
    "dashboard.content_management_desc": "النصوص والصور والترجمات",
    "dashboard.view_site": "عرض الموقع",
    "dashboard.super_admin": "مدير أعلى",
    "dashboard.urgent": "عاجل",

    // Store Management
    "stores.title": "إدارة المتاجر",
    "stores.subtitle": "متجر مسجل",
    "stores.total_stores": "إجمالي المتاجر",
    "stores.active_stores": "مت��جر نشطة",
    "stores.pending_stores": "في الانتظار",
    "stores.suspended_stores": "معلقة",
    "stores.search_placeholder": "البحث في المتاجر...",
    "stores.all_statuses": "جميع الحالات",
    "stores.status_active": "نشط",
    "stores.status_pending": "في الانتظار",
    "stores.status_suspended": "معلق",
    "stores.category": "الفئة",
    "stores.join_date": "تاريخ الانضمام",
    "stores.last_active": "آخر نشاط",
    "stores.rating": "التقييم",
    "stores.products": "منتج",
    "stores.orders": "طلب",
    "stores.revenue": "إيراد",
    "stores.view_details": "عرض التفاصيل",
    "stores.approve_store": "اعتماد المتجر",
    "stores.suspend_store": "تعليق المتجر",
    "stores.reactivate_store": "إعادة تفعيل",
    "stores.no_stores_found": "لا توجد متاجر",
    "stores.no_stores_match": "لم يتم العثور على متاجر تطابق معايير البحث",
    "stores.filter_results": "من",
    "stores.store_details": "تفاصيل المتجر",
    "stores.store_details_desc": "معلومات شاملة عن المتجر ونشاطه",
    "stores.basic_info": "المعلومات الأساسية",
    "stores.performance_stats": "إحصائيات الأداء",
    "stores.store_name": "اسم المتجر",
    "stores.owner": "المالك",
    "stores.email": "البريد الإلكتروني",
    "stores.phone": "رقم الهاتف",
    "stores.location": "الموقع",
    "stores.status": "الحالة",
    "stores.total_products": "إجمالي المنتجات",
    "stores.total_orders": "إجمالي الطلبات",
    "stores.revenues": "الإيرادات",
    "stores.confirm_action": "تأكيد الإجراء",
    "stores.confirm_approve": "هل أنت متأكد من اعتماد هذا المتجر؟",
    "stores.confirm_suspend": "هل أنت متأكد من تعليق هذا المتجر؟",
    "stores.confirm_reactivate": "هل أنت متأكد من إعادة تفعيل هذا المتجر؟",
    "stores.action_approve": "اعتماد",
    "stores.action_suspend": "تعليق",
    "stores.action_reactivate": "إعادة تفعيل",
    "stores.success_approve": "تم اعتماد المتجر بنجاح! ✅",
    "stores.success_suspend": "تم تعليق المتجر بنجاح! ⚠️",
    "stores.success_reactivate": "تم إعادة تفعيل المتجر بنجاح! ✅",
    "stores.reviews_count": "تقييم",

    // Login & Register
    "login.title": "تسجيل الدخول",
    "login.subtitle": "أدخل بياناتك للوصول إلى حسابك",
    "login.username": "اسم المستخدم أو البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.remember_me": "تذكرني",
    "login.forgot_password": "نسيت كلمة المرور؟",
    "login.no_account": "ليس لديك حساب؟",
    "login.create_account": "إنشاء حساب جديد",
    "login.or_continue_with": "أو تابع باستخدام",
    "login.error.username_required": "يرجى إدخال اسم المستخدم",
    "login.error.password_required": "يرجى إدخال كلمة المرور",
    "login.error.invalid_credentials": "بيانات الدخول غير صحيحة",
    "register.title": "إنشاء حساب جديد",
    "register.subtitle": "انضم إلى البيت السوداني اليوم",
    "register.full_name": "الاسم الكامل",
    "register.email": "البريد الإلكتروني",
    "register.phone": "رقم الهاتف",
    "register.confirm_password": "تأكيد كلمة المرور",
    "register.agree_terms": "أوافق على الشروط والأحكام",
    "register.already_have_account": "لديك حساب بالفعل؟",
    "register.login_here": "سجل دخولك هنا",
    "login.demo_accounts": "حسابات التجربة",
    "login.demo.super_admin": "مدير التطبيق (Super Admin)",
    "login.demo.merchant": "صاحب متجر (Merchant)",
    "login.demo.username": "اسم المستخدم",
    "login.demo.password": "كلمة المرور",
    "login.demo.use_account": "استخدام هذا الحساب",

    // Settings
    "settings.theme": "المظهر",
    "settings.fonts": "الخطوط",
    "settings.branding": "العلامة التجارية",
    "settings.features": "الميزات",
    "settings.content": "المحتوى",
    "settings.advanced": "متقدم",

    // Font Settings
    "font_settings.title": "إعدادات الخطوط",
    "font_settings.subtitle": "اختر الخطوط المناسبة للنصوص العربية والإنجليزية",
    "font_settings.reset": "إعادة تعيين",
    "font_settings.current_settings": "الإعدادات الحالية",
    "font_settings.arabic_font": "الخط العربي",
    "font_settings.english_font": "الخط الإنجليزي",
    "font_settings.arabic_fonts": "الخطوط العربية",
    "font_settings.english_fonts": "الخطوط الإنجليزية",
    "font_settings.custom_preview": "معاينة مخصصة",
    "font_settings.arabic_preview_text": "نص المعاينة العربي",
    "font_settings.english_preview_text": "نص المعاينة الإنجليزي",
    "common.selected": "محدد",

    // Dashboard Activities
    "dashboard.activity.new_store": "تسجيل متجر جديد",
    "dashboard.activity.product_approval": "طلب اعتماد منتج",
    "dashboard.activity.negative_review": "مراجعة سلبية",
    "dashboard.activity.support_request": "طلب دعم فني",
    "dashboard.user.ahmed_mohamed": "أحمد مح��د",
    "dashboard.user.fatima_abdullah": "فاطمة عبدالله",
    "dashboard.user.mohamed_ali": "محمد علي",
    "dashboard.user.aisha_ahmed": "عائشة أحمد",
    "dashboard.time.15_minutes_ago": "منذ 15 دقيقة",
    "dashboard.time.30_minutes_ago": "منذ 30 دقيقة",
    "dashboard.time.1_hour_ago": "منذ ساعة",
    "dashboard.time.2_hours_ago": "منذ ساعتين",
    "dashboard.by": "بواسطة",

    // Common pages
    "common.coming_soon": "قريباً - قيد التطوير",
    "common.under_development": "صفحة قيد التطوير",
    "common.back_to_dashboard": "العودة للوحة الرئيسية",
    "users.coming_soon_desc": "صفحة إدارة المستخدمين ستكون متاحة قريباً بميزات شاملة لإدارة حسابات المستخدمين",
    "appearance.coming_soon_desc": "صفحة تخصيص المظهر ستكون متاحة قريباً لتغيير الألوان والصور والخلفيات",
    "system.coming_soon_desc": "صفحة إعدادات النظام ستكون متاحة قريباً لإدارة الصلاحيات وإعدادات الأمان",
    "content.coming_soon_desc": "صفحة إدارة المحتوى ستكون متاحة قريباً لإدارة النصوص والصور والترجمات",
    "settings.current_settings": "إعدادات التطبيق الحالية",

    // Error messages
    "error.404": "الصفحة غير موجودة",
    "error.unauthorized": "غير مسموح بالوصول",
    "error.general": "حدث خطأ غير متوقع",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.marketplace": "Marketplace",
    "nav.products": "Products",
    "nav.companies": "Companies",
    "nav.jobs": "Jobs",
    "nav.services": "Services",
    "nav.ads": "Advertisements",

    // Common
    "common.search": "Search in Sudan House...",
    "common.login": "Login",
    "common.logout": "Logout",
    "common.register": "Register",
    "common.welcome": "Welcome to Sudan House",
    "common.users_count": "+100K Sudanese in the House",
    "common.notifications": "Notifications",
    "common.messages": "Messages",
    "common.back": "Back",
    "common.close": "Close",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.details": "Details",
    "common.more": "More",
    "common.loading": "Loading...",
    "common.success": "Success",
    "common.error": "Error",

    // Branding
    "brand.name": "Sudan House",
    "brand.tagline": "Sudan Market & Services",
    "brand.description":
      "Comprehensive platform for Sudanese services and commerce in the Gulf and worldwide",

    // Homepage
    "home.hero.title": "Sudan House",
    "home.hero.subtitle":
      "Sudan market, services and companies in the Gulf and worldwide",
    "home.hero.explore_market": "Explore Market",
    "home.hero.join_us": "Join Us",
    "home.services.title": "Our Services",
    "home.services.subtitle":
      "Comprehensive services designed specifically for the Sudanese community in the Gulf and worldwide",
    "home.services.marketplace": "Commercial Market",
    "home.services.marketplace_desc":
      "Discover authentic Sudanese products from trusted merchants",
    "home.services.companies": "Company Directory",
    "home.services.companies_desc":
      "Connect with Sudanese companies and institutions in the Gulf",
    "home.services.jobs": "Job Board",
    "home.services.jobs_desc":
      "Find suitable job opportunities or post job vacancies",
    "home.services.professional": "Professional Services",
    "home.services.professional_desc":
      "Get specialized professional services from Sudanese experts",
    "home.services.ads": "Advertisements",
    "home.services.ads_desc":
      "Promote your business and services to the Sudanese community",
    "home.services.discover": "Discover More",
    "home.testimonials.title": "Customer Reviews",
    "home.testimonials.subtitle":
      "What our customers say about their experience with us",
    "home.cta.title": "Start Your Journey With Us Today",
    "home.cta.subtitle":
      "Join thousands of Sudanese who use Sudan House to grow their businesses and services",
    "home.cta.create_account": "Create Free Account",
    "home.stats.users": "Active Users",
    "home.stats.companies": "Registered Companies",
    "home.stats.products": "Available Products",
    "home.stats.jobs": "Job Opportunities",

    // Footer
    "footer.services": "Services",
    "footer.business": "Business",
    "footer.contact": "Contact Us",
    "footer.email": "Email",
    "footer.phone": "Phone",
    "footer.rights": "All Rights Reserved",

    // Theme Settings
    "theme.light": "Light Mode",
    "theme.dark": "Dark Mode",
    "theme.toggle": "Toggle Theme",
    "language.toggle": "Toggle Language",

    // Dashboard
    "dashboard.admin": "Admin Dashboard",
    "dashboard.merchant": "Merchant Dashboard",
    "dashboard.welcome": "Welcome",
    "dashboard.overview": "Overview",
    "dashboard.analytics": "Analytics",
    "dashboard.settings": "Settings",
    "dashboard.quick_actions": "Quick Actions",
    "dashboard.recent_activity": "Recent Activity",
    "dashboard.quick_stats": "Quick Stats",
    "dashboard.view_all_activities": "View All Activities",
    "dashboard.view_detailed_reports": "View Detailed Reports",
    "dashboard.total_users": "Total Users",
    "dashboard.registered_stores": "Registered Stores",
    "dashboard.total_products": "Total Products",
    "dashboard.monthly_revenue": "Monthly Revenue",
    "dashboard.active_stores": "Active Stores",
    "dashboard.pending_approvals": "Pending Approvals",
    "dashboard.new_registrations": "New Registrations",
    "dashboard.total_orders": "Total Orders",
    "dashboard.app_settings": "App Settings",
    "dashboard.app_settings_desc": "Customize appearance, colors and fonts",
    "dashboard.user_management": "User Management",
    "dashboard.user_management_desc": "View and manage user accounts",
    "dashboard.store_management": "Store Management",
    "dashboard.store_management_desc": "Review and manage registered stores",
    "dashboard.appearance": "Appearance Customization",
    "dashboard.appearance_desc": "Change colors, images and backgrounds",
    "dashboard.system_settings": "System Settings",
    "dashboard.system_settings_desc": "Permissions and security settings",
    "dashboard.content_management": "Content Management",
    "dashboard.content_management_desc": "Text, images and translations",
    "dashboard.view_site": "View Site",
    "dashboard.super_admin": "Super Admin",
    "dashboard.urgent": "Urgent",

    // Store Management
    "stores.title": "Store Management",
    "stores.subtitle": "registered stores",
    "stores.total_stores": "Total Stores",
    "stores.active_stores": "Active Stores",
    "stores.pending_stores": "Pending",
    "stores.suspended_stores": "Suspended",
    "stores.search_placeholder": "Search stores...",
    "stores.all_statuses": "All Statuses",
    "stores.status_active": "Active",
    "stores.status_pending": "Pending",
    "stores.status_suspended": "Suspended",
    "stores.category": "Category",
    "stores.join_date": "Join Date",
    "stores.last_active": "Last Active",
    "stores.rating": "Rating",
    "stores.products": "Products",
    "stores.orders": "Orders",
    "stores.revenue": "Revenue",
    "stores.view_details": "View Details",
    "stores.approve_store": "Approve Store",
    "stores.suspend_store": "Suspend Store",
    "stores.reactivate_store": "Reactivate",
    "stores.no_stores_found": "No Stores Found",
    "stores.no_stores_match": "No stores found matching search criteria",
    "stores.filter_results": "of",
    "stores.store_details": "Store Details",
    "stores.store_details_desc":
      "Comprehensive information about the store and its activity",
    "stores.basic_info": "Basic Information",
    "stores.performance_stats": "Performance Statistics",
    "stores.store_name": "Store Name",
    "stores.owner": "Owner",
    "stores.email": "Email",
    "stores.phone": "Phone",
    "stores.location": "Location",
    "stores.status": "Status",
    "stores.total_products": "Total Products",
    "stores.total_orders": "Total Orders",
    "stores.revenues": "Revenues",
    "stores.confirm_action": "Confirm Action",
    "stores.confirm_approve": "Are you sure you want to approve this store?",
    "stores.confirm_suspend": "Are you sure you want to suspend this store?",
    "stores.confirm_reactivate":
      "Are you sure you want to reactivate this store?",
    "stores.action_approve": "Approve",
    "stores.action_suspend": "Suspend",
    "stores.action_reactivate": "Reactivate",
    "stores.success_approve": "Store approved successfully! ✅",
    "stores.success_suspend": "Store suspended successfully! ⚠️",
    "stores.success_reactivate": "Store reactivated successfully! ✅",
    "stores.reviews_count": "reviews",

    // Login & Register
    "login.title": "Sign In",
    "login.subtitle": "Enter your credentials to access your account",
    "login.username": "Username or Email",
    "login.password": "Password",
    "login.remember_me": "Remember me",
    "login.forgot_password": "Forgot password?",
    "login.no_account": "Don't have an account?",
    "login.create_account": "Create new account",
    "login.or_continue_with": "Or continue with",
    "login.error.username_required": "Please enter username",
    "login.error.password_required": "Please enter password",
    "login.error.invalid_credentials": "Invalid credentials",
    "register.title": "Create New Account",
    "register.subtitle": "Join Sudan House today",
    "register.full_name": "Full Name",
    "register.email": "Email",
    "register.phone": "Phone Number",
    "register.confirm_password": "Confirm Password",
    "register.agree_terms": "I agree to the Terms and Conditions",
    "register.already_have_account": "Already have an account?",
    "register.login_here": "Sign in here",
    "login.demo_accounts": "Demo Accounts",
    "login.demo.super_admin": "Super Admin",
    "login.demo.merchant": "Merchant",
    "login.demo.username": "Username",
    "login.demo.password": "Password",
    "login.demo.use_account": "Use this account",

    // Settings
    "settings.theme": "Theme",
    "settings.fonts": "Fonts",
    "settings.branding": "Branding",
    "settings.features": "Features",
    "settings.content": "Content",
    "settings.advanced": "Advanced",

    // Font Settings
    "font_settings.title": "Font Settings",
    "font_settings.subtitle": "Choose appropriate fonts for Arabic and English content",
    "font_settings.reset": "Reset",
    "font_settings.current_settings": "Current Settings",
    "font_settings.arabic_font": "Arabic Font",
    "font_settings.english_font": "English Font",
    "font_settings.arabic_fonts": "Arabic Fonts",
    "font_settings.english_fonts": "English Fonts",
    "font_settings.custom_preview": "Custom Preview",
    "font_settings.arabic_preview_text": "Arabic Preview Text",
    "font_settings.english_preview_text": "English Preview Text",
    "common.selected": "Selected",

    // Dashboard Activities
    "dashboard.activity.new_store": "New store registration",
    "dashboard.activity.product_approval": "Product approval request",
    "dashboard.activity.negative_review": "Negative review",
    "dashboard.activity.support_request": "Support request",
    "dashboard.user.ahmed_mohamed": "Ahmed Mohamed",
    "dashboard.user.fatima_abdullah": "Fatima Abdullah",
    "dashboard.user.mohamed_ali": "Mohamed Ali",
    "dashboard.user.aisha_ahmed": "Aisha Ahmed",
    "dashboard.time.15_minutes_ago": "15 minutes ago",
    "dashboard.time.30_minutes_ago": "30 minutes ago",
    "dashboard.time.1_hour_ago": "1 hour ago",
    "dashboard.time.2_hours_ago": "2 hours ago",
    "dashboard.by": "by",

    // Common pages
    "common.coming_soon": "Coming Soon - Under Development",
    "common.under_development": "Page Under Development",
    "common.back_to_dashboard": "Back to Dashboard",
    "users.coming_soon_desc": "User management page will be available soon with comprehensive features for managing user accounts",
    "appearance.coming_soon_desc": "Appearance customization page will be available soon to change colors, images and backgrounds",
    "system.coming_soon_desc": "System settings page will be available soon for managing permissions and security settings",
    "content.coming_soon_desc": "Content management page will be available soon for managing text, images and translations",
    "settings.current_settings": "Current App Settings",

    // Error messages
    "error.404": "Page Not Found",
    "error.unauthorized": "Access Denied",
    "error.general": "An unexpected error occurred",
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEYS = {
  THEME: "bayt-al-sudani-theme",
  LANGUAGE: "bayt-al-sudani-language",
  ARABIC_FONT: "bayt-al-sudani-arabic-font",
  ENGLISH_FONT: "bayt-al-sudani-english-font",
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [language] = useState<Language>("ar"); // Fixed to Arabic only
  const [arabicFont, setArabicFontState] = useState<ArabicFontFamily>("amiri");
  const [englishFont, setEnglishFontState] = useState<EnglishFontFamily>("inter");

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;
    const savedArabicFont = localStorage.getItem(STORAGE_KEYS.ARABIC_FONT) as ArabicFontFamily;
    const savedEnglishFont = localStorage.getItem(STORAGE_KEYS.ENGLISH_FONT) as EnglishFontFamily;

    if (savedTheme) setTheme(savedTheme);
    if (savedArabicFont) setArabicFontState(savedArabicFont);
    if (savedEnglishFont) setEnglishFontState(savedEnglishFont);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Apply Arabic direction to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Set direction to RTL for Arabic
    root.dir = "rtl";
    body.dir = "rtl";

    // Set language attribute to Arabic
    root.lang = "ar";
  }, []);

  // Apply fonts based on current language
  useEffect(() => {
    const root = document.documentElement;

    // Remove all font classes
    const allFontClasses = [
      'font-amiri', 'font-cairo', 'font-tajawal', 'font-noto-kufi',
      'font-ibm-plex', 'font-lateef', 'font-almarai', 'font-markazi', 'font-kufi-standard',
      'font-inter', 'font-roboto', 'font-poppins', 'font-montserrat', 'font-open-sans'
    ];
    root.classList.remove(...allFontClasses);

    // Apply current language font
    const currentFont = language === 'ar' ? arabicFont : englishFont;
    root.classList.add(`font-${currentFont}`);

    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.ARABIC_FONT, arabicFont);
    localStorage.setItem(STORAGE_KEYS.ENGLISH_FONT, englishFont);
  }, [arabicFont, englishFont, language]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ar" ? "en" : "ar"));
  };

  const setArabicFont = (font: ArabicFontFamily) => {
    setArabicFontState(font);
  };

  const setEnglishFont = (font: EnglishFontFamily) => {
    setEnglishFontState(font);
  };

  const getCurrentFont = () => {
    return language === 'ar' ? arabicFont : englishFont;
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  const isRTL = language === "ar";

  const contextValue: ThemeContextType = {
    theme,
    language,
    arabicFont,
    englishFont,
    toggleTheme,
    toggleLanguage,
    setArabicFont,
    setEnglishFont,
    getCurrentFont,
    t,
    isRTL,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Font definitions with preview text
export const arabicFonts = [
  {
    id: "amiri" as ArabicFontFamily,
    name: "أميري",
    englishName: "Amiri",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  },
  {
    id: "cairo" as ArabicFontFamily,
    name: "القاهرة",
    englishName: "Cairo",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap",
  },
  {
    id: "tajawal" as ArabicFontFamily,
    name: "تجول",
    englishName: "Tajawal",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap",
  },
  {
    id: "noto-kufi" as ArabicFontFamily,
    name: "نوتو كوفي",
    englishName: "Noto Kufi Arabic",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100;200;300;400;500;600;700;800;900&display=swap",
  },
  {
    id: "ibm-plex" as ArabicFontFamily,
    name: "آي بي إم بلكس",
    englishName: "IBM Plex Sans Arabic",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap",
  },
  {
    id: "lateef" as ArabicFontFamily,
    name: "لطيف",
    englishName: "Lateef",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=Lateef:wght@200;300;400;500;600;700;800&display=swap",
  },
  {
    id: "almarai" as ArabicFontFamily,
    name: "المرائي",
    englishName: "Almarai",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap",
  },
  {
    id: "markazi" as ArabicFontFamily,
    name: "مرکزی",
    englishName: "Markazi Text",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400;500;600;700&display=swap",
  },
  {
    id: "kufi-standard" as ArabicFontFamily,
    name: "كوفي ستاندرد",
    englishName: "Kufi Standard GK",
    preview: "أهلاً وسهلاً بكم في البيت السوداني",
    url: "https://fonts.googleapis.com/css2?family=Amiri&display=swap", // Fallback to Amiri for now
  },
];

export const englishFonts = [
  {
    id: "inter" as EnglishFontFamily,
    name: "Inter",
    preview: "Welcome to Sudan House - Your Digital Home",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
  },
  {
    id: "roboto" as EnglishFontFamily,
    name: "Roboto",
    preview: "Welcome to Sudan House - Your Digital Home",
    url: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
  },
  {
    id: "poppins" as EnglishFontFamily,
    name: "Poppins",
    preview: "Welcome to Sudan House - Your Digital Home",
    url: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },
  {
    id: "montserrat" as EnglishFontFamily,
    name: "Montserrat",
    preview: "Welcome to Sudan House - Your Digital Home",
    url: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },
  {
    id: "open-sans" as EnglishFontFamily,
    name: "Open Sans",
    preview: "Welcome to Sudan House - Your Digital Home",
    url: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
];

// Font loading utilities
export const loadFonts = () => {
  const allFonts = [...arabicFonts, ...englishFonts];

  allFonts.forEach((font) => {
    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href="${font.url}"]`);
    if (!existingLink) {
      const link = document.createElement("link");
      link.href = font.url;
      link.rel = "stylesheet";
      link.type = "text/css";
      document.head.appendChild(link);
    }
  });
};
