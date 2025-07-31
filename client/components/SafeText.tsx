import React from 'react';

// دالة لتنظيف النصوص العربية المعطوبة
const cleanArabicText = (text: string): string => {
  if (!text) return text;
  
  return text
    // إزالة الأحرف المعطوبة الأساسية
    .replace(/��/g, '')
    .replace(/ï»¿/g, '')
    .replace(/�/g, '')
    
    // إصلاح الكلمات الشائعة المعطوبة
    .replace(/مت��جر/gi, 'متاجر')
    .replace(/��لسوداني/gi, 'السوداني')
    .replace(/��لليلي/gi, 'الليلي')
    .replace(/تفصيل��ة/gi, 'تفصيلية')
    .replace(/��هنية/gi, 'مهنية')
    .replace(/ه��ا/gi, 'هذا')
    .replace(/له��تف/gi, 'للهاتف')
    .replace(/��ودانية/gi, 'سودانية')
    .replace(/من��لي/gi, 'منزلي')
    .replace(/شام��ة/gi, 'شاملة')
    .replace(/��شطة/gi, 'نشطة')
    .replace(/��رحباً/gi, 'مرحباً')
    .replace(/��تاجر/gi, 'متاجر')
    .replace(/��لجدد/gi, 'الجدد')
    .replace(/��ختر/gi, 'اختر')
    .replace(/��كتشف/gi, 'اكتشف')
    .replace(/��نضم/gi, 'انضم')
    .replace(/��ثناء/gi, 'أثناء')
    .replace(/��دخال/gi, 'إدخال')
    .replace(/��زياء/gi, 'أزياء')
    .replace(/��لغاء/gi, 'إلغاء')
    .replace(/��عدادات/gi, 'إعدادات')
    .replace(/��روط/gi, 'شروط')
    .replace(/��ميز/gi, 'مميز')
    .replace(/��ين/gi, 'أين')
    .replace(/��يام/gi, 'أيام')
    
    // تنظيف المسافات الزائدة
    .replace(/\s+/g, ' ')
    .trim();
};

// مكون النص الآمن
export const SafeText: React.FC<{
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  fallback?: string;
}> = ({ children, className, as: Component = 'span', fallback = '' }) => {
  const cleanedText = cleanArabicText(children);
  const finalText = cleanedText || fallback;
  
  return React.createElement(Component, { className }, finalText);
};

// Hook لتنظيف النصوص
export const useCleanText = (text: string): string => {
  return React.useMemo(() => cleanArabicText(text), [text]);
};

// مكون عالي المستوى لتنظيف جميع النصوص في شجرة المكونات
export const TextCleaner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    const cleanupTexts = () => {
      const textNodes = document.evaluate(
        '//text()[contains(., "��")]',
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
      );

      for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        if (node && node.textContent) {
          node.textContent = cleanArabicText(node.textContent);
        }
      }
    };

    // تنظيف فوري
    cleanupTexts();
    
    // تنظيف دوري
    const interval = setInterval(cleanupTexts, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
};

export default SafeText;
