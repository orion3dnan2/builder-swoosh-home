import { useState } from "react";
import { ProductService } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";

export default function AddSampleProducts() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProducts = () => {
    setLoading(true);
    try {
      // Add sample products for the specific restaurant
      const restaurantId = "store-1753868707117-r80zjqevj";
      ProductService.addSampleRestaurantProducts(restaurantId);
      setMessage("تم إضافة المنتجات التجريبية بنجاح!");
    } catch (error) {
      setMessage("حدث خطأ في إضافة المنتجات");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearProducts = () => {
    setLoading(true);
    try {
      localStorage.removeItem("bayt_al_sudani_products");
      setMessage("تم مسح جميع المنتجات");
    } catch (error) {
      setMessage("حدث خطأ في المسح");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="arabic">إدارة المنتجات التجريبية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={handleAddProducts} 
                disabled={loading}
                className="w-full arabic"
              >
                إضافة منتجات تجريبية لمطعم زول اقاشي
              </Button>
              
              <Button 
                onClick={handleClearProducts} 
                disabled={loading}
                variant="destructive"
                className="w-full arabic"
              >
                مسح جميع المنتجات
              </Button>
            </div>
            
            {message && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 arabic">{message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
