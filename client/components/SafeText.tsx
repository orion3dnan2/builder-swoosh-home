import React from "react";

// دالة لتنظيف النصوص العربية المعطوبة
const cleanArabicText = (text: string): string => {
  if (!text) return text;

  return (
    text
      // إزالة الأحرف المعطوبة الأساسية
      .replace(/��/g, "")
      .replace(/ï»¿/g, "")
      .replace(/�/g, "")

      // إصلاح الكلمات الشائعة المعطوبة
      .replace(/مت��جر/gi, "متاجر")
      .replace(/��لسوداني/gi, "السوداني")
      .replace(/��لليلي/gi, "الليلي")
      .replace(/تفصيل��ة/gi, "تفصيلية")
      .replace(/��هنية/gi, "مهنية")
      .replace(/ه��ا/gi, "هذا")
      .replace(/له��تف/gi, "للهاتف")
      .replace(/��ودانية/gi, "سودانية")
      .replace(/من��لي/gi, "منزلي")
      .replace(/شام��ة/gi, "شاملة")
      .replace(/��شطة/gi, "نشطة")
      .replace(/��رحباً/gi, "مرحباً")
      .replace(/��تاجر/gi, "متاجر")
      .replace(/��لجدد/gi, "الجدد")
      .replace(/��ختر/gi, "اختر")
      .replace(/��كتشف/gi, "اكتشف")
      .replace(/��نضم/gi, "انضم")
      .replace(/��ثناء/gi, "أثناء")
      .replace(/��دخال/gi, "إدخال")
      .replace(/��زياء/gi, "أزياء")
      .replace(/��لغاء/gi, "إلغاء")
      .replace(/��عدادات/gi, "إعدادات")
      .replace(/��روط/gi, "شروط")
      .replace(/��ميز/gi, "مميز")
      .replace(/��ين/gi, "أين")
      .replace(/��يام/gi, "أيام")

      // تنظيف المسافات الزائدة
      .replace(/\s+/g, " ")
      .trim()
  );
};

// مكون النص الآمن
export const SafeText: React.FC<{
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  fallback?: string;
}> = ({ children, className, as: Component = "span", fallback = "" }) => {
  try {
    const cleanedText = cleanArabicText(children);
    const finalText = cleanedText || fallback;

    return React.createElement(Component, { className }, finalText);
  } catch (error) {
    console.error("Error in SafeText:", error);
    // Return fallback or original text if cleaning fails
    return React.createElement(Component, { className }, children || fallback);
  }
};

// Hook لتنظيف النصوص
export const useCleanText = (text: string): string => {
  try {
    return React.useMemo(() => cleanArabicText(text), [text]);
  } catch (error) {
    console.error("Error in useCleanText:", error);
    return text; // Return original text if cleaning fails
  }
};

// مكون عالي المستوى لتنظيف جميع النصوص في شجرة المكونات
export const TextCleaner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Check for browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    return <>{children}</>;
  }

  // Wrap in try-catch to prevent crashes
  try {
    React.useEffect(() => {
      const cleanupTexts = () => {
        try {
          // Find all text nodes with corrupted characters
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node) => {
                return node.textContent && node.textContent.includes("��")
                  ? NodeFilter.FILTER_ACCEPT
                  : NodeFilter.FILTER_REJECT;
              },
            },
          );

          const corruptedNodes = [];
          let node;
          while ((node = walker.nextNode())) {
            corruptedNodes.push(node);
          }

          // Clean each corrupted node
          corruptedNodes.forEach((textNode) => {
            if (textNode.textContent) {
              textNode.textContent = cleanArabicText(textNode.textContent);
            }
          });
        } catch (error) {
          console.error("Error in cleanupTexts:", error);
        }
      };

      // تنظيف فوري
      cleanupTexts();

      // مراقبة التغييرات في DOM وتنظيف المحتوى الجديد
      const observer = new MutationObserver((mutations) => {
        try {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              mutation.addedNodes.forEach((node) => {
                try {
                  if (
                    node.nodeType === Node.TEXT_NODE &&
                    node.textContent?.includes("��")
                  ) {
                    node.textContent = cleanArabicText(node.textContent);
                  } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const walker = document.createTreeWalker(
                      node as Element,
                      NodeFilter.SHOW_TEXT,
                      {
                        acceptNode: (textNode) => {
                          return textNode.textContent &&
                            textNode.textContent.includes("��")
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                        },
                      },
                    );

                    let textNode;
                    while ((textNode = walker.nextNode())) {
                      if (textNode.textContent) {
                        textNode.textContent = cleanArabicText(
                          textNode.textContent,
                        );
                      }
                    }
                  }
                } catch (nodeError) {
                  console.error("Error processing node:", nodeError);
                }
              });
            }
          });
        } catch (mutationError) {
          console.error("Error in MutationObserver:", mutationError);
        }
      });

      // بدء مراقبة DOM
      try {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      } catch (observerError) {
        console.error("Error starting MutationObserver:", observerError);
      }

      // تنظيف دوري كنسخة احتياطية
      const interval = setInterval(cleanupTexts, 5000);

      return () => {
        try {
          observer.disconnect();
          clearInterval(interval);
        } catch (cleanupError) {
          console.error("Error in TextCleaner cleanup:", cleanupError);
        }
      };
    }, []);

    return <>{children}</>;
  } catch (error) {
    console.error("❌ TextCleaner: Critical error:", error);
    // Fallback: return children without text cleaning functionality
    return <>{children}</>;
  }
};

export default SafeText;
