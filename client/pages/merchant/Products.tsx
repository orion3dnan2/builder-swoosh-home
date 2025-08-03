import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  ArrowLeft,
  Grid3x3,
  List,
  SortAsc,
  SortDesc,
  Sparkles,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/lib/products";
import { StoresService } from "@/lib/stores";
import { Currency, defaultCurrency, formatPriceArabic } from "@/lib/currencies";
import { Product } from "../../../shared/types";

export default function MerchantProducts() {
  const { user } = useAuth();
  const [isNewMerchant, setIsNewMerchant] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "updated">(
    "updated",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Use products hook to get actual products
  const {
    products: allProducts,
    deleteProduct,
    updateStock,
    categories,
    getProductsByStatus,
    searchProducts,
    clearAllProducts,
  } = useProducts();

  // Get user's store information - use proper store mapping
  const getUserStoreId = () => {
    if (!user?.id) return null;

    // Known store mappings from stores.json
    const storeMapping: Record<string, string> = {
      "user-1753865301240-efsqj09s0": "store-1753868707117-r80zjqevj", // زول اقاشي
      "merchant-001": "store-001",
      "admin-001": "store-001",
    };

    const userStoreId = storeMapping[user.id];
    if (userStoreId) {
      return userStoreId;
    }

    // Fallback: if user has businessName, assume they have a store
    if (user.profile?.businessName) {
      return `store-${user.id}`;
    }

    return null;
  };

  const userStoreId = getUserStoreId();
  const userStoreName = user?.profile?.businessName || "متجرك";

  // Filter products by current user's store only
  const products = userStoreId
    ? allProducts.filter((product) => product.storeId === userStoreId)
    : [];

  const currentStore = userStoreId
    ? {
        id: userStoreId,
        name: userStoreName,
        category: user?.profile?.businessType || "general",
      }
    : null;

  // تحديد إذا كان التاجر جديد
  useEffect(() => {
    if (user?.createdAt) {
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
      setIsNewMerchant(daysSinceCreation < 7 && products.length === 0);
    }
  }, [user, products.length]);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || product.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "stock":
          comparison = a.inventory.quantity - b.inventory.quantity;
          break;
        case "updated":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const userCategories = [...new Set(products.map((p) => p.category))];

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "نشط";
      case "inactive":
        return "غ���ر نشط";
      case "out_of_stock":
        return "نفد المخزون";
      default:
        return status;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        deleteProduct(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleStockUpdate = (id: string, newQuantity: number) => {
    try {
      updateStock(id, newQuantity);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleResetToOriginalProduct = () => {
    if (window.confirm("هل تريد مسح جميع المنتجات والاحتفاظ بـ 'طلب اقاشي فراخ وسط' فقط؟")) {
      clearAllProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link to="/merchant/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 arabic">
                  إدارة المنتجات
                </h1>
                <p className="text-gray-600 arabic mt-1">
                  {filteredProducts.length} منتج في متجرك
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Badge variant="outline" className="arabic">
                {currentStore?.name}
              </Badge>
              <Button
                variant="outline"
                onClick={handleResetToOriginalProduct}
                className="arabic text-red-600 border-red-300 hover:bg-red-50"
              >
                إعادة تعيين المنتجات
              </Button>
              <Link to="/merchant/products/new">
                <Button className="arabic">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة منتج جديد
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Info Banner */}
        {currentStore && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-800 arabic">
                  منتجات متجر: {currentStore.name}
                </h3>
                <p className="text-xs text-blue-600 arabic">
                  منتجاتك تظهر في السوق العام تلقائياً • يمكن للعملاء رؤية وشراء
                  منتجاتك
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message for users without store */}
        {!currentStore && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 arabic">
                  يجب إعداد معلومات المتجر أولاً
                </h3>
                <p className="text-xs text-yellow-700 arabic">
                  لعرض وإدارة منتجاتك، يرجى إكمال مع��ومات العمل التجاري في
                  إعدادات الملف الشخصي
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 arabic text-right"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 arabic text-right"
              >
                <option value="all">جميع الفئات</option>
                {userCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 arabic text-right"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="out_of_stock">نفد المخزون</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 arabic text-right"
              >
                <option value="updated-desc">الأحدث أولاً</option>
                <option value="updated-asc">الأقدم أولاً</option>
                <option value="name-asc">الاسم أ-ي</option>
                <option value="name-desc">الاسم ي-أ</option>
                <option value="price-asc">السعر (منخفض-عالي)</option>
                <option value="price-desc">السعر (عالي-منخفض)</option>
                <option value="stock-asc">المخزون (��ليل-كثير)</option>
                <option value="stock-desc">المخزون (كثير-قليل)</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.salePrice && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      خصم{" "}
                      {Math.round(
                        ((product.price - product.salePrice) / product.price) *
                          100,
                      )}
                      %
                    </Badge>
                  )}
                  <Badge
                    className={`absolute top-2 left-2 ${getStatusColor(product.status)}`}
                  >
                    {getStatusText(product.status)}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 arabic">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 arabic line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {product.salePrice ? (
                        <>
                          <span className="font-bold text-green-600">
                            ${product.salePrice}
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-gray-900">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="arabic">
                      {product.inventory.quantity} قطعة
                    </Badge>
                  </div>

                  {product.inventory.quantity <=
                    product.inventory.lowStockThreshold && (
                    <div className="flex items-center text-orange-600 text-sm mb-3">
                      <AlertTriangle className="w-4 h-4 ml-1" />
                      <span className="arabic">مخزون منخفض</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Link to={`/merchant/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 ml-2" />
                      <span className="arabic">عرض</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider arabic">
                        المنتج
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider arabic">
                        الفئة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider arabic">
                        السعر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider arabic">
                        المخزون
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider arabic">
                        الحا��ة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider arabic">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 arabic">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.inventory.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="arabic">
                            {product.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            {product.salePrice ? (
                              <>
                                <span className="font-bold text-green-600">
                                  ${product.salePrice}
                                </span>
                                <span className="text-gray-400 line-through text-sm">
                                  ${product.price}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-gray-900">
                                ${product.price}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Input
                              type="number"
                              value={product.inventory.quantity}
                              onChange={(e) =>
                                handleStockUpdate(
                                  product.id,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-20 h-8 text-center"
                              min="0"
                            />
                            {product.inventory.quantity <=
                              product.inventory.lowStockThreshold && (
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(product.status)}>
                            {getStatusText(product.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Link to={`/merchant/products/${product.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Store Setup Message */}
        {!currentStore && (
          <div className="text-center py-12">
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 arabic">
                  إعداد المتجر مطلوب
                </h3>
                <p className="text-gray-700 mb-6 arabic">
                  لبدء إدارة منتجاتك، يرجى إكمال معلومات العمل التجاري (اسم
                  العمل، نوع ال��مل) في ملفك الشخصي أولاً.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/profile">
                    <Button className="arabic bg-yellow-600 hover:bg-yellow-700">
                      <Settings className="w-4 h-4 ml-2" />
                      إكمال معلومات المتجر
                    </Button>
                  </Link>
                  <Link to="/merchant/settings">
                    <Button variant="outline" className="arabic">
                      إعدادات التاجر
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Products Message */}
        {currentStore && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            {isNewMerchant ? (
              <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 arabic">
                    ابدأ رحلتك التجارية! 🚀
                  </h3>
                  <p className="text-gray-700 mb-6 arabic">
                    أهلاً وسهلاً {user?.profile?.name}! متجر "
                    {currentStore.name}" جاهز الآن. ابدأ بإضافة منتجاتك الأولى
                    لتكون متاحة للعملاء.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/merchant/products/new">
                      <Button className="arabic bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 ml-2" />
                        أضف منتجك الأول
                      </Button>
                    </Link>
                    <Link to="/merchant/settings">
                      <Button variant="outline" className="arabic">
                        إعداد المتجر أولاً
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2 arabic">
                  لا توجد منتجات في متجرك
                </h3>
                <p className="text-gray-600 arabic mb-4">
                  لم يتم العثور على منتجات في متجر "{currentStore.name}" تطابق
                  معايير البحث
                </p>
                <Link to="/merchant/products/new">
                  <Button className="arabic">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة منتج جديد
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
