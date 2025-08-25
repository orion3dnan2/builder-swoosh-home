import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Currency,
  getCurrencyByCountry,
  defaultCurrency,
} from "@/lib/currencies";

interface CurrencyContextType {
  currentCurrency: Currency;
  storeCountry: string;
  setStoreCountry: (country: string) => void;
  formatPrice: (price: number) => string;
  formatPriceDetailed: (price: number) => string;
  updateCurrencyByCountry: (country: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [storeCountry, setStoreCountry] = useState<string>("دولة الكويت");
  const [currentCurrency, setCurrentCurrency] =
    useState<Currency>(defaultCurrency);

  // تحميل إعدادات الدولة من localStorage عند بداية التشغيل
  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem("bayt_al_sudani_store_country");
      if (savedCountry) {
        setStoreCountry(savedCountry);
        const currency = getCurrencyByCountry(savedCountry);
        setCurrentCurrency(currency);
      }
    } catch (error) {
      console.error("خطأ في تحميل إعدادات الدولة:", error);
    }
  }, []);

  // دالة لتحديث العملة حسب الدولة
  const updateCurrencyByCountry = (country: string) => {
    try {
      setStoreCountry(country);
      const currency = getCurrencyByCountry(country);
      setCurrentCurrency(currency);

      // حفظ الدولة في localStorage
      localStorage.setItem("bayt_al_sudani_store_country", country);

      console.log(`تم تحديث العملة إلى ${currency.nameAr} للدولة: ${country}`);
    } catch (error) {
      console.error("خطأ في تحديث العملة:", error);
    }
  };

  // دالة لتنسيق السعر
  const formatPrice = (price: number): string => {
    if (isNaN(price) || price < 0) return `0 ${currentCurrency.symbol}`;

    // تحديد عدد الخانات العشرية حسب العملة
    let decimals = 2;
    if (
      currentCurrency.code === "KWD" ||
      currentCurrency.code === "BHD" ||
      currentCurrency.code === "OMR"
    ) {
      decimals = 3; // الدينار الكويتي والبحريني والريال العماني لها 3 خانات عشرية
    }

    return `${price.toFixed(decimals)} ${currentCurrency.symbol}`;
  };

  // دالة لتنسيق السعر مع تفاصيل إضافية
  const formatPriceDetailed = (price: number): string => {
    const formattedPrice = formatPrice(price);
    return `${formattedPrice} (${currentCurrency.nameAr})`;
  };

  const value: CurrencyContextType = {
    currentCurrency,
    storeCountry,
    setStoreCountry: updateCurrencyByCountry,
    formatPrice,
    formatPriceDetailed,
    updateCurrencyByCountry,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Hook للحصول على context العملة
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

// Hook أكثر أماناً للاستخدام العام
export function useCurrencySafe() {
  const context = useContext(CurrencyContext);

  if (context === undefined) {
    // إذا لم يكن Provider موجوداً، استخدم القيم الافتراضية
    console.warn("CurrencyContext not found, using default values");
    return {
      currentCurrency: defaultCurrency,
      storeCountry: "دولة الكويت",
      setStoreCountry: () => {},
      formatPrice: (price: number) =>
        `${price.toFixed(3)} ${defaultCurrency.symbol}`,
      formatPriceDetailed: (price: number) =>
        `${price.toFixed(3)} ${defaultCurrency.symbol} (${defaultCurrency.nameAr})`,
      updateCurrencyByCountry: () => {},
    };
  }

  return context;
}

export { CurrencyContext };
