import { useEffect } from "react";
import { useProducts } from "@/lib/products";

export default function ClearDemoProducts() {
  const { clearDemoProducts } = useProducts();

  useEffect(() => {
    // حذف جميع المنتجات التجريبية والاحتفاظ بمنتجات زول اقاشي فقط
    clearDemoProducts();
    
    // إعادة تحميل الصفحة لضمان تطبيق التغييرات
    window.location.reload();
  }, [clearDemoProducts]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 arabic">جاري تنظيف المنتجات التجريبية...</p>
        <p className="text-sm text-gray-500 arabic mt-2">سيتم إعادة تحميل الصفحة تلقائياً</p>
      </div>
    </div>
  );
}
