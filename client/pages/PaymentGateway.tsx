import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Phone,
  Building2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { PromoCodeService } from "@/lib/promoCodes";

interface PaymentData {
  orderData: any;
  customerInfo: any;
  paymentMethod: string;
  timestamp: string;
}

export default function PaymentGateway() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success' | 'failed'>('form');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    phoneNumber: "",
    pin: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedPaymentData = sessionStorage.getItem('paymentData');
    if (storedPaymentData) {
      setPaymentData(JSON.parse(storedPaymentData));
    } else {
      toast.error("بيانات الدفع غير متوفرة");
      navigate('/cart');
    }
  }, [navigate]);

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ريال`;
  };

  const getPaymentMethodInfo = (method: string) => {
    const methods = {
      visa: {
        name: "فيزا / ماستركارد",
        icon: <CreditCard className="w-6 h-6" />,
        color: "text-blue-600",
        fields: ['cardNumber', 'expiryDate', 'cvv', 'cardName']
      },
      mada: {
        name: "مدى",
        icon: <Wallet className="w-6 h-6" />,
        color: "text-green-600",
        fields: ['cardNumber', 'expiryDate', 'cvv', 'cardName']
      },
      knet: {
        name: "كي نت",
        icon: <Building2 className="w-6 h-6" />,
        color: "text-purple-600",
        fields: ['cardNumber', 'pin']
      },
      stcpay: {
        name: "STC Pay",
        icon: <Phone className="w-6 h-6" />,
        color: "text-indigo-600",
        fields: ['phoneNumber', 'pin']
      }
    };
    return methods[method as keyof typeof methods] || methods.visa;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const methodInfo = getPaymentMethodInfo(paymentData?.paymentMethod || 'visa');

    if (methodInfo.fields.includes('cardNumber')) {
      if (!paymentForm.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = "رقم البطاقة مطلوب";
      } else if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = "رقم البطاقة غير صحيح";
      }
    }

    if (methodInfo.fields.includes('expiryDate')) {
      if (!paymentForm.expiryDate) {
        newErrors.expiryDate = "تاريخ الانتهاء مطلوب";
      } else if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) {
        newErrors.expiryDate = "تاريخ الانتهاء غير صحيح";
      }
    }

    if (methodInfo.fields.includes('cvv')) {
      if (!paymentForm.cvv) {
        newErrors.cvv = "رمز الأمان مطلوب";
      } else if (paymentForm.cvv.length < 3) {
        newErrors.cvv = "رمز الأمان غير صحيح";
      }
    }

    if (methodInfo.fields.includes('cardName')) {
      if (!paymentForm.cardName.trim()) {
        newErrors.cardName = "اسم حامل البطا��ة مطلوب";
      }
    }

    if (methodInfo.fields.includes('phoneNumber')) {
      if (!paymentForm.phoneNumber) {
        newErrors.phoneNumber = "رقم الجوال مطلوب";
      } else if (!/^05\d{8}$/.test(paymentForm.phoneNumber)) {
        newErrors.phoneNumber = "رقم الجوال غير صحيح";
      }
    }

    if (methodInfo.fields.includes('pin')) {
      if (!paymentForm.pin) {
        newErrors.pin = "الرقم السري مطلوب";
      } else if (paymentForm.pin.length < 4) {
        newErrors.pin = "الرقم السري غير صحيح";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setPaymentStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate for demo
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        // Use promo code if applied
        if (paymentData?.orderData.promoCode) {
          PromoCodeService.usePromoCode(paymentData.orderData.promoCode.code);
        }

        // Clear cart
        clearCart();
        
        // Clear session data
        sessionStorage.removeItem('orderData');
        sessionStorage.removeItem('paymentData');
        
        setPaymentStep('success');
        toast.success("تم الدفع بنجاح!");
      } else {
        setPaymentStep('failed');
        toast.error("فشل في عملية الدفع. يرجى المحاولة مرة أخرى");
      }
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!paymentData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <Loader2 className="w-24 h-24 text-gray-300 mx-auto mb-6 animate-spin" />
            <h2 className="text-3xl font-bold text-gray-400 mb-4 arabic">
              جاري تحميل بوابة الدفع...
            </h2>
          </div>
        </div>
      </Layout>
    );
  }

  const methodInfo = getPaymentMethodInfo(paymentData.paymentMethod);

  if (paymentStep === 'success') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8 bg-green-50 border-green-200">
              <CardContent className="space-y-6">
                <CheckCircle className="w-24 h-24 text-green-600 mx-auto" />
                <h1 className="text-3xl font-bold text-green-800 arabic">
                  تم الدفع بنجاح!
                </h1>
                <p className="text-green-700 arabic text-lg">
                  تم استلام طلبك وسيتم تجهيزه خلال 24 ساعة
                </p>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 arabic mb-2">
                    رقم الطلب: #{Date.now().toString().slice(-8)}
                  </p>
                  <p className="text-lg font-bold text-gray-800 arabic">
                    المبلغ المدفوع: {formatPrice(paymentData.orderData.total)}
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/products')}
                    className="w-full arabic"
                  >
                    متابعة التسوق
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full arabic"
                  >
                    العودة للرئيسية
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (paymentStep === 'failed') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8 bg-red-50 border-red-200">
              <CardContent className="space-y-6">
                <AlertTriangle className="w-24 h-24 text-red-600 mx-auto" />
                <h1 className="text-3xl font-bold text-red-800 arabic">
                  فشل في عملية الدفع
                </h1>
                <p className="text-red-700 arabic text-lg">
                  عذراً، لم نتمكن من إتمام عملية الدفع. يرجى المحاولة مرة أخرى
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setPaymentStep('form')}
                    className="w-full arabic"
                  >
                    إعادة المحاولة
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/checkout')}
                    className="w-full arabic"
                  >
                    العودة لصفحة الدفع
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <CardContent className="space-y-6">
                <Loader2 className="w-24 h-24 text-blue-600 mx-auto animate-spin" />
                <h1 className="text-3xl font-bold text-gray-800 arabic">
                  جاري معالجة الدفعة...
                </h1>
                <p className="text-gray-600 arabic text-lg">
                  يرجى عدم إغلاق هذه الصفحة أو الضغط على زر الرجوع
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 arabic font-medium">
                    المبلغ: {formatPrice(paymentData.orderData.total)}
                  </p>
                  <p className="text-blue-600 arabic text-sm">
                    طريقة الدفع: {methodInfo.name}
                  </p>
                </div>
              </CardContent>
            </Card>
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
          <Button 
            variant="outline" 
            size="sm" 
            className="arabic"
            onClick={() => navigate('/checkout')}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 arabic">
            بوابة الدفع الآمنة
          </h1>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={methodInfo.color}>
                    {methodInfo.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold arabic">{methodInfo.name}</h3>
                    <p className="text-sm text-gray-600 arabic">
                      أدخل بيانات الدفع بشكل آمن
                    </p>
                  </div>
                  <div className="mr-auto flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 arabic font-medium">آمن</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {methodInfo.fields.includes('cardNumber') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                        رقم البطاقة
                      </label>
                      <input
                        type="text"
                        value={paymentForm.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          if (formatted.length <= 19) {
                            setPaymentForm({...paymentForm, cardNumber: formatted});
                            if (errors.cardNumber) setErrors({...errors, cardNumber: ''});
                          }
                        }}
                        className={`w-full px-3 py-3 border rounded-lg text-center text-lg tracking-wider ${
                          errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-600 text-sm mt-1 arabic">{errors.cardNumber}</p>
                      )}
                    </div>
                  )}

                  {methodInfo.fields.includes('phoneNumber') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                        رقم الجوال
                      </label>
                      <input
                        type="tel"
                        value={paymentForm.phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 10) {
                            setPaymentForm({...paymentForm, phoneNumber: value});
                            if (errors.phoneNumber) setErrors({...errors, phoneNumber: ''});
                          }
                        }}
                        className={`w-full px-3 py-3 border rounded-lg text-right arabic ${
                          errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="05xxxxxxxx"
                        maxLength={10}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-600 text-sm mt-1 arabic">{errors.phoneNumber}</p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {methodInfo.fields.includes('expiryDate') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                          تاريخ الانتهاء
                        </label>
                        <input
                          type="text"
                          value={paymentForm.expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            if (formatted.length <= 5) {
                              setPaymentForm({...paymentForm, expiryDate: formatted});
                              if (errors.expiryDate) setErrors({...errors, expiryDate: ''});
                            }
                          }}
                          className={`w-full px-3 py-3 border rounded-lg text-center ${
                            errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-600 text-sm mt-1 arabic">{errors.expiryDate}</p>
                        )}
                      </div>
                    )}

                    {methodInfo.fields.includes('cvv') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                          رمز الأمان (CVV)
                        </label>
                        <input
                          type="password"
                          value={paymentForm.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            if (value.length <= 4) {
                              setPaymentForm({...paymentForm, cvv: value});
                              if (errors.cvv) setErrors({...errors, cvv: ''});
                            }
                          }}
                          className={`w-full px-3 py-3 border rounded-lg text-center ${
                            errors.cvv ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="text-red-600 text-sm mt-1 arabic">{errors.cvv}</p>
                        )}
                      </div>
                    )}

                    {methodInfo.fields.includes('pin') && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                          الرقم السري
                        </label>
                        <input
                          type="password"
                          value={paymentForm.pin}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            if (value.length <= 6) {
                              setPaymentForm({...paymentForm, pin: value});
                              if (errors.pin) setErrors({...errors, pin: ''});
                            }
                          }}
                          className={`w-full px-3 py-3 border rounded-lg text-center ${
                            errors.pin ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="••••••"
                          maxLength={6}
                        />
                        {errors.pin && (
                          <p className="text-red-600 text-sm mt-1 arabic">{errors.pin}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {methodInfo.fields.includes('cardName') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 arabic">
                        اسم حامل البطاقة
                      </label>
                      <input
                        type="text"
                        value={paymentForm.cardName}
                        onChange={(e) => {
                          setPaymentForm({...paymentForm, cardName: e.target.value});
                          if (errors.cardName) setErrors({...errors, cardName: ''});
                        }}
                        className={`w-full px-3 py-3 border rounded-lg text-right arabic ${
                          errors.cardName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="الاسم كما هو مكتوب على البطاقة"
                      />
                      {errors.cardName && (
                        <p className="text-red-600 text-sm mt-1 arabic">{errors.cardName}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-800 arabic font-medium">
                      بياناتك محمية بتشفير SSL
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 arabic mt-1">
                    نحن لا نحتفظ ببيانات البطاقة على خوادمنا
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full mt-6 py-3 text-lg arabic bg-green-600 hover:bg-green-700"
                >
                  <Lock className="w-5 h-5 ml-2" />
                  دفع {formatPrice(paymentData.orderData.total)}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold arabic mb-4">ملخص الطلب</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">المنتجات</span>
                    <span className="arabic">{paymentData.orderData.items.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">المجموع الفرعي</span>
                    <span className="arabic">{formatPrice(paymentData.orderData.subtotal)}</span>
                  </div>
                  
                  {paymentData.orderData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="arabic">الخصم</span>
                      <span className="arabic">-{formatPrice(paymentData.orderData.discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">الشحن</span>
                    <span className="arabic">
                      {paymentData.orderData.shipping > 0 ? formatPrice(paymentData.orderData.shipping) : "مجاني"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">الضريبة</span>
                    <span className="arabic">{formatPrice(paymentData.orderData.tax)}</span>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="arabic">المجموع</span>
                    <span className="text-green-600 arabic">{formatPrice(paymentData.orderData.total)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 arabic">
                    <strong>العميل:</strong> {paymentData.customerInfo.name}
                  </p>
                  <p className="text-xs text-gray-600 arabic">
                    <strong>الجوال:</strong> {paymentData.customerInfo.phone}
                  </p>
                  <p className="text-xs text-gray-600 arabic">
                    <strong>المدينة:</strong> {paymentData.customerInfo.city}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
