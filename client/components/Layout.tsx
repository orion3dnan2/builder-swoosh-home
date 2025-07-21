import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Search, Bell, MessageCircle, User, Menu } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "الرئيسية", href: "/", icon: "🏠" },
    { name: "السوق", href: "/marketplace", icon: "🛍️" },
    { name: "المنتجات", href: "/products", icon: "📦" },
    { name: "الشركات", href: "/companies", icon: "🏢" },
    { name: "الوظائف", href: "/jobs", icon: "💼" },
    { name: "الخدمات", href: "/services", icon: "🛠️" },
    { name: "الإعلانات", href: "/ads", icon: "📢" },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 text-white shadow-xl border-b border-primary-900">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
                    <div className="hidden md:flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-4">
              <span>مرحباً بكم في البيت السوداني</span>
                            <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="bg-secondary-600 text-white rounded-full px-2 py-0.5 text-xs">3</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="bg-secondary-600 text-white rounded-full px-2 py-0.5 text-xs">5</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>+100 الف سوداني في البيت</span>
                                          <Link to="/login">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary-600">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
                    </div>

          {/* Mobile Top Bar */}
          <div className="md:hidden flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs truncate">مرحباً بكم في البيت السوداني</span>
              <div className="flex items-center gap-1">
                <Bell className="w-3 h-3" />
                <span className="bg-secondary-600 text-white rounded-full px-1.5 py-0.5 text-xs">3</span>
                <MessageCircle className="w-3 h-3 ml-1" />
                <span className="bg-secondary-600 text-white rounded-full px-1.5 py-0.5 text-xs">5</span>
              </div>
            </div>
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary-600 text-xs px-2 py-1">
                دخول
              </Button>
            </Link>
          </div>

          {/* Main Header */}
                    <div className="flex items-center justify-between py-3 md:py-4">
                        <div className="flex items-center gap-4 md:gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                                                <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-600 text-lg md:text-xl font-bold">🇸🇩</span>
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold arabic">البيت السوداني</h1>
                  <p className="text-xs md:text-sm opacity-90 hidden sm:block">سوق وخدمات السودان</p>
                </div>
              </Link>

              {/* Navigation - Desktop */}
              <nav className="hidden lg:flex items-center gap-6">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 arabic ${
                      location.pathname === item.href
                        ? "bg-white text-primary-600 shadow-lg"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Search and User Actions */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                  type="text"
                  placeholder="ابحث في البيت السوداني..."
                  className="pl-10 pr-4 py-2 w-80 rounded-xl text-gray-800 placeholder:text-gray-500 arabic border-0 shadow-md focus:shadow-lg transition-all duration-200"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </Button>
                            <Link to="/login">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <User className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4">
              <nav className="grid grid-cols-2 gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 arabic ${
                      location.pathname === item.href
                        ? "bg-white text-primary-600 shadow-lg"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="arabic">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 arabic">البيت السوداني</h3>
              <p className="text-gray-300 arabic">
                م��صة شاملة للخدمات والتجا��ة السودانية في الخليج والعالم
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 arabic">الخدمات</h4>
              <ul className="space-y-2 arabic">
                <li><Link to="/marketplace" className="text-gray-300 hover:text-white">السوق</Link></li>
                <li><Link to="/products" className="text-gray-300 hover:text-white">المنتجات</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-white">الخدمات</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 arabic">الأعمال</h4>
              <ul className="space-y-2 arabic">
                <li><Link to="/companies" className="text-gray-300 hover:text-white">الشركات</Link></li>
                <li><Link to="/jobs" className="text-gray-300 hover:text-white">��لوظا��ف</Link></li>
                <li><Link to="/ads" className="text-gray-300 hover:text-white">الإعلانات</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 arabic">تواصل معنا</h4>
              <p className="text-gray-300 arabic">البريد الإلكتروني: info@sudan-house.com</p>
              <p className="text-gray-300 arabic">الهاتف: +966 50 123 4567</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center arabic">
            <p className="text-gray-300">© 2024 البيت السوداني. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
