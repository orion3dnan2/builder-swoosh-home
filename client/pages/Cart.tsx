import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ريال`;
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
      toast.success("تم تحديث الكمية");
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success("تم حذف المنتج من السلة");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("تم تفريغ السلة");
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      toast.success("تم إرسال طلبك بنجاح!");
      clearCart();
    }, 2000);
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const shippingCost = cart.totalItems > 0 ? 10 : 0;
  const tax = calculateSubtotal() * 0.15; // 15% VAT
  const total = calculateSubtotal() + shippingCost + tax;

  if (cart.totalItems === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-400 mb-4 arabic">
              السلة فارغة
            </h2>
            <p className="text-gray-500 mb-8 arabic max-w-md mx-auto">
              لم تقم بإضافة أي منتجات إلى السلة بعد. تصفح منتجاتنا واختر ما يناسبك!
            </p>
            <Link to="/products">
              <Button className="arabic">
                <Package className="w-4 h-4 ml-2" />
                تصفح المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/products">
              <Button variant="outline" size="sm" className="arabic">
                <ArrowLeft className="w-4 h-4 ml-2" />
                متابعة التسوق
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 arabic">
              سلة التسوق
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="arabic">
              {cart.totalItems} منتج
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              className="arabic text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 ml-1" />
              تفريغ السلة
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.productId} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 arabic mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600 arabic line-clamp-2">
                            {item.product.description}
                          </p>
                          <Badge variant="outline" className="text-xs arabic mt-2">
                            {item.product.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium px-3">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          {item.product.salePrice ? (
                            <div>
                              <span className="text-lg font-bold text-green-600 arabic">
                                {formatPrice(
                                  item.product.salePrice * item.quantity
                                )}
                              </span>
                              <span className="text-sm text-gray-500 line-through arabic mr-2">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-800 arabic">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          )}
                          <p className="text-xs text-gray-500 arabic">
                            {formatPrice(
                              item.product.salePrice || item.product.price
                            )}{" "}
                            للقطعة
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold arabic mb-4">ملخص الطلب</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">
                      المجموع الفرعي ({cart.totalItems} منتج)
                    </span>
                    <span className="font-medium arabic">
                      {formatPrice(calculateSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">الشحن</span>
                    <span className="font-medium arabic">
                      {shippingCost > 0 ? formatPrice(shippingCost) : "مجاني"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">ضريبة القيمة المضافة</span>
                    <span className="font-medium arabic">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="arabic">المجموع الكلي</span>
                    <span className="arabic text-green-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود الخصم"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right arabic"
                    />
                    <Button variant="outline" size="sm" className="arabic">
                      تطبيق
                    </Button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full mt-6 arabic bg-green-600 hover:bg-green-700"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <span className="arabic">جاري المعالجة...</span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 ml-2" />
                      إتمام الطلب
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Security & Shipping Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold arabic mb-4">
                  معلومات الأمان والشحن
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium arabic">دفع آمن 100%</p>
                      <p className="text-sm text-gray-600 arabic">
                        مشفر بتقنية SSL
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium arabic">شحن سريع</p>
                      <p className="text-sm text-gray-600 arabic">
                        التوصيل خلال 2-3 أيام عمل
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium arabic">سياسة الإرجاع</p>
                      <p className="text-sm text-gray-600 arabic">
                        إرجاع مجاني خلال 14 يوم
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold arabic mb-4">
                  منتجات قد تعجبك
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/placeholder.svg"
                      alt="منتج مقترح"
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm arabic">
                        منتج سوداني أصيل
                      </p>
                      <p className="text-sm text-gray-600 arabic">25.99 ريال</p>
                    </div>
                    <Button size="sm" variant="outline" className="arabic">
                      إضافة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
