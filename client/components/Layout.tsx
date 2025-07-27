import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Search, Bell, MessageCircle, User, Menu } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { LanguageAndThemeControls } from "./ThemeToggle";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isRTL } = useTheme();
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
    <div className="min-h-screen bg-background transition-colors duration-300 sudanese-pattern">
      {/* Header */}
      <header className="header-glass sticky top-0 z-50 shadow-cultural">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="hidden md:flex items-center justify-between py-2 text-sm">
            <div
              className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="text-muted-foreground">
                مرحباً بكم في البيت السوداني
              </span>
              <div
                className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="bg-secondary-600 text-white rounded-full px-2 py-0.5 text-xs">
                  3
                </span>
              </div>
              <div
                className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <span className="bg-secondary-600 text-white rounded-full px-2 py-0.5 text-xs">
                  5
                </span>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="text-muted-foreground">
                +100 ألف سوداني في البي��
              </span>
              <LanguageAndThemeControls />
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/20"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Top Bar */}
          <div
            className={`md:hidden flex items-center justify-between py-2 text-xs ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="text-xs truncate text-muted-foreground max-w-[120px]">
                مرحباً بكم في البيت السوداني
              </span>
              <div
                className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <Bell className="w-3 h-3 text-muted-foreground" />
                <span className="bg-secondary-600 text-white rounded-full px-1.5 py-0.5 text-xs">
                  3
                </span>
                <MessageCircle
                  className={`w-3 h-3 text-muted-foreground ${isRTL ? "mr-1" : "ml-1"}`}
                />
                <span className="bg-secondary-600 text-white rounded-full px-1.5 py-0.5 text-xs">
                  5
                </span>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <LanguageAndThemeControls />
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 py-1 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/20"
                >
                  دخول
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Header */}
          <div
            className={`flex items-center justify-between py-3 md:py-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex items-center gap-3 md:gap-6 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Logo */}
              <Link
                to="/"
                className={`flex items-center gap-2 md:gap-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-cultural">
                  <span className="text-white text-lg md:text-2xl font-bold">
                    🇸🇩
                  </span>
                </div>
                <div
                  className={`${isRTL ? "text-right" : "text-left"} min-w-0`}
                >
                  <h1 className="text-lg md:text-2xl lg:text-3xl font-bold arabic text-foreground leading-tight">
                    البيت السوداني
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block leading-tight">
                    سوق وخدمات السودان
                  </p>
                </div>
              </Link>

              {/* Navigation - Desktop */}
              <nav
                className={`hidden xl:flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 arabic text-sm ${
                      isRTL ? "flex-row-reverse" : "flex-row"
                    } ${
                      location.pathname === item.href
                        ? "bg-primary-100 text-primary-700 shadow-md dark:bg-primary-900/30 dark:text-primary-300"
                        : "text-foreground hover:bg-muted hover:text-primary-700 dark:hover:bg-muted dark:hover:text-primary-300"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Search and User Actions */}
            <div
              className={`flex items-center gap-2 md:gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="relative hidden lg:block">
                <Search
                  className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground ${
                    isRTL ? "right-3" : "left-3"
                  }`}
                />
                <input
                  type="text"
                  placeholder={t("common.search")}
                  className={`${isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4"} py-2 w-64 xl:w-80 rounded-xl input-dark arabic border shadow-sm focus:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary-500`}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden text-foreground hover:bg-muted p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-muted p-2"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="xl:hidden pb-4 animate-slide-up">
              <nav className="grid grid-cols-2 gap-2 mb-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl transition-all duration-200 arabic text-sm ${
                      isRTL ? "flex-row-reverse" : "flex-row"
                    } ${
                      location.pathname === item.href
                        ? "bg-primary-100 text-primary-700 shadow-md dark:bg-primary-900/30 dark:text-primary-300"
                        : "text-foreground hover:bg-muted hover:text-primary-700 dark:hover:bg-muted dark:hover:text-primary-300"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile search */}
              <div className="relative">
                <Search
                  className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground ${
                    isRTL ? "right-3" : "left-3"
                  }`}
                />
                <input
                  type="text"
                  placeholder={t("common.search")}
                  className={`${isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4"} py-3 w-full rounded-xl input-dark arabic border shadow-sm focus:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary-500`}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="arabic animate-fade-in">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 mt-20">
        <div className="container mx-auto px-4">
          <div
            className={`grid grid-cols-1 md:grid-cols-4 gap-8 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div>
              <h3 className="text-xl font-bold mb-4 arabic text-foreground">
                البيت السوداني
              </h3>
              <p className="text-muted-foreground arabic">
                {t("brand.description")}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 arabic text-foreground">
                {t("footer.services")}
              </h4>
              <ul className="space-y-2 arabic">
                <li>
                  <Link
                    to="/marketplace"
                    className="text-muted-foreground hover:text-primary-600 transition-colors"
                  >
                    {t("nav.marketplace")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-muted-foreground hover:text-primary-600 transition-colors"
                  >
                    {t("nav.products")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-muted-foreground hover:text-primary-600 transition-colors"
                  >
                    {t("nav.services")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 arabic text-foreground">
                {t("footer.business")}
              </h4>
              <ul className="space-y-2 arabic">
                <li>
                  <Link
                    to="/companies"
                    className="text-muted-foreground hover:text-primary-600 transition-colors"
                  >
                    {t("nav.companies")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className="text-muted-foreground hover:text-primary-600 transition-colors"
                  >
                    {t("nav.jobs")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ads"
                    className="text-muted-foreground hover:text-primary-600 transition-colors"
                  >
                    {t("nav.ads")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 arabic text-foreground">
                {t("footer.contact")}
              </h4>
              <p className="text-muted-foreground arabic mb-2">
                {t("footer.email")}: info@bayt-sudani.com
              </p>
              <p className="text-muted-foreground arabic">
                {t("footer.phone")}: +966 50 123 4567
              </p>
            </div>
          </div>
          <div
            className={`border-t border-border mt-8 pt-8 text-center arabic ${isRTL ? "text-right" : "text-center"}`}
          >
            <p className="text-muted-foreground">
              © 2024 البيت السوداني. {t("footer.rights")}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
