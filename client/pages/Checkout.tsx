import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Clock,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface OrderData {
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  promoCode?: any;
  total: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "الرياض",
    postalCode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get order data from session storage
    const storedOrderData = sessionStorage.getItem('orderData');
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
    } else {
      // If no order data, redirect to cart
      toast.error("لا توجد بيانات طلب. يرجى المحاولة مرة أخرى");
      navigate('/cart');
    }
  }, [navigate]);

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ريال`;
  };

  const paymentMethods = [
    {
      id: "visa",
      name: "فيزا / ماستركارد",
      description: "بطاقة ائتمان أو خصم",
      icon: <CreditCard className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "mada",
      name: "مدى",
      description: "شبكة المدفوعات السعودية",
      icon: <Wallet className="w-6 h-6" />,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "knet",
      name: "كي نت",
      description: "الشبكة الكويتية للمدفوعات",
      icon: <Building2 className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      borderColor: "border-purple-200",
    },
    {
      id: "stcpay",
      name: "STC Pay",
      description: "محفظة إلكترونية",
      icon: <Phone className="w-6 h-6" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleProceedToPayment = () => {
    if (!selectedPaymentMethod) {
      toast.error("الرجاء اختيار طريقة الدفع");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("الرجاء إكمال بيانات التوصيل");
      return;
    }

    setIsProcessing(true);

    // Store all data for payment gateway
    const paymentData = {
      orderData,
      customerInfo,
      paymentMethod: selectedPaymentMethod,
      timestamp: new Date().toISOString(),
    };

    sessionStorage.setItem('paymentData', JSON.stringify(paymentData));

    // Navigate to payment gateway
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment-gateway');
    }, 1000);
  };

  if (!orderData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <AlertCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-400 mb-4 arabic">
              جاري تحميل بيانات الطلب...
            </h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart">
            <Button variant="outline" size="sm" className="arabic">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للسلة
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 arabic">
            إتمام الطلب
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8 space-x-reverse">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="mr-2 text-sm arabic text-green-600 font-medium">السلة</span>
            </div>
            <div className="flex-1 h-1 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="mr-2 text-sm arabic text-blue-600 font-medium">الدفع</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="mr-2 text-sm arabic text-gray-500">التأكيد</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold arabic mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  بيانات التوصيل
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right arabic"
                      placeholder="اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                      رقم الجوال *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right arabic"
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right arabic"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                      المدينة
                    </label>
                    <select
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right arabic bg-white"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="الخبر">الخبر</option>
                      <option value="مكة">مكة</option>
                      <option value="المدينة">المدينة</option>
                      <option value="تبوك">تبوك</option>
                      <option value="أبها">أبها</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                      العنوان التفصيلي *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right arabic"
                      rows={3}
                      placeholder="الحي، الشارع، رقم المبنى، رقم الشقة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                      الرمز البريدي
                    </label>
                    <input
                      type="text"
                      value={customerInfo.postalCode}
                      onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right arabic"
                      placeholder="12345"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold arabic mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  طريقة الدفع
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedPaymentMethod === method.id
                          ? `${method.borderColor} ${method.bgColor}`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${method.color}`}>
                            {method.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold arabic">{method.name}</h4>
                            <p className="text-sm text-gray-600 arabic">{method.description}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedPaymentMethod === method.id
                            ? `${method.borderColor.replace('border-', 'border-')} bg-current`
                            : "border-gray-300"
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <CheckCircle className="w-5 h-5 text-white fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-800 arabic">دفع آمن ومضمون</h4>
                    <p className="text-sm text-blue-700 arabic mt-1">
                      جميع المعاملات محمية بتشفير SSL 256-bit ومراقبة من قبل أنظمة الأمان المتقدمة
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold arabic mb-4">ملخص الطلب</h3>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {orderData.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm arabic line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-600 arabic">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-sm arabic">
                        {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-200 my-4" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 arabic">المجموع الفرعي</span>
                    <span className="arabic">{formatPrice(orderData.subtotal)}</span>
                  </div>
                  
                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="arabic">الخصم</span>
                      <span className="arabic">-{formatPrice(orderData.discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 arabic">الشحن</span>
                    <span className="arabic">
                      {orderData.shipping > 0 ? formatPrice(orderData.shipping) : "مجاني"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 arabic">الضريبة</span>
                    <span className="arabic">{formatPrice(orderData.tax)}</span>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="arabic">المجموع</span>
                    <span className="text-green-600 arabic">{formatPrice(orderData.total)}</span>
                  </div>
                </div>

                {orderData.promoCode && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 arabic">
                      كود الخصم: {orderData.promoCode.code}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold arabic mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  معلومات التوصيل
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 arabic">التوصيل خلال 2-3 أيام عمل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 arabic">سيتم التواصل معك لتأكيد الطلب</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 arabic">ستصلك رسالة تأكيد عبر الجوال</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proceed Button */}
            <Button
              onClick={handleProceedToPayment}
              disabled={isProcessing || !selectedPaymentMethod}
              className="w-full py-3 text-lg arabic bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                "جاري المعالجة..."
              ) : (
                <>
                  <CreditCard className="w-5 h-5 ml-2" />
                  متابعة للدفع ({formatPrice(orderData.total)})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
