import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
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
  Users,
  Award,
} from "lucide-react";
import { useProducts } from "@/lib/products";

export default function Company() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // جلب منتجات/خدمات الشركة
  const { products: allProducts } = useProducts();
  const companyProducts = allProducts.filter(product => 
    product.storeId === id && product.status === "active"
  );

  // جلب معلومات الشركة
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stores/companies`);
        if (response.ok) {
          const companies = await response.json();
          const foundCompany = companies.find((c: any) => c.id === id);
          if (foundCompany) {
            setCompany(foundCompany);
          } else {
            setError("الشركة غير موجودة");
          }
        } else {
          setError("خطأ في جلب بيانات الشركة");
        }
      } catch (error) {
        console.error("خطأ في جلب الشركة:", error);
        setError("خطأ في الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 arabic">جاري تحميل بيانات الشركة...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !company) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <Building2 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-400 mb-4 arabic">
              {error || "الشركة غير موجودة"}
            </h2>
            <Link to="/companies">
              <Button className="arabic">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للشركات
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
            <Link to="/companies">
              <Button variant="outline" size="sm" className="arabic">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للشركات
              </Button>
            </Link>
          </div>
        </div>

        {/* Company Hero Section */}
        <div className="relative">
          <img
            src={company.banner || "/placeholder.svg"}
            alt={company.name}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <div className="flex items-end gap-4">
                <img
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="text-white">
                  <h1 className="text-3xl md:text-4xl font-bold arabic mb-2">
                    {company.name}
                  </h1>
                  <p className="text-lg arabic opacity-90">
                    {company.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="arabic">4.9 (89 تقييم)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="arabic">{company.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span className="arabic">شركة معتمدة</span>
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
              {/* Quick Actions */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold arabic">إجراءات سريعة</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 ml-1" />
                        <span className="arabic">مفضلة</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4 ml-1" />
                        <span className="arabic">مشاركة</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products/Services */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold arabic">الخدمات والمنتجات</h2>
                    <Badge className="arabic">{companyProducts.length} خدمة</Badge>
                  </div>

                  {companyProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {companyProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex">
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-24 h-24 object-cover"
                            />
                            <div className="flex-1 p-4">
                              <h3 className="font-bold text-gray-800 arabic mb-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 arabic line-clamp-2 mb-2">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
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
                                <Button size="sm" className="arabic">
                                  <ShoppingCart className="w-3 h-3 ml-1" />
                                  طلب الخدمة
                                </Button>
                              </div>
                            </div>
                          </div>
                          {product.salePrice && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs arabic">
                              خصم {Math.round((1 - product.salePrice / product.price) * 100)}%
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2 arabic">
                        الخدمات قريباً
                      </h3>
                      <p className="text-gray-600 arabic">
                        الشركة تعمل على إضافة خدمات جديدة
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
                  <h3 className="text-lg font-bold arabic mb-4">معلومات التواصل</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{company.phone}</p>
                        <p className="text-sm text-gray-600 arabic">للاستفسار والطلبات</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{company.email}</p>
                        <p className="text-sm text-gray-600 arabic">البريد الإلكتروني</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium arabic">{company.address || company.city}</p>
                        <p className="text-sm text-gray-600 arabic">العنوان</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button className="w-full arabic bg-blue-600 hover:bg-blue-700">
                      <Phone className="w-4 h-4 ml-2" />
                      اتصل الآن
                    </Button>
                    <Button variant="outline" className="w-full arabic">
                      <Navigation className="w-4 h-4 ml-2" />
                      الاتجاهات
                    </Button>
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
                        {company.workingHours?.start || "08:00"} - {company.workingHours?.end || "17:00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="arabic">الجمعة</span>
                      <span className="arabic">مغلق</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium arabic">مفتوح الآن</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold arabic mb-4">إحصائيات الشركة</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 arabic">عدد الموظفين</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium arabic">50+</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 arabic">سنوات الخبرة</span>
                      <span className="font-medium arabic">10 سنوات</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 arabic">العملاء</span>
                      <span className="font-medium arabic">500+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 arabic">المشاريع المكتملة</span>
                      <span className="font-medium arabic">200+</span>
                    </div>
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
