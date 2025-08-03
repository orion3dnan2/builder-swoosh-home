import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store as StoreIcon,
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  ShoppingCart,
  ArrowLeft,
  Package,
  Heart,
  Share,
  Navigation,
  Truck,
  CreditCard,
} from "lucide-react";
import { useProducts, ProductService } from "@/lib/products";

export default function Store() {
  const { id } = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // جلب منتجات المتجر
  const { products: allProducts } = useProducts();
  const storeProducts = allProducts.filter(
    (product) => product.storeId === id && product.status === "active",
  );

  // جلب معلومات المتجر
  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stores/general`);
        if (response.ok) {
          const stores = await response.json();
          const foundStore = stores.find((s: any) => s.id === id);
          if (foundStore) {
            setStore(foundStore);
          } else {
            setError("المتجر غير موجود");
          }
        } else {
          setError("خطأ في جلب بيانات المتجر");
        }
      } catch (error) {
        console.error("خطأ في جلب المتجر:", error);
        setError("خطأ في الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStore();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ريال`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600 arabic">
              جاري تحميل بيانات المتجر...
            </span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !store) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <StoreIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-400 mb-4 arabic">
              {error || "المتجر غير موجود"}
            </h2>
            <Link to="/products">
              <Button className="arabic">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للمنتجات
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header with back button */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <Link to="/products">
              <Button variant="outline" size="sm" className="arabic">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للمنتجات
              </Button>
            </Link>
          </div>
        </div>

        {/* Store Hero Section */}
        <div className="relative">
          <img
            src={store.banner || "/placeholder.svg"}
            alt={store.name}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <div className="flex items-end gap-4">
                <img
                  src={store.logo || "/placeholder.svg"}
                  alt={store.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="text-white">
                  <h1 className="text-3xl md:text-4xl font-bold arabic mb-2">
                    {store.name}
                  </h1>
                  <p className="text-lg arabic opacity-90">
                    {store.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="arabic">4.7 (156 تقييم)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="arabic">{store.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span className="arabic">
                        {storeProducts.length} منتج
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Store Features */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold arabic mb-4">
                    مزايا المتجر
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Truck className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium arabic">توصيل سريع</p>
                        <p className="text-sm text-gray-600 arabic">
                          خلال 24 ساعة
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium arabic">دفع آمن</p>
                        <p className="text-sm text-gray-600 arabic">
                          جميع طرق الدفع
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Star className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-medium arabic">جودة عالية</p>
                        <p className="text-sm text-gray-600 arabic">
                          منتجات مضمونة
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold arabic">منتجات المتجر</h2>
                    <div className="flex items-center gap-2">
                      <Badge className="arabic">
                        {storeProducts.length} منتج
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant={viewMode === "grid" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                        >
                          <Package className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                        >
                          ☰
                        </Button>
                      </div>
                    </div>
                  </div>

                  {storeProducts.length > 0 ? (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                          : "space-y-4"
                      }
                    >
                      {storeProducts.map((product) => (
                        <Card
                          key={product.id}
                          className="overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {viewMode === "grid" ? (
                            <>
                              <div className="relative">
                                <img
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-48 object-cover"
                                />
                                {product.salePrice && (
                                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs arabic">
                                    خصم{" "}
                                    {Math.round(
                                      (1 - product.salePrice / product.price) *
                                        100,
                                    )}
                                    %
                                  </div>
                                )}
                                <div className="absolute top-2 left-2">
                                  <Badge className="arabic">
                                    {ProductService.getCategoryIcon(
                                      product.category,
                                    )}{" "}
                                    {product.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-gray-800 arabic mb-2">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 arabic line-clamp-2 mb-3">
                                  {product.description}
                                </p>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-right">
                                    {product.salePrice ? (
                                      <div>
                                        <span className="font-bold text-green-600 arabic">
                                          {formatPrice(product.salePrice)}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through arabic mr-2">
                                          {formatPrice(product.price)}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="font-bold text-gray-800 arabic">
                                        {formatPrice(product.price)}
                                      </span>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="arabic">
                                    {product.inventory.quantity} قطعة
                                  </Badge>
                                </div>
                                <Button size="sm" className="w-full arabic">
                                  <ShoppingCart className="w-4 h-4 ml-2" />
                                  أضف للسلة
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex gap-4 p-4">
                              <img
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-bold text-gray-800 arabic mb-1">
                                      {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 arabic line-clamp-2">
                                      {product.description}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    {product.salePrice ? (
                                      <div>
                                        <span className="font-bold text-green-600 arabic">
                                          {formatPrice(product.salePrice)}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through arabic mr-2">
                                          {formatPrice(product.price)}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="font-bold text-gray-800 arabic">
                                        {formatPrice(product.price)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs arabic"
                                    >
                                      {ProductService.getCategoryIcon(
                                        product.category,
                                      )}{" "}
                                      {product.category}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs arabic"
                                    >
                                      {product.inventory.quantity} قطعة
                                    </Badge>
                                  </div>
                                  <Button size="sm" className="arabic">
                                    <ShoppingCart className="w-4 h-4 ml-1" />
                                    أضف للسلة
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2 arabic">
                        لا توجد منتجات حالياً
                      </h3>
                      <p className="text-gray-600 arabic">
                        المتجر يعمل على إضافة منتجات جديدة
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold arabic mb-4">
                    معلومات التواصل
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{store.phone}</p>
                        <p className="text-sm text-gray-600 arabic">
                          للطلب والاستفسار
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{store.email}</p>
                        <p className="text-sm text-gray-600 arabic">
                          البريد الإلكتروني
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium arabic">
                          {store.address || store.city}
                        </p>
                        <p className="text-sm text-gray-600 arabic">العنوان</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button className="w-full arabic bg-green-600 hover:bg-green-700">
                      <Phone className="w-4 h-4 ml-2" />
                      اتصل الآن
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 arabic">
                        <Heart className="w-4 h-4 ml-1" />
                        مفضلة
                      </Button>
                      <Button variant="outline" className="flex-1 arabic">
                        <Share className="w-4 h-4 ml-1" />
                        مشاركة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold arabic mb-4">ساعات العمل</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="arabic">السبت - الخميس</span>
                      <span className="arabic">
                        {store.workingHours?.start || "09:00"} -{" "}
                        {store.workingHours?.end || "18:00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="arabic">الجمعة</span>
                      <span className="arabic">
                        {store.workingHours?.start || "14:00"} -{" "}
                        {store.workingHours?.end || "18:00"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium arabic">
                        مفتوح الآن
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold arabic mb-4">
                    معلومات التوصيل
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 arabic">رسوم التوصيل</span>
                      <span className="font-medium arabic">
                        {store.shippingSettings?.standardShippingCost || 15}{" "}
                        ريال
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 arabic">أقل طلب</span>
                      <span className="font-medium arabic">50 ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 arabic">وقت التوصيل</span>
                      <span className="font-medium arabic">
                        {store.shippingSettings?.processingTime || "1-3 أيام"}
                      </span>
                    </div>
                    {store.shippingSettings?.freeShippingThreshold && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-700 text-sm arabic">
                          توصيل مجاني للطلبات فوق{" "}
                          {store.shippingSettings.freeShippingThreshold} ريال
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
