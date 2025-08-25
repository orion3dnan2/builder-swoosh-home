import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShoppingCart,
  Store,
  Star,
  Heart,
  Share2,
  Plus,
  Minus,
  Eye,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Package,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { ProductService, useProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useCurrencySafe } from "@/contexts/CurrencyContext";
import { toast } from "sonner";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { formatPrice } = useCurrencySafe();
  const {
    addToCart,
    removeFromCart,
    updateQuantity,
    getProductQuantity,
  } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // البحث عن المنتج
  const productsWithStore = ProductService.getProductsWithStore();
  const product = productsWithStore.find((p) => p.id === id);

  useEffect(() => {
    if (!product) {
      navigate("/products");
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 arabic mb-4">
              المنتج غير موجود
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

  const handleAddToCart = () => {
    try {
      addToCart(product, quantity);
      toast.success(`تم إضافة ${product.name} إلى السلة`, {
        description: `الكمية: ${quantity}`,
      });
    } catch (error) {
      toast.error("فشل في إضافة المنتج إلى السلة");
    }
  };

  const handleIncreaseQuantity = () => {
    const currentQuantity = getProductQuantity(product.id);
    updateQuantity(product.id, currentQuantity + 1);
    toast.success("تم زيادة الكمية");
  };

  const handleDecreaseQuantity = () => {
    const currentQuantity = getProductQuantity(product.id);
    if (currentQuantity > 1) {
      updateQuantity(product.id, currentQuantity - 1);
      toast.success("تم تقليل الكمية");
    } else {
      removeFromCart(product.id);
      toast.success("تم حذف المنتج من السلة");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ رابط المنتج");
    }
  };

  const currentCartQuantity = getProductQuantity(product.id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/products")}
            className="arabic"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للمنتجات
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={isWishlisted ? "text-red-500" : ""}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.salePrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold arabic">
                  خصم {Math.round((1 - product.salePrice / product.price) * 100)}%
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge
                  className={`text-white text-xs arabic ${ProductService.getStatusBadgeColor(product.status)}`}
                >
                  {ProductService.getStatusText(product.status)}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 arabic mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 arabic leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Store Info */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Store className="w-5 h-5 text-gray-400" />
              <div>
                <Link
                  to={`/store/${product.storeId}`}
                  className="font-medium text-blue-600 arabic hover:underline"
                >
                  {product.storeName}
                </Link>
                <div className="text-sm text-gray-500 arabic">
                  تاجر موثق ⭐ 4.8 (156 تقييم)
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.salePrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-green-600 arabic">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through arabic">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900 arabic">
                  {formatPrice(product.price)}
                </span>
              )}
              <div className="text-sm text-gray-500 arabic">
                شامل الضريبة • توصيل مجاني للطلبات فوق 50 د.ك
              </div>
            </div>

            {/* Category and Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="arabic">
                {ProductService.getCategoryIcon(product.category)} {product.category}
              </Badge>
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="arabic text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inventory.quantity > 0 ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium arabic">
                    متوفر في المخزون ({product.inventory.quantity} قطعة)
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 font-medium arabic">
                    غير متوفر حالياً
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-4">
              {currentCartQuantity > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDecreaseQuantity}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">
                      {currentCartQuantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleIncreaseQuantity}
                      disabled={currentCartQuantity >= product.inventory.quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 arabic">
                    في السلة
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.inventory.quantity, quantity + 1))}
                      disabled={quantity >= product.inventory.quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.inventory.quantity === 0}
                    className="flex-1 arabic"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    أضف إلى السلة
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold arabic mb-2">توصيل سريع</h3>
              <p className="text-sm text-gray-600 arabic">
                توصيل خلال 24-48 ساعة
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold arabic mb-2">ضمان الجودة</h3>
              <p className="text-sm text-gray-600 arabic">
                ضمان لمدة سنة كاملة
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold arabic mb-2">إرجاع مجاني</h3>
              <p className="text-sm text-gray-600 arabic">
                إرجاع خلال 14 يوم
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Product Specifications */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold arabic mb-4">مواصفات المنتج</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 arabic">الفئة:</span>
                  <span className="font-medium arabic">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 arabic">المخزون:</span>
                  <span className="font-medium arabic">{product.inventory.quantity} قطعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 arabic">الحالة:</span>
                  <span className="font-medium arabic">
                    {ProductService.getStatusText(product.status)}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 arabic">الوزن:</span>
                  <span className="font-medium arabic">1.2 كجم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 arabic">الأبعاد:</span>
                  <span className="font-medium arabic">20 × 15 × 5 سم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 arabic">المنشأ:</span>
                  <span className="font-medium arabic">السودان</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold arabic">تقييمات المنتج</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(24 تقييم)</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Sample Review */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      أ
                    </div>
                    <div>
                      <div className="font-medium arabic">أحمد محمد</div>
                      <div className="text-xs text-gray-500">منذ 3 أيام</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 5 ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 arabic">
                  منتج ممتاز وجودة عالية. وصل في الوقت المحدد والتغليف ممتاز. أنصح بالشراء.
                </p>
              </div>

              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      ف
                    </div>
                    <div>
                      <div className="font-medium arabic">فاطمة أحمد</div>
                      <div className="text-xs text-gray-500">منذ أسبوع</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 arabic">
                  المنتج جيد لكن التوصيل تأخر قليلاً. بشكل عام راضية عن الشراء.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 arabic">
              <MessageCircle className="w-4 h-4 ml-2" />
              أضف تقييمك
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
