// نظام إدارة العملات حسب البلد
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  nameAr: string;
}

// العملات المدعومة حسب البلد
export const countryCurrencies: Record<string, Currency> = {
  "دولة الكويت": {
    code: "KWD",
    symbol: "د.ك",
    name: "Kuwaiti Dinar",
    nameAr: "دينار كويتي"
  },
  "الكويت": {
    code: "KWD", 
    symbol: "د.ك",
    name: "Kuwaiti Dinar",
    nameAr: "دينار كويتي"
  },
  "السعودية": {
    code: "SAR",
    symbol: "ر.س",
    name: "Saudi Riyal",
    nameAr: "ريال سعودي"
  },
  "المملكة العربية السعودية": {
    code: "SAR",
    symbol: "ر.س", 
    name: "Saudi Riyal",
    nameAr: "ريال سعودي"
  },
  "الإمارات": {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    nameAr: "درهم إماراتي"
  },
  "الإمارات العربية المتحدة": {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham", 
    nameAr: "درهم إماراتي"
  },
  "قطر": {
    code: "QAR",
    symbol: "ر.ق",
    name: "Qatari Riyal",
    nameAr: "ريال قطري"
  },
  "دولة قطر": {
    code: "QAR",
    symbol: "ر.ق",
    name: "Qatari Riyal",
    nameAr: "ريال قطري"
  },
  "البحرين": {
    code: "BHD",
    symbol: "د.ب",
    name: "Bahraini Dinar",
    nameAr: "دينار بحريني"
  },
  "مملكة البحرين": {
    code: "BHD",
    symbol: "د.ب", 
    name: "Bahraini Dinar",
    nameAr: "دينار بحريني"
  },
  "عمان": {
    code: "OMR",
    symbol: "ر.ع",
    name: "Omani Rial",
    nameAr: "ريال عماني"
  },
  "سلطنة عمان": {
    code: "OMR",
    symbol: "ر.ع",
    name: "Omani Rial", 
    nameAr: "ريال عماني"
  },
  "مصر": {
    code: "EGP",
    symbol: "ج.م",
    name: "Egyptian Pound",
    nameAr: "جنيه مصري"
  },
  "جمهورية مصر العربية": {
    code: "EGP",
    symbol: "ج.م",
    name: "Egyptian Pound",
    nameAr: "جنيه مصري"
  },
  "الأردن": {
    code: "JOD",
    symbol: "د.أ",
    name: "Jordanian Dinar",
    nameAr: "دينار أردني"
  },
  "المملكة الأردنية الهاشمية": {
    code: "JOD",
    symbol: "د.أ",
    name: "Jordanian Dinar",
    nameAr: "دينار أردني"
  },
  "لبنان": {
    code: "LBP",
    symbol: "ل.ل",
    name: "Lebanese Pound",
    nameAr: "ليرة لبنانية"
  },
  "الجمهورية اللبنانية": {
    code: "LBP",
    symbol: "ل.ل",
    name: "Lebanese Pound",
    nameAr: "ليرة لبنانية"
  },
  "السودان": {
    code: "SDG",
    symbol: "ج.س",
    name: "Sudanese Pound",
    nameAr: "جنيه سوداني"
  },
  "جمهورية السودان": {
    code: "SDG",
    symbol: "ج.س",
    name: "Sudanese Pound",
    nameAr: "جنيه سوداني"
  }
};

// العملة الافتراضية (للكويت)
export const defaultCurrency: Currency = {
  code: "KWD",
  symbol: "د.ك",
  name: "Kuwaiti Dinar",
  nameAr: "دينار كويتي"
};

// الحصول على العملة حسب البلد
export function getCurrencyByCountry(country: string): Currency {
  console.log("Looking for currency for country:", country);
  const currency = countryCurrencies[country];
  console.log("Found currency:", currency);
  return currency || defaultCurrency;
}

// تنسيق السعر مع العملة
export function formatPrice(price: number, currency: Currency): string {
  return `${price.toFixed(2)} ${currency.symbol}`;
}

// تنسيق السعر مع العملة بالعربية
export function formatPriceArabic(price: number, currency: Currency): string {
  return `${price.toFixed(2)} ${currency.symbol}`;
}

// الحصول على عملة المتجر
export function getStoreCurrency(storeCountry: string): Currency {
  return getCurrencyByCountry(storeCountry);
}

// تحويل السعر من عملة لأخرى (يمكن تطويرها لاحقاً بأسعار الصرف الحقيقية)
export function convertPrice(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
  // هذه أسعار تقريبية للتوضيح - في التطبيق الحقيقي يجب استخدام API لأسعار الصرف
  const exchangeRates: Record<string, number> = {
    "USD": 1,      // ا��دولار هو العملة المرجعية
    "KWD": 0.30,   // دينار كويتي
    "SAR": 3.75,   // ريال سعودي
    "AED": 3.67,   // درهم إماراتي
    "QAR": 3.64,   // ريال قطري
    "BHD": 0.38,   // دينار بحريني
    "OMR": 0.38,   // ريال عماني
    "EGP": 30.90,  // جنيه مصري
    "JOD": 0.71,   // دينار أردني
    "LBP": 15000,  // ليرة لبنانية
    "SDG": 600     // جنيه سوداني
  };

  const fromRate = exchangeRates[fromCurrency.code] || 1;
  const toRate = exchangeRates[toCurrency.code] || 1;
  
  return (amount / fromRate) * toRate;
}
