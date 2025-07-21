import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Layout } from "@/components/Layout";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, isRTL } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.username.trim()) {
      setError(t("login.error.username_required"));
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError(t("login.error.password_required"));
      setIsLoading(false);
      return;
    }

    try {
      const user = await login({
        username: formData.username,
        password: formData.password,
      });

      console.log("Login successful:", user);

      // Redirect based on user role
      const from = location.state?.from?.pathname || "/";
      if (user.role === "super_admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "merchant") {
        navigate("/merchant/dashboard");
      } else {
        navigate(from);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(t("login.error.invalid_credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Login Form */}
            <Card className="card-dark shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className={`text-2xl font-bold text-secondary-800 arabic ${isRTL ? 'text-right' : 'text-center'}`}>
                  {t("login.title")}
                </h1>
                <p className={`text-secondary-600 arabic ${isRTL ? 'text-right' : 'text-center'}`}>
                  {t("login.subtitle")}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="username"
                        className={`block mb-2 arabic text-secondary-700 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        🧑 {t("login.username")}
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder={t("login.username")}
                        value={formData.username}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className={`arabic rounded-xl border-secondary-200 focus:border-primary-600 focus:ring-primary-600 ${isRTL ? 'text-right' : 'text-left'}`}
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="password"
                        className={`block mb-2 arabic text-secondary-700 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        🔐 {t("login.password")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("login.password")}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          className={`arabic ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'} rounded-xl border-secondary-200 focus:border-primary-600 focus:ring-primary-600`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 ${isRTL ? 'left-3' : 'right-3'}`}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse flex-row-reverse' : 'flex-row'}`}>
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            rememberMe: checked as boolean,
                          }))
                        }
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm arabic text-secondary-600"
                      >
                        {t("login.remember_me")}
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary-600 hover:underline arabic font-semibold"
                    >
                      {t("login.forgot_password")}
                    </Link>
                  </div>

                  {error && (
                    <div className={`bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl arabic ${isRTL ? 'text-right' : 'text-center'}`}>
                      ⚠️ {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg py-4 arabic rounded-xl font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t("common.loading")}
                      </div>
                    ) : (
                      t("login.title")
                    )}
                  </Button>
                </form>

                <div className={`text-center ${isRTL ? 'text-right' : 'text-center'}`}>
                  <span className="text-secondary-600 arabic">
                    {t("login.no_account")}{" "}
                    <Link
                      to="/register"
                      className="text-primary-600 hover:underline arabic font-semibold"
                    >
                      {t("login.create_account")}
                    </Link>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Demo Accounts Card */}
            <Card className="card-dark shadow-lg">
              <CardContent className="p-6">
                <h3 className={`font-semibold text-primary-800 mb-3 arabic ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("login.demo_accounts", "حسابات التجربة")}
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className={`font-bold text-primary-700 arabic mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("login.demo.super_admin", "مدير التطبيق (Super Admin)")}
                    </h4>
                    <p className={`text-sm text-gray-600 arabic ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("login.demo.username", "اسم المستخدم")}: <strong>admin</strong>
                    </p>
                    <p className={`text-sm text-gray-600 arabic ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("login.demo.password", "كلمة المرور")}: <strong>admin123</strong>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() =>
                        setFormData({
                          username: "admin",
                          password: "admin123",
                          rememberMe: false,
                        })
                      }
                    >
                      {t("login.demo.use_account", "استخدام هذا الحساب")}
                    </Button>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className={`font-bold text-secondary-700 arabic mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("login.demo.merchant", "صاحب متجر (Merchant)")}
                    </h4>
                    <p className={`text-sm text-gray-600 arabic ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("login.demo.username", "اسم المستخدم")}: <strong>merchant</strong>
                    </p>
                    <p className={`text-sm text-gray-600 arabic ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("login.demo.password", "كلمة المرور")}: <strong>merchant123</strong>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() =>
                        setFormData({
                          username: "merchant",
                          password: "merchant123",
                          rememberMe: false,
                        })
                      }
                    >
                      {t("login.demo.use_account", "استخدام هذا الحساب")}
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
