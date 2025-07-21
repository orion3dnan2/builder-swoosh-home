import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Layout } from "@/components/Layout";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // تحقق من البيانات
    if (!formData.username.trim()) {
      setError("يرجى إدخال اسم المستخدم");
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError("يرجى إدخال كلمة المرور");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      setIsLoading(false);
      return;
    }

    try {
      // محاكاة عملية تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // في التطبيق الحقيقي، ستتم عملية المصادقة هنا
      console.log("Login successful:", formData);
      
      // حفظ بيانات المستخدم (محاكاة)
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        loginTime: new Date().toISOString()
      }));
      
      // توجه إلى الصفحة الرئيسية
      navigate('/');
      
    } catch (err) {
      setError("حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-sudan-blue to-blue-600 rounded-full flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 arabic">تسجيل الدخول</h1>
              <p className="text-gray-600 arabic">أدخل بيانات تسجيل دخولك</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-right block mb-2 arabic text-gray-700">
                      🧑 اسم المستخدم
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="أدخل اسم المستخدم"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="text-right arabic"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-right block mb-2 arabic text-gray-700">
                      🔐 كلمة المرور
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="text-right arabic pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                    />
                    <Label htmlFor="remember" className="text-sm arabic text-gray-600">
                      تذكرني
                    </Label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-sudan-blue hover:underline arabic">
                    نسيت كلمة المرور؟
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center arabic">
                    ⚠️ {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="sudan"
                  size="lg"
                  className="w-full text-lg py-3 arabic"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    "تسجيل الدخول →"
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-gray-600 arabic">ليس لديك حساب؟ </span>
                  <Link to="/register" className="text-sudan-blue hover:underline arabic">
                    انشئ حساب جديد
                  </Link>
                </div>

                <div className="text-center">
                  <Link to="/company-register" className="text-sudan-orange hover:underline arabic text-sm">
                    🏢 تسجيل للشركات والمؤسسات
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="mt-6 bg-gradient-to-br from-sudan-blue/5 to-blue-50 border-sudan-blue/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3 arabic">معلومات مهمة</h3>
              <ul className="space-y-2 text-sm text-gray-600 arabic">
                <li>📧 مدير الموقع: admin@example.com</li>
                <li>📞 تاجر / زبون: merchant@example.com</li>
                <li>👥 خدمة الزبائن: customer@example.com</li>
              </ul>
            </CardContent>
          </Card>

          {/* Demo Instructions */}
          <Card className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-green-800 mb-2 arabic">للتجربة</h3>
              <p className="text-sm text-green-700 arabic">
                يمكنك استخدام أي اسم مستخدم وكلمة مرور (على الأقل 6 أحرف) للتجربة. 
                سيتم توجيهك للصفحة الرئيسية بعد نجاح العملية.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
