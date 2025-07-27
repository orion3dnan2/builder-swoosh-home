import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Layout } from "@/components/Layout";
import { UserPlus, Eye, EyeOff, User, Briefcase } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    accountType: "customer", // customer or merchant
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    businessName: "", // للتجار فقط
    businessType: "", // للتجار فقط
    acceptTerms: false,
    newsletter: false,
  });

  const countries = [
    "السعودية",
    "الإمارات",
    "الكويت",
    "قطر",
    "البحرين",
    "عمان",
    "مصر",
    "الأردن",
    "لبنان",
    "العراق",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }
    console.log("Registration attempt:", formData);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Registration Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-sudan-green to-green-600 rounded-full flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 arabic">
                إنشاء حساب جديد
              </h1>
              <p className="text-gray-600 arabic">
                انض�� إلى البيت السوداني اليوم
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* نوع الحساب */}
                <div className="space-y-4">
                  <Label className="text-right block mb-3 arabic text-gray-700 font-semibold">
                    🔰 نوع الحساب
                  </Label>
                  <RadioGroup
                    value={formData.accountType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, accountType: value }))
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                      <RadioGroupItem value="customer" id="customer" />
                      <div className="flex items-center space-x-3 space-x-reverse flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <Label htmlFor="customer" className="arabic font-medium text-gray-800 cursor-pointer">
                            مستخدم عادي
                          </Label>
                          <p className="text-sm text-gray-600 arabic">
                            للتسوق والشراء من المتاجر المختلفة
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                      <RadioGroupItem value="merchant" id="merchant" />
                      <div className="flex items-center space-x-3 space-x-reverse flex-1">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <Label htmlFor="merchant" className="arabic font-medium text-gray-800 cursor-pointer">
                            صاحب عمل
                          </Label>
                          <p className="text-sm text-gray-600 arabic">
                            لإنشاء متجر وبيع المنتجات
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="text-right block mb-2 arabic text-gray-700"
                    >
                      👤 الاسم الكامل
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="text-right arabic"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-right block mb-2 arabic text-gray-700"
                    >
                      📧 البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="text-right"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-right block mb-2 arabic text-gray-700"
                    >
                      📱 رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+966 50 123 4567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="text-right"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="country"
                      className="text-right block mb-2 arabic text-gray-700"
                    >
                      🌍 الدولة
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger className="text-right arabic">
                        <SelectValue placeholder="اختر الدولة" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem
                            key={country}
                            value={country}
                            className="arabic"
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="city"
                    className="text-right block mb-2 arabic text-gray-700"
                  >
                    🏘️ المدينة
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="أدخل اسم المدينة"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="text-right arabic"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="password"
                      className="text-right block mb-2 arabic text-gray-700"
                    >
                      🔐 كلمة المرور
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="text-right arabic pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-right block mb-2 arabic text-gray-700"
                    >
                      🔐 تأكيد كلم�� المرور
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="أعد إدخال كلمة المرور"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="text-right arabic pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          acceptTerms: checked as boolean,
                        }))
                      }
                      required
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm arabic text-gray-600"
                    >
                      أوافق على{" "}
                      <Link
                        to="/terms"
                        className="text-sudan-blue hover:underline"
                      >
                        الشروط والأحكام
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          newsletter: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="newsletter"
                      className="text-sm arabic text-gray-600"
                    >
                      أريد تلقي النشرة الإخبارية والعروض الخاصة
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="sudan-green"
                  size="lg"
                  className="w-full text-lg py-3 arabic"
                  disabled={!formData.acceptTerms}
                >
                  إنشاء الحساب →
                </Button>

                <div className="text-center">
                  <span className="text-gray-600 arabic">
                    لديك حساب بالفعل؟{" "}
                  </span>
                  <Link
                    to="/login"
                    className="text-sudan-blue hover:underline arabic"
                  >
                    سجل الدخول
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
