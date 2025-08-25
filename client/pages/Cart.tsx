import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { PromoCodeService } from "@/lib/promoCodes";
import { useCurrencySafe } from "@/contexts/CurrencyContext";
import { toast } from "sonner";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { formatPrice, currentCurrency } = useCurrencySafe();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null);
  const [promoCodeError, setPromoCodeError] = useState("");

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

    // Calculate tax (0% for Sudan/Kuwait - no VAT currently applied)
    const taxRate = 0; // 0% tax rate - can be configured later
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal - discountAmount) * taxRate;

    // Navigate to checkout page with order summary
    const orderData = {
      items: cart.items,
      subtotal: subtotal,
      shipping: finalShippingCost,
      tax: taxAmount,
      discount: discountAmount,
      promoCode: appliedPromoCode,
      total: finalTotal,
    };

    // Store order data temporarily
    if (typeof window !== "undefined") {
      sessionStorage.setItem("orderData", JSON.stringify(orderData));
    }

    // Navigate to checkout
    navigate("/checkout");

    // Reset loading state after a short delay
    setTimeout(() => {
      setIsCheckingOut(false);
    }, 1000);
  };

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoCodeError("الرجاء إدخال كود الخصم");
      return;
    }

    const subtotal = calculateSubtotal();
    const validation = PromoCodeService.validatePromoCode(
      promoCode.trim(),
      subtotal,
    );

    if (validation.isValid && validation.promoCode) {
      setAppliedPromoCode(validation.promoCode);
      setPromoCodeError("");
      toast.success(`تم تطبيق كود الخصم: ${validation.message}`);
      setPromoCode(""); // Clear input after successful application
    } else {
      setPromoCodeError(validation.message);
      toast.error(validation.message);
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
    setPromoCodeError("");
    toast.success("تم إلغاء كود الخصم");
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const baseShippingCost = cart.totalItems > 0 ? 2 : 0; // 2 KD shipping cost

  // Calculate discount if promo code is applied
  const discountData = appliedPromoCode
    ? PromoCodeService.calculateDiscount(
        appliedPromoCode,
        calculateSubtotal(),
        baseShippingCost,
      )
    : {
        discountAmount: 0,
        finalAmount: calculateSubtotal(),
        shippingDiscount: 0,
      };

  const discountAmount = discountData.discountAmount;
  const shippingDiscount = discountData.shippingDiscount;
  const finalShippingCost = Math.max(0, baseShippingCost - shippingDiscount);

  const subtotalAfterDiscount = calculateSubtotal() - discountAmount;
  const finalTotal = subtotalAfterDiscount + finalShippingCost;

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
              لم تقم بإضافة أي منتجات إلى السلة بعد. تصفح منتجاتنا واختر ما
              يناسبك!
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
                          <Badge
                            variant="outline"
                            className="text-xs arabic mt-2"
                          >
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
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1,
                              )
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
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1,
                              )
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
                                  item.product.salePrice * item.quantity,
                                )}
                              </span>
                              <span className="text-sm text-gray-500 line-through arabic mr-2">
                                {formatPrice(
                                  item.product.price * item.quantity,
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-800 arabic">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          )}
                          <p className="text-xs text-gray-500 arabic">
                            {formatPrice(
                              item.product.salePrice || item.product.price,
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

                  {/* Applied Promo Code */}
                  {appliedPromoCode && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-700 font-medium arabic">
                            كود الخصم: {appliedPromoCode.code}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemovePromoCode}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          ×
                        </Button>
                      </div>
                      <p className="text-sm text-green-600 arabic">
                        {appliedPromoCode.description}
                      </p>
                    </div>
                  )}

                  {/* Discount Amount */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="arabic">خصم المنتجات</span>
                      <span className="font-medium arabic">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">الشحن</span>
                    <div className="text-right">
                      {shippingDiscount > 0 ? (
                        <div>
                          <span className="text-sm text-gray-500 line-through arabic">
                            {formatPrice(baseShippingCost)}
                          </span>
                          <span className="font-medium text-green-600 arabic mr-2">
                            {finalShippingCost > 0
                              ? formatPrice(finalShippingCost)
                              : "مجاني"}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium arabic">
                          {finalShippingCost > 0
                            ? formatPrice(finalShippingCost)
                            : "مجاني"}
                        </span>
                      )}
                    </div>
                  </div>

                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="arabic">المجموع الكلي</span>
                    <span className="arabic text-green-600">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  {/* Savings Display */}
                  {(discountAmount > 0 || shippingDiscount > 0) && (
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <span className="text-green-700 font-medium arabic">
                        وفرت {formatPrice(discountAmount + shippingDiscount)} 🎉
                      </span>
                    </div>
                  )}
                </div>

                {/* Promo Code */}
                {!appliedPromoCode && (
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="كود الخص�� (مثال: WELCOME10)"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoCodeError(""); // Clear error when user types
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleApplyPromoCode();
                          }
                        }}
                        className={`flex-1 px-3 py-2 border rounded-lg text-right arabic ${
                          promoCodeError ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="arabic"
                        onClick={handleApplyPromoCode}
                        disabled={!promoCode.trim()}
                      >
                        تطبيق
                      </Button>
                    </div>
                    {promoCodeError && (
                      <p className="text-red-600 text-sm mt-1 arabic">
                        {promoCodeError}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-gray-500 arabic">
                      <p>
                        أكواد متاحة للتجربة: WELCOME10, SUDAN20, FREESHIP, KWD10
                      </p>
                    </div>
                  </div>
                )}

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
                      <p className="text-sm text-gray-600 arabic">8.000 د.ك</p>
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
