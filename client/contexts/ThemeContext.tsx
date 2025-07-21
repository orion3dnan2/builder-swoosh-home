import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for theme and language
export type Theme = 'light' | 'dark';
export type Language = 'ar' | 'en';
export type FontFamily = 'cairo' | 'tajawal' | 'noto-kufi' | 'amiri';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  fontFamily: FontFamily;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setFontFamily: (font: FontFamily) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.marketplace': 'السوق',
    'nav.products': 'المنتجات',
    'nav.companies': 'الشركات',
    'nav.jobs': 'الوظائف',
    'nav.services': 'الخدمات',
    'nav.ads': 'الإعلانات',
    
    // Common
    'common.search': 'ابحث في البيت السوداني...',
    'common.login': 'تسجيل الدخول',
    'common.logout': 'تسجيل الخروج',
    'common.register': 'تسجيل',
    'common.welcome': 'مرحباً بكم في البيت السوداني',
    'common.users_count': '+100 ألف سوداني في البيت',
    'common.notifications': 'الإشعارات',
    'common.messages': 'الرسائل',
    
    // Branding
    'brand.name': 'البيت السوداني',
    'brand.tagline': 'سوق وخدمات السودان',
    'brand.description': 'منصة شاملة للخدمات والتجارة السودانية في الخليج والعالم',
    
    // Footer
    'footer.services': 'الخدمات',
    'footer.business': 'الأعمال',
    'footer.contact': 'تواصل معنا',
    'footer.email': 'البريد الإلكتروني',
    'footer.phone': 'الهاتف',
    'footer.rights': 'جميع الحقوق محفوظة',
    
    // Theme Settings
    'theme.light': 'الوضع النهاري',
    'theme.dark': 'الوضع الليلي',
    'theme.toggle': 'تبديل الثيم',
    'language.toggle': 'تبديل اللغة',
    
    // Dashboard
    'dashboard.admin': 'لوحة إدارة التطبيق',
    'dashboard.merchant': 'لوحة إدارة المتجر',
    'dashboard.welcome': 'مرحباً',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.analytics': 'الإحصائيات',
    'dashboard.settings': 'الإعدادات',
    
    // Error messages
    'error.404': 'الصفحة غير موجودة',
    'error.unauthorized': 'غير مسموح بالوصول',
    'error.general': 'حدث خطأ غير متوقع',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.marketplace': 'Marketplace',
    'nav.products': 'Products',
    'nav.companies': 'Companies',
    'nav.jobs': 'Jobs',
    'nav.services': 'Services',
    'nav.ads': 'Advertisements',
    
    // Common
    'common.search': 'Search in Sudan House...',
    'common.login': 'Login',
    'common.logout': 'Logout',
    'common.register': 'Register',
    'common.welcome': 'Welcome to Sudan House',
    'common.users_count': '+100K Sudanese in the House',
    'common.notifications': 'Notifications',
    'common.messages': 'Messages',
    
    // Branding
    'brand.name': 'Sudan House',
    'brand.tagline': 'Sudan Market & Services',
    'brand.description': 'Comprehensive platform for Sudanese services and commerce in the Gulf and worldwide',
    
    // Footer
    'footer.services': 'Services',
    'footer.business': 'Business',
    'footer.contact': 'Contact Us',
    'footer.email': 'Email',
    'footer.phone': 'Phone',
    'footer.rights': 'All Rights Reserved',
    
    // Theme Settings
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'theme.toggle': 'Toggle Theme',
    'language.toggle': 'Toggle Language',
    
    // Dashboard
    'dashboard.admin': 'Admin Dashboard',
    'dashboard.merchant': 'Merchant Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.analytics': 'Analytics',
    'dashboard.settings': 'Settings',
    
    // Error messages
    'error.404': 'Page Not Found',
    'error.unauthorized': 'Access Denied',
    'error.general': 'An unexpected error occurred',
  }
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEYS = {
  THEME: 'bayt-al-sudani-theme',
  LANGUAGE: 'bayt-al-sudani-language',
  FONT_FAMILY: 'bayt-al-sudani-font-family'
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ar');
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('cairo');

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    const savedFont = localStorage.getItem(STORAGE_KEYS.FONT_FAMILY) as FontFamily;

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedFont) setFontFamilyState(savedFont);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Apply language and direction to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Set direction
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    body.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Set language attribute
    root.lang = language;
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  // Apply font family
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous font classes
    root.classList.remove('font-cairo', 'font-tajawal', 'font-noto-kufi', 'font-amiri');
    root.classList.add(`font-${fontFamily}`);
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.FONT_FAMILY, fontFamily);
  }, [fontFamily]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ar' ? 'en' : 'ar');
  };

  const setFontFamily = (font: FontFamily) => {
    setFontFamilyState(font);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const isRTL = language === 'ar';

  const contextValue: ThemeContextType = {
    theme,
    language,
    fontFamily,
    toggleTheme,
    toggleLanguage,
    setFontFamily,
    t,
    isRTL
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
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Font loading utilities
export const loadFonts = () => {
  const fonts = [
    {
      family: 'Cairo',
      weights: ['300', '400', '500', '600', '700'],
      url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap'
    },
    {
      family: 'Tajawal',
      weights: ['300', '400', '500', '700'],
      url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap'
    },
    {
      family: 'Noto Kufi Arabic',
      weights: ['400', '500', '600', '700'],
      url: 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap'
    },
    {
      family: 'Amiri',
      weights: ['400', '700'],
      url: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap'
    }
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.href = font.url;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
  });
};
