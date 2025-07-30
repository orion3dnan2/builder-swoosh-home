import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Package,
  ShoppingCart,
  TrendingUp,
  Eye,
  Plus,
  BarChart3,
  Users,
  Star,
  Clock,
  AlertCircle,
  Settings,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MerchantDashboard() {
  const { user } = useAuth();
  const [isNewMerchant, setIsNewMerchant] = useState(true);

  // تحديد إذا كان التاجر جديد بناءً على تاريخ ��نشاء الحساب
  useEffect(() => {
    if (user?.createdAt) {
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
      // إذا كان الحساب أقل من 7 أيام وليس له منتجات أو طلبات، يُعتبر جديد
      setIsNewMerchant(daysSinceCreation < 7);
    }
  }, [user]);

  const [storeStats] = useState({
    totalProducts: isNewMerchant ? 0 : 45,
    totalOrders: isNewMerchant ? 0 : 128,
    monthlyRevenue: isNewMerchant ? 0 : 15420,
    storeViews: isNewMerchant ? 0 : 2340,
    activeProducts: isNewMerchant ? 0 : 42,
    outOfStock: isNewMerchant ? 0 : 3,
    pendingOrders: isNewMerchant ? 0 : 7,
    completedOrders: isNewMerchant ? 0 : 121,
    averageRating: isNewMerchant ? 0 : 4.6,
    totalReviews: isNewMerchant ? 0 : 89,
  });

  const recentOrders = isNewMerchant ? [] : [
    {
      id: "ORD-001",
      customer: "أحمد محمد",
      items: 3,
      total: 125.5,
      status: "pending",
      time: "منذ 15 دقيقة",
    },
    {
      id: "ORD-002",
      customer: "فاطمة علي",
      items: 1,
      total: 45.0,
      status: "confirmed",
      time: "منذ ساعة",
    },
    {
      id: "ORD-003",
      customer: "محمد سعد",
      items: 2,
      total: 89.99,
      status: "shipped",
      time: "منذ 3 ساعات",
    },
    {
      id: "ORD-004",
      customer: "عائشة أحمد",
      items: 4,
      total: 234.75,
      status: "delivered",
      time: "اليوم",
    },
  ];

  const lowStockProducts = isNewMerchant ? [] : [
    { name: "عطر صندل سوداني", stock: 2, sku: "PER-001" },
    { name: "كركديه طبيعي", stock: 1, sku: "TEA-003" },
    { name: "حقيبة سودانية", stock: 0, sku: "BAG-012" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار";
      case "confirmed":
        return "مؤكد";
      case "shipped":
        return "تم الشحن";
      case "delivered":
        return "تم التسليم";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 arabic">
                  لوحة إدارة المتجر
                </h1>
                <p className="text-gray-600 arabic">
                  مرحباً {user?.profile.name} -{" "}
                  {user?.profile.businessInfo?.businessName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Badge variant="secondary" className="arabic">
                صاحب متجر
              </Badge>
              <Link to="/">
                <Button variant="outline" size="sm" className="arabic">
                  <Eye className="w-4 h-4 ml-2" />
                  عرض المتجر
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-blue-800">
                    {storeStats.totalProducts}
                  </p>
                  <p className="text-blue-600 text-sm arabic">
                    إجمالي المنتجات
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="w-8 h-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-green-800">
                    {storeStats.totalOrders}
                  </p>
                  <p className="text-green-600 text-sm arabic">
                    إجمالي الطلبات
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-purple-800">
                    ${storeStats.monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-purple-600 text-sm arabic">
                    إيرادات الشهر
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-orange-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-orange-800">
                    {storeStats.storeViews.toLocaleString()}
                  </p>
                  <p className="text-orange-600 text-sm arabic">
                    مشاهدات المتجر
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/merchant/products/new">
            <Button className="w-full h-24 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg">
              <div className="text-center">
                <Plus className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm arabic">إضافة منتج جديد</span>
              </div>
            </Button>
          </Link>

          <Link to="/merchant/products">
            <Button
              variant="outline"
              className="w-full h-24 rounded-xl border-2 hover:bg-blue-50"
            >
              <div className="text-center">
                <Package className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm arabic">إدارة المنتجات</span>
              </div>
            </Button>
          </Link>

          <Link to="/merchant/orders">
            <Button
              variant="outline"
              className="w-full h-24 rounded-xl border-2 hover:bg-purple-50"
            >
              <div className="text-center">
                <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm arabic">إدارة الطلبات</span>
              </div>
            </Button>
          </Link>

          <Link to="/merchant/settings">
            <Button
              variant="outline"
              className="w-full h-24 rounded-xl border-2 hover:bg-gray-50"
            >
              <div className="text-center">
                <Settings className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm arabic">إعدادات المتجر</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center arabic">
                  <Clock className="w-5 h-5 ml-2" />
                  الطلبات الأخيرة
                </CardTitle>
                <Link to="/merchant/orders">
                  <Button variant="outline" size="sm" className="arabic">
                    عرض الكل
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <ShoppingCart className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 arabic">
                            {order.customer}
                          </p>
                          <p className="text-sm text-gray-600 arabic">
                            {order.id} • {order.items} منتج��ت
                          </p>
                          <p className="text-xs text-gray-500 arabic">
                            {order.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">
                          ${order.total}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs arabic ${getStatusColor(order.status)}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center arabic">
                  <BarChart3 className="w-5 h-5 ml-2" />
                  أداء المتجر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm arabic">المنتجات النشطة</span>
                  <span className="font-bold text-green-600">
                    {storeStats.activeProducts}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm arabic">طلبات معلقة</span>
                  <span className="font-bold text-yellow-600">
                    {storeStats.pendingOrders}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm arabic">متوسط التقييم</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-900 mr-1">
                      {storeStats.averageRating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm arabic">إجمالي المراجعات</span>
                  <span className="font-bold text-blue-600">
                    {storeStats.totalReviews}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800 arabic">
                    <AlertCircle className="w-5 h-5 ml-2" />
                    تنبيه المخزون
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 arabic">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">{product.sku}</p>
                        </div>
                        <Badge
                          variant={
                            product.stock === 0 ? "destructive" : "secondary"
                          }
                          className="arabic"
                        >
                          {product.stock === 0
                            ? "نفد المخزون"
                            : `${product.stock} متبقي`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/merchant/products?filter=low-stock">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full arabic"
                      >
                        إدارة المخزون
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Store Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center arabic">
                  <ImageIcon className="w-5 h-5 ml-2" />
                  تخصيص المتجر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/merchant/appearance">
                  <Button variant="outline" size="sm" className="w-full arabic">
                    تخصيص المظهر
                  </Button>
                </Link>
                <Link to="/merchant/profile">
                  <Button variant="outline" size="sm" className="w-full arabic">
                    تحديث المعلومات
                  </Button>
                </Link>
                <Link to="/merchant/analytics">
                  <Button variant="outline" size="sm" className="w-full arabic">
                    تقارير مفصلة
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
