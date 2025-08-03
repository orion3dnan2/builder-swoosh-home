import { useEffect } from "react";
import { useProducts } from "@/lib/products";

export default function ClearAllProducts() {
  const { clearAllProducts } = useProducts();

  useEffect(() => {
    // مسح جميع المنتجات التجريبية وإعادة ضبط البيانات
    clearAllProducts();
  }, [clearAllProducts]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600 arabic text-lg font-medium">
          جاري مسح جميع المنتجات التجريبية...
        </p>
        <p className="text-sm text-gray-500 arabic mt-2">
          سيتم إعادة تحميل الصفحة تلقائياً
        </p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
          <p className="text-yellow-800 text-sm arabic">
            ⚠️ تم حذف جميع المنتجات المضافة والاحتفاظ بالمنتجات الأصلية لمطعم
            "زول اقاشي" فقط
          </p>
        </div>
      </div>
    </div>
  );
}
